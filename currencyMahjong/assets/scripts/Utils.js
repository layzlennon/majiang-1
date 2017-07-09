cc.Class({
    extends: cc.Component,
    properties: {
    
    },
    addClickEvent:function(node, target, component, handler){
        var eventHandler = new cc.Component.EventHandler
        eventHandler.target = target
        eventHandler.component = component
        eventHandler.handler = handler
        var clickEvents = node.getComponent(cc.Button).clickEvents
        clickEvents.push(eventHandler)
    },
    addSlideEvent:function(node, target, component, handler)
    {
        var eventHandler = new cc.Component.EventHandler()
        eventHandler.target = target
        eventHandler.component = component
        eventHandler.handler = handler

        var slideEvents = node.getComponent(cc.Slider).slideEvents
        slideEvents.push(eventHandler)
    },
    runSendTileAction:function(tileNode)
    {
        var pos = tileNode.getPosition()
        tileNode.setPosition(cc.pAdd(pos, cc.p(0, 20)))
        var actMove = cc.moveTo(0.5, pos)
        tileNode.runAction(cc.EaseElasticOut.create(actMove, 0.2))
    },

    tilesSortNumber:function(a, b){
        return b - a

    },
    getPlayedTilePosition:function(tileIndex, tileSize)
    {
        // 行列数
        var rowCount = this._arrPlayTileCount[0];
        var colCount = this._arrPlayTileCount[1];
        var count = rowCount * colCount;
        var isSecondFloor = tileIndex >= count;
        tileIndex %= count;

        var p = cc.p(0, 0), rowIndex = 0, colIndex = 0;

        // 排列用的大小
        var size = cc.size(tileSize.width * mjv.TablePlayerConfig.PLAY_TILE_SIZE_F.x, tileSize.height * mjv.TablePlayerConfig.PLAY_TILE_SIZE_F.y);
        switch(this._seatIndex)
        {
            case mj.SEAT_DOWN:
            {
                rowIndex = Math.floor(tileIndex / colCount);
                colIndex = Math.floor(tileIndex % colCount);
                p.x = this._playTileStart.x + colIndex * size.width;
                p.y = this._playTileStart.y + rowIndex * size.height;
                break;
            }
            case mj.SEAT_RIGHT:
            {
                rowIndex = Math.floor(tileIndex % rowCount);
                colIndex = Math.floor(tileIndex / rowCount);
                p.x = this._playTileStart.x + size.width * colCount - (colIndex + 1) * size.width;
                p.y = this._playTileStart.y + rowIndex * size.height;
                break;
            }
            case mj.SEAT_UP:
            {
                rowIndex = Math.floor(tileIndex / colCount);
                colIndex = Math.floor(tileIndex % colCount);
                p.x = this._playTileStart.x + size.width * colCount - (colIndex + 1) * size.width;
                p.y = this._playTileStart.y + size.height * rowCount - (rowIndex + 1) * size.height;
                break;
            }
            case mj.SEAT_LEFT:
            {
                rowIndex = Math.floor(tileIndex % rowCount);
                colIndex = Math.floor(tileIndex / rowCount);
                p.x = this._playTileStart.x + colIndex * size.width;
                p.y = this._playTileStart.y + size.height * rowCount - (rowIndex + 1) * size.height;
                break;
            }
        }

        // 第二层牌，偏移
        if(isSecondFloor)
        {
            p.y += mj.Const.TILE_SECOND_FLOOR_Y_OFFSET;
        }
        return p;
    },
});
