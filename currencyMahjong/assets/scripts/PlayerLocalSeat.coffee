cc.Class {
    extends: cc.Component

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
        _seatId: 0
    }
    onLoad: () ->
        this._seatId = 0
    
        this._playerData = cc.vv.playersManager._players[0]
        self = this
        cc.director.GlobalEvent.on "stand_tiles", this.init_tiles, this
        cc.director.GlobalEvent.on "send_tile", this.send_tile, this,
        cc.director.GlobalEvent.on "chi", this.chi, this
        cc.director.GlobalEvent.on "peng", this.peng, this
        cc.director.GlobalEvent.on "gang", this.gang, this
        cc.director.GlobalEvent.on "play", this.play , this
    init_tiles: (data) ->
        console.log " init_tiles data " + JSON.stringify data
        if data.seatId isnt this._seatId
            return

        console.log " local stand_tiles: " + this._playerData._standUpTiles
        # this.standNode.removeAllChildren()
        for i in [0...this._playerData._standUpTiles.length]
            tile = cc.instantiate this.localStandUpTile
            pTileC = tile.getComponent "TileC"
            pTileC.init()
            pTileC.setConfig { tile: this._playerData._standUpTiles[i] }
            pTileC.setContentSize(cc.size(68, 98), 0.94)
            this.standNode.addChild tile
            posX = i * 61 * -1 - 160
            posY = 50
            console.log "posX =========== " + posX
            console.log "posX =========== " + posY
            tile.setPosition(cc.p(posX, posY))
        console.log "children.length: " + this.standNode.children.length
        for k in [0...this.standNode.children.length]
            pos = this.standNode.children[k].getPosition()
            console.log "pos : " + JSON.stringify pos
    send_tile: (data) ->
        console.log " send_tile data " + JSON.stringify data
        if data.seatId isnt this._seatId
            return
        console.log "local send_tile: " + this._playerData._send_tile
        tile = cc.instantiate this.localStandUpTile
        pTileC = tile.getComponent "TileC"
        pTileC.init()
        pTileC.setConfig { tile: this._playerData._send_tile }
        pTileC.setContentSize(cc.size(68, 98), 0.94)
        this.standNode.addChild tile
        tile.setPosition(cc.p( -70, 50))

        cc.vv.utils.runSendTileAction(tile)
        

    chi: (data) ->
        console.log "local chi tiles : " + this._playerData._chi_tiles
    peng: (data) ->
        console.log "local peng tiles : " + this._playerData._peng_tiles
    gang: (data) ->
        console.log "local gang tiles : " + this._playerData._peng_tiles
    play: (data) ->
        console.log "local play tiles : " + this._playerData._peng_tiles
    update: (dt) ->
        # do your update here
}
