cc.Class {
    extends: cc.Component

    properties: {
        openTile: {
            default: null,
            type: cc.Node
        },
        standUpTile: {
            default: null,
            type: cc.Node
        },
        downTile: {
            default: null,
            type: cc.Node
        },
        playTile: {
            default: null,
            type: cc.Prefab
        },
    }
    setConfig: (config) ->
        if config['standUp']
            this.downTile.removeFromParent()
            this.openTile.removeFromParent()
        else if config['open']
            this.downTile.removeFromParent()
            this.standUpTile.removeFromParent()
        else if config['down']
            this.openTile.removeFromParent()
            this.standUpTile.removeFromParent()

    update: (dt) ->
        # do your update here
}
