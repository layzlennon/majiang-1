/**
 * Created by sml on 2017/7/10.
 */
cc.Class({
    "extends":cc.Component,
    //玩家数据信息
    _playerData: null,
    _seatId: 0,
    _playTileConfig: null,//打出牌的配置
    _arrPlayedTiles: null,//打出的牌数组
    _playingAnTile:null,//动画牌
    _arrStandUpTiles:null, //手牌数组
    _sendTiled:null, //摸到的牌

    onLoad: function(){
        this.initPlayerSeat();
        this.initGlobalEvent();

    },
    initPlayerSeat:function () {

        //子节点进行初始化工作
    },
    initGlobalEvent:function ()
    {
        cc.director.GlobalEvent.on("stand_tiles", this.init_tiles, this);
        cc.director.GlobalEvent.on("send_tile", this.send_tile, this);
        cc.director.GlobalEvent.on("chi", this.chi, this);
        cc.director.GlobalEvent.on("peng", this.peng, this);
        cc.director.GlobalEvent.on("gang", this.gang, this);
        cc.director.GlobalEvent.on("play", this.play, this);
        cc.director.GlobalEvent.on("play_tile", this.playTileFuc,this);
        cc.director.GlobalEvent.on("refresh_all", this.refreshAll, this);
    },
    init_tiles: function(data)
    {
        if (data.seatId !== this._seatId) {
            return;
        }
        console.log('init_tiles: '+JSON.stringify(data));

        console.log(" left stand_tiles: " + this._playerData._standUpTiles);
        if(this._seatId === 3 || this._seatId === 1)
        {
            this._arrStandUpTiles = [];
            this.standNode.removeAllChildren();

            for (var i = 0; i < this._playerData._standUpTiles.length;i++) {
                var tile = cc.instantiate(this.standUpTile);
                this.standNode.addChild(tile);
                this._arrStandUpTiles.push(tile);
                tile.setPosition(cc.p(0, i * 25 * -1));
            }
        }
        else if(this._seatId === 2)
        {
            this._arrStandUpTiles = [];
            this.standNode.removeAllChildren();
            for (var i = 0; i < this._playerData._standUpTiles.length; i++) {
                var tile = cc.instantiate(this.standUpTile);
                this.standNode.addChild(tile);
                this._arrStandUpTiles.push(tile);
                tile.setPosition(cc.p(40 * i, 0));
            }
        }
        else if(this._seatId === 0)
        {
            this._arrStandUpTiles = [];
            this.create_standTiles();
        }

    },
    create_standTiles:function()
    {
        this.standNode.removeAllChildren()
        for(var i = 0; i < this._playerData._standUpTiles.length;i++)
        {
            var tile = cc.instantiate(this.standUpTile)
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
    send_tile:function (data) {
        if (data.seatId !== this._seatId) {
            return;
        }
        if(this._seatId === 1)
        {
            var tile = cc.instantiate(this.standUpTile);
            this.standNode.addChild(tile);
            tile.setPosition(cc.p(0, 50));
            tile.setLocalZOrder(-10);
            this._sendTiled = tile;

        }
        else if(this._seatId === 2)
        {
            var tile = cc.instantiate(this.standUpTile);
            this.standNode.addChild(tile);
            tile.setPosition(cc.p(-50, 0));
            this._sendTiled = tile;

        }
        else if(this._seatId === 3)
        {
            var tile = cc.instantiate(this.standUpTile);
            this.standNode.addChild(tile);
            var tilesLength = this._playerData._standUpTiles.length;
            tile.setPosition(cc.p(0, tilesLength * 27 * -1));
            this._sendTiled = tile;

        }
        else if(this._seatId === 0)
        {
            var tile = cc.instantiate(this.standUpTile)
            var pTileC = tile.getComponent("TileC")
            pTileC.init(this._seatId,true);
            pTileC.setConfig({ tile: this._playerData._send_tile })
            pTileC.setContentSize(cc.size(68, 98), 0.94)
            this.standNode.addChild(tile);
            tile.setPosition(cc.p( -70, 50));
            this._sendTiled = tile;
        }
    },
    refreshAll: function(data) {
        if (data.seatId !== this._seatId) {
            return;
        }
        this.init_tiles(data);
        this.chi(data);
        this.peng(data);
        return this.gang(data);
    },
    chi: function() {
        return console.log("left chi tiles : " + this._playerData._chi_tiles);
    },
    peng: function() {
        return console.log("left peng tiles : " + this._playerData._peng_tiles);
    },
    gang: function() {
        return console.log("left gang tiles : " + this._playerData._peng_tiles);
    },
    play: function(data)
    {
        var localIndex = data.seatId
        if(localIndex !== this._seatId)
        {
            return
        }
        console.log("play tiles : " + this._playerData._peng_tiles);
        var playTile = this._playerData._play_tile;
        var playTileARPos = this._sendTiled.convertToWorldSpaceAR(cc.p(0,0))
        this._sendTiled.removeFromParent();
        this.playPlayTileAnimation(playTile, playTileARPos,false);
        this._sendTiled = null;
        this._playerData._send_tile = null;

    },
    playTileFuc:function(data)
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
        var playTileARPos = data.tileWorldARPos;
        if(isSendTileF)
        {
            this._sendTiled.removeFromParent();
            this._playerData._send_tile = null;

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
                if(this._seatId === 0)
                {
                    this.refreshStandTilesPos();

                }
                //处理摸得牌
                if(this._playerData._send_tile)
                {
                    this._playerData._standUpTiles.push(this._playerData._send_tile);
                    if(this._seatId === 0)
                    {
                        this._playerData._standUpTiles.sort(cc.vv.utils.tilesSortNumber);
                        this.setSendTileInStandTiles(this._playerData._send_tile);
                    }
                    else
                    {
                        this._arrStandUpTiles.push(this._sendTiled)
                        this.refreshStandTilesPos();

                    }

                    this._playerData._send_tile = null;
                }
            }

        }

        this.playPlayTileAnimation(playTile, playTileARPos,true);
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
    },
    refreshStandTilesPos:function()
    {
        if(this._seatId === 0)
        {
            for(var i = 0; i < this._arrStandUpTiles.length;i++)
            {
                var tile = this._arrStandUpTiles[i];
                var posX = i * 61 * -1 - 160
                var posY = 50
                tile.setPosition(cc.p(posX, posY))
            }
        }
        else if(this._seatId === 1 || this._seatId === 3)
        {

            for(var i = 0; i < this._arrStandUpTiles.length;i++)
            {
                var tile = this._arrStandUpTiles[i];
                tile.setPosition(cc.p(0, i * 25 * -1));

            }
        }
        else if(this._seatId === 2)
        {

            for(var i = 0; i < this._arrStandUpTiles.length;i++)
            {
                var tile = this._arrStandUpTiles[i];
                tile.setPosition(cc.p(40 * i, 0));

            }
        }


    },
    addPlayedTile:function(tileId)
    {
        var tile = cc.instantiate(this.playTile)
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
        var tile = cc.instantiate(this.playTile)
        var pTileC = tile.getComponent("TileC")
        pTileC.init(this._seatId)
        pTileC.setConfig({ tile: tileId })
        pTileC.setContentSize(cc.size(46, 60), 1)
        this.node.addChild(tile)

        return tile;
    },

    playPlayTileAnimation:function(tileId, srcPos,needSend)
    {
        //添加到出牌区
        var playedTile = this.addPlayedTile(tileId);
        // playedTile.active = false;

        this._playingAnTile = this.clonePlayTile(tileId);

        var dstPos = playedTile.convertToWorldSpaceAR(cc.p(0,0));

        var controlPoints = this._playTileConfig.getPlayTileControlPoints(srcPos, dstPos);

        var that = this;
        var playingTileC = this._playingAnTile.getComponent("TileC")
        if (!CC_JSB && !cc.sys.isNative)
        {
                that.onPlayTileEnd();
                if(needSend)
                {
                    cc.vv.net.sendPlayTile(tileId);

                }
        }
        else
        {
            playingTileC.runPlayAction(srcPos, controlPoints, 0.2, function(){
                that.onPlayTileEnd();
                if(needSend)
                {
                    cc.vv.net.sendPlayTile(tileId);
                }
            });
        }


    },
    removePlayingTile:function()
    {
        if(this._playingAnTile)
        {
            this._playingAnTile.removeFromParent();
            this._playingAnTile = null;
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
    }

});
