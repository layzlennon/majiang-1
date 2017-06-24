cc.Class {
    extends: cc.Component

    properties: {
       
        quitButtonSprite: {
            default: null,
            type: cc.SpriteFrame
        },
        quitButton: {
            default: null,
            type: cc.Button
        },
        standNode: {
            default: null,
            type: cc.Node
        },
        localStandUpTile: {
            default: null,
            type: cc.Node
        },
        _headTileInfo: null,
        _gameNode: null,
        _tilesNode: null,
        
    }
    onLoad: () ->

        this.addComponent "Alert"
        this.addComponent "Dissolve"
        this.addComponent "Setting"
        this.addComponent "PlayersManage"
        this.addComponent "MjRoom"
        
    
        this._headTileInfo = this.node.getChildByName "HeadTileInfo"
        this._seatReady = this.node.getChildByName "SeatReady"
        this._gameNode = this.node.getChildByName "GameNode"
        this.initEventHandlers()
        
        if cc.vv.gameNetMgr.isHostUser()
                argetSprite = this.quitButton.getComponent cc.Sprite
                argetSprite.spriteFrame = this.quitButtonSprite
        
        
        

    initEventHandlers: () ->
        cc.vv.gameNetMgr.dataEventHandler = this.node
        self = this
        this.node.on "game_begin", (data) ->
            self.onGameBeign()
    refreshSendTile: (seatId) ->
        console.log "refreshSendTile: " + seatId
        player = cc.vv.playersManager._players[seatId]
        playTile = player._tile
        playTile = cc.instantiate this._tilesNode[seatId]["tileNode"]
        pTileC = playTile.getComponent this._tilesNode[seatId]["commponentName"]
        player._parentNode.addChild playTile
        playTile.setPosition(cc.p(-80, 0))

    onGameBeign: () ->
        this._headTileInfo.active = false
        this._seatReady.active = false
        this._gameNode.active = true

    showSettingUI: () ->
        if cc.vv.setting
            cc.vv.setting.showSetting()
    update: (dt) ->
        # do your update here

        
        
}
