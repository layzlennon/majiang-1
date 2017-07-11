// Generated by CoffeeScript 1.12.5
cc.Class({
    "extends": cc.Component,
    properties: {
        quitButtonSprite: {
            "default": null,
            type: cc.SpriteFrame
        },
        quitButton: {
            "default": null,
            type: cc.Button
        },
        _headTileInfo: null,
        _gameNode: null,
        _tilesNode: null,
        _juShuZhangShu: null
    },
    onLoad: function() {
        var argetSprite;
        this.addComponent("Alert");
        this.addComponent("Dissolve");
        this.addComponent("Setting");
        this.addComponent("MjRoom");
        this._headTileInfo = this.node.getChildByName("HeadTileInfo");
        this._seatReady = this.node.getChildByName("SeatReady");
        this._gameNode = this.node.getChildByName("GameNode");
        this.initEventHandlers();
        if (cc.director.TableGlobalData.isHostUser()) {
            argetSprite = this.quitButton.getComponent(cc.Sprite);
            argetSprite.spriteFrame = this.quitButtonSprite;
        }
    },
    start: function() {
        var i, j, localIndex, ref, results, seats;
        console.log("mjGameScene .........");
        if (cc.director.TableGlobalData.getGameIn()) {
            this.onGameBeign();
            seats = cc.director.TableGlobalData.getSeats();
            results = [];
            for (i = j = 0, ref = seats.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                if (seats[i].userid > 0) {
                    localIndex = cc.director.TableGlobalData.getLocalIndex(seats[i].seatindex);
                    console.log("localIndex : " + localIndex);
                    results.push(cc.director.GlobalEvent.emit("refresh_all", {
                        seatId: localIndex
                    }));
                } else {
                    results.push(void 0);
                }
            }
            return results;
        }
    },
    initEventHandlers: function() {
        var self;
        cc.vv.gameNetMgr.dataEventHandler = this.node;
        self = this;
        return cc.director.GlobalEvent.on("game_begin", this.onGameBeign, this);
    },
    onGameBeign: function() {
        var component;
        console.log("onGameBeign: ");
        this._seatReady.active = false;
        this._gameNode.active = true;
        component = cc.find("Canvas/HeadTileInfo/TableNoLabel");
        this.tableNoLabel = component.getComponent(cc.Label);
        return this.tableNoLabel.string = "房间: " + cc.director.TableGlobalData.getRoomId();
    },
    showSettingUI: function() {
        if (cc.vv.setting) {
            return cc.vv.setting.showSetting();
        }
    },
    update: function(dt) {}
});

//# sourceMappingURL=MjGameScene.js.map
