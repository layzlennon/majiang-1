cc.Class {
    extends: cc.Component

    properties: {
        rightStandUpTile: {
            default: null,
            type: cc.Node
        },
        rightOpenTile: {
            default: null,
            type: cc.Node
        },
        rightDownTile: {
            default: null,
            type: cc.Node
        },
        rightPlayTile: {
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
        #玩家数据信息
        _playerData: null,
        _seatId: 1
    }
    onLoad: () ->
        this._seatId = 1
        this._playerData = cc.vv.playersManager._players[1]
        self = this
        cc.director.GlobalEvent.on "stand_tiles", this.init_tiles, this
        cc.director.GlobalEvent.on "send_tile", this.send_tile, this
        cc.director.GlobalEvent.on "chi", this.chi , this
        cc.director.GlobalEvent.on "peng", this.peng, this
        cc.director.GlobalEvent.on "gang", this.gang, this
        cc.director.GlobalEvent.on "play", this.play, this
        cc.director.GlobalEvent.on "refresh_all", this.refreshAll , this
    
    refreshAll: (data) ->
        # console.log " rightSeat refreshAll data " + JSON.stringify data
        if data.seatId isnt this._seatId
            return
        this.init_tiles(data)
        this.chi(data)
        this.peng(data)
        this.gang(data)
    init_tiles: (data) ->
        # console.log " init_tiles data " + JSON.stringify data
        if data.seatId isnt this._seatId
            return
        console.log "right stand_tiles: " + this._playerData._standUpTiles
        this.standNode.removeAllChildren()
        for i in [0...this._playerData._standUpTiles.length]
            tile = cc.instantiate this.rightStandUpTile
            this.standNode.addChild tile
            tile.setPosition(cc.p(0, i * 25 * -1))
        
    send_tile: (data) ->
        console.log " send_tile data " + JSON.stringify data
        if data.seatId isnt this._seatId
            return
        console.log "right send_tile: " + this._playerData._send_tile
        tile = cc.instantiate this.rightStandUpTile
        this.standNode.addChild tile
        tile.setPosition(cc.p(0, 50))
        tile.setLocalZOrder -10
        # cc.vv.utils.runSendTileAction(tile)
        
    chi: () ->
        console.log "right chi tiles : " + this._playerData._chi_tiles
    peng: () ->
        console.log "right peng tiles : " + this._playerData._peng_tiles
    gang: () ->
        console.log "right gang tiles : " + this._playerData._peng_tiles
    play: () ->
        console.log "right play tiles : " + this._playerData._peng_tiles
    update: (dt) ->
        # do your update here
}
