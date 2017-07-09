cc.Class({
    extends: cc.Component,
    properties: {
        localStandUpTile: {
            default: null,
            type: cc.Node
        },
        localOpenTile: {
            default: null,
            type: cc.Node
        },
        localDownTile: {
            default: null,
            type: cc.Node
        },
        localPlayTile: {
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
        },
        bindNode: {
            default: null,
            type: cc.Node
        },
        //玩家数据信息
        _playerData: null,
        _seatId: 0,
        _playTilePos: null,
        _playTileConfig: null,
        _arrPlayedTiles: null,
        _playingTile:null,
        _arrStandUpTiles:null,
        _sendTiled:null

    },
    onLoad:function()
    {
        console.log("localseat:............");
        this._seatId = 0
        this._arrPlayedTiles = [];
        var tablePlayTileConfig = require('TablePlayTileConfig');
        this._playTileConfig = new tablePlayTileConfig();
        this._playTileConfig.init(this._seatId,cc.p(0,0),4);
    
        this._playerData = cc.vv.playersManager._players[0]
        var self = this
        cc.director.GlobalEvent.on("stand_tiles", this.init_tiles, this)
        cc.director.GlobalEvent.on("send_tile", this.send_tile, this)
        cc.director.GlobalEvent.on("chi", this.chi, this)
        cc.director.GlobalEvent.on("peng", this.peng, this)
        cc.director.GlobalEvent.on("gang", this.gang, this)
        cc.director.GlobalEvent.on("play", this.play , this)
        cc.director.GlobalEvent.on("play_tile", this.playTile,this);
        cc.director.GlobalEvent.on("refresh_all", this.refreshAll,this)
    },
    playTile:function(data)
    {
        console.log("playTile: "+ JSON.stringify(data))
        var localIndex = data.seatId
        if( localIndex != this._seatId )
        {
            return
        }
        var playTile = this._playerData._play_tile
        var playTilePos = this._playerData._playTilePos
        var isSendTileF = data.isSendTileF;
        this._playTilePos = data.tileWorldARPos;
        if(isSendTileF)
        {
            this._sendTiled.removeFromParent();
        }
        else
        {
            //整理牌
            var standTiles = this._arrStandUpTiles;
            var findF = false;
            var findIndex = 0;
            console.log("playTilePos: "+JSON.stringify(playTilePos))
            for(var i = 0; i < standTiles.length;i++)
            {
                var tile = standTiles[i];
                var stPos = tile.getPosition();
                console.log("stPos: " + JSON.stringify(stPos));
                if(stPos.x = playTilePos.x && stPos.y == playTilePos.y)
                {
                    tile.removeFromParent();
                    findF = true;
                    findIndex = i;
                    break;
                }
            }
            if(findF)
            {
                //数组里面删掉
                this._arrStandUpTiles.splice(findIndex,1);
                //刷新位置
                this.refreshStandTilesPos();
                //处理摸得牌
                if(this._playerData._send_tile)
                {
                    this._playerData._standUpTiles.push(this._playerData._send_tile);
                    // this._arrStandUpTiles.push(this._sendTiled)
                    this._playerData._standUpTiles.sort(cc.vv.utils.tilesSortNumber);
                    this.setSendTileInStandTiles(this._playerData._send_tile);
                    this._playerData._send_tile = null;
                }
            }



            // var arrRemovedTilePos = this.refreshAndTidyStandUpTiles([playTile], true);

        }


        this.playPlayTileAnimation(playTile, this._playTilePos);
        this._playTilePos = null;
    },
    setSendTileInStandTiles:function(sendTileId)
    {
        var arrStandTilesId = this._playerData._standUpTiles;
        // arrStandTilesId.push(sendTileId);
        // arrStandTilesId.sort(cc.vv.utils.tilesSortNumber);
        var sendPosIndex = -1;
        for(var i = arrStandTilesId.length -1; i >=0 ;i--)
        {
            if(arrStandTilesId[i] == sendTileId)
            {
                sendPosIndex = i;
                break;
            }
        }
        if(sendPosIndex > -1)
        {
            var destPos = this._arrStandUpTiles[sendPosIndex].getPosition();
            for(var k = this._arrStandUpTiles.length - 1;k >= 0; k--)
            {
                var tile = this._arrStandUpTiles[k];
                
                if(k < sendPosIndex)
                {

                    break;
                }
                else
                {
                    var act = cc.MoveBy.create(0.2,cc.p(-60,0));
                    
                    // tile.runAction(cc.EaseSineIn.create(act));
                    tile.runAction(cc.Sequence.create(cc.EaseSineIn.create(act),cc.CallFunc.create(function()
                    {

                    })));
                }
            }

            var pTileC = this._sendTiled.getComponent("TileC")
            var moveTime = 0.3;
            var self = this;
            var squ = cc.Sequence.create(cc.DelayTime.create(0.2),cc.CallFunc.create(function()
                {
                    pTileC.runTidyAction(destPos, moveTime * 0.2, moveTime * 0.6, moveTime * 0.2);

                }
            ),cc.DelayTime.create(0.5),cc.CallFunc.create(function()
            {
                self.refreshStandTilesPos();
            }));
            pTileC.resetSendTileF();
            this._arrStandUpTiles.splice(sendPosIndex,0,this._sendTiled)
            
            this._sendTiled.runAction(squ);

            
        }
        // for(var i = 0; i < this._arrStandUpTiles.length;i++)
        // {
        //     var tile = this._arrStandUpTiles[i];
        //     var pTileC = tile.getComponent("TileC")
        //     var tileId = pTileC.getTileId();

        // }
    },
    refreshStandTilesPos:function()
    {
        for(var i = 0; i < this._arrStandUpTiles.length;i++)
        {
            var tile = this._arrStandUpTiles[i];
            var posX = i * 61 * -1 - 160
            var posY = 50
            tile.setPosition(cc.p(posX, posY))
        }
    },
    addPlayedTile:function(tileId)
    {
        var tile = cc.instantiate(this.localPlayTile)
        var pTileC = tile.getComponent("TileC")
        pTileC.init(this._seatId)
        pTileC.setConfig({ tile: tileId })
        pTileC.setContentSize(cc.size(46, 60), 1)
        this.playNode.addChild(tile)
        
        var index = this._arrPlayedTiles.length;
        var p = this._playTileConfig.getPlayedTilePosition(index, pTileC.getViewSize());
        tile.setPosition(p);

        var zOrder = this._playTileConfig.getPlayedTileZOrder(index);
        tile.setLocalZOrder(zOrder);

        this._arrPlayedTiles[index] = tile;

        return tile;
    },


    clonePlayTile:function(tileId)
    {
        var tile = cc.instantiate(this.localPlayTile)
        var pTileC = tile.getComponent("TileC")
        pTileC.init(this._seatId)
        pTileC.setConfig({ tile: tileId })
        pTileC.setContentSize(cc.size(46, 60), 1)
        this.node.addChild(tile)

        return tile;
    },
    
    playPlayTileAnimation:function(tileId, srcPos, callFunc)
    {
        //添加到出牌区
        var playedTile = this.addPlayedTile(tileId);
        // playedTile.active = false;

        this._playingTile = this.clonePlayTile(tileId);

        var dstPos = playedTile.convertToWorldSpaceAR(cc.p(0,0));
        console.log("srcPos: " + JSON.stringify(srcPos));
        console.log("dstPos: " + JSON.stringify(dstPos));
 
        var controlPoints = this._playTileConfig.getPlayTileControlPoints(srcPos, dstPos);

        var that = this;
        var _callFunc = callFunc || function(){};
        var playingTileC = this._playingTile.getComponent("TileC")
        playingTileC.runPlayAction(srcPos, controlPoints, 0.2, function(){
            that.onPlayTileEnd();
            _callFunc();
        });

    },
    removePlayingTile:function()
    {
        if(this._playingTile)
        {
            this._playingTile.removeFromParent();
            this._playingTile = null;
        }
    },
    onPlayTileEnd:function()
    {
        this.removePlayingTile();
        
        var playedTile = this._arrPlayedTiles[this._arrPlayedTiles.length - 1];
        if(!playedTile)
        {
            return;
        }
        playedTile.active =true;

        //显示指针
        var pTileC = playedTile.getComponent("TileC")
        var center = playedTile.getPosition();
        var size = pTileC.getViewSize();
        center.x += size.width * 0.5;
        center.y += size.height * 0.6;
    },
    refreshAll: function(data)
    {
        if(data.seatId !== this._seatId)
        {
            return
        }
        this.init_tiles(data)
        this.chi(data)
        this.peng(data)
        this.gang(data)
    },
    create_standTiles:function()
    {
        this.standNode.removeAllChildren()
        this._arrStandUpTiles = [];
        for(var i = 0; i < this._playerData._standUpTiles.length;i++)
        {
            var tile = cc.instantiate(this.localStandUpTile)
            var pTileC = tile.getComponent("TileC")
            pTileC.init(this._seatId)
            pTileC.setConfig({ tile: this._playerData._standUpTiles[i] })
            pTileC.setContentSize(cc.size(68, 98), 0.94)
            this.standNode.addChild(tile)
            var posX = i * 61 * -1 - 160
            var posY = 50
            tile.setPosition(cc.p(posX, posY))
            this._arrStandUpTiles.push(tile);
        }
    },
    init_tiles:function(data)
    {
        // console.log " init_tiles data " + JSON.stringify data
        if(data.seatId !== this._seatId)
        {
            return;
        }
        console.log(" local stand_tiles: " + this._playerData._standUpTiles)
        this.create_standTiles();
    }, 
    send_tile: function(data)
    {
        console.log(" send_tile data " + JSON.stringify(data))
        if(data.seatId !== this._seatId)
        {
            return;
        }
        console.log("local send_tile: " + this._playerData._send_tile);

        var tile = cc.instantiate(this.localStandUpTile)
        var pTileC = tile.getComponent("TileC")
        pTileC.init(this._seatId,true)
        pTileC.setConfig({ tile: this._playerData._send_tile })
        pTileC.setContentSize(cc.size(68, 98), 0.94)
        this.standNode.addChild(tile)
        tile.setPosition(cc.p( -70, 50))
        this._sendTiled = tile;
        // cc.vv.utils.runSendTileAction(tile)
        //tile.setPosition(cc.p( -70, 50))
    },
    chi:function(data)
    {
        console.log("local chi tiles : " + this._playerData._chi_tiles)
    },
    peng:function(data)
    {
        console.log("local peng tiles : " + this._playerData._peng_tiles)
    },
    gang:function(data)
    {
        console.log("local gang tiles : " + this._playerData._peng_tiles)
    },
    play:function(data)
    {
        console.log("local play tiles : " + this._playerData._peng_tiles)

    }
    
})
