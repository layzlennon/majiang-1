cc.Class({
    extends: cc.Component,

    properties: {
        _winTileId:-1,
        _winDegree:0,
    },

    praseWinParmes:function(winTileId,winDegree) {
        this._winTileId = winTileId;
        this._winDegree = winDegree;
    },
    clickWinBtn:function () {

    }

});
