cc.Class({
    extends: cc.Component,

    properties: {
        _SEAT_DOWN          : 0,
        _SEAT_RIGHT         : 1,
        _SEAT_UP            : 2,
        _SEAT_LEFT          : 3,
        _SEAT_NUM           : 4,
        _seatIndex          : -1,       // 座位索引
        _playTileStart      : null,     // 起点坐标
        _arrPlayTileCount   : null,     // 出牌区数量

    },
    init: function(seatIndex, playTileStart, maxPlayerNum)
    {
        this._playTileStart = playTileStart;
        this._seatIndex = seatIndex;
        var play_tile_count = [
            [3, 8],
            [7, 3],
            [3, 8],
            [7, 3]
        ];
        if(maxPlayerNum < 3)
        {
            if(seatIndex > this._SEAT_DOWN)
            {
                this._seatIndex = this._SEAT_UP;
            }
            this._arrPlayTileCount = [2, 11];
        }
        else
        {
            this._arrPlayTileCount = play_tile_count[seatIndex];
        }
    },
    // use this for initialization
    onLoad: function () {

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
        var size = cc.size(tileSize.width * 1, tileSize.height * 0.86);
        switch(this._seatIndex)
        {
            case this._SEAT_DOWN:
            {
                rowIndex = Math.floor(tileIndex / colCount);
                colIndex = Math.floor(tileIndex % colCount);
                p.x = this._playTileStart.x + colIndex * size.width;
                p.y = this._playTileStart.y + rowIndex * size.height;
                break;
            }
            case this._SEAT_RIGHT:
            {
                rowIndex = Math.floor(tileIndex % rowCount);
                colIndex = Math.floor(tileIndex / rowCount);
                p.x = this._playTileStart.x + size.width * colCount - (colIndex + 1) * size.width;
                p.y = this._playTileStart.y + rowIndex * size.height;
                break;
            }
            case this._SEAT_UP:
            {
                rowIndex = Math.floor(tileIndex / colCount);
                colIndex = Math.floor(tileIndex % colCount);
                p.x = this._playTileStart.x + size.width * colCount - (colIndex + 1) * size.width;
                p.y = this._playTileStart.y + size.height * rowCount - (rowIndex + 1) * size.height;
                break;
            }
            case this._SEAT_LEFT:
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
            p.y += 8;
        }
        console.log("getPlayedTilePosition " + JSON.stringify(p))
        return p;
    },

    /**
     * 获取打出牌的ZOrder
     */
    getPlayedTileZOrder:function(tileIndex)
    {
        var rowCount = this._arrPlayTileCount[0];
        var colCount = this._arrPlayTileCount[1];
        var tileCount = rowCount * colCount;
        tileIndex %= tileCount;

        switch(this._seatIndex)
        {
            case this._SEAT_DOWN:      return -1000 + tileCount - tileIndex;
            case this._SEAT_RIGHT:     return -1000 + tileCount - tileIndex;
            case this._SEAT_UP:        return -1000 + tileIndex;
            case this._SEAT_LEFT:      return -1000 + tileIndex;
        }
    },

    /**
     * 获取出牌动画贝赛尔曲线的控制点
     */
    getPlayTileControlPoints:function(srcPos, dstPos)
    {
        var delta = cc.pSub(dstPos, srcPos);
        var controlPoints = [
            cc.p(srcPos.x, srcPos.y),
            cc.p(srcPos.x + delta.x * 0.5, srcPos.y + delta.y * 0.5),
            cc.p(dstPos.x, dstPos.y)
        ];

        var absDelta = cc.p(Math.abs(delta.x) * 0.5, Math.abs(delta.y) * 0.5);
        var incVar = absDelta.x > absDelta.y ? 'y' : 'x';

        switch(this._seatIndex)
        {
            case this._SEAT_DOWN:
                controlPoints[0][incVar] += absDelta[incVar];
                controlPoints[1][incVar] += absDelta[incVar];
                break;
            case this._SEAT_RIGHT:
                controlPoints[0][incVar] -= absDelta[incVar];
                controlPoints[1][incVar] -= absDelta[incVar];
                break;
            case this._SEAT_UP:
                controlPoints[0][incVar] -= absDelta[incVar];
                controlPoints[1][incVar] -= absDelta[incVar];
                break;
            case this._SEAT_LEFT:
                controlPoints[0][incVar] += absDelta[incVar];
                controlPoints[1][incVar] += absDelta[incVar];
                break;
        }

        return controlPoints;
    },

    /**
     * 获取打出的牌的总数
     */
    getPlayedTileCount:function()
    {
        return this._arrPlayTileCount[0] * this._arrPlayTileCount[1];
    }
});
