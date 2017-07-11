// Generated by CoffeeScript 1.12.5

cc.Class({
    "extends": cc.Component,
    properties: {
        ItemBG: {
            "default": null,
            type: cc.Button
        },
        ItemLabel: {
            "default": null,
            type: cc.Label
        }
    },
    onLoad: function() {
        this.mainIndex = 0;
        return this.pObj = null;
    },
    show: function(msg, index, pObj) {
        this.mainIndex = index;
        this.pObj = pObj;
        cc.log('gameTypeItem' + JSON.stringify(msg));
        this.node.active = true;
        return this.ItemLabel.string = msg['gamesTypeName'];
    },
    buttonOkCallBack: function() {
        return this.pObj.gameTypeClickCallBack(this.mainIndex);
    },
    update: function(dt) {}
});


//# sourceMappingURL=gameTypeItem.js.map
