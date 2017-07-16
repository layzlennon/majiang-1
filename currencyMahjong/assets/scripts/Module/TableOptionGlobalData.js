/**
 * Created by sml on 2017/7/14.
 */
cc.Class({
    "extends": cc.Component,
    properties: {
        _eatTileId              : -1,   // 吃牌ID
        _arrEatTileIndex        : -1,   // 吃牌索引列表
        _touchTileId            : -1,   // 碰牌的ID
        _arrBarTileId           : null,                 // 杠牌列表
        _arrNewBarTileIds       : null,                 // 新杠（大同王牌）
        _arrSendNewBarTileIds   : null,                 // 新杠发给服务器的（大同王牌）
        _arrTingTiles           : null,                 // 听牌列表
        _arrKouTingTiles        : null,                 // 扣听列表
        _winTileId              : -1,   // 和的牌
        _winDegree              : -1,                   // 和的番数
        _grabTingOption         : null,                 // 抢听的选项
        _jingDaoTileId          : -1,   // 精吊的牌
        _buTiledId              : null,   // 长沙玩法，补的牌
        eatTileList             : null,
        _hasPass                : true, // 是否需要显示过，默认需要
        _hasInit                : false,            // 是否已经初始化
    },


    initJson:function (json)
    {
        cc.log("TableOptionGlobalData: "+ JSON.stringify(json));

        // 先清空
        this.clear();



        //吃一个list
        if (json.hasOwnProperty('chi_list_action')){
            this.setEatList(json['chi_list_action']);
        }

        // 吃
        if(json.hasOwnProperty('chi_action'))
        {
            this.setEat(json['tile'], json['chi_action']);
        }

        // 碰
        if(json.hasOwnProperty('peng_action'))
        {
            this.setPeng(json['peng_action']);
        }

        // 杠
        if(json.hasOwnProperty('gang_action') && json['gang_action'].length > 0)
        {
            this.setGang(json['gang_action']);
        }
        //新杠
        if(json.hasOwnProperty('new_gang_action') && json['new_gang_action'].length > 0)
        {
            var gangData = [];
            for (var i = 0; i < json['new_gang_action'].length; ++i){
                gangData.push(json['new_gang_action'][i]['tiles_show']);
            }
            this.setNewBar(gangData);
            var gangSendData = [];
            for (var i = 0; i < json['new_gang_action'].length; ++i){
                gangSendData.push(json['new_gang_action'][i]['tiles_return']);
            }
            this.setSendNewBar(gangSendData);

        }


        // 和
        if(json.hasOwnProperty('win_action') && json['win_action'] > 0)
        {
            this.setWin(json['tile'], json['win_degree']);
        }


        // 抢杠
        if(json.hasOwnProperty('grab_bar') && json['grab_bar'] > 0)
        {
            this.setWin(json['tile'], json['win_degree']);
        }

        // 过牌
        if (json.hasOwnProperty('pass_action')) {
            this._hasPass = json['pass_action'] == 0 ? false : true;
        } else {
            this._hasPass = true;
        }

        // 没有选项
        if(!this.hasOption())
        {
            return false;
        }

        // 初始化完成
        this.onInitComplete();

        return true;
    },
    /**
     * 初始化完成处理
     */
    onInitComplete:function()
    {
        this._hasInit = true;

        // 打印数据

        // 发送事件
        // this.sendEvent(mjm.Model.EVT_INIT, this);
    },
    /**
     * 清空
     */
    clear:function()
    {
        this._eatTileId         = -1;
        this._arrEatTileIndex   = -1;
        this._touchTileId       = -1;
        this._arrBarTileId      = null;
        this._arrNewBarTileIds  = null;
        this._arrSendNewBarTileIds  = null;
        this._arrTingTiles      = null;
        this._arrKouTingTiles   = null;
        this._winTileId         = -1;
        this._jingDaoTileId     = -1;
        this._buTiledId         = null;
        this.eatTileList        = null;
        this._winDegree         = -1;
        this._grabTingOption    = null;
    },

    setEat      : function(tileId, arrIndex)    { this._eatTileId = tileId; this._arrEatTileIndex = arrIndex.concat(); },
    setPeng    : function(tileId)              { this._touchTileId = tileId; },
    setNewBar   : function(arrNewBarTileIds)    { this._arrNewBarTileIds = arrNewBarTileIds.concat(); },
    setSendNewBar   : function(arrSendNewBarTileIds)    { this._arrSendNewBarTileIds = arrSendNewBarTileIds.concat(); },
    setWin      : function(tileId, degree)      { this._winTileId = tileId; this._winDegree = degree; },
    setJingDao  : function(tileId, degree)      { this._jingDaoTileId = tileId; this._winDegree = degree; },
    setBu       : function(tileId)              {this._buTiledId = tileId.concat();},
    setEatList  : function(tileList)            {this.eatTileList = tileList;},
    setGang      : function(arrBarTileId)        { this._arrBarTileId = arrBarTileId.concat(); },

    hasEat              : function() { return this._eatTileId !== -1; },
    hasPeng            : function() { return this._touchTileId !== -1; },
    hasGang              : function() { return this._arrBarTileId !== null; },
    hasNewBar           : function() { return this._arrNewBarTileIds !== null; },
    hasSendNewBar       : function() { return this._arrSendNewBarTileIds !== null; },
    hasTing             : function() { return this._arrTingTiles !== null; },
    hasWin              : function() { return this._winTileId !== -1; },
    hasJingDiao         : function() { return this._jingDaoTileId !== -1; },
    hasGrabTing         : function() { return this._grabTingOption !== null; },
    hasBu               : function() { return this._buTiledId !== null; },
    HasEatList          : function() { return this.eatTileList !== null; },
    hasKouTing          : function() { return this._arrKouTingTiles !== null; },

    getEatTileId        : function() { return this._eatTileId; },
    getEatIndexArray    : function() { return this._arrEatTileIndex; },
    getPengTileId      : function() { return this._touchTileId; },
    getBuTileId         : function() { return this._buTiledId},
    getGangTileIdArray   : function() { return this._arrBarTileId },
    getNewBarTileIdArray: function() { return this._arrNewBarTileIds },
    getSendNewBarTileIdArray: function() { return this._arrSendNewBarTileIds },
    getTingTiles        : function() { return this._arrTingTiles;},
    getKouTingTiles     : function() { return this._arrKouTingTiles; },
    getWinDegree        : function() { return this._winDegree; },
    getWinTileId        : function() { return this._winTileId; },
    getGrabTingOption   : function() { return this._grabTingOption; },
    getEatTileList      : function() { return this.eatTileList; },
    hasPass             : function() { return this._hasPass; },
    hasOption           : function() { return this.hasEat() || this.hasPeng() || this.hasGang() ||  this.hasWin(); }
});