
cc.Class {
    extends: cc.Component

    properties: {
        # foo:
        #   default: null
        #The default value will be used only when the component attaching
        #                        to a node for the first time
        #   type: cc
        #   serializable: true # [optional], default is true
        #   visible: true      # [optional], default is true
        #   displayName: 'Foo' # [optional], default is property name
        #   readonly: false    # [optional], default is false
        tipLabel: cc.Label,
        _stateMsg: "",
        _progress: 0.0,
        _splash: null,
        _isLoading: false
    }
    onLoadComplete: () ->
        this._isLoading = false
        this._stateMsg = "准备登陆"
        cc.director.loadScene "Login"
        cc.loader.onProgress = null
    startPreloading: () ->
        cc.log "startPreloading ...."
        this._stateMsg = "正在加载资源,请稍等"
        this._isLoading = true
        self = this
        cc.loader.onProgress = (completedCount, totalCount, item) ->
            if self._isLoading
                self._progress = completedCount / totalCount
        cc.loader.loadResAll "texture", (err, assets) ->
            self.onLoadComplete()

    onLoad: () ->
        this.initMgr()
        this.tipLabel.string = this._stateMsg
        this._splash = cc.find "Canvas/Splash"
        this._splash.active = true
    update: (dt) ->
        # do your update here
        if this._stateMsg.length == 0
            return
        this.tipLabel.string = this._stateMsg
    checkVersion: () ->
        cc.log 'checkVersion...... start'
        self = this
        onGetVersion = (ret) ->
            cc.log 'onGetVersion ', JSON.stringify ret
            if ret.version == null
                console.log "error"
            else
                cc.vv.SI = ret
                cc.log "VERSION 1 : ", cc.VERSION
                cc.log "VERSION 2 : ", ret.version
                if ret.version isnt cc.VERSION
                    cc.log "VERSION 2 : ", ret.version
                    alert = cc.find "Canvas/Alert"
                    alert.active = true
                else
                    self.startPreloading()
        xhr = null
        complete = false
        fnRequest = () ->
            self._stateMsg = "正在连接服务器"
            xhr = cc.vv.http.sendRequest "/get_serverinfo", null, (ret) ->
                xhr = null
                complete = true
                onGetVersion ret
            setTimeout fn , 5000
        fn = () ->
            cc.log 'fn...... complete', complete
            if not complete
                if xhr
                    xhr.abort
                    self._stateMsg = "连接失败, 即将重试"
                    fnR = () ->
                        fnRequest()
                    setTimeout fnR, 5000
                else
                    fnRequest()
        fn()
        cc.log 'checkVersion...... end'
    start: () ->
        self = this
        SHOW_TIME = 100
        FADE_TIME = 500
        cc.log 'cc.sys.os ', cc.sys.os
        cc.log 'cc.sys.OS_IOS ', cc.sys.OS_IOS
        cc.log 'cc.sys.isNative ', cc.sys.isNative
        if true or true
            self._splash.active = true
            t = Date.now()
            cc.log ' tttttt ', t
            fn = () ->
                dt = Date.now() - t
                cc.log 'cc date dt', dt
                if dt < SHOW_TIME
                    setTimeout fn, 33
                else
                    op = (1 - ((dt - SHOW_TIME) / FADE_TIME)) * 255
                    cc.log 'op ======== ', op
                    if op <= 0
                        self._splash.opacity = 0
                        self.checkVersion()
                        cc.log 'self.checkVersion', op
                    else
                        self._splash.opacity = op
                        setTimeout fn , 33
            setTimeout fn , 33
        else
            self._splash.active = false
    initMgr: () ->
        cc.vv = {}
        cc.vv.http = require "HTTP"
        UserMgr = require "UserMgr"
        cc.vv.userMgr = new UserMgr()
        
        AudioMgr = require "AudioMgr"
        cc.vv.audioMgr = new AudioMgr()
        cc.vv.audioMgr.init()

        cc.vv.net = require "Net"
        GameNetMgr = require "GameNetMgr"
        cc.vv.gameNetMgr = new GameNetMgr()
        cc.vv.gameNetMgr.initHandlers()

        Utils = require "Utils"
        cc.vv.utils = new Utils()

        cc.args = this.urlParse()

    urlParse: () ->
        params = {}
        if not window.location
            return params

        str = window.location.href
        num = str.indexOf("?")
        str = str.substr num + 1
        arr = str.split "&"
        name
        value
        for i in[0...arr.length]
            num = arr[i].indexOf "="
            if num > 0
                name = arr[i].substring 0, num
                value = arr[i].substr num + 1
                params[name] = value
        
        return params
}
