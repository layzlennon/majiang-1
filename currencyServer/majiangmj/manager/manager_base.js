/**
 * Created by sml on 2017/6/3.
 */

var mjUtil = require("../mjutil");
var _ = require("lodash");

var tilePatternBase = require("../pattern/pattern_base").tilePatternBase();

_MAX_TILE_NUM = 4  // 每张牌最多4张

_WIN_TILE_TYPE_NORMAL = 10  // 普通平胡

_WIN_TILE_TYPE_SEVEN_PAIR = 11  // 七对
_WIN_TILE_TYPE_BIG_SEVEN_PAIR = 12  // 大七对
_WIN_TILE_TYPE_SHI_SAN_LAN = 13  // 十三烂
_WIN_TILE_TYPE_SEVEN_STAR_SHI_SAN_LAN = 14  // 七星十三烂
_WIN_TILE_TYPE_DIANDIAO = 15 //单吊
_WIN_TILE_TYPE_PENGPENG = 17 //碰碰胡
_WIN_TILE_TYPE_JIUYAO = 18 //九幺
_WIN_TILE_TYPE_JIUYAO_SEVEN_PAIR = 22 //九幺七星
_WIN_TILE_TYPE_DAJIUYAO = 19 //大九幺
_WIN_TILE_TYPE_ONE_COLOR = 20 //清一色
_WIN_TILE_TYPE_ZI_COLOR = 21 //字一色

tileManagerBase  = function () {

    this._patterns = {0: new tilePatternBase(0), 1: new tilePatternBase(1), 2: new tilePatternBase(2),
        3: new tilePatternBase(3)};

}

tileManagerBase.prototype._patterns = {};
tileManagerBase.prototype._tiles = [];
tileManagerBase.prototype._table_laizi_tiles = []  ;// 上精牌
tileManagerBase.prototype._laizi_tile_order = -1  ;// 癞子牌花色
tileManagerBase.prototype._last_added_tile = []  ;// 记录摸牌历史
tileManagerBase.prototype._table_laizi_count = 0
tileManagerBase.prototype._hu_config_havebao = true
// 辅助变量
tileManagerBase.prototype._target_gang_num = 0;
tileManagerBase.prototype._target_peng_num = 0;
tileManagerBase.prototype._target_chi_num = 0;
tileManagerBase.prototype._target_standup_ke_num = 0;
tileManagerBase.prototype._target_standup_shun_num = 0;
tileManagerBase.prototype._target_standup_lin_num = 0;
tileManagerBase.prototype._target_standup_pair_num = 0;
tileManagerBase.prototype._target_standup_single_num = 0;
// 判胡时的辅助变量，同时用于记录胡牌时的站牌拆分
tileManagerBase.prototype._standup_shun_list = []  ;// 顺子
tileManagerBase.prototype._standup_ke_list = []  ;// 刻
tileManagerBase.prototype._standup_lin_list = []  ;// 临牌，包括顺临、隔临
tileManagerBase.prototype._standup_pair_list = []  ;// 对子
tileManagerBase.prototype._standup_single_list = []  ;// 单张
tileManagerBase.prototype._is_set_target_direction = 0

tileManagerBase.prototype._win_tile_type = []  ;// 胡牌类型: -1：不胡牌 10：平胡 11：七对 12：大七对 13：十三烂 14：七星十三烂
tileManagerBase.prototype._jing_huan_yuan = true  ;// 精还原
tileManagerBase.prototype._win_double_type = {
                                        "hh":0,//豪华
                                        "bdt":0,//宝吊头
                                        "dd":0,//单吊
                                        "wub":0,//宝还原
                                        "mq":0,//门清
                                        "bhy":0,//宝还原
                                    };
// 玩法辅助
tileManagerBase.prototype._chi_list_tiles = []  ;// 吃牌列表 如[[3, 4, 5], [31, 32, 34]
tileManagerBase.prototype.init_tiles = function (tiles) {

    for(var index = 0;index < tiles.length;index++)
    {
        this.add(tiles[index],true);
    }

};
tileManagerBase.prototype.set_table_laizi = function (table_laizi) {
    this._table_laizi_tiles = [table_laizi[1]]
    this._laizi_tile_order = table_laizi[1] // 10
};
tileManagerBase.prototype.add = function (tile,pself_get) {
    var self_get = pself_get || false;

    if(tile in this._table_laizi_tiles && self_get)
    {
        this._table_laizi_count +=1;
    }

    var ret = this._patterns[Math.floor(tile / 10)].addTile(tile % 10);
    if(ret)
    {
        this._last_added_tile.push(tile);
        this._tiles.push(tile)
    }

    return ret;

};
tileManagerBase.prototype.delete = function (tile) {

    var ret = this._patterns[Math.floor(tile / 10)].dropTile(tile % 10);
    if(ret)
    {
        if(tile in this._tiles)
        {
            this._tiles = mjUtil.remove(this._tiles,tile);
        }
    }

    return ret;

}
tileManagerBase.prototype.get_laizi_in_standup_tiles = function () {
    var laizi_tiles = [];
    for(var i in this._table_laizi_tiles)
    {
        var tile = this._table_laizi_tiles[i];
        var tilesCount = this._patterns[Math.floor(tile/ 10)].tiles[(tile % 10) - 1];
        for(var j = 0;j<tilesCount;j++)
        {
            laizi_tiles.push(tile)
        }

    }

    laizi_tiles.sort()

    return laizi_tiles;
}
tileManagerBase.prototype.get_all_standup_tiles = function () {
    var ret_list = [];

    for(var k in this._patterns)
    {
        var max = 9;
        if(k === 3)
        {
            max = 7;
        }
        var v = this._patterns[k];

        for(var i = 0; i < max;i++)
        {
            var j = 0;
            while(j < v.tiles[i])
            {
                ret_list.push(i + 1 + k * 10)
                j++;
            }
        }
    }
    ret_list.sort();
    return ret_list;
}
tileManagerBase.prototype.get_all_peng_tiles = function () {
    var ret_list = [];
    for(var k in this._patterns)
    {
        var max = 9;
        if(k === 3)
        {
            max = 7;
        }
        var v = this._patterns[k];

        for(var i = 0; i < max;i++)
        {
            if(v.show_tiles[i][0] == 3)
            {
                ret_list.push(i + 1 + k * 10)
            }
        }
    }

    return ret_list;
}
tileManagerBase.prototype.get_all_gang_tiles = function () {

    var ret_list = [];
    for(var k in this._patterns)
    {
        var max = 9;
        if(k === 3)
        {
            max = 7;
        }
        var v = this._patterns[k];

        for(var i = 0; i < max;i++)
        {
            if(v.show_tiles[i][0] == 4)
            {
                ret_list.push([i + 1 + k * 10,v._show_tiles[i][1]])
            }
        }
    }

    return ret_list;

}
tileManagerBase.prototype.get_all_chi_tiles = function () {

    var ret_list = [];
    for(var i in this._chi_list_tiles)
    {
        var chi_list_tile = this._chi_list_tiles[i];
        if(Math.floor(chi_list_tile[0] / 10) === 3 && chi_list_tile[0] % 10 in [1,2,3,4])
        {
            var tile = (chi_list_tile[0] % 10) * 100 + (chi_list_tile[1] % 10) * 10 + (chi_list_tile[2] % 10)
            ret_list.push(tile)
        }
        else
        {
            var tile = chi_list_tile[0];
            ret_list.push(tile)
        }
    }

    return ret_list;
};
tileManagerBase.prototype.get_standup_tile_count = function () {

    return this.get_all_standup_tiles().length;
};
tileManagerBase.prototype.check_gang_style = function (tile) {

    return this._patterns[Math.floor(tile / 10)].checkPatternGangStyle(tile % 10)
};
tileManagerBase.prototype.check_gang = function (tile,from_self) {

    return this._patterns[Math.floor(tile / 10)].checkPatternGang(tile % 10, from_self)

};
tileManagerBase.prototype.set_gang = function (tile, from_self) {
    var ret = this._patterns[Math.floor(tile / 10)].setPatternGang(tile % 10, from_self)
    if(ret)
    {
        if(!from_self)
        {
            this._tiles.push(tile)
        }
    }
}
tileManagerBase.prototype.has_gang = function (ptile) {
    var tile = ptile || 0;

    var ret_list = [];

    for(var k in this._patterns)
    {
        var v = this._patterns[k];
        if(Math.floor(tile / 10) === k)
        {
            v.hasPatternGang(ret_list, tile % 10);
        }
        else
        {
            v.hasPatternGang(ret_list);
        }
    }

    return ret_list;
};
tileManagerBase.prototype.check_peng = function (tile) {

    return this._patterns[Math.floor(tile / 10)].checkPatternPeng(tile % 10)
};
tileManagerBase.prototype.set_peng = function (tile) {

    var ret = this._patterns[Math.floor(tile / 10)].setPatternPeng(tile % 10)
    if(ret)
    {
        this._tiles.push(tile);

    }
};
tileManagerBase.prototype.check_chi = function (tile) {
    //{ret:ret,style_list:style_list};
    return this._patterns[Math.floor(tile / 10)].checkPatternChi(tile % 10)
};
tileManagerBase.prototype.set_chi = function (tile, style) {
    var checkChiObject = this.check_chi(tile);
    var ret = checkChiObject["ret"];
    var style_list = checkChiObject["style_list"];

    var chi_list = [];
    if(ret && style in style_list)
    {
        // {ret:true,chi_list:chi_list}
        var setPatObject = this._patterns[Math.floor(tile / 10)].setPatternChi(tile % 10, style);
        var ret2 = setPatObject["ret"];
        var chi_list = setPatObject["chi_list"];
        if(ret2)
        {
            this._tiles.push(tile);
            this._chi_list_tiles.push(chi_list);
            return {ret:true, chi_list:chi_list};
        }

    }

    return {ret:false, chi_list:chi_list}
}
tileManagerBase.prototype._reset_win_state = function () {
    this._jing_huan_yuan = true
    this._win_tile_type = []
    this._win_double_type = {
        "hh": 0,
        "bdt":0,
        "dd":0,
        "wub":0,
        "mq":0,
        "bhy":0
    }
}
tilePatternBase.prototype._check_jing_huan_yuan = function (laizi_tiles) {

    if(laizi_tiles.length >= 0)
    {
        this._jing_huan_yuan = true
    }
};
tilePatternBase.prototype._set_show_tiles_target_direction = function () {
    this._target_chi_num = 0
    this._target_peng_num = 0
    this._target_gang_num = 0

    this._target_chi_num = this.get_all_chi_tiles().length
    this._target_peng_num = this.get_all_peng_tiles().length
    this._target_gang_num = this.get_all_gang_tiles().length
};
tileManagerBase.prototype._check_special_win = function (tile, laizi_tiles) {

    this._set_show_tiles_target_direction();

    if(this._check_shi_san_lan_win(laizi_tiles) ||
            this._check_peng_peng_hu(tile,laizi_tiles) ||
            this._check_seven_pair_win(laizi_tiles) ||
            this._check_is_luan_yao(laizi_tiles))
    {
        return true;
    }

    return false;

};
tileManagerBase.prototype._reset_target_direction = function () {
    //"""重置辅助变量"""
    this._standup_shun_list = []
    this._standup_ke_list = []
    this._standup_lin_list = []
    this._standup_pair_list = []
    this._standup_single_list = []

    this._target_chi_num = 0
    this._target_peng_num = 0
    this._target_gang_num = 0

    this._target_standup_shun_num = 0
    this._target_standup_ke_num = 0
    this._target_standup_lin_num = 0
    this._target_standup_pair_num = 0
    this._target_standup_single_num = 0

    this._is_set_target_direction = 0
};
tileManagerBase.prototype._print_current_tiles_info = function () {
    var all_tiles_info = {}
    all_tiles_info["table_laizi_tiles"] = this._table_laizi_tiles;
    all_tiles_info["tiles"] = this._tiles;
    all_tiles_info["gang_tiles"] = this.get_all_gang_tiles();
    all_tiles_info["peng_tiles"] = this.get_all_peng_tiles();
    all_tiles_info["chi_tiles"] = this.get_all_chi_tiles();
    all_tiles_info["standup_tiles"] = this.get_all_standup_tiles();
    all_tiles_info["_standup_shun_list"] = this._standup_shun_list;
    all_tiles_info["_standup_ke_list"] = this._standup_ke_list;
    all_tiles_info["_standup_pair_list"] = this._standup_pair_list;
    all_tiles_info["_standup_lin_list"] = this._standup_lin_list;
    all_tiles_info["_standup_single_list"] = this._standup_single_list;
    all_tiles_info["_target_gang_num"] = this._target_gang_num;
    all_tiles_info["_target_peng_num"] = this._target_peng_num;
    all_tiles_info["_target_chi_num"] = this._target_chi_num;
    all_tiles_info["_target_standup_shun_num"] = this._target_standup_shun_num;
    all_tiles_info["_target_standup_ke_num"] = this._target_standup_ke_num;
    all_tiles_info["_target_standup_lin_num"] = this._target_standup_lin_num;
    all_tiles_info["_target_standup_pair_num"] = this._target_standup_pair_num;
    all_tiles_info["_target_standup_single_num"] = this._target_standup_single_num;

    console.log('_print_current_tiles_info:');
    console.log(all_tiles_info);
}
tileManagerBase.prototype._set_all_target_direction = function (laizi_tiles,pplayTile,plaizi_mode) {
    var playTile = pplayTile || 0;
    var laizi_mode = plaizi_mode || true;
    this._reset_target_direction();
    for(var k in this._patterns)
    {
        var v = this._patterns[k];
        var temp_tiles = _.clone(v.tiles);
        if(laizi_mode && this._laizi_tile_order == k)  // 把癞子牌拿出来
        {
            for(var lp in laizi_tiles)
            {
                var laizi_tile = laizi_tiles[lp];
                if(temp_tiles[laizi_tile % 10 - 1] > 0)
                {
                    temp_tiles[laizi_tile % 10 - 1] -= 1
                }
            }
        }

        if(playTile > 0 && Math.floor(playTile / 10))
        {
            if(temp_tiles[playTile % 10 - 1] > 0)
            {
                temp_tiles[playTile % 10 - 1] -= 1

            }
        }
        // return {shun_list:shun_list, ke_list:ke_list, lin_list:lin_list, pair_list:pair_list, single_list:single_list}

        var paTTObject = v.getPatternTypeTiles(temp_tiles)
        var shun_list = paTTObject["shun_list"];
        var ke_list = paTTObject["ke_list"];
        var lin_list = paTTObject["lin_list"];
        var pair_list = paTTObject["pair_list"];
        var single_list = paTTObject["single_list"];

        this._standup_shun_list = mjUtil.arrcat(this._standup_shun_list,shun_list);
        this._standup_ke_list = mjUtil.arrcat(this._standup_ke_list,ke_list);
        this._standup_lin_list = mjUtil.arrcat(this._standup_lin_list,lin_list);
        this._standup_pair_list = mjUtil.arrcat(this._standup_pair_list,pair_list);
        this._standup_single_list = mjUtil.arrcat(this._standup_single_list,single_list);
    }

    this._target_standup_shun_num = this._standup_shun_list.length;
    this._target_standup_ke_num = this._standup_ke_list.length;
    this._target_standup_lin_num = this._standup_lin_list.length;
    this._target_standup_pair_num = this._standup_pair_list.length;
    this._target_standup_single_num = this._standup_single_list.length;
    this._set_show_tiles_target_direction();
    this._print_current_tiles_info();
    
}
tileManagerBase.prototype._check_normal_win = function (laizi_tiles) {
    var canHu = false;
    this._set_all_target_direction(laizi_tiles,0,false);
    if(((this._target_chi_num + this._target_peng_num + this._target_gang_num + this._target_standup_ke_num + this._target_standup_shun_num) == 4
    && this._target_standup_pair_num == 1 && this._target_standup_lin_num == this._target_standup_single_num == 0))
    {
        this._check_jing_huan_yuan(laizi_tiles);
        canHu = true;
    }

    var normal_win_need_laizi_num = 0;
    if(!canHu && laizi_tiles.length > 0)
    {
        this._set_all_target_direction(laizi_tiles,0,true)
        if (this._target_standup_single_num == this._target_standup_pair_num == 0 && this._target_standup_lin_num > 0)
        {
            normal_win_need_laizi_num = this._target_standup_lin_num + 2

        }
        else
        {
            normal_win_need_laizi_num = 2 * this._target_standup_single_num + this._target_standup_lin_num + this._target_standup_pair_num - 1

        }

        if(laizi_tiles.length >= normal_win_need_laizi_num)
        {
            canHu = true;
        }
    }

    if(canHu)
    {
        var normal_single_color = this._check_only_one_color(laizi_tiles);
        if(normal_single_color)
        {
            this._win_tile_type.push(_WIN_TILE_TYPE_ONE_COLOR)

        }

        this._win_tile_type.push(_WIN_TILE_TYPE_NORMAL)


    }

    return canHu;
}
tileManagerBase.prototype.check_win = function (tile, pfrom_self) {
    var from_self = pfrom_self || false;
    var standup_laizi_tiles = this.get_laizi_in_standup_tiles()
    if (tile in this._table_laizi_tiles && from_self)  // 自摸的癞子
    {
        standup_laizi_tiles.push(tile)

    }

    this.add(tile);
    this._reset_win_state();
    
    var ret = this._check_special_win(tile,standup_laizi_tiles);

    if(!ret)
    {
        ret = this._check_normal_win(standup_laizi_tiles);
    }

    if(ret)
    {
        if(_.indexOf(this._win_tile_type,_WIN_TILE_TYPE_SHI_SAN_LAN) === -1 &&
            _.indexOf(this._win_tile_type,_WIN_TILE_TYPE_SEVEN_STAR_SHI_SAN_LAN) === -1)
        {
            // danDiao, baoDiao = this._check_dan_diao(tile, standup_laizi_tiles)

        }

        if(standup_laizi_tiles.length === 0)
        {
            this._win_double_type['wub'] = 1
        }

        if(this._jing_huan_yuan)
        {
            if(standup_laizi_tiles.length >1)
            {
                this._win_double_type['bhy'] = 1

            }
            else
            {
                this._win_double_type['wub'] = 1

            }
        }

        if(from_self && this._check_men_qian_qing() && _WIN_TILE_TYPE_NORMAL in this._win_tile_type)
        {
            this._win_double_type['mq'] = 1
        }

        var haoHuaNum = this._GetGangCount();
        if(_WIN_TILE_TYPE_SEVEN_PAIR in this._win_tile_type)
        {
            if(haoHuaNum > 0)
            {
                this._win_double_type['hh'] = haoHuaNum

            }
        }
        
    }

    this.delete(tile)

    return ret;

};
tileManagerBase.prototype._GetNonEmptyTileOrders = function () {

    var orders = [];
    for(var k in this._patterns)
    {
        var v = this._patterns[k];
        if( v.tile_count + v.show_tile_count > 0)
        {
            orders.push(k);
        }
    }

    return orders;
};
tilePatternBase.prototype._GetGangCount = function () {

    var orders = this._GetNonEmptyTileOrders();
    var gang_count = 0;

    for(var lp in orders)
    {
        var order = orders[lp];
        gang_count += this._patterns[order].getGangCount();

    }

    return gang_count;
};
tileManagerBase.prototype._check_men_qian_qing = function () {
    if((this._target_chi_num + this._target_peng_num + this._target_gang_num ) > 0)
    {
        return false;
    }
    return true;
}
tileManagerBase.prototype._check_dan_diao = function (tile, laizi_tiles) {
    var standup_tiles = this.get_all_standup_tiles();
    var baoDiao = false;
    var danDiao = false;



}
tileManagerBase.prototype._check_only_one_color = function (laizi_tiles) {
    var orders = [];
    for(var k in this._patterns)
    {
        var v = this._patterns[k];
        if(v.get_all_tile_count() > 0)
        {
            orders.push(k)
        }
    }

    if(this._jing_huan_yuan || laizi_tiles.length === 0)
    {
        return orders.length === 1;
    }
    else if(orders.length === 1)
    {
        return true;
    }
    else if(orders.length > 2)
    {
        return false;
    }
    else
    {
        var laiziCount = laizi_tiles.length;
        if(laiziCount > 0)
        {
            var tileCount = this._patterns[this._laizi_tile_order].get_all_tile_count();
            return tileCount - laiziCount === 0;
        }
    }

    return false;
}
tileManagerBase.prototype._check_is_luan_yao = function (laizi_tiles) {
    var isQuanYao = true;
    for(var k in this._patterns)
    {
        var v = this._patterns[k];
        if(v.is_all_yao())
        {
            //todo
        }
        else
        {
            isQuanYao = false;
            break;
        }
    }

    if(isQuanYao)
    {
        if(_WIN_TILE_TYPE_PENGPENG in this._win_tile_type || _WIN_TILE_TYPE_SEVEN_PAIR in this._win_tile_type)
        {
            //todo
        }
        else
        {
            this._check_jing_huan_yuan(laizi_tiles);
        }
    }
    else
    {
        if(!this._jing_huan_yuan && laizi_tiles.length > 0)
        {
            isQuanYao = true;
            for(var k in this._patterns)
            {
                var v = this._patterns[k];
                var find_tiles = _.clone(v.tiles);
                if(this._laizi_tile_order === k ) //把癞子拿出来
                {
                    for(var lp in laizi_tiles)
                    {
                        var laizi_tile = laizi_tiles[lp];
                        if(find_tiles[laizi_tile % 10 - 1] > 0)
                        {
                            find_tiles[laizi_tile % 10 - 1] -= 1
                        }
                    }
                }

                if(v.is_all_yao2(find_tiles))
                {
                    //todo
                }
                else
                {
                    isQuanYao = false
                    break
                }
            }
            if(isQuanYao && (laizi_tiles[0] in [1,9,11,19,21,29,31,32,33,34,35,36,37]))
            {
                this._check_jing_huan_yuan(laizi_tiles);

            }

        }
    }

    if(isQuanYao)
    {
        this._win_tile_type.push(_WIN_TILE_TYPE_JIUYAO)

    }

    return isQuanYao;

}
tileManagerBase.prototype._check_peng_peng_hu = function (tile, laizi_tiles) {
    if(this._target_chi_num > 0)
    {
        return false;
    }
    var ke_num = 0;
    var pair_num = 0;
    var single_num = 0;
    for(var k in this._patterns)
    {
        var v = this._patterns[k];
        var find_tiles = _.clone(v.tiles);

        var getKeObject  =  v.getKePairInfo(find_tiles);
        var pattern_ke_num = getKeObject["ke_num"];
        var pattern_pair_num = getKeObject["pair_num"];
        var pattern_single_num = getKeObject["single_num"];

        ke_num += pattern_ke_num
        pair_num += pattern_pair_num
        single_num += pattern_single_num
    }

    if ((this._target_gang_num + this._target_peng_num + ke_num) == 4 && pair_num == 1 && single_num == 0)
    {
        this._win_tile_type.push(_WIN_TILE_TYPE_PENGPENG)
        this._check_jing_huan_yuan(laizi_tiles);
        return true;
    }

    if(this._jing_huan_yuan == false && laizi_tiles.length > 0)
    {
        var ke_num = 0;
        var pair_num = 0;
        var single_num = 0;

        for(var k in this._patterns)
        {
            var v = this._patterns[k];
            var find_tiles = _.clone(v.tiles);
            if(this._laizi_tile_order === k ) //把癞子拿出来
            {
                for(var lp in laizi_tiles)
                {
                    var laizi_tile = laizi_tiles[lp];
                    if(find_tiles[laizi_tile % 10 - 1] > 0)
                    {
                        find_tiles[laizi_tile % 10 - 1] -= 1
                    }
                }
            }

            var getKeObject  =  v.getKePairInfo(find_tiles);
            var pattern_ke_num = getKeObject["ke_num"];
            var pattern_pair_num = getKeObject["pair_num"];
            var pattern_single_num = getKeObject["single_num"];

            ke_num += pattern_ke_num
            pair_num += pattern_pair_num
            single_num += pattern_single_num
        }
        var need_laizi_num = 0;
        if(pair_num == 0)
        {
            if(single_num == 0)
            {
                need_laizi_num = 0;
            }
            else
            {
                need_laizi_num = 2 * (single_num - 1) + 1
            }
        }
        else
        {
            need_laizi_num = Math.abs(pair_num - 1) + single_num * 2

        }

        if(laizi_tiles.length >= need_laizi_num)
        {
            this._win_tile_type.push(_WIN_TILE_TYPE_PENGPENG)
            return true;
        }
    }

    return false;

};
tileManagerBase.prototype._check_seven_pair_win = function (laizi_tiles) {

    if (this._target_chi_num + this._target_peng_num + this._target_gang_num > 0)
    {
        return false;
    }


    var pair_num = 0;
    var single_num = 0;
    for(var k in this._patterns)
    {
        var v = this._patterns[k];
        var find_tiles = _.clone(v.tiles);
        var getKeObject  =  v.getKePairInfo(find_tiles);
        var pattern_pair_num = getKeObject["pair_num"];
        pair_num += pattern_pair_num

    }
    if(pair_num == 7)
    {
        this._win_tile_type.push(_WIN_TILE_TYPE_SEVEN_PAIR)
        this._check_jing_huan_yuan(laizi_tiles)
        return true;
    }

    if(laizi_tiles.length > 0)
    {
        pair_num = 0;
        single_num = 0;

        for(var k in this._patterns)
        {
            var v = this._patterns[k];
            var find_tiles = _.clone(v.tiles);
            if(this._laizi_tile_order === k)
            {
                for(var lp in laizi_tiles)
                {
                    var laizi_tile = laizi_tiles[lp];
                    if(find_tiles[laizi_tile % 10 - 1] > 0)
                    {
                        find_tiles[laizi_tile % 10 - 1] -= 1
                    }
                }
            }

            var getKeObject  =  v.getKePairInfo(find_tiles);
            var pattern_pair_num = getKeObject["pair_num"];
            var pattern_single_num = getKeObject["single_num"];
            pair_num += pattern_pair_num
            single_num += pattern_single_num

        }

        var need_laizi_num = single_num
        if(laizi_tiles.length >= need_laizi_num)
        {
            this._win_tile_type.push(_WIN_TILE_TYPE_SEVEN_PAIR);
            return true;

        }

    }

    return false;
}
tileManagerBase.prototype._check_shi_san_lan_win = function (laizi_tiles) {

    if(this._target_chi_num + this._target_peng_num + this._target_gang_num > 0)
    {
        return false;
    }

    if(this._is_quan_bu_kao(laizi_tiles,false))
    {
        this._check_jing_huan_yuan(laizi_tiles);
        if(this._is_have_seven_star())
        {
            this._win_tile_type.push(_WIN_TILE_TYPE_SEVEN_STAR_SHI_SAN_LAN);
            return true;
        }
        else
        {
            if(this._jing_huan_yuan)
            {
                this._win_tile_type.push(_WIN_TILE_TYPE_SEVEN_STAR_SHI_SAN_LAN);
                return true;
            }
            return false

        }
    }

    if(laizi_tiles.length > 0)
    {
        if(this._is_quan_bu_kao(laizi_tiles,true))
        {
            if(this._is_have_seven_star())
            {
                this._win_tile_type.push(_WIN_TILE_TYPE_SEVEN_STAR_SHI_SAN_LAN);
                return true;
            }
            else
            {
                return false;
            }
        }

    }

    return false;
};
tileManagerBase.prototype._is_quan_bu_kao = function (laizi_tiles,plaizi_mode) {
    var laizi_mode = plaizi_mode || false;
    for(var k in this._patterns)
    {
        var v = this._patterns[k];

        var tiles = _.clone(v.tiles);
        if(laizi_mode && laizi_tiles.length > 0 && this._laizi_tile_order === k)
        {
            for(var lp in laizi_tiles)
            {
                var laizi_tile = laizi_tiles[lp];
                tiles[laizi_tile % 10 - 1] -= 1
            }
        }

        if(! v.isPatternQuanBuKaoMod(k,tiles))
        {
            return false;
        }
    }

    return true;
}
tileManagerBase.prototype._is_have_seven_star = function () {

    var cTiles = mjUtil.getArrayFromIndex2Index(this._patterns[3].tiles,0,7);
    return mjUtil.count(cTiles,0) === 0;
}
tileManagerBase.prototype.reset = function () {
    this._patterns = {0: new tilePatternBase(0), 1: new tilePatternBase(1), 2: new tilePatternBase(2),
        3: new tilePatternBase(3)}
    this._tiles = []  // 所有的手牌
    this._table_laizi_tiles = []  // 上精牌
    this._laizi_tile_order = -1  // 癞子牌花色
    this._last_added_tile = []  // 记录摸牌历史
    this._table_laizi_count = 0

        // 辅助变量
    this._target_gang_num = 0
    this._target_peng_num = 0
    this._target_chi_num = 0
    this._target_standup_ke_num = 0
    this._target_standup_shun_num = 0
    this._target_standup_lin_num = 0
    this._target_standup_pair_num = 0
    this._target_standup_single_num = 0

        // 判胡时的辅助变量，同时用于记录胡牌时的站牌拆分
    this._standup_shun_list = []  // 顺子
    this._standup_ke_list = []  // 刻
    this._standup_lin_list = []  // 临牌，包括顺临、隔临
    this._standup_pair_list = []  // 对子
    this._standup_single_list = []  // 单张

    this._win_tile_type = []  // 胡牌类型: -1：不胡牌 10：平胡 11：七对 12：大七对 13：十三烂 14：七星十三烂
    this._jing_huan_yuan = false  // 精还原
    this._win_double_type = {
        "hh":0,//豪华
        "bdt":0,//宝吊头
        "dd":0,//单吊
        "wub":0,//宝还原
        "mq":0,//门清
        "bhy":0,//宝还原
    }

    this._chi_list_tiles = []  // 吃牌列表 如[[3, 4, 5], [31, 32, 34]
}
var manager = new tileManagerBase()
exports.tileManagerBase = function () {

    return tileManagerBase;
}