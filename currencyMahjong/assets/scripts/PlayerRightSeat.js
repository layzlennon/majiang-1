var PlayerSeatBase = require("PlayerSeatBase");

cc.Class({
    "extends": PlayerSeatBase,
    properties: {
        standUpTile: {
            default: null,
            type: cc.Node
        },
        openTile: {
            default: null,
            type: cc.Node
        },
        downTile: {
            default: null,
            type: cc.Node
        },
        playTile: {
            default: null,
            type: cc.Node
        },
        standNode: {
            default: null,
            type: cc.Node
        },
        playNode: {
            default: null,
            type: cc.Node
        },
        chiPengGang: {
            default: null,
            type: cc.Node
        },
        score: {
            default: null,
            type: cc.Label
        }
    },
    initPlayerSeat: function() {
        this._seatId = 1;
        this._playerData = cc.vv.playersManager._players[1];
        this._arrPlayedTiles = [];
        this._arrStandUpTiles = [];
        var tablePlayTileConfig = require('TablePlayTileConfig');
        this._playTileConfig = new tablePlayTileConfig();
        this._playTileConfig.init(this._seatId,cc.p(0,0),4);
    },
    playTile:function (data)
    {
        if (data.seatId !== this._seatId) {
            return
        }
    }



});