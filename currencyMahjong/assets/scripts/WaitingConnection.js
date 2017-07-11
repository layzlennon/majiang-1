// Generated by CoffeeScript 1.12.5
cc.Class({
    "extends": cc.Component,
    properties: {
        lblContent: null,
        target: null,
        _isShow: false,
        _waitting: null
    },
    onLoad: function() {
        var component;
        if (cc.vv === null) {
            return null;
        }
        cc.log("onLoad WaitingConnection");
        this._waitting = cc.find("Canvas/WaitingConnection");
        cc.vv.wc = this;
        this._waitting.active = this._isShow;
        component = cc.find("Canvas/WaitingConnection/ConnectionTip");
        this.lblContent = component.getComponent(cc.Label);
        return this.target = cc.find("Canvas/WaitingConnection/LoadingAn");
    },
    update: function(dt) {
        return this.target.rotation = this.target.rotation - dt * 45;
    },
    show: function(content) {
        this._isShow = true;
        if (this.node) {
            this._waitting.active = this._isShow;
        }
        if (this.lblContent) {
            if (content === null) {
                content = "";
            }
            return this.lblContent.string = content;
        }
    },
    hide: function() {
        this._isShow = false;
        if (this.node) {
            return this._waitting.active = this._isShow;
        }
    }
});
