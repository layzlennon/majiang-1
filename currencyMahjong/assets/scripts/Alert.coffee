cc.Class {
    extends: cc.Component

    properties: {
        _alert: null,
        _title: null,
        _content: null,
        _btnOK: null,
        _onBtnClickOkCallBack: null
    }
    onLoad: () ->
        this._alert = cc.find "Canvas/Alert"
        cc.log "Alert is show"
        component = cc.find("Canvas/Alert/AlertHeaderTiltle")
        this._title = component.getComponent(cc.Label)
        component = cc.find("Canvas/Alert/AlertConent")
        this._content = component.getComponent(cc.Label)
        this._btnOK = cc.find("Canvas/Alert/AlertOkButton")

        cc.vv.utils.addClickEvent(this._btnOK, this.node,
                            "Alert", "onBtnClicked")

        this._alert.active = false
        cc.vv.alert = this
    onBtnClicked: (event) ->
        this._alert.active = false
        if this._onBtnClickOkCallBack
            this._onBtnClickOkCallBack()
    show: (titile, content, onOk, needcancel) ->
        this._title.string = titile
        this._content.string = content
        this._alert.active = true
        this._onBtnClickOkCallBack = onOk



    update: (dt) ->
        # do your update here
}
