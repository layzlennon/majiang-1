cc.Class {
    extends: cc.Component

    properties: {
        _standUpTiles: null,
        _chi_tiles: null,
        _peng_tiles: null,
        _gang_tiles: null,
        _send_tile: -1,
        _play_tile: -1,
        _index: -1,
        _parentNode: null
        _standComponentList: [],

        _nickName: null,
        _score: 0,
        _voiceDate: null,
        _ready: false,
        _onLine: false,
        _headIconImg: null,
        _userId: 0,
        
    }

    onInit: () ->
        this._standUpTiles = []
        this._chi_tiles = []
        this._peng_tiles = []
        this._gang_tiles = []
        this._tile = -1
        this._standComponentList = []

    refreshBaseInfo: (seatInfo) ->
        this._nickName = seatInfo.name
        this._score = "积分: " + seatInfo.score
        this._onLine = !seatInfo.online
        this._ready = seatInfo.ready
        this._userId = seatInfo.userid
    setIndexPlayer: (index) ->
        this._index = index
    sortNumber: (a, b) ->
        return b - a
    
    refreshTiles: (parseTiles, nodeObj) ->

        if parseTiles['standup_tiles']
            this._standUpTiles.sort()
            parseTiles['standup_tiles'].sort(this.sortNumber)
            if this._standUpTiles.toString() isnt parseTiles['standup_tiles'].toString()
                this._standUpTiles = parseTiles['standup_tiles']

        if parseTiles["send_tile"]
            this._send_tile = parseTiles["send_tile"]

        if parseTiles['play_tile']
            this._play_tile = parseTiles["play_tile"]

        if parseTiles["peng_tiles"]
            this._peng_tiles.sort()
            parseTiles['peng_tiles'].sort()
            if this._peng_tiles.toString() isnt parseTiles['peng_tiles'].toString()
                this._peng_tiles = parseTiles['peng_tiles']
        
        if parseTiles["chi_tiles"]
            this._chi_tiles.sort()
            parseTiles["chi_tiles"].sort()
            if this._chi_tiles.toString() isnt parseTiles["chi_tiles"].toString()
                this._chi_tiles = parseTiles["chi_tiles"]

        if parseTiles["gang_tiles"]
            this._gang_tiles.sort()
            parseTiles["gang_tiles"].sort()
            if this._gang_tiles.toString() isnt parseTiles["gang_tiles"].toString()
                this._gang_tiles = parseTiles["gang_tiles"]
        
        console.log "standup_tiles " + JSON.stringify this._standUpTiles
        console.log "_send_tile " + JSON.stringify this._send_tile
        console.log "_peng_tiles " + JSON.stringify this._peng_tiles
        console.log "_chi_tiles " + JSON.stringify this._chi_tiles
        console.log "_gang_tiles " + JSON.stringify this._gang_tiles
        console.log "play_tile  " + JSON.stringify this._play_tile
        
    update: (dt) ->
        # do your update here
}
