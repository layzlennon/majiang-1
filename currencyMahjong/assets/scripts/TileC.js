cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
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
        _isTouchFg: false,
        _contentSize: null,
        _viewSize: null,
        _pos: null,
        _ownIndex: -1,
        _position: null,
        _isSendTileF:false,
    },

    // use this for initialization
    onLoad: function () {

    },
    resetSendTileF:function()
    {
        this._isSendTileF = false;
    },
    getSendTileF:function()
    {
        return this._isSendTileF;
    },
    init:function(ownIndex,isSendTileF)
    {
        var self = this
        this._isSendTileF = isSendTileF || false;
        this._position = cc.p(0, 0);
        this._ownIndex = ownIndex
        this._contentSize = cc.size(0, 0)
        this._viewSize = cc.size(0, 0)
        this.tileMask.node.active = false
        this.tileFg.node.active = false
        var onTouchStart = function(event)
        {
            console.log(" touch start ");
            if(self._isTouchFg)
            {
                return;
            }
            self._isTouchFg = true
            self._pos = self.node.getPosition()
            var posY = self.node.getPositionY()
            var posX = self.node.getPositionX()
            var plusHeigth = self._viewSize.height * 0.2
            self.node.setPosition(cc.p(posX, posY + plusHeigth))
            cc.director.GlobalEvent.emit("touchTile" , { tileID: self._tileID });
            self.tileMask.node.active = true
        };
        var onTouchMove =function(event)
        {
            console.log(" touch move");

        };
        var onTouchEnd =function(event)
        {
            console.log(" touch end" + self.getSendTileF());
            self.tileMask.node.active = false
            cc.director.GlobalEvent.emit("touchPlayTile", {
                tileId: self._tileID,
                seatId: self._ownIndex,
                isSendTileF:self.getSendTileF(),
                tilePos:self.node.getPosition(),
                tileWorldARPos: self.node.convertToWorldSpaceAR(cc.p(0,0))
            });
        }

        var onTouchCancle =function(event)
        {
            console.log(" touch cancel");
            self._isTouchFg = false
            self.node.setPosition(self._pos);
            self.tileMask.node.active = false
        }


        this.node.on(cc.Node.EventType.TOUCH_START, onTouchStart, this.node)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, onTouchMove, this.node)
        this.node.on(cc.Node.EventType.TOUCH_END, onTouchEnd, this.node)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, onTouchCancle, this.node)

        cc.director.GlobalEvent.on("touchTile",function(data)
        {
            console.log("touch Tile " + JSON.stringify (data));
            if(data.tileID === self._tileID)
            {
                return;
            }
            else
            {
                if(self._isTouchFg === true)
                {
                    self._isTouchFg = false
                    self.node.setPosition(self._pos);
                }

            }

        });

    },
    runMoveAction:function(srcPos, duration)
    {
        // 位置没有改变
        
        if(Math.abs(this._position.x - srcPos.x) < 0.1 && Math.abs(this._position.y - srcPos.y) < 0.1)
        {
            return;
        }

        var posInTile = cc.p(this._viewSize.width * 0.5, this._viewSize.height * 0.5);
        this.node.setPosition(cc.pAdd(srcPos, posInTile));
        var act = cc.MoveTo.create(duration, cc.pAdd(this._position, posInTile));
        this.node.runAction(cc.EaseSineIn.create(act));
        
    },
    runTidyAction:function(viewDstPos,duration1, duration2, duration3)
    {
        // 移动
        console.log("viewDstPos: " + JSON.stringify(viewDstPos));
        var tidyHeight = this._viewSize.height * 1.2;
        var controlPoints = [cc.p(0, 0), cc.p(0, 0), cc.p(0, 0)];

        // var posInTile = cc.p(this._viewSize.width * 0.5, this._viewSize.height * 0.5);
        // var viewDstPos = cc.pAdd(this._position, posInTile);
        var viewSrcPos = this.node.getPosition();
        this.node.setPosition(viewSrcPos);

        controlPoints[0].x = viewSrcPos.x;
        controlPoints[0].y = viewSrcPos.y + tidyHeight;
        controlPoints[1].x = viewDstPos.x;
        controlPoints[1].y = viewDstPos.y + tidyHeight;
        controlPoints[2].x = viewDstPos.x;
        controlPoints[2].y = viewDstPos.y;
        console.log("controlPoints: " + JSON.stringify(controlPoints));
        var act1 = cc.MoveTo.create(duration1, controlPoints[0]);
        var act2 = cc.MoveTo.create(duration2, controlPoints[1]);
        var act3 = cc.MoveTo.create(duration3, controlPoints[2]);
        var act = cc.Sequence.create(act1, act2, act3);
        this.node.runAction(cc.EaseSineIn.create(act));

    },
    getPosition:function()
    {
        return this.node.getPosition();
    },
    getTileId:function()
    {
        return this._tileID;
    },
    getTilePosition:function()
    {
        return this.node.getPosition();
    },
    setContentSize:function(cSize, scale)
    {
        this._contentSize = cSize
        this._viewSize.width = this._contentSize.width * scale
        this._viewSize.height = this._contentSize.height * scale
    },  
    getViewSize:function()
    {
        return this._viewSize;
    },
    setPosition:function(p)
    {
        var delta = cc.p(p.x - this._position.x, p.y - this._position.y);
        this._position = cc.p(p.x, p.y);
        var viewPosition = this.node.getPosition();
        this.node.setPosition(cc.p(viewPosition.x + delta.x, viewPosition.y + delta.y));
    }, 
    runPlayAction:function(srcPos, controlPoints, duration, callFunc)
    {
        var _callFunc = callFunc || function(){};
        var cp = [cc.p(0, 0), cc.p(0, 0), cc.p(0, 0)];
        this.setPosition(controlPoints[2]);
        var posInTile = cc.p(this._viewSize.width * 0.5, this._viewSize.height * 0.5);
        this.node.setPosition(cc.pAdd(srcPos, posInTile))
        for(var n = 0; n < 3; ++n)
        {
            cp[n].x = controlPoints[n].x + posInTile.x;
            cp[n].y = controlPoints[n].y + posInTile.y;
        }
        
        var act = cc.Sequence.create(cc.BezierTo.create(duration, cp),
            cc.CallFunc.create((function(_index){
                return function(){
                        _callFunc();  
                }
            })()));
        this.node.runAction(act);

    },
    setConfig:function(config)
    {
        console.log("down setConfig " + JSON.stringify(config))
        if(config['tile'])
        {
            this._tileID = config['tile']

        }
        var self = this
        cc.loader.loadRes("texture/MjTiles", cc.SpriteAtlas, function(err, atlas)
        {
            self.tileFlower.spriteFrame = atlas.getSpriteFrame("" + self._tileID);
        })

        
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
