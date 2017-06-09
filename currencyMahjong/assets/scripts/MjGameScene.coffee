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
        }
    }
    onLoad: () ->

        this.addComponent "MjRoom"
        this.addComponent "Alert"
        this.addComponent "Dissolve"
        this.addComponent "Setting"

        this.initEventHandlers()

        if cc.vv.gameNetMgr.isHostUser()
                argetSprite = this.quitButton.getComponent cc.Sprite
                argetSprite.spriteFrame = this.quitButtonSprite

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
