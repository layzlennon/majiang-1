cc.Class {
    extends: cc.Component

    properties: {
        onLine: {
            default: null,
            type: cc.Node
        },
        nickName: {
            default: null,
            type: cc.Label
        },
        ready: {
            default: null,
            type: cc.Node
        },
        score: {
            default: null,
            type: cc.Label
        },
        voiceMsg: {
            default: null,
            type: cc.Node
        },
        headIcon: {
            default: null,
            type: cc.Node
        }
        
        _name: "",
        _score: 0,
        _voiceDate: null,
        _ready: false,
        _onLine: false,
        _headIconImg: null,
        _userId: 0,

    }

    onLoad: () ->
        this.node.active = false
        this.voiceMsg = false
        this.refresh()

    refresh: () ->
        this.onLine.active = this._onLine
        this.nickName.string = this._name
        this.score.string = this._score
        this.ready.active = this._ready

        this.node.active = this._userId > 0

    setInfo: (seatInfo) ->
        cc.log "setInfo : " + JSON.stringify seatInfo
        this._name = seatInfo.name
        this._score = "积分: " + seatInfo.score
        this._onLine = !seatInfo.online
        this._ready = seatInfo.ready
        this._userId = seatInfo.userid
        this.refresh()
    update: (dt) ->
        # do your update here
}
