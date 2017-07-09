cc.Class {
    extends: cc.Component

    properties: {
        isOver: false,
        dataEventHandler: null,
        isDessolevF: false,
        
    }

    initHandlers: () ->
        self = this
        cc.vv.net.addHandler "login_result" , (data) ->
            console.log "login_result : " + JSON.stringify data
            self.isDessolevF =  false
            if data.errcode is 0
                msgData = data.data
                cc.director.TableGlobalData.setRoomId(msgData.roomid)
                cc.director.TableGlobalData.setGameConf(msgData.conf)
                cc.director.TableGlobalData.setMaxNumOfGame(msgData.conf.maxGames)
                cc.director.TableGlobalData.setNumOfGames(msgData.numofgames)
                cc.director.TableGlobalData.setSeats(msgData.seats)
                seatId = cc.director.TableGlobalData.getSeatIndexByID(cc.vv.userMgr.userId)
                cc.director.TableGlobalData.setSeatId(seatId)

                self.isOver = false

            else
                console.log data.errmsg


        cc.vv.net.addHandler "login_finished", (data) ->
            console.log "loagin_finished " + JSON.stringify data
            if data and data["gameBegin"]
                cc.director.TableGlobalData.setGameIn(true)
            else
                cc.director.loadScene "MjGameScene"

        cc.vv.net.addHandler "disconnect", () ->
            console.log "disconnect............"

            roomId = cc.director.TableGlobalData.getRoomId()
            if roomId == null
                if not self.isDessolevF
                    cc.director.loadScene "HallScene"
                
            else
                if not self.isOver
                    self.dispatchEvent "disconnect"
        cc.vv.net.addHandler "new_user_comes_push", (data) ->
            console.log "new_user_comes_push: " + JSON.stringify data
            seatIndex = data.seatindex
            seats = cc.director.TableGlobalData.getSeats()
            if seats[seatIndex].userid > 0
                seats[seatIndex].online = true
            else
                seats[seatIndex] = data
                JSON.stringify seats[seatIndex]
            self.dispatchEvent "new_user", seats[seatIndex]

        cc.vv.net.addHandler "user_state_push", (data) ->
            console.log "user_state_push: " + JSON.stringify data
            roomId = cc.director.TableGlobalData.getRoomId()
            seats = cc.director.TableGlobalData.getSeats()
            if not self.isDessolevF and roomId and seats
                userId = data.userid
                seat = cc.director.TableGlobalData.getSeatByID userId
                seat.online = data.online
                self.dispatchEvent 'user_state_changed', seat
        
        cc.vv.net.addHandler "user_ready_push", (data) ->
            console.log "user_ready_push : " + JSON.stringify data
            userId = data.userid
            seat = cc.director.TableGlobalData.getSeatByID userId
            seat.ready = data.ready
            self.dispatchEvent 'user_state_changed', seat
        
        cc.vv.net.addHandler "exit_result", (data) ->
            console.log "exit_result" + JSON.stringify data

            cc.director.TableGlobalData.setRoomId(null)
            cc.director.TableGlobalData.setSeats(null)
            cc.director.loadScene "HallScene"
            
        cc.vv.net.addHandler "dispress_push", (data) ->
            console.log "dispress_push" + JSON.stringify data
            cc.director.TableGlobalData.setRoomId(null)
            cc.director.TableGlobalData.setSeats(null)
            if cc.director.TableGlobalData.isHostUser()
                return

            self.isDessolevF = true
            fn = () ->
                cc.director.loadScene "HallScene"
            cc.vv.alert.show "提示", "房主已经解散房间了，点击确定返回大厅", fn , true

        cc.vv.net.addHandler "dissolve_notice_push", (data) ->
            console.log "dissolve_notice_push" + JSON.stringify data
            self.dispatchEvent "dissolve_notice", data

        cc.vv.net.addHandler "dissolve_cancel_push", (data) ->
            console.log "dissolve_cancel_push" + JSON.stringify data
            self.dispatchEvent "dissolve_cancel", data
        
         cc.vv.net.addHandler "game_over_push", (data) ->
            console.log "game_over_push" + JSON.stringify data
            self.dispatchEvent "game_over", data

            isGameIn = cc.director.TableGlobalData.getGameIn()
            if not isGameIn
                cc.director.loadScene "HallScene"
            cc.director.TableGlobalData.setGameIn(false)

        cc.vv.net.addHandler "game_begin_push", (data) ->
            console.log "game_begin_push" + JSON.stringify data
            cc.director.TableGlobalData.setGameIn(true)
            # self.dispatchEvent 'game_begin'
        

        cc.vv.net.addHandler "exit_notify_push", (data) ->
            console.log "exit_notify_push" + JSON.stringify data
            userId = data
            s = cc.director.TableGlobalData.getSeatByID userId
            if s isnt null
                s.userid = 0
                s.name = ""
                self.dispatchEvent "user_state_changed", s
        
        cc.vv.net.addHandler "table_call_push", (data) ->
            console.log "table_call_push" + JSON.stringify data
            cc.director.GlobalEvent.emit "table_call" , data


    connectGameServer: (data) ->
        cc.vv.net.ip = data.ip + ":" + data.port
        console.log cc.vv.net.ip
        onConnectOK = () ->
            console.log "onConnectOK"
            sd=
             {
                token: data.token,
                roomid: data.roomid,
                time: data.time,
                sign: data.sign,
            }
            cc.vv.net.send "login", sd
        onConnectFailed = () ->
            console.log "connect failed"
            cc.vv.wc.hide()
        
        cc.vv.wc.show "正在进入房间"

        cc.vv.net.connect onConnectOK, onConnectFailed

    dispatchEvent: (event, data) ->
        if this.dataEventHandler
            this.dataEventHandler.emit event, data
        

    update: (dt) ->
        # do your update here
}
