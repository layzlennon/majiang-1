cc.Class {
    extends: cc.Component

    properties: {
        tileBg: {
            default: null,
            type: cc.Sprite
        },
        tileFlower: {
            default: null,
            type: cc.Sprite
        },
        tileFg: {
            default: null,
            type: cc.Sprite
        },
        tileMask: {
            default: null,
            type: cc.Sprite
        },
        _tileID: -1,
        _isTouchFg: false
        _contentSize: null
        _viewSize: null
        _pos: null
    }
    init: () ->
        
        self = this
        this._contentSize = cc.size 0, 0
        this._viewSize = cc.size 0, 0

        onTouchStart = (event) ->
            console.log " touch start "
            self._isTouchFg = true
            self._pos = self.node.getPosition()
            posY = self.node.getPositionY()
            posX = self.node.getPositionX()
            plusHeigth = self._viewSize.height * 0.2
            self.node.setPosition(cc.p(posX, posY + plusHeigth))
            cc.director.GlobalEvent.emit "touchTile" , self._tileID
        onTouchMove = (event) ->
            console.log " touch move"
        onTouchEnd = (event) ->
            console.log " touch end"
            
        onTouchCancle = (event) ->
            console.log " touch cancel"
            self._isTouchFg = false
            self.node.setPosition self._pos

        this.node.on cc.Node.EventType.TOUCH_START, onTouchStart, this.node
        this.node.on cc.Node.EventType.TOUCH_MOVE, onTouchMove, this.node
        this.node.on cc.Node.EventType.TOUCH_END, onTouchEnd, this.node
        this.node.on cc.Node.EventType.TOUCH_CANCEL, onTouchCancle, this.node

        cc.director.GlobalEvent.on "touchTile", (data) ->
            console.log "touch Tile " + JSON.stringify data
            if data is self._tileID
                return
            else
                if self._isTouchFg is true
                    self._isTouchFg = false
                    self.node.setPosition self._pos

    setContentSize: (cSize, scale) ->
        this._contentSize = cSize
        this._viewSize.width = this._contentSize.width * scale
        this._viewSize.height = this._contentSize.height * scale
    setConfig: (config) ->
        console.log "down setConfig " + JSON.stringify config
        if config['tile']
            this._tileID = config['tile']
        self = this
        cc.loader.loadRes "texture/MjTiles", cc.SpriteAtlas, (err, atlas) ->
            console.log "cc.loader.loadRes  " + self._tileID
            self.tileFlower.spriteFrame = atlas.getSpriteFrame "" + self._tileID
        
        # this.playTile.removeFromParent()
        # this.setPosition pos.x, pos.y

        # this.node.setPosition(cc.p(1000, 0))
    update: (dt) ->
        # do your update here
}

