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
        playTileNode: {
            default: null,
            type: cc.Prefab
        },
        tilesDownNode: {
            default: null,
            type: cc.Prefab
        },
        tilesLeftRightNode: {
            default: null,
            type: cc.Prefab
        },
        tilesUpNode: {
            default: null,
            type: cc.Prefab
        },
        
    }
    onLoad: () ->

        # this.addComponent "MjRoom"
        # this.addComponent "Alert"
        # this.addComponent "Dissolve"
        # this.addComponent "Setting"

        # this.initEventHandlers()

        # if cc.vv.gameNetMgr.isHostUser()
        #         argetSprite = this.quitButton.getComponent cc.Sprite
        #         argetSprite.spriteFrame = this.quitButtonSprite
        tiles = [32, 36, 17, 6, 15, 34, 34, 8, 33, 36, 9, 27, 13]
        sortNumber = ( a, b ) ->
            return a < b
        tiles.sort(sortNumber)
        console.log tiles
        StandNode = cc.find "Canvas/GameNode/Player0/StandRoot/StandNode"
        for i in [0 ... 13]
            playTile = cc.instantiate this.tilesDownNode
            playTile.getComponent('TilesDown').setConfig { tile: tiles[i] }
            StandNode.addChild playTile
            playTile.setPosition(cc.p(i * 65 * -1 - 165, 0))
        StandNode = cc.find "Canvas/GameNode/Player1/StandNode"
        for i in [0 ... 13]
            playTile = cc.instantiate this.tilesLeftRightNode
            playTile.getComponent('TilesLeftRight').setConfig { left: false,
            open: false, down: false, play: false , standUp: true }
            StandNode.addChild playTile
            playTile.setPosition(cc.p(0, i * 25 * -1))
        StandNode = cc.find "Canvas/GameNode/Player3/StandNode"

        for i in [0 ... 13]
            playTile = cc.instantiate this.tilesLeftRightNode
            playTile.getComponent('TilesLeftRight').setConfig { left: true,
            open: false, down: false, play: false, standUp: true }
            StandNode.addChild playTile
            playTile.setPosition(cc.p(0, i * 25 * -1))
        StandNode = cc.find "Canvas/GameNode/Player2/StandRoot/StandNode"
        for i in [0 ... 13]
            playTile = cc.instantiate this.tilesUpNode
            playTile.getComponent('TilesUp').setConfig { open: false,
            down: false, play: false, standUp: true }
            StandNode.addChild playTile
            playTile.setPosition(cc.p(i * 40, 0))
    initEventHandlers: () ->
        cc.vv.gameNetMgr.dataEventHandler = this.node
        self = this
        this.node.on()
    showSettingUI: () ->
        if cc.vv.setting
            cc.vv.setting.showSetting()
    update: (dt) ->
        # do your update here

        
        
}
