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
        _juShuZhangShu: null
        
    }
    onLoad: () ->

        this.addComponent "Alert"
        this.addComponent "Dissolve"
        this.addComponent "Setting"
        this.addComponent "MjRoom"
        
    
        this._headTileInfo = this.node.getChildByName "HeadTileInfo"
        this._seatReady = this.node.getChildByName "SeatReady"
        this._gameNode = this.node.getChildByName "GameNode"
        this.initEventHandlers()
        
        if cc.director.TableGlobalData.isHostUser()
                argetSprite = this.quitButton.getComponent cc.Sprite
                argetSprite.spriteFrame = this.quitButtonSprite
        
        
        
        
        # component = cc.find "Canvas/GameNode/JuShu"
        # this._juShuZhangShu = component.getComponent cc.Label
    start: () ->
        console.log "mjGameScene ........."
        if cc.director.TableGlobalData.getGameIn()
            this.onGameBeign()
            seats = cc.director.TableGlobalData.getSeats()
            for i in [0...seats.length]
                if seats[i].userid > 0
                    localIndex = cc.director.TableGlobalData.getLocalIndex seats[i].seatindex
                    console.log "localIndex : " + localIndex
                    cc.director.GlobalEvent.emit "refresh_all", {
                            seatId: localIndex
                        }
    initEventHandlers: () ->
        cc.vv.gameNetMgr.dataEventHandler = this.node
        self = this
        cc.director.GlobalEvent.on "game_begin", this.onGameBeign, this
    

    onGameBeign: () ->
        console.log "onGameBeign: "
        # this._headTileInfo.active = false
        this._seatReady.active = false
        this._gameNode.active = true

        component = cc.find "Canvas/HeadTileInfo/TableNoLabel"
        this.tableNoLabel = component.getComponent cc.Label
        this.tableNoLabel.string = "房间: " + cc.director.TableGlobalData.getRoomId()


    showSettingUI: () ->
        if cc.vv.setting
            cc.vv.setting.showSetting()
    update: (dt) ->
        # do your update here

        
        
}
