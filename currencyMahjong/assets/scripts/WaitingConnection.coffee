cc.Class {
    extends: cc.Component

    properties: {
        lblContent: null,
        target: null,
        _isShow: false,
        _waitting: null

    }
    onLoad: () ->
        if cc.vv is null
            return null
        cc.log "onLoad WaitingConnection"
        this._waitting = cc.find "Canvas/WaitingConnection"

        cc.vv.wc = this
        # this.node.active = this._isShow
        this._waitting.active = this._isShow
        component = cc.find "Canvas/WaitingConnection/ConnectionTip"
        this.lblContent = component.getComponent(cc.Label)
        this.target = cc.find "Canvas/WaitingConnection/LoadingAn"

    update: (dt) ->
        # do your update here
        this.target.rotation = this.target.rotation - dt * 45
    
    show: (content) ->
        this._isShow = true
        if this.node
            this._waitting.active = this._isShow
        if this.lblContent
            if content is null
                content = ""
            this.lblContent.string = content
    hide: () ->
        this._isShow = false
        if this.node
            this._waitting.active = this._isShow
}
