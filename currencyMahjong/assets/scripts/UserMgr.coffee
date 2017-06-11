cc.Class {
    extends: cc.Component

    properties: {
       account: null
       userId: null
       userName: null
       lv: 0
       exp: 0
       coins: 0
       gems: 0
       sign: 0
       ip: ""
       sex: 0
       roomData: null
       oldRoomId: null


    }
    guestAuth: () ->
        account = cc.args["account"]
        if account is null
            account = cc.sys.localStorage.getItem "account"
        if account is null
            account = Date.now()
            cc.sys.localStorage.setItem "account", account
        cc.vv.http.sendRequest "/guest", {
            account: account
            }, this.onAuth

    enterRoom: (roomId, callback) ->
        self = this
        
        onEnter = (ret) ->
            console.log "ret : " + JSON.stringify ret
            if ret.errcode isnt 0
                if ret.errcode is -1
                    fn = () ->
                        self.enterRoom roomId, callback
                    setTimeout fn , 5000
                else
                    cc.vv.wc.hide()
                    if callback
                        callback ret
            else
                if callback
                    callback ret

                cc.vv.gameNetMgr.connectGameServer ret

        data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            roomid: roomId
        }

        cc.vv.wc.show "正在进入房间 " + roomId
        cc.vv.http.sendRequest "/enter_private_room", data, onEnter

    onAuth: (ret) ->
        cc.log "onAuth" + JSON.stringify ret
        
        self = cc.vv.userMgr
        if ret.errcode isnt 0
            cc.log ret.errmsg
        else
            self.account = ret.account
            self.sign = ret.sign
            cc.vv.http.url = "http://" + ret.halladdr
            self.login()
    login: () ->
        self = this
        onLogin = (ret) ->
            cc.log "ret :" + JSON.stringify(ret)
            if ret.errcode
                cc.log ret.errmsg
            else
                if not ret.userid
                  cc.director.loadScene "Createrole"
                else
                    cc.log "enter hall: " + ret
                    self.account = ret.account
                    self.userId = ret.userid
                    self.userName = ret.name
                    self.lv = ret.lv
                    self.exp = ret.exp
                    self.coins = ret.coins
                    self.gems = ret.gems
                    self.roomData = ret.roomid
                    self.sex = ret.sex
                    self.ip = ret.ip
                    cc.director.loadScene "HallScene"
        cc.vv.wc.show "正在登陆游戏"

        cc.vv.http.sendRequest "/login", {
                account: this.account,
                sign: this.sign,
            }, onLogin
    
    createUser: (name) ->
        self = this
        onCreate = (ret) ->
            if ret.errcode isnt 0
                cc.log ret.errmsg
            else
                self.login()

        data = {
            account: this.account,
            sign: this.sign,
            name: name
        }
        cc.vv.http.sendRequest "/create_user", data, onCreate

    update: (dt) ->
        # do your update here
}
