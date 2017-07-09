cc.Class {
    extends: cc.Component

    properties: {
       _dissolve: null,
       _noticeLabel: null,
       _extraInfo: "",
       _endTime: null,


    }
    onLoad: () ->
        cc.vv.dissolve = this

        this._dissolve = cc.find "Canvas/Dissolve"
        this._noticeLabel =
        this._dissolve.getChildByName("InfoLabel").getComponent(cc.Label)
        this.addBtnHandler "AgreeButton"
        this.addBtnHandler "RejectButton"
        self = this
        this.node.on "dissolve_notice", (event) ->
            data = event.detail
            console.log "dissolve_notice" + JSON.stringify data
            self.showDissolveNotice data
        this.node.on "dissolve_cancel", (event) ->
            this._dissolve.active = false
    
    addBtnHandler: (btnName) ->
        btn = cc.find "Canvas/Dissolve/" + btnName
        cc.vv.utils.addClickEvent btn, this.node, "Dissolve",
            "onBtnClicked"
    onBtnClicked: (event) ->
        btnName = event.target.name
        if btnName is 'AgreeButton'
            cc.vv.net.send 'dissolve_agree'
        else if btnName is 'RejectButton'
            cc.vv.net.send 'dissolve_reject'
    showDissolveNotice: (data) ->
        this._endTime = Date.now() / 1000 + data.time
        this._extraInfo = ""
        seats = cc.director.TableGlobalData.getSeats()
        for i in [0...data.states.length]
            b = data.states[i]
            name = seats[i].name
            if b
                this._extraInfo += "\n[已同意] " + name
            else
                this._extraInfo += "\n[待确认] " + name
        this._dissolve.active = true

    update: (dt) ->
        # do your update here
        if this._endTime > 0
            lastTime = this._endTime - Date.now() / 1000
            if lastTime < 0
                this._endTime = -1
            m = Math.floor(lastTime / 60)
            s = Math.ceil(lastTime - m * 60)
            str = ""
            if m > 0
                str += m + "分"
            this._noticeLabel.string = str + s + "秒后房间将自动解散" + this._extraInfo

}
