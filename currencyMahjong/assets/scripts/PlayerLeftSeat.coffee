cc.Class {
    extends: cc.Component

    properties: {
        leftStandUpTile: {
            default: null,
            type: cc.Node
        },
        leftOpenTile: {
            default: null,
            type: cc.Node
        },
        leftDownTile: {
            default: null,
            type: cc.Node
        },
        leftPlayTile: {
            default: null,
            type: cc.Node
        },
        standNode: {
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
        #玩家数据信息
        _playerData: null,
        _seatId: 3
    }
    onLoad: () ->
        this._seatId = 3
        this._playerData = cc.vv.playersManager._players[3]

        self = this
        cc.director.GlobalEvent.on "stand_tiles", this.init_tiles, this
        cc.director.GlobalEvent.on "send_tile", this.send_tile, this
        cc.director.GlobalEvent.on "chi", this.chi , this
        cc.director.GlobalEvent.on "peng", this.peng, this
        cc.director.GlobalEvent.on "gang", this.gang, this
        cc.director.GlobalEvent.on "play", this.play, this
    init_tiles: (data) ->

        console.log " init_tiles data " + JSON.stringify data
        if data.seatId isnt this._seatId
            return
        console.log " left stand_tiles: " + this._playerData._standUpTiles
            
        this.standNode.removeAllChildren()
        for i in [0...this._playerData._standUpTiles.length]
            tile = cc.instantiate this.leftStandUpTile
            this.standNode.addChild tile
            tile.setPosition(cc.p(0, i * 25 * -1))
    send_tile: (data) ->

        console.log " send_tile data " + JSON.stringify data
        if data.seatId isnt this._seatId
            return
        console.log "left send_tile: " + this._playerData._send_tile
        tile = cc.instantiate this.leftStandUpTile
        this.standNode.addChild tile
        tilesLength = this._playerData._standUpTiles.length
        tile.setPosition(cc.p(0, tilesLength * 27 * -1))
        # cc.vv.utils.runSendTileAction(tile)
    chi: () ->
        console.log "left chi tiles : " + this._playerData._chi_tiles
    peng: () ->
        console.log "left peng tiles : " + this._playerData._peng_tiles
    gang: () ->
        console.log "left gang tiles : " + this._playerData._peng_tiles
    play: () ->
        console.log "left play tiles : " + this._playerData._peng_tiles
    

    update: (dt) ->
        # do your update here
}
