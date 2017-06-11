cc.Class {
    extends: cc.Component

    properties: {
        standupTile: {
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
        _tileID: -1,
        _tileImg: null,
    }
    onLoad: () ->
        console.log "tiles down onLoad"
        # this.node.children
        console.log "name " + this.node.name
        # tileImg = cc.find "/StandupTile/Tiles"
        standTilBg = this.node.getChildByName "StandupTile"
        tileImg = standTilBg.getChildByName "Tiles"
        this._tileImg = tileImg.getComponent cc.Sprite
        self = this
        tileImg.on cc.Node.EventType.MOUSE_DOWN, (event) ->
            console.log 'mouse down ' + self._tileID
    setConfig: (config) ->
        this.downTile.removeFromParent()
        if config['tile']
            this._tileID = config['tile']
        self = this
        cc.loader.loadRes "texture/MjTiles",
        cc.SpriteAtlas, (err, atlas) ->
            console.log "cc.loader.loadRes  " + self._tileID
            self._tileImg.spriteFrame = atlas.getSpriteFrame "" + self._tileID
        
        # this.playTile.removeFromParent()
        # this.setPosition pos.x, pos.y
    update: (dt) ->
        # do your update here
}
