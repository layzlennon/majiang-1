var PlayerSeatBase = require("PlayerSeatBase");

cc.Class({
    extends: PlayerSeatBase,
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
    initPlayerSeat:function()
    {
        this._seatId = 0;
        this._playerData = cc.vv.playersManager._players[0];
        console.log('initPlayerSeat....' + this._playerData);

        this._arrPlayedTiles = [];
        this._arrStandUpTiles = [];
        var tablePlayTileConfig = require('TablePlayTileConfig');
        this._playTileConfig = new tablePlayTileConfig();
        this._playTileConfig.init(this._seatId,cc.p(0,0),4);

        cc.director.GlobalEvent.on("chi_peng_gang", this.haveTileChiPengGang, this);

    },
    haveTileChiPengGang:function (data)
    {

        if(data.seatId == this._seatId)
        {
            if(!this._optionMenuData)
            {
                var tableOptionGlobalData = require("./Module/TableOptionGlobalData");
                this._optionMenuData = new tableOptionGlobalData();
                // this._optionMenuData.initOptionMenu();

            }

            if(this._optionMenuData.initJson(data.optionMenuJson))
            {
                cc.director.GlobalEvent.emit('newOption',{optionData:this._optionMenuData})
            }
        }

    }
});
