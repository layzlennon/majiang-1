/**
 * Created by sml on 2017/6/1.
 */
var _ = require('lodash');
var mjutil = require('../mjutil');


var _MAX_PATTERN_TILE_NUM = 9; // 每种花色最多牌张数

// 南昌麻将风字(东31 南32 西33 北34)吃牌的特殊常量定义
var _WIND_TILES_CHI_STYLE_123 = 123;  // 东南西
var _WIND_TILES_CHI_STYLE_124 = 124;  // 东南北
var _WIND_TILES_CHI_STYLE_134 = 134;  // 东西北
var _WIND_TILES_CHI_STYLE_234 = 234;  // 南西北

tilePatternBase = function (order) {

    this.order = order
}
tilePatternBase.prototype.order = 0;
tilePatternBase.prototype.tiles = [0,0,0,0,0,0,0,0,0];
tilePatternBase.prototype.tile_count = 0;
tilePatternBase.prototype.single_tiles = [0,0,0,0,0,0,0,0,0];
tilePatternBase.prototype.show_tiles = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];
tilePatternBase.prototype.show_tile_count = 0;
tilePatternBase.prototype.show_shun_tiles = [];
tilePatternBase.prototype.show_shun_tile_count = 0;
tilePatternBase.prototype.current_pattern = -1;
tilePatternBase.prototype.last_added_tile = 0;
tilePatternBase.prototype.forbidden_evolve_list = [];
tilePatternBase.prototype.evolve_direction = -1;
tilePatternBase.prototype.evolve_list = [];

tilePatternBase.prototype.addTile =function (tile) {
    if(tile > 0 && tile < 10)
    {
        this.tiles[tile - 1] += 1;
        this.tile_count += 1;
        this.last_added_tile = tile;
        return true;
    }
    return false
};

tilePatternBase.prototype.dropTile = function (tile) {

    if(tile > 0 && tile < 10 && this.tiles[tile - 1] > 0)
    {
        this.tiles[tile - 1] -= 1;
        this.tile_count -= 1;
        return true;
    }
    return false
};
tilePatternBase.prototype.isPatternQuanBuKaoMod = function (order,tiles) {

    if(order == 3)
    {
        var unqTiles = _.uniq(tiles);
        return unqTiles.sort().toString() == tiles.sort().toString();
    }

    if(_.sum(tiles) > 3)
    {
        return false;
    }

    if(_.sum(tiles) <= 1)
    {
        return true;
    }
    var temp_tiles = _.clone(tiles);
    for(var i in temp_tiles)
    {
        if(i > 1)
        {
            return false;
        }
    }

    var count = mjutil.count(tiles,1);
    var pos_list = [];
    for(var i = 0; i < count;i++)
    {
        var pos = _.indexOf(temp_tiles,1);
        pos_list.push(pos);
        temp_tiles[pos] = 1;

    }

    var reBool = true;
    if(pos_list.length > 1)
    {
        for(var j = 1 ; j < pos_list.length;j++)
        {
            if(pos_list[j] - pos_list[j - 1] < 3)
            {
                reBool =  false;
                break;
            }
        }
    }

    return reBool;
    
};
tilePatternBase.prototype.getKePairInfo = function (find_tiles) {
    var tiles = _.clone(find_tiles);
    var ke_num = 0;
    var pair_num = 0;
    for(var i = 0; i < 9;i++)
    {
        if(tiles[i] >= 3)
        {
            ke_num += 1;
            tiles[i] -= 3;

        }
        else  if (tiles[i] == 2)
        {
            pair_num += 1;
            tiles[i] -= 2;
        }

    }

    var single_num = mjutil.count(tiles,1);
    return {ke_num:ke_num,pair_num:pair_num,single_num:single_num};
};
tilePatternBase.prototype.getPairInfo2 = function (find_tiles) {

    var singIndexList = [];
    var tiles = _.clone(find_tiles);

    for(var i = 0 ; i < 9;i++)
    {
        if(tiles[i] == 1 || tiles[i] == 3)
        {
            singIndexList.push(i);
        }
    }

    return singIndexList;
};
tilePatternBase.prototype.calculateMinNeedLaiziCount = function (lin_count,pair_count,single_count) {

    return 2 * single_count + lin_count + pair_count - 1;
};
tilePatternBase.prototype.isShunTiles = function (tiles) {
    var reBool = true;
    if(tiles.length !== 3)
    {
        reBool = false;
    }

    if(this.order < 3)
    {
        if ((tiles[0] + 1) === tiles[1] && (tiles[0] + 2) === tiles[2])
        {
            reBool = false

        }
    }
    else
    {
        if(tiles[0] in [33, 34] || tiles[2] in [35, 36])
        {
            reBool =  false

        }
        else
        {
            reBool = true
        }

    }

    return reBool;
};
tilePatternBase.prototype.isNewResultBetter = function (current_best_shun_list, current_best_ke_list, current_best_lin_list,
                                                        current_best_pair_list, current_best_single_list, new_shun_list, new_ke_list, new_lin_list,
                                                        new_pair_list, new_single_list) {
    var reBool = false;
    if (current_best_shun_list.length === 0 && current_best_ke_list.length === 0 && current_best_lin_list.length ===
        current_best_pair_list.length === current_best_single_list.length === 0)  // 第一次
    {
        return  true;
    }

    var current_best_need_laizi_count = this.calculateMinNeedLaiziCount(current_best_lin_list.length,current_best_pair_list.length,current_best_single_list.length);
    var new_need_laizi_count = this.calculateMinNeedLaiziCount(new_lin_list.length,new_pair_list.length,new_single_list.length);

    if(new_need_laizi_count < current_best_need_laizi_count)
    {
        reBool =  true;
    }
    else if(new_need_laizi_count == current_best_need_laizi_count)
    {
        if((new_shun_list.length + new_ke_list.length) > (current_best_shun_list.length + current_best_ke_list.length))
        {
            reBool =  true;
        }
        else if((new_shun_list.length + new_ke_list.length) === (current_best_shun_list.length + current_best_ke_list.length))
        {
            if ((new_pair_list.length) > current_best_pair_list.length)  // 对子数多的优先
            {
                reBool = true;
            }
            else if(new_pair_list.length === current_best_pair_list.length)  // 对子数也一样
            {
                if(new_lin_list.length > current_best_lin_list.length)  // 临牌数多的优先
                {
                    reBool =  true;
                }
                else if (new_lin_list.length === current_best_lin_list.length)  //临牌也一样
                {
                    if(new_single_list.length < current_best_single_list.length)  // 单张少的优先
                    {
                        reBool =  true

                    }

                }
            }

        }
    }

    return reBool;
};
tilePatternBase.prototype.hasPatternGang = function (pgang_tiles,ptile) {
    var tile = ptile || -1;
    var gang_tiles = pgang_tiles || [];
    var max = 7;
    if(this.order != 3)
    {
        max = _MAX_PATTERN_TILE_NUM;
    }

    for(var i = 0;i < max;i++)
    {
        if(this.tiles[i] === 4)
        {
            gang_tiles.push(i + 1 + this.order * 10);
        }
        else if((this.tiles[i] === 3 || this.show_tiles[i][0] === 3) && tile === i + 1 )
        {
            gang_tiles.push(i + 1 + this.order * 10);
        }
        else if(this.show_tiles[i][0] === 3 && this.tiles[i] === 3)
        {
            gang_tiles.push(i + 1 + this.order * 10);
        }
    }

    return gang_tiles;
};
tilePatternBase.prototype.checkPatternGangStyle = function (tile) {
    if(this.tiles[tile - 1] >= 3)
    {
        return 0;
    }
    else
    {
        return 1;
    }
};
tilePatternBase.prototype.checkPatternGang = function (tile,from_this) {

    if(this.tiles[tile - 1] === 4)
    {
        return {ret:true,style:0}
    }

    var ret = false;
    var style = -1;

    if(this.tiles[tile - 1] == 3)
    {
        ret = true;
        style = 0;
        if(!from_this)
        {
            style = 1;
        }

    }
    else if(from_this && this.show_tiles[tile - 1][0] === 3)
    {
        ret = true;
        style = 1;
    }

    return {ret:ret,style:style}
};
tilePatternBase.prototype.setPatternGang = function (tile,from_this) {
    var ret = false;
    if(this.tiles[tile - 1 ] >= 3)
    {
        this.tile_count -= this.tiles[tile -1];
        this.tiles[tile - 1] = 0;
        this.show_tiles[tile - 1] = [4,0];
        if(from_this)
        {
            this.show_tiles[tile - 1] = [4,1];

        }
        this.show_tile_count += 4;
        ret = true;
    }
    else if(this.show_tiles[tile - 1][0] === 3 && from_this)
    {
        this.tile_count -= this.tiles[tile - 1];
        this.tiles[tile - 1] = 0;
        this.show_tiles[tile - 1] = [4,1];
        this.show_tile_count += 1;
        ret = true
    }

    return ret;
};
tilePatternBase.prototype.checkPatternPeng = function (tile) {

    return this.tiles[tile - 1] >= 2;
};
tilePatternBase.prototype.getDiaoCountNum = function (diaoTile) {

    return this.tiles[diaoTile - 1];
};
tilePatternBase.prototype.setPatternPeng = function (tile) {
    this.tiles[tile - 1] -= 2;
    this.tile_count -= 2;
    this.show_tiles[tile - 1] = [3,1];
    this.show_tile_count += 3;

    return true;
};
tilePatternBase.prototype.checkPatternChi = function (tile) {

    var ret = false;
    var style_list = [];
    if(this.tile_count < 2)
    {
        return {ret:ret,style_list:style_list};
    }

    if(this.order < 3)
    {
        if(tile >= 1 && tile <= _MAX_PATTERN_TILE_NUM - 2 && this.tiles[tile] > 0 && this.tiles[tile + 1] > 0)
        {
            ret = true;
            style_list.push(0);
        }
        else if(tile >= 2 && tile <= _MAX_PATTERN_TILE_NUM - 1 && this.tiles[tile - 2] > 0 && this.tiles[tile] > 0)
        {
            ret = true;
            style_list.push(1);
        }
        else if(tile >= 3 && tile <= _MAX_PATTERN_TILE_NUM - 1 && this.tiles[tile - 3] > 0 && this.tiles[tile - 2] > 0)
        {
            ret = true;
            style_list.push(2);
        }
    }
    else if(this.order === 3)
    {
        if(tile >= 1 && tile <= 4)
        {
            if(tile === 1)//东
            {
                if(this.tiles[2  - 1] > 0 && this.tiles[3 - 1] > 0) //(东)南西
                {
                    ret = true;
                    style_list.push(_WIND_TILES_CHI_STYLE_123)
                }
                if(this.tiles[2  - 1] > 0 && this.tiles[4 - 1] > 0) //(东)南北
                {
                    ret = true;
                    style_list.push(_WIND_TILES_CHI_STYLE_124)
                }
                if(this.tiles[3  - 1] > 0 && this.tiles[4 - 1] > 0) //(东)西北
                {
                    ret = true;
                    style_list.push(_WIND_TILES_CHI_STYLE_134)
                }
            }
            else if(tile === 2) //南
            {
                if(this.tiles[1 - 1] > 0 && this.tiles[3 - 1] > 0) //东(南)西
                {
                    ret = true;
                    style_list.push(_WIND_TILES_CHI_STYLE_123)
                }
                if(this.tiles[1  - 1] > 0 && this.tiles[4 - 1] > 0) //东(南)北
                {
                    ret = true;
                    style_list.push(_WIND_TILES_CHI_STYLE_124)
                }
                if(this.tiles[3  - 1] > 0 && this.tiles[4 - 1] > 0) //(南)西北
                {
                    ret = true;
                    style_list.push(_WIND_TILES_CHI_STYLE_234)
                }
            }
           else if(tile === 3) //西
            {
                if(this.tiles[1  - 1] > 0 && this.tiles[2 - 1] > 0) //东南(西)
                {
                    ret = true;
                    style_list.push(_WIND_TILES_CHI_STYLE_123)
                }
                if(this.tiles[1  - 1] > 0 && this.tiles[4 - 1] > 0) //东(西)北
                {
                    ret = true;
                    style_list.push(_WIND_TILES_CHI_STYLE_134)
                }
                if(this.tiles[2  - 1] > 0 && this.tiles[4 - 1] > 0) //南(西)北
                {
                    ret = true;
                    style_list.push(_WIND_TILES_CHI_STYLE_234)
                }
            }
            else if(tile === 4) //北
            {
                if(this.tiles[1  - 1] > 0 && this.tiles[2 - 1] > 0) //东南(北)
                {
                    ret = true;
                    style_list.push(_WIND_TILES_CHI_STYLE_124)
                }
                if(this.tiles[1  - 1] > 0 && this.tiles[3 - 1] > 0)//东西(北)
                {
                    ret = true;
                    style_list.push(_WIND_TILES_CHI_STYLE_134)
                }
                if(this.tiles[2  - 1] > 0 && this.tiles[3 - 1] > 0)//南西(北)
                {
                    ret = true;
                    style_list.push(_WIND_TILES_CHI_STYLE_234)
                }
            }
        }
        else if(tile <= 7)
        {
            if(tile === 5 && this.tiles[5] > 0 && this.tiles[6] > 0)
            {
                ret = true;
                style_list.push(0);
            }
            else if(tile === 6 && this.tiles[4] > 0 &&  this.tiles[6] > 0)
            {
                ret = true;
                style_list.push(1);
            }
            else if(tile == 7 && this.tiles[4] > 0 && this.tiles[5] > 0)
            {
                ret = true;
                style_list.push(2);
            }
        }
    }

    return {ret:ret,style_list:style_list};
};
tilePatternBase.prototype.get_all_tile_count = function () {
    return this.tile_count + this.show_tile_count + this.show_shun_tile_count;
};
tilePatternBase.prototype.is_all_yao = function () {
    if(this.get_all_tile_count() == 0 || this.order === 3)
    {
        return true;
    }

    if(this.show_shun_tile_count > 0)
    {
        return false;
    }

    for(var i = 0;i< _MAX_PATTERN_TILE_NUM;i++)
    {
        if ((this.tiles[i] > 0 || this.show_tiles[i][0] > 0) && (i in [1,2,3,4,5,6,7]))
        {
            return false
        }
    }

    return true
};
tilePatternBase.prototype.is_all_yao2 = function (tiles) {
    if(this.get_all_tile_count() == 0 || this.order === 3)
    {
        return true;
    }

    if(this.show_shun_tile_count > 0)
    {
        return false;
    }

    for(var i = 0;i< _MAX_PATTERN_TILE_NUM;i++)
    {
        if ((tiles[i] > 0 || this.show_tiles[i][0] > 0) && (i in [1,2,3,4,5,6,7]))
        {
            return false
        }
    }

    return true
};
tilePatternBase.prototype.getGangCount = function () {
    var count = 0;
    for(var i = 0 ; i < _MAX_PATTERN_TILE_NUM;i++)
    {
        if(this.tiles[i] + this.show_tiles[i][0] === 4)
        {
            count += 1;
        }
    }

    return count;
};
tilePatternBase.prototype.setPatternWindChi = function (tile,style) {
    
};
tilePatternBase.prototype.setPatternChi = function (tile,style) {
    var chi_tiles = [];
    if(this.order === 3 && tile in [1,2,3,4])
    {
        chi_tiles = this.setPatternWindChi(tile,style);

    }
    else
    {
        if(style === 0)
        {
            this.tiles[tile] -= 1;
            this.tiles[tile - 1] -= 1;
            chi_tiles = [style,tile,tile + 1,tile + 2];
        }
        else if(style === 1)
        {
            this.tiles[tile - 2] -= 1;
            this.tiles[tile] -= 1;
            chi_tiles = [style,tile - 1,tile,tile + 1];
        }
        else if(style === 2)
        {
            this.tiles[tile - 3] -= 1;
            this.tiles[tile - 2] -= 1;
            chi_tiles = [style,tile - 2,tile - 1,tile];
        }
    }

    var chi_list = [];

    if(chi_tiles.length > 0)
    {
        this.tile_count -= 2;
        this.show_shun_tiles.push(chi_tiles);
        this.show_shun_tile_count += 3;

        chi_list.push(chi_tiles[1] + 10 * this.order );
        chi_list.push(chi_tiles[2] + 10 * this.order );
        chi_list.push(chi_tiles[3] + 10 * this.order );

    }

    return {ret:true,chi_list:chi_list};
};
tilePatternBase.prototype.setPatternWindChi = function (tile,style) {
    var chi_tiles = []
    if(tile === 1)
    {
        if(style === _WIND_TILES_CHI_STYLE_123)
        {
            this.tiles[2 - 1] -= 1;
            this.tiles[3 - 1] -= 1;
            chi_tiles = [style, 1, 2, 3]
        }

        else if(style === this._WIND_TILES_CHI_STYLE_124)
        {
            this.tiles[2 - 1] -= 1;
            this.tiles[4 - 1] -= 1;
            chi_tiles = [style, 1, 2, 4]
        }

        else if(style === this._WIND_TILES_CHI_STYLE_134)
        {
            this.tiles[3 - 1] -= 1;
            this.tiles[4 - 1] -= 1;
            chi_tiles = [style, 1, 3, 4]
        }

    }
    else if(tile ===  2)
    {
        if(style === this._WIND_TILES_CHI_STYLE_123)
        {
            this.tiles[1 - 1] -= 1;
            this.tiles[3 - 1] -= 1;
            chi_tiles = [style, 1, 2, 3]
        }

        else if(style === this._WIND_TILES_CHI_STYLE_124)
        {
            this.tiles[1 - 1] -= 1;
            this.tiles[4 - 1] -= 1;
            chi_tiles = [style, 1, 2, 4]
        }

        else if(style === this._WIND_TILES_CHI_STYLE_234)
        {
            this.tiles[3 - 1] -= 1;
            this.tiles[4 - 1] -= 1;
            chi_tiles = [style, 2, 3, 4]
        }

    }
    else if(tile === 3)
    {
        if(style === this._WIND_TILES_CHI_STYLE_123)
        {
            this.tiles[1 - 1] -= 1;
            this.tiles[2 - 1] -= 1;
            chi_tiles = [style, 1, 2, 3]
        }

        else if(style === this._WIND_TILES_CHI_STYLE_134)
        {
            this.tiles[1 - 1] -= 1;
            this.tiles[4 - 1] -= 1;
            chi_tiles = [style, 1, 3, 4]
        }

        else if(style === this._WIND_TILES_CHI_STYLE_234)
        {
            this.tiles[2 - 1] -= 1;
            this.tiles[4 - 1] -= 1;
            chi_tiles = [style, 2, 3, 4]
        }

    }

    else if(tile === 4)
    {
        if(style === this._WIND_TILES_CHI_STYLE_124)
        {
            this.tiles[1 - 1] -= 1;
            this.tiles[2 - 1] -= 1;
            chi_tiles = [style, 1, 2, 4];
        }

        else if(style === this._WIND_TILES_CHI_STYLE_134)
        {
            this.tiles[1 - 1] -= 1;
            this.tiles[3 - 1] -= 1;
            chi_tiles = [style, 1, 3, 4]
        }

        else if(style === this._WIND_TILES_CHI_STYLE_234)
        {
            this.tiles[2 - 1] -= 1;
            this.tiles[3 - 1] -= 1;
            chi_tiles = [style, 2, 3, 4]
        }

    }

    return chi_tiles
};
tilePatternBase.prototype.getFindShunPriorittyList = function (tiles) {
    if(mjutil.count(tiles,0) > 6)
    {
        return [];
    }

    if(this.order === 3)
    {
        var chunkTiles =_.chunk(tiles,4);
        if(mjutil.count(chunkTiles[0],0) <= 1 && mjutil.count(chunkTiles[1],0) == 0)  // 风、箭都有顺
        {
            return [1,2,3,4,5,6,7];

        }
        else if(mjutil.count(chunkTiles[0],0) <= 1 && mjutil.count(chunkTiles[1],0) > 0)  // 只有风有顺
        {
            return [1,2,3,4];

        }
        else if(mjutil.count(chunkTiles[0],0) > 1 && mjutil.count(chunkTiles[1],0) == 0)  // 只有箭有顺
        {
            return [5,6,7]

        }
        else  // 都没顺
        {
            return []

        }
    }
    else
    {
        var start_tile = 1;
        while(start_tile <= 7)
        {
            if(tiles[start_tile - 1] === 0)  // 不存在
            {
                start_tile += 1
                continue

            }
            if(start_tile === 1 && tiles[1] === 0 && tiles[0] * tiles[2] > 0 && tiles[0] === tiles[2] && tiles[3] * tiles[5] * tiles[6] > 0)  // 1,3 缺2 且4、5、6存在
            {
                start_tile = 4
                continue
            }

            if(start_tile <= 4)
            {
                if(tiles[start_tile - 1] === tiles[start_tile + 2] == 2 && tiles[start_tile] * tiles[start_tile + 1] * tiles[start_tile + 3] * tiles[start_tile + 4] === 1)  // 如：21,21,22,23,24,24,25,26,27
                {
                    start_tile += 1
                    continue

                }
            }

            if(tiles[start_tile - 1] > 0 && (tiles[start_tile] > 0 || tiles[start_tile + 1] > 0))  // 相邻
            {
                break

            }
            start_tile += 1
        }

        var end_tile = 9
        while(end_tile >= 1)
        {
            if(tiles[end_tile - 1] === 0)
            {
                end_tile -= 1
                continue
            }

            if(end_tile === 9 && tiles[7] === 0 && tiles[6] * tiles[8] > 0 && tiles[6] === tiles[8] && tiles[3] * tiles[4] * tiles[5])  // 7, 9 缺8 且4、5、6存在
            {
                end_tile = 6
                continue
            }

            if(end_tile >= 6)
            {
                if(tiles[end_tile - 1] === tiles[end_tile - 4] === 2 && tiles[end_tile - 2] * tiles[end_tile - 3] * tiles[end_tile - 5] * tiles[end_tile - 6] === 1)  // 24，25，26，26，27，28，29，29
                {
                    end_tile -= 1
                    continue

                }
            }

            if(tiles[end_tile - 1] > 0 && (tiles[end_tile - 2] > 0 || tiles[end_tile - 3] > 0))
            {
                break

            }

            end_tile -= 1

        }

        if(start_tile > end_tile)
        {
            return [];
        }

        var reList = [];
        for(var i = start_tile;i < end_tile; i++)
        {
            reList.push(i);
        }
        return reList

    }
};
tilePatternBase.prototype.calculatePatternSingleModTileCount = function (find_tiles) {
    var tiles = _.clone(find_tiles);
    var single_count = 0;
    if (this.order === 3)  // 风、箭牌单独处理
    {
        var chunkTiles = _.chunk(tiles,4);
        if(_.sum(chunkTiles[0]) === 1)
        {
            single_count += 1;
        }
        if(_.sum(chunkTiles[1]) === 1)
        {
            single_count += 1;
        }

        return single_count;
    }

    for(var tile = 0; tile < tiles.length;tile++)
    {
        if(tiles[tile] >= 3)
        {
            tiles[tile] -= 3;

        }

        if (tiles[tile] >= 2)
        {
            tiles[tile] -= 2;
        }

        if(tile == 0)
        {
            if(tiles[tile] == 1 && tiles[tile + 1] == tiles[tile + 2] == 0)  // 1|2, 3
            {
                single_count += 1;
            }
            else if(tiles[tile] > 0 && tiles[tile + 1] > 0 && tiles[tile + 2] > 0)  // 有顺
            {
                tiles[tile] -= 1;
                tiles[tile] -= 1;
                tiles[tile + 1] -= 1;
            }
            else if(tiles[tile] == 1 && tiles[tile + 1] > 0)
            {
                tiles[tile] -= 1;
                tiles[tile + 1] -= 1;
            }
            else  if(tiles[tile] == 1 && tiles[tile + 2] > 0)
            {
                tiles[tile] -= 1;
                tiles[tile + 2] -= 1;
            }
        }
        else if(tile == 1)
        {
            if(tiles[tile] == 1 && tiles[tile - 1] == tiles[tile + 1] == tiles[tile + 2] == 0)  // 1|2|3，4
            {
                single_count += 1;

            }
            else if(tiles[tile] * tiles[tile - 1] * tiles[tile + 1] > 0)
            {
                tiles[tile] -= 1;
                tiles[tile - 1] -= 1;
                tiles[tile + 1] -= 1;
            }
            else if(tiles[tile] * tiles[tile + 1] * tiles[tile + 2] > 0)
            {
                tiles[tile] -= 1;
                tiles[tile + 1] -= 1;
                tiles[tile + 2] -= 1;
            }
            else if(tiles[tile] == 1 && tiles[tile - 1] > 0)
            {
                tiles[tile] -= 1;
                tiles[tile - 1] -= 1;
            }

            else if(tiles[tile] == 1 && tiles[tile + 1] > 0)
            {
                tiles[tile] -= 1;
                tiles[tile + 1] -= 1;
            }
            else if(tiles[tile] == 1 && tiles[tile + 2] > 0)
            {
                tiles[tile] -= 1;
                tiles[tile + 2] -= 1;
            }

        }
        else if(tile == 8)
        {
            if(tiles[tile] == 1 && tiles[tile - 2] == tiles[tile - 1] == 0)  // 7, 8|9
            {
                single_count += 1

            }
            else if(tiles[tile] * tiles[tile - 2] * tiles[tile - 1] > 0)  // 有顺
            {
                tiles[tile] -= 1
                tiles[tile - 2] -= 1
                tiles[tile - 1] -= 1
            }
            else if(tiles[tile] == 1 && tiles[tile - 2] > 0)
            {
                tiles[tile] -= 1
                tiles[tile - 2] -= 1
            }
            else if (tiles[tile] == 1 && tiles[tile - 1] > 0)
            {
                tiles[tile] -= 1
                tiles[tile - 1] -= 1
            }
        }
        else if(tile == 7)
        {
            if(tiles[tile] == 1 && tiles[tile - 2] == tiles[tile - 1] == tiles[tile + 1] == 0)  // 6, 7|8|9
            {
                single_count += 1

            }
            else if(tiles[tile] * tiles[tile - 2] * tiles[tile - 1] > 0)
            {
                tiles[tile] -= 1
                tiles[tile - 2] -= 1
                tiles[tile - 1] -= 1
            }
            else if(tiles[tile] * tiles[tile - 1] * tiles[tile + 1] > 0)
            {
                tiles[tile] -= 1
                tiles[tile - 1] -= 1
                tiles[tile + 1] -= 1
            }
            else if(tiles[tile] == 1 && tiles[tile - 2] > 0)
            {
                tiles[tile] -= 1
                tiles[tile - 2] -= 1
            }
            else  if(tiles[tile] == 1 && tiles[tile - 1] > 0)
            {
                tiles[tile] -= 1
                tiles[tile - 1] -= 1
            }
            else  if(tiles[tile] == 1 && tiles[tile + 1] > 0)
            {
                tiles[tile] -= 1
                tiles[tile + 1] -= 1
            }
        }
        else
        {
            if(tiles[tile] == 1 && tiles[tile - 2] == tiles[tile - 1] == tiles[tile + 1] == tiles[tile + 2] == 0)
            {
                single_count += 1

            }
            else if(tiles[tile] * tiles[tile - 2] * tiles[tile - 1] > 0)
            {
                tiles[tile] -= 1
                tiles[tile - 2] -= 1
                tiles[tile - 1] -= 1
            }
            else if(tiles[tile] * tiles[tile - 1] * tiles[tile + 1] > 0)
            {
                tiles[tile] -= 1
                tiles[tile - 1] -= 1
                tiles[tile + 1] -= 1
            }
            else if(tiles[tile] * tiles[tile + 1] * tiles[tile + 2] > 0)
            {
                tiles[tile] -= 1
                tiles[tile + 1] -= 1
                tiles[tile + 2] -= 1
            }
            else if(tiles[tile] == 1 && tiles[tile - 2] > 0)
            {
                tiles[tile] -= 1
                tiles[tile - 2] -= 1
            }
            else if (tiles[tile] == 1 && tiles[tile - 1] > 0)
            {
                tiles[tile] -= 1
                tiles[tile - 1] -= 1
            }
            else if(tiles[tile] == 1 && tiles[tile + 1] > 0)
            {
                tiles[tile] -= 1
                tiles[tile + 1] -= 1
            }
            else if(tiles[tile] == 1 && tiles[tile + 2] > 0)
            {
                tiles[tile] -= 1
                tiles[tile + 2] -= 1
            }

        }

    }

    return single_count

};
tilePatternBase.prototype.canExtractShun = function(tiles, start_tile, end_tile) {
    var canExtract = true;
    if(start_tile > 0)
    {
        var check_tiles = _.clone(tiles);
        var befor_single_count = this.calculatePatternSingleModTileCount(check_tiles);
        check_tiles[start_tile - 1] -= 1
        check_tiles[start_tile] -= 1
        check_tiles[start_tile + 1] -= 1
        var after_single_count = this.calculatePatternSingleModTileCount(check_tiles);
        canExtract = after_single_count <= befor_single_count || after_single_count <= 1
    }

    if(end_tile > 0)
    {
        var check_tiles = _.clone(tiles);
        var befor_single_count = this.calculatePatternSingleModTileCount(check_tiles);
        check_tiles[end_tile - 3] -= 1
        check_tiles[end_tile - 2] -= 1
        check_tiles[end_tile - 1] -= 1
        var after_single_count = this.calculatePatternSingleModTileCount(check_tiles);
        canExtract = after_single_count <= befor_single_count || after_single_count <= 1
    }

    return canExtract;
};
tilePatternBase.prototype.findPattern3Shun = function (tiles, count_scope, start_tile, end_tile, mode) {

    var shun_list = []

    return {shun_list:shun_list,tiles:tiles};
};
tilePatternBase.prototype.findPatternShun = function (tiles,count_scope,pmode) {
    var mode = pmode || 2;
    var shun_list = []
    var find_priority_list = this.getFindShunPriorittyList(tiles);
    if(find_priority_list.length < 3)
    {
        return {shun_list:[],tiles:tiles};
    }

    var start_tile = find_priority_list[0];
    var end_tile = find_priority_list[-1];

    if(this.order === 3)
    {
        return this.findPattern3Shun(tiles, count_scope, start_tile, end_tile, mode)
    }
    else
    {
        while(start_tile < end_tile)
        {

            if(mode in [0, 2])  // 从小到大或从两边到中间
            {
                var loopList = [0];
                if(count_scope.length === 1)
                {
                    loopList = [0]
                }
                else
                {
                    loopList = [];
                    for(var i = 0 ; i <tiles[start_tile - 1];i++)
                    {
                        loopList.push(i);
                    }
                }

                for(var i = 0 ;i < loopList.length;i++)
                {
                    if(start_tile < 7 && tiles[start_tile - 1] in count_scope && tiles[start_tile] in count_scope && tiles[start_tile + 1] in count_scope)
                    {
                        var canExtract = this.canExtractShun(tiles, start_tile, -1)
                        if(canExtract)
                        {
                            shun_list.push([start_tile + this.order * 10, start_tile + 1 + this.order * 10,start_tile + 2 + this.order * 10])
                            tiles[start_tile - 1] -= 1
                            tiles[start_tile] -= 1
                            tiles[start_tile + 1] -= 1
                        }
                    }
                }

                start_tile += 1

            }
            if(mode in [1, 2])
            {
                var loopList = [0];
                if(count_scope.length == 1)
                {
                    loopList = [0]
                }
                else
                {
                    loopList = [];
                    for(var i = 0 ; i <tiles[end_tile - 1];i++)
                    {
                        loopList.push(i);
                    }
                }

                for(var i = 0 ;i < loopList.length;i++) {

                    if(end_tile > 2 && tiles[end_tile - 1] in count_scope && tiles[end_tile - 2] in count_scope && tiles[end_tile - 3] in count_scope)
                    {
                        var canExtract = this.canExtractShun(tiles, -1, end_tile);
                        if(canExtract)
                        {
                            shun_list.append([end_tile - 2 + this.order * 10, end_tile - 1 + this.order * 10,
                                end_tile + this.order * 10])
                            tiles[end_tile - 3] -= 1
                            tiles[end_tile - 2] -= 1
                            tiles[end_tile - 1] -= 1
                        }

                    }
                }

                end_tile -= 1

            }


        }
    }

    return {shun_list:shun_list, tiles:tiles}

};
tilePatternBase.prototype.findPatternKe = function (tiles, pcount_scope) {
    var count_scope = pcount_scope || [3];
    var ke_list = [];
    var maxLoop = 9;
    if(this.order === 3)
    {
        maxLoop = 7;

    }
    for(var start_tile = 0; start_tile < maxLoop;start_tile++)
    {
        if(tiles[start_tile] in count_scope)
        {
            ke_list.push([start_tile + 1 + this.order * 10] * 3)
            tiles[start_tile] -= 3
        }
    }
    return {ke_list:ke_list,tiles:tiles}
};
tilePatternBase.prototype.findPattern3Lin = function (find_tiles) {

    var tiles = _.clone(find_tiles);
    var lin_list = [];
    return {lin_list:lin_list,tiles:tiles};
};
tilePatternBase.prototype.canExtractLin = function (tiles, start_tile, end_tile) {
    var check_tiles = _.clone(tiles);
    if(check_tiles[start_tile] < 2 && check_tiles[end_tile] < 2)  // 都不够2张
    {
        return true
    }

    var before_single_count = this.calculatePatternSingleModTileCount(check_tiles);
    check_tiles[start_tile] -= 1;
    check_tiles[end_tile] -= 1;
    var after_single_count = this.calculatePatternSingleModTileCount(check_tiles);

    return after_single_count <= before_single_count


};
tilePatternBase.prototype.findPatternLin = function (find_tiles) {

    var tiles = _.clone(find_tiles);
    var count_scope = [1,2];
    if(this.order === 3)
    {
        return this.findPattern3Lin(tiles);
    }

    var lin_list = [];
    for(var start_tile = 0;start_tile < _MAX_PATTERN_TILE_NUM;start_tile++)
    {
        if(tiles[start_tile] == 0)
        {
            continue;
        }
        if(start_tile == 0 && tiles[start_tile] == 2)  // 对1不拆
        {
            continue;

        }
        else if(start_tile == 8 && tiles[start_tile] == 2)  // 对9不拆
        {
            continue;

        }


        if(start_tile < 7)
        {
            for(var i = 0; i < tiles[start_tile];i++)
            {
                if(tiles[start_tile] in count_scope && tiles[start_tile + 1] in count_scope)
                {
                    var canExtractLin = this.canExtractLin(tiles, start_tile, start_tile + 1);
                    if (canExtractLin)
                    {
                        lin_list.push([start_tile + 1 + this.order * 10, start_tile + 2 + this.order * 10])
                        tiles[start_tile] -= 1
                        tiles[start_tile + 1] -= 1
                    }

                }
                else if(tiles[start_tile] in count_scope && tiles[start_tile + 2] in count_scope)
                {
                    var canExtractLin = this.canExtractLin(tiles, start_tile, start_tile + 2)
                    if(canExtractLin)
                    {
                        lin_list.push([start_tile + 1 + this.order * 10, start_tile + 3 + this.order * 10])
                        tiles[start_tile] -= 1
                        tiles[start_tile + 2] -= 1
                    }

                }

            }
        }
        else if(start_tile === 7)
        {
            for(var i = 0; i < tiles[start_tile];i++)
            {
                if(tiles[start_tile] in count_scope && tiles[start_tile + 1] in count_scope)
                {
                    var canExtractLin = this.canExtractLin(tiles, start_tile, start_tile + 1);

                    if(canExtractLin)
                    {
                        lin_list.push([start_tile + 1 + this.order * 10, start_tile + 2 + this.order * 10])
                        tiles[start_tile] -= 1
                        tiles[start_tile + 1] -= 1
                    }

                }
            }
        }


    }


    return {lin_list:lin_list, tiles:tiles}
};
tilePatternBase.prototype.findPatternPair = function (find_tiles) {

    var tiles = _.clone(find_tiles);
    var pair_list = [];
    var loopMax = 9;
    if(this.order === 3 )
    {
        loopMax = 7;
    }
    for(var start_tile = 0; start_tile < loopMax;start_tile ++)
    {
        if(tiles[start_tile] == 4)
        {
            pair_list.push([start_tile + 1 + this.order * 10] * 2)
            pair_list.push([start_tile + 1 + this.order * 10] * 2)
            tiles[start_tile] = 0
        }
        else if(tiles[start_tile] >= 2)
        {
            pair_list.push([start_tile + 1 + this.order * 10] * 2)
            tiles[start_tile] -= 2
        }
    }

    return {pair_list:pair_list, tiles:tiles}

};
tilePatternBase.prototype.findPatternSingle = function (find_tiles) {
    var tiles = _.clone(find_tiles);

    var single_list = [];


    if(_.sum(tiles) === 0)
    {
        single_list = [];
    }
    else
    {
        var loopMax = 9;
        if(this.order === 3 )
        {
            loopMax = 7;
        }

        for(var start_tile = 0; start_tile < loopMax;start_tile ++)
        {
            if(tiles[start_tile] == 1)
            {
                single_list.push([start_tile + 1 + this.order * 10])
                tiles[start_tile] -= 1
            }
        }
    }

    return {single_list:single_list, tiles:tiles}
};
tilePatternBase.prototype.findPatternLinPairSingle = function (tiles,pmode) {
    var mode = pmode || 0;
    var find_tiles = _.clone(tiles);
    var lin_list = [];
    var pair_list = [];
    var single_list = [];
    var left_tiles = [];
    if(mode == 0)
    {

        var findLinObject = this.findPatternLin(find_tiles);  // 取临
        lin_list = findLinObject["lin_list"];
        var left_tiles_after_find_lin = findLinObject["tiles"];
        var findPairObject = this.findPatternPair(left_tiles_after_find_lin);  // 取对
        pair_list = findPairObject["pair_list"];
        var left_tiles_after_find_pair = findPairObject["tiles"];
        var findSingleObject = this.findPatternSingle(left_tiles_after_find_pair);  // 取单
        single_list = findSingleObject['single_list'];
        left_tiles = findSingleObject['tiles'];
    }
    else if(mode == 1)
    {

        var findPairObject = this.findPatternPair(left_tiles_after_find_lin);  // 取对
        pair_list = findPairObject["pair_list"];
        var left_tiles_after_find_pair = findPairObject["tiles"];
        var findLinObject = this.findPatternLin(find_tiles);  // 取临
        lin_list = findLinObject["lin_list"];
        var left_tiles_after_find_lin = findLinObject["tiles"];
        var findSingleObject = this.findPatternSingle(left_tiles_after_find_pair);  // 取单
        single_list = findSingleObject['single_list'];
        left_tiles = findSingleObject['tiles'];
    }

    return {lin_list:lin_list, pair_list:pair_list, single_list:single_list, left_tiles:left_tiles}

};
tilePatternBase.prototype.findPaternOptimalLinPairSingle = function (tiles) {

    var lin_list = [];
    var pair_list = [];
    var single_list = [];
    var left_tiles = [];
    var mode_list = [0, 1];
    var tiles_list = [_.clone(tiles),_.clone(tiles)];
    var loop_index = 0;

    while(loop_index < mode_list.length)
    {
        //return {lin_list:lin_list, pair_list:pair_list, single_list:single_list, left_tiles:left_tiles}
        var findLinPairSingleObject = this.findPatternLinPairSingle(tiles_list[loop_index], mode_list[loop_index]);
        var loop_lin_list = findLinPairSingleObject["lin_list"];
        var loop_pair_list = findLinPairSingleObject["pair_list"];
        var loop_single_list = findLinPairSingleObject["single_list"];
        if(this.isNewResultBetter([], [], lin_list, pair_list, single_list, [], [], loop_lin_list, loop_pair_list,
            loop_single_list))
        {
            lin_list = loop_lin_list;
            pair_list = loop_pair_list;
            single_list = loop_single_list;


        }

        loop_index += 1
    }

    return {lin_list:lin_list, pair_list:pair_list, single_list:single_list, left_tiles:left_tiles}

};
tilePatternBase.prototype.findPatternKeAfterShun = function (tiles) {
    var ke_list = [];
    var lin_list = [];
    var pair_list = [];
    var single_list = [];
    var left_tiles = [];
    var count_scope_list = [[3], [3, 4]]  // 不拆杠、拆杠
    var tiles_list = [_.clone(tiles),_.clone(tiles)];
    var loop_index = 0;
    while(loop_index < count_scope_list.length)
    {
        var findPatternKeReturnObject= this.findPatternKe(tiles_list[loop_index],count_scope_list[loop_index]);
        var loop_ke_list = findPatternKeReturnObject['ke_list'];
        var loop_left_tiles_after_find_ke = findPatternKeReturnObject['tiles'];
        var findPaternObject = this.findPaternOptimalLinPairSingle(loop_left_tiles_after_find_ke);
        var loop_lin_list = findPaternObject["lin_list"];
        var loop_pair_list = findPaternObject["pair_list"];
        var loop_single_list = findPaternObject["single_list"];
        if (this.isNewResultBetter([], ke_list, lin_list, pair_list, single_list, [], loop_ke_list, loop_lin_list,
        loop_pair_list, loop_single_list))
        {
            var ke_list = loop_ke_list;
            var lin_list = loop_lin_list;
            var pair_list = loop_pair_list;
            var single_list = loop_single_list;

        }

        loop_index += 1

    }

    return {ke_list:ke_list, lin_list:lin_list, pair_list:pair_list, single_list:single_list, left_tiles:left_tiles}

};
tilePatternBase.prototype.findPatternOptiimalShunKe = function (tiles, count_scope) {
    var shun_list = [];
    var ke_list = [];
    var lin_list = [];
    var pair_list = [];
    var single_list = [];
    var left_tiles = [];
    var mode_list = [0, 1, 2]
    var tiles_list = [tiles,tiles,tiles];
    var loop_index = 0
    while(loop_index < mode_list.length)
    {


        var findPatternShunReturnObject = this.findPatternShun(tiles_list[loop_index], count_scope, mode_list[loop_index]);
        var loop_shun_list = findPatternShunReturnObject['shun_list'];
        var left_tiles_after_find_shun = findPatternShunReturnObject['tiles'];
        // return {ke_list:ke_list, lin_list:lin_list, pair_list:pair_list, single_list:single_list, left_tiles:left_tiles}
        var findKeAfterShunObject = this.findPatternKeAfterShun(left_tiles_after_find_shun);
        var loop_ke_list = findKeAfterShunObject["ke_list"];
        var loop_lin_list = findKeAfterShunObject["lin_list"];
        var loop_pair_list= findKeAfterShunObject["pair_list"];
        var loop_single_list = findKeAfterShunObject["single_list"];

        if (this.isNewResultBetter(shun_list, ke_list, lin_list, pair_list, single_list,loop_shun_list,loop_ke_list, loop_lin_list, loop_pair_list,loop_single_list))
        {
            shun_list = loop_shun_list;
            ke_list = loop_ke_list;
            lin_list = loop_lin_list;
            pair_list = loop_pair_list;
            single_list = loop_single_list

        }

        loop_index += 1
    }

    return {shun_list:shun_list, ke_list:ke_list, lin_list:lin_list, pair_list:pair_list, single_list:single_list, left_tiles:left_tiles}

};
tilePatternBase.prototype.getPatternShunKe = function (tiles) {
    var shun_list = [];
    var ke_list = [];
    var lin_list = [];
    var pair_list = [];
    var single_list = [];
    var left_tiles = [];
    var count_scope_list = [[1], [1, 2, 4], [1, 3, 4], [1, 2, 3, 4]];  // 依次对应：都不拆、拆对杠、拆刻杠、拆对刻杠
    var tiles_list = [tiles,tiles,tiles,tiles];
    var loop_index = 0
    while(loop_index < count_scope_list.length)
    {
        // return {shun_list:shun_list, ke_list:ke_list, lin_list:lin_list, pair_list:pair_list, single_list:single_list, left_tiles:left_tiles}

        var findOptiimalObject =  this.findPatternOptiimalShunKe(tiles_list[loop_index], count_scope_list[loop_index]);
        var loop_shun_list = findOptiimalObject["shun_list"];
        var loop_ke_list = findOptiimalObject["ke_list"];
        var loop_lin_list = findOptiimalObject["lin_list"];
        var loop_pair_list = findOptiimalObject["pair_list"];
        var loop_single_list = findOptiimalObject["single_list"];
        if(this.isNewResultBetter(shun_list, ke_list, lin_list, pair_list, single_list, loop_shun_list,loop_ke_list, loop_lin_list, loop_pair_list, loop_single_list))
        {
            shun_list, ke_list, lin_list, pair_list, single_list = loop_shun_list, loop_ke_list, loop_lin_list, loop_pair_list, loop_single_list

        }

        loop_index += 1

    }

    return {shun_list:shun_list, ke_list:ke_list, lin_list:lin_list, pair_list:pair_list, single_list:single_list, left_tiles:left_tiles}

};
tilePatternBase.prototype.findPatternOptimalShunLinPairSingle=function(find_tiles, count_scope) {
    var shun_list = [];
    var lin_list = [];
    var pair_list = [];
    var single_list = [];
    var left_tiles = [];

    var mode_list = [0, 1, 2];

    var tiles_list = [_.clone(find_tiles),_.clone(find_tiles),_.clone(find_tiles)];
    var loop_index = 0;

    while(loop_index < mode_list.length)
    {
        var findPaObject = this.findPatternShun(tiles_list[loop_index], count_scope, mode_list[loop_index]);
        var loop_shun_list = findPaObject["shun_list"];
        var left_tiles_after_find_shun = findPaObject["tiles"];
        var findOLPSObjcet = this.findPaternOptimalLinPairSingle(left_tiles_after_find_shun);
        var loop_lin_list = findOLPSObjcet["lin_list"];
        var loop_pair_list = findOLPSObjcet["pair_list"];
        var loop_single_list = findOLPSObjcet["single_list"];

        if (this.isNewResultBetter(shun_list, [], lin_list, pair_list, single_list, loop_shun_list, [],
            loop_lin_list, loop_pair_list, loop_single_list))
        {
            shun_list = loop_shun_list;
            lin_list = loop_lin_list;
            pair_list = loop_pair_list;
            single_list = loop_single_list;

        }

        loop_index += 1

    }

    return {shun_list:shun_list, lin_list:lin_list, pair_list:pair_list, single_list:single_list, left_tiles:left_tiles}



}
tilePatternBase.prototype.findPatternShunAfterKe = function (tiles) {
    var shun_list = [];
    var lin_list = [];
    var pair_list = [];
    var single_list = [];
    var left_tiles = [];

    var count_scope_list = [[1], [1, 2, 4], [1, 3, 4], [1, 2, 3, 4]]  // 依次对应：都不拆、拆对杠、拆刻杠、拆对刻杠
    var tiles_list = [_.clone(tiles),_.clone(tiles),_.clone(tiles),_.clone(tiles)];
    var loop_index = 0

    while(loop_index < count_scope_list.length)
    {
        // return {shun_list:shun_list, lin_list:lin_list, pair_list:pair_list, single_list:single_list, left_tiles:left_tiles}

        var findPOSLPSObjcet =  this.findPatternOptimalShunLinPairSingle(tiles_list[loop_index], count_scope_list[loop_index]);
        var loop_shun_list = findPOSLPSObjcet["shun_list"];
        var loop_pair_list = findPOSLPSObjcet["pair_list"];
        var loop_single_list = findPOSLPSObjcet["single_list"];
        var loop_lin_list = findPOSLPSObjcet['lin_list'];

        if (this.isNewResultBetter(shun_list, [], lin_list, pair_list, single_list, loop_shun_list, [],
            loop_lin_list, loop_pair_list, loop_single_list))
        {
            shun_list = loop_shun_list;
            lin_list = loop_lin_list;
            pair_list = loop_pair_list;
            single_list =loop_single_list

        }

        loop_index += 1

    }

    return {shun_list:shun_list, lin_list:lin_list, pair_list:pair_list, single_list:single_list, left_tiles:left_tiles}

};
tilePatternBase.prototype.getPatternKeShun = function (tiles) {

    var shun_list = [];
    var ke_list = [];
    var lin_list = [];
    var pair_list = [];
    var single_list = [];
    var left_tiles = [];

    var count_scope_list = [[3], [3, 4]]; // 不拆杠、拆杠

    var tiles_list = [_.clone(tiles),_.clone(tiles)];

    var loop_index = 0;
    while(loop_index < count_scope_list.length)
    {
        var findKeObject = this.findPatternKe(tiles_list[loop_index],count_scope_list[loop_index]);

        var loop_ke_list = findKeObject["ke_list"];
        var loop_left_tiles_after_find_ke = findKeObject["tiles"];
        // return {shun_list:shun_list, lin_list:lin_list, pair_list:pair_list, single_list:single_list, left_tiles:left_tiles}

        var findShunAKObject = this.findPatternShunAfterKe(loop_left_tiles_after_find_ke);
        var loop_shun_list = findShunAKObject["shun_list"];
        var loop_lin_list = findShunAKObject["lin_list"];
        var loop_pair_list = findShunAKObject["pair_list"];
        var loop_single_list = findShunAKObject["single_list"];

        if (this.isNewResultBetter(shun_list, ke_list, lin_list, pair_list, single_list, loop_shun_list,
            loop_ke_list, loop_lin_list, loop_pair_list, loop_single_list))
        {
            shun_list = loop_shun_list;
            ke_list = loop_ke_list;
            lin_list = loop_lin_list;
            pair_list = loop_pair_list;
            single_list = loop_single_list;

        }

        loop_index += 1

    }

    return {shun_list:shun_list, ke_list:ke_list, lin_list:lin_list, pair_list:pair_list, single_list:single_list, left_tiles:left_tiles}


};
tilePatternBase.prototype.getPatternTypeTiles = function (tiles) {
    var shun_list = [];
    var ke_list = [];
    var lin_list = [];
    var pair_list = [];
    var single_list = [];
    var mode_list = [0, 1];  //0：先顺后刻 1：先刻后顺
    // var tiles_list = [copy.copy(tiles) for i in range(len(mode_list))]
    var tiles_list = [tiles,tiles];
    var loop_index = 0;

    while(loop_index < mode_list.length)
    {
        var loop_shun_list = [];
        var loop_ke_list = [];
        var loop_lin_list = [];
        var loop_pair_list = [];
        var loop_single_list = [];

        if(loop_index ===  0)
        {
            // return {shun_list:shun_list, ke_list:ke_list, lin_list:lin_list, pair_list:pair_list, single_list:single_list, left_tiles:left_tiles}

            var patternShunKeObject = this.getPatternShunKe(tiles_list[loop_index]);

            loop_shun_list = patternShunKeObject["shun_list"];
            loop_ke_list = patternShunKeObject["ke_list"];
            loop_lin_list = patternShunKeObject["lin_list"];
            loop_pair_list = patternShunKeObject["pair_list"];
            loop_single_list = patternShunKeObject["single_list"];
        }
        else if(loop_index === 1)
        {
            // return {shun_list:shun_list, ke_list:ke_list, lin_list:lin_list, pair_list:pair_list, single_list:single_list, left_tiles:left_tiles}
            var patternKeShunObject = this.getPatternKeShun(tiles_list[loop_index]);
            loop_shun_list = patternKeShunObject["shun_list"];
            loop_ke_list = patternKeShunObject["ke_list"];
            loop_lin_list = patternKeShunObject["lin_list"];
            loop_pair_list = patternKeShunObject["pair_list"];
            loop_single_list = patternKeShunObject["single_list"];
        }

        // this.finalPatternCorrect(loop_shun_list, loop_ke_list, loop_lin_list, loop_pair_list, loop_single_list)
        if(this.isNewResultBetter(shun_list, ke_list, lin_list, pair_list, single_list, loop_shun_list,
            loop_ke_list, loop_lin_list, loop_pair_list, loop_single_list))
        {
            shun_list  =  loop_shun_list;
            ke_list = loop_ke_list;
            lin_list =  loop_lin_list;
            pair_list = loop_pair_list;
            single_list =loop_single_list

        }

        loop_index += 1
    }

    return {shun_list:shun_list, ke_list:ke_list, lin_list:lin_list, pair_list:pair_list, single_list:single_list}

};


exports.tilePatternBase = function () {

    return tilePatternBase;
}





























