cc.Class {
    extends: cc.Component

    properties: {
        # foo:
        #   default: null      # The default value will be used only when the component attaching
        #                        to a node for the first time
        #   type: cc
        #   serializable: true # [optional], default is true
        #   visible: true      # [optional], default is true
        #   displayName: 'Foo' # [optional], default is property name
        #   readonly: false    # [optional], default is false
        _setting: null,
    }

    onLoad: () ->
        cc.vv.setting = this

        this._setting = cc.find "Canvas/Setting"
        closeBtn = cc.find "Canvas/Setting/CloseButton"
        cc.vv.utils.addClickEvent closeBtn, this.node, "Setting",
            "btnCloseClicked"
        applyDissolveButton = cc.find "Canvas/Setting/ApplyDissolveButton"
        cc.vv.utils.addClickEvent applyDissolveButton, this.node, "Setting",
            "btnApplyCliked"
    btnApplyCliked: () ->
        cc.vv.net.send "dissolve_request"
        this._setting.active = false
        
    showSetting: () ->
        this._setting.active = true

    btnSettingClicked: () ->
        this._setting.active = true
    btnCloseClicked: () ->
        this._setting.active = false
    update: (dt) ->
        # do your update here
}
