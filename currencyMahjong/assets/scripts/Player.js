cc.Class({
    extends: cc.Component,
    properties: {
        _standUpTiles: null,
        _chi_tiles: null,
        _peng_tiles: null,
        _gang_tiles: null,
        _drop_tiles: null,
        _send_tile: null,
        _play_tile: null,
        _index: -1,
        _parentNode: null,
        _standComponentList: [],

        _nickName: null,
        _score: 0,
        _voiceDate: null,
        _ready: false,
        _onLine: false,
        _headIconImg: null,
        _userId: 0,
        _playTilePos:null,
        
    },
    onInit:function()
    {

        this._standUpTiles = []
        this._chi_tiles = []
        this._peng_tiles = []
        this._gang_tiles = []
        this._drop_tiles = []
    },
    refreshBaseInfo:function(seatInfo)
    {
        this._nickName = seatInfo.name
        this._score = "积分: " + seatInfo.score
        this._onLine = !seatInfo.online
        this._ready = seatInfo.ready
        this._userId = seatInfo.userid
    },
    setIndexPlayer:function(index)
    {
        this._index = index

    },

    dropTiles:function(dropTile, tilePos,isSendTileF)
    {
        // refreshAndTidyStandUpTiles
        //添加到出牌列表
        this._playTilePos = tilePos;
        this._play_tile = dropTile;
        
        this._drop_tiles.push(dropTile);
        if(isSendTileF)
        {
            this._send_tile = null;
            return;
        }

        if(this._standUpTiles[0] === cc.director.TableGlobalData.invalid_tile_id)
        {
            if(this._send_tile !== null)
            {
                this._send_tile = null;
            }
            else
            {
                this._standUpTiles.pop();
            }
            return;

        }
        var index = this._standUpTiles.indexOf(dropTile);

        if(index < 0)
        {
            cc.log('Can not find stand up tile id = ' + dropTile);
            return;
        }
        else
        {
            this._standUpTiles.splice(index,1);

        }

        this._standUpTiles.sort(cc.vv.utils.tilesSortNumber)

        
    },
    refreshTiles:function(parseTiles, nodeObj)
    {
        if(parseTiles['standup_tiles'])
        {
            this._standUpTiles.sort()
            parseTiles['standup_tiles'].sort(cc.vv.utils.tilesSortNumber)
            if(this._standUpTiles.toString() !== parseTiles['standup_tiles'].toString())
            {
                this._standUpTiles = parseTiles['standup_tiles']

            }

        }

        if(parseTiles["send_tile"])
        {
            this._send_tile = parseTiles["send_tile"]
        }
        if(parseTiles['play_tile'])
        {
            this._play_tile = parseTiles["play_tile"]

        }

        if(parseTiles["peng_tiles"])
        {
            this._peng_tiles.sort()
            parseTiles['peng_tiles'].sort()
            if(this._peng_tiles.toString() != parseTiles['peng_tiles'].toString())
            {
                this._peng_tiles = parseTiles['peng_tiles']
            }
        
        }
      
        if(parseTiles["chi_tiles"])
        {
            this._chi_tiles.sort()
            parseTiles["chi_tiles"].sort()
            if(this._chi_tiles.toString() != parseTiles["chi_tiles"].toString())
            {
                this._chi_tiles = parseTiles["chi_tiles"]
            }
        }
        if(parseTiles["gang_tiles"])
        {
            this._gang_tiles.sort()
            parseTiles["gang_tiles"].sort()
            if(this._gang_tiles.toString() != parseTiles["gang_tiles"].toString())
            {
                this._gang_tiles = parseTiles["gang_tiles"]

            }
        
        }
        console.log("standup_tiles " + JSON.stringify(this._standUpTiles))
        console.log("_send_tile " + JSON.stringify(this._send_tile))
        console.log("_peng_tiles " + JSON.stringify(this._peng_tiles))
        console.log("_chi_tiles " + JSON.stringify(this._chi_tiles))
        console.log("_gang_tiles " + JSON.stringify(this._gang_tiles))
        console.log("play_tile  " + JSON.stringify(this._play_tile))
    }
})
