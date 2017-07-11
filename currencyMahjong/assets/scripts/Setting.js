// Generated by CoffeeScript 1.12.5
cc.Class({
    "extends": cc.Component,
    properties: {
        _setting: null
    },
    onLoad: function() {
        var applyDissolveButton, closeBtn;
        cc.vv.setting = this;
        this._setting = cc.find("Canvas/Setting");
        closeBtn = cc.find("Canvas/Setting/CloseButton");
        cc.vv.utils.addClickEvent(closeBtn, this.node, "Setting", "btnCloseClicked");
        applyDissolveButton = cc.find("Canvas/Setting/ApplyDissolveButton");
        return cc.vv.utils.addClickEvent(applyDissolveButton, this.node, "Setting", "btnApplyCliked");
    },
    btnApplyCliked: function() {
        cc.vv.net.send("dissolve_request");
        return this._setting.active = false;
    },
    showSetting: function() {
        return this._setting.active = true;
    },
    btnSettingClicked: function() {
        return this._setting.active = true;
    },
    btnCloseClicked: function() {
        return this._setting.active = false;
    },
    update: function(dt) {}
});
