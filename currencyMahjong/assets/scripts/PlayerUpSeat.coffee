cc.Class {
    extends: cc.Component

    properties: {
        upStandUpTile: {
            default: null,
            type: cc.Node
        },
        upOpenTile: {
            default: null,
            type: cc.Node
        },
        upDownTile: {
            default: null,
            type: cc.Node
        },
        upPlayTile: {
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
        _seatId: 2
    }
    onLoad: () ->
        this._seatId = 2
        this._playerData = cc.vv.playersManager._players[2]

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
        console.log " up stand_tiles: " + this._playerData._standUpTiles
        this.standNode.removeAllChildren()
        for i in [0...this._playerData._standUpTiles.length]
            tile = cc.instantiate this.upStandUpTile
            this.standNode.addChild tile
            tile.setPosition(cc.p(i * 40, 0))
    send_tile: (data) ->
        console.log " send_tile data " + JSON.stringify data
        if data.seatId isnt this._seatId
            return
        console.log "up send_tile: " + this._playerData._send_tile
        tile = cc.instantiate this.upStandUpTile
        this.standNode.addChild tile
        tile.setPosition(cc.p(-50, 0))
        # cc.vv.utils.runSendTileAction(tile)
    chi: () ->
        console.log "up chi tiles : " + this._playerData._chi_tiles
    peng: () ->
        console.log "up peng tiles : " + this._playerData._peng_tiles
    gang: () ->
        console.log "up gang tiles : " + this._playerData._peng_tiles
    play: () ->
        console.log "up play tiles : " + this._playerData._play_tile
        
    update: (dt) ->
        # do your update here
}
