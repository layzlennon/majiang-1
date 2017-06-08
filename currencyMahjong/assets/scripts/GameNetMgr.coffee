cc.Class {
    extends: cc.Component

    properties: {
        isOver: false,
        roomId: null,
        conf: null,
        maxNumOfGames: 0,
        numOfGames: 0,
        seats: null,
        seatLocalIndex: -1,
        dataEventHandler: null,
        dissoveData: null,
    }
    getSeatIndexByID: (userId) ->
        for i in [0...this.seats.length]
            s = this.seats[i]
            if s.userid is userId
                return i
        return -1
    initHandlers: () ->
        self = this
        cc.vv.net.addHandler "login_result" , (data) ->
            console.log "login_result : " + JSON.stringify data
            if data.errcode is 0
                msgData = data.data
                self.roomId = msgData.roomid
                self.conf = msgData.conf
                self.maxNumOfGames = msgData.conf.maxGames
                self.numOfGames = msgData.numofgames
                self.seats = msgData.seats
                self.seatLocalIndex = self.getSeatIndexByID cc.vv.userMgr.userId
                self.isOver = false

            else
                console.log data.errmsg


        cc.vv.net.addHandler "login_finished", (data) ->
            console.log "loagin_finished" + JSON.stringify data
            cc.director.loadScene "MjGameScene"
        cc.vv.net.addHandler "disconnect", () ->
            console.log "disconnect"
            if self.roomId == null
                cc.director.loadScene "HallScene"
            else
                if not self.isOver
                    self.dispatchEvent "disconnect"
        cc.vv.net.addHandler "new_user_comes_push", (data) ->
            console.log "new_user_comes_push: " + JSON.stringify data
            seatIndex = data.seatindex
            if self.seats[seatIndex].userid > 0
                self.seats[seatIndex].online = true
            else
                self.seats[seatIndex] = data
            console.log "new_user_comes_push" +
                JSON.stringify self.seats[seatIndex]
            self.dispatchEvent "new_user", self.seats[seatIndex]

        cc.vv.net.addHandler "user_state_push", (data) ->
            console.log "new_user_comes_push: " + JSON.stringify data
            self.dispatchEvent 'user_state_changed'
        
        cc.vv.net.addHandler "user_ready_push", (data) ->
            console.log "user_ready_push : " + JSON.stringify data
            self.dispatchEvent 'user_state_changed'
        
        cc.vv.net.addHandler "game_begin_push", (data) ->
            console.log "game_begin_push" + JSON.stringify data
            self.dispatchEvent 'game_begin'

        cc.vv.net.addHandler "exit_result", (data) ->
            console.log "exit_result" + JSON.stringify data
            self.roomId = null
            self.seats = null
            cc.director.loadScene "HallScene"
            
        cc.vv.net.addHandler "dispress_push", (data) ->
            console.log "dispress_push" + JSON.stringify data
            self.roomId = null
            self.seats = null

        cc.vv.net.addHandler "dissolve_notice_push", (data) ->
            console.log "dissolve_notice_push" + JSON.stringify data
            self.dissoveData = data
            self.dispatchEvent "dissolve_notice", data

        cc.vv.net.addHandler "dissolve_cancel_push", (data) ->
            console.log "dissolve_cancel_push" + JSON.stringify data
            self.dissoveData = null
            self.dispatchEvent "dissolve_cancel", data

        cc.vv.net.addHandler "exit_notify_push", (data) ->
            console.log "exit_notify_push" + JSON.stringify data
            userId = data
            s = self.getSeatByID userId
            if s isnt null
                s.userid = 0
                s.name = ""
                self.dispatchEvent "user_state_changed", s
        
    getLocalIndex: (seatIndex) ->
        index = (seatIndex - this.seatLocalIndex + 4) % 4
        return index
    isHostUser: () ->
        return this.seatLocalIndex is 0

    getSeatByID: (userId) ->
        seatIndex = this.getSeatIndexByID userId
        seat = this.seats[seatIndex]
        return seat
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
