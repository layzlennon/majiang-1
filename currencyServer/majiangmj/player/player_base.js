/**
 * Created by sml on 2017/6/4.
 */

var _ = require("lodash");
var tileManagerBase = require("../manager/manager_base").tileManagerBase();

playerBase = function () {

    this._init_all_members();
};

playerBase.prototype._tile_manager = null;
playerBase.prototype.create_table_total_score = 0;
playerBase.prototype.create_default_score = 0;
playerBase.prototype._room_id = null;
playerBase.prototype._owner = null;
playerBase.prototype._gang_before_play = false
playerBase.prototype._gang_tile_befor_play = 0  // 记录杠的牌
playerBase.prototype._max_action_id = 0
playerBase.prototype._no_action = true  // 表示用户还没有做出任何玩牌动作，天胡/地胡需要
playerBase.prototype._uid = 0
playerBase.prototype._win_coin = 0  // 最终输赢金币数
playerBase.prototype._big_degree_fee = 0  // 大番费
playerBase.prototype._has_bang = false  // 本局是否点炮
playerBase.prototype._win_style = []
playerBase.prototype._win_tile = 0
playerBase.prototype._win_type = -1
playerBase.prototype._sex = 0
playerBase.prototype._name = ""
playerBase.prototype._pic = ''
playerBase.prototype._noGoodTileTimes = 0
// 记录已经出的牌, 短线重连的时候的需要把该信息发送给客户端
playerBase.prototype._drop_tiles = []
playerBase.prototype.has_shown_tiles = false
playerBase.prototype._gang_budget = {'delta_score': 0}
playerBase.prototype._hu_budget = {'delta_score': 0}
playerBase.prototype._budget = {'win': [], 'lose': []}
playerBase.prototype.louhu = false
playerBase.prototype._louhuInfo = [false,0];
playerBase.prototype.firstPlayTile = 0
playerBase.prototype._gangPengChiDetail = {'gang': [], 'peng': [], 'chi': []}  // 杠碰吃牌的详细信息
playerBase.prototype.create_budgets = [];
playerBase.prototype.create_default_score = 0;

playerBase.prototype.online = true;

playerBase.prototype._create_table_player_reset = function ()
{
    this.create_table_total_score = this._owner.createTableDefaultScore//玩家自建桌总积分
    this.create_default_score = this.create_table_total_score
    this.create_budgets = [] //一张房卡玩得局数中每局输赢多少分情况
    this.louhu = false
    this._louhuInfo = [false, 0]  // 过胡信息，格式：[是否过胡，可以胡的分]
    this.firstPlayTile = 0 // 打出的第一张牌
    this.online = true
    this._gangPengChiDetail = {'gang': [], 'peng': [], 'chi': []}  // 杠碰吃牌的详细信息
};
playerBase.prototype._crate_table_end_game_player_reset = function () {

    this.louhu = false
    this._louhuInfo = [false, 0]  // 过胡信息，格式：[是否过胡，可以胡的分]
    this.firstPlayTile = 0 // 打出的第一张牌
    this._gangPengChiDetail = {'gang': [], 'peng': [], 'chi': []}  // 杠碰吃牌的详细信息

};
playerBase.prototype._init_all_members = function () {
    this._create_table_player_reset();
    this._crate_table_end_game_player_reset();

    this._win_timestamp = 0
    this._gang_before_play = false
    this._max_action_id = 0
    this._no_action = true  // 表示用户还没有做出任何玩牌动作，天胡/地胡需要
    this._uid = 0
    this._win_coin = 0  // 最终输赢金币数
    this._sex = 0
    this._name = ""
    this._pic = ''
    this._drop_tiles = [];
    this._win_style = [];
    this._win_tile = 0;
    this._win_type = -1;
    this._gang_budget = {'delta_score': 0}
    this._hu_budget = {'delta_score': 0}
    this._budget = {'win': [], 'lose': []}
};
playerBase.prototype.reset = function () {
    if(this._tile_manager)
    {
        this._tile_manager.reset();

    }
    this._init_all_members();
};
playerBase.prototype._initPlayer = function () {

    if(_.isNull(this._tile_manager))
    {
        this._tile_manager = new tileManagerBase()

    }
};
playerBase.prototype.set = function (uid)
{
    this._initPlayer();
    this._uid = uid
    this._name = this._uid.toString();
};
playerBase.prototype._create_table_player_reset = function () {
    
}
playerBase.prototype.get_abstract = function (pall_info)
{
    var all_info = pall_info || false;

    var abs_dict = {}
    abs_dict['name'] = this._name
    abs_dict['sex'] = this._sex
    abs_dict['userId'] = this._uid
    abs_dict['pic'] = this._pic

    if(all_info)
    {
        var standup_tiles = [];
        abs_dict['standup_tiles'] = [];
        abs_dict['gang_tiles'] = [];
        abs_dict['peng_tiles'] = [];
        abs_dict['chi_tiles'] = [];

        if(this._tile_manager)
        {
            abs_dict['standup_tiles'] = this._tile_manager.get_all_standup_tiles();
            abs_dict['gang_tiles'] = this._tile_manager.get_all_gang_tiles()
            abs_dict['peng_tiles'] = this._tile_manager.get_all_peng_tiles()
            abs_dict['chi_tiles'] = this._tile_manager.get_all_chi_tiles()
            abs_dict['drop_tiles'] = this._drop_tiles;
            abs_dict['gangPengChi_tiles_detail'] = this._gangPengChiDetail;
        }
    }

    return abs_dict;
};
playerBase.prototype.update_gang_budget = function (gang_delta_score) {
    this._gang_budget['delta_score'] += gang_delta_score

};
playerBase.prototype.update_gang_lose_budget = function (real_lose_chip)
{
    this.update_gang_budget(real_lose_chip);
    this._win_coin += real_lose_chip
    this.create_table_total_score += real_lose_chip

};
playerBase.prototype.get_budgets = function (pwith_tiles, pfinal_display) {
    var with_tiles = pwith_tiles || true;
    var final_display = pfinal_display || true;
    var budget_dict = {};
    budget_dict['coin'] = this._win_coin;
    if(with_tiles)
    {
        if(this._win_tile != 0 && final_display)
        {
            this._tile_manager.delete(this._win_tile)

        }

        budget_dict['standup_tiles'] = this._tile_manager.get_all_standup_tiles()
        if(this._win_tile != 0 && final_display)
        {
            this._tile_manager.add(this._win_tile)

        }
        budget_dict['gang_tiles'] = this._tile_manager.get_all_gang_tiles()
        budget_dict['peng_tiles'] = this._tile_manager.get_all_peng_tiles()
        budget_dict['chi_tiles'] = this._tile_manager.get_all_chi_tiles()

        if(this._win_tile != 0 && final_display)
        {
            budget_dict['win_tile'] = this._win_tile
            budget_dict['win_tile_type'] = this._win_tile_type
        }
    }

    for(var k in this._budget)
    {
        budget_dict[k] = this._budget[k];
    }

    return budget_dict;

}
playerBase.prototype.update_hu_budget = function (delta_score) {
    this._hu_budget['delta_score'] += delta_score

};
playerBase.prototype.update_gang_budget = function (gang_delta_score) {
    this._gang_budget['delta_score'] += gang_delta_score

};
playerBase.prototype._convert_win_desc = function (description) {

    // desc_segs = description.split(";")
    var desc_segs = _.split(description,";");

    return desc_segs;
};
playerBase.prototype.update_create_win_budget = function (key, coin, degree, description, losers_info) {

    this._win_coin += coin
    this.create_table_total_score += coin
    this._win_degree = degree
    this._win_master_point = win_master_point

    var _names = losers_info['name'];
    var  _uids = losers_info['uid'];
    var _coins = losers_info['coin'];
    var _desc = this._convert_win_desc(description)
    this._budget[key].append([coin, degree, _desc, _names, _uids, _coins]);
};
playerBase.prototype.update_lose_budget = function (key, real_lose_chip, degree, description, win_name, win_uid) {

    this._budget[key].append([real_lose_chip, degree, this._convert_win_desc(description),
        win_name, win_uid])
};
playerBase.prototype.update_create_lose_budget = function (key, real_lose_chip, degree, description, win_name, win_uid) {

    this._win_coin += real_lose_chip
    this.create_table_total_score += real_lose_chip
    this._budget[key].append([real_lose_chip, degree, this._convert_win_desc(description),
        win_name, win_uid])

};
playerBase.prototype.update_gang_budget = function (gang_score) {
    this._gang_budget['delta_score'] += gang_score

};

exports.playerBase = function () {

    return playerBase;
}