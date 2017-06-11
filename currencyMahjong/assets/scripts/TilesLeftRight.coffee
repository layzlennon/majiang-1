cc.Class {
    extends: cc.Component

    properties: {
        standupLeftTile: {
            default: null,
            type: cc.Node
        },
        standupRightTile: {
            default: null,
            type: cc.Node
        },
        downTile: {
            default: null,
            type: cc.Node
        },
        openLeftTile: {
            default: null,
            type: cc.Node
        },
        openRightTile: {
            default: null,
            type: cc.Node
        },
        playTile: {
            default: null,
            type: cc.Prefab
        },
    }
    onLoad: () ->
        cc.log "tiles left right "
        
    setConfig: (config) ->
        console.log " config : " + JSON.stringify config
        if config['left']
            this.openRightTile.removeFromParent()
            this.standupRightTile.removeFromParent()
            this.downTile.removeFromParent()
            if not config['open']
                this.openLeftTile.removeFromParent()
            if config['standUp']
                this.standupLeftTile.active = true
        else
            if config['open']
                this.openRightTile.removeFromParent()
            this.downTile.removeFromParent()
            this.openLeftTile.removeFromParent()
            this.standupLeftTile.removeFromParent()
            if config['standUp']
                this.standupRightTile.active = true
        if config['play']
            this.openRightTile.removeFromParent()
            this.downTile.removeFromParent()
            this.openLeftTile.removeFromParent()
            this.standupRightTile.removeFromParent()
            this.standupLeftTile.removeFromParent()
        else if config['down']
            this.openRightTile.removeFromParent()
            this.openLeftTile.removeFromParent()
            this.standupRightTile.removeFromParent()
            this.standupLeftTile.removeFromParent()
        
    update: (dt) ->
        # do your update here
}
