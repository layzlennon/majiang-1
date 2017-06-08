/**
 * Created by sml on 2017/6/3.
 */

var _ = require("lodash");
var mjutil = require("../mjutil");

_MAX_TILE_NUM = 136  // 总牌张数
_FIRST_SEND_TILE_NUM = 13  // 开始每个玩家先发13张手牌
_LIUJU_LIMIT_TILE_NUM = 14  // 剩最后7墩(即14张)未胡牌，则流局

//shuffle
tileDealerBase = function (seatNum) {

    this.__seatNum = seatNum;
    if(this.__seatNum == 4)
    {
        this.__map_tiles = [
            4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
            4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
            4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
            4, 4, 4, 4, 4, 4, 4, 4, 4, 4
        ]
        this.__assigned_tiles = {0: [], 1: [], 2: [], 3: []}
        this.__first_send_tiles = {0: [], 1: [], 2: [], 3: []}
    }
  
    else if(this.__seatNum == 3)
    {
        this.__map_tiles = [
            4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
            4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
            4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
            4, 4, 4, 4, 4, 4, 4, 4, 4, 4
        ]
        this.__assigned_tiles = {0: [], 1: [], 2: []}
        this.__first_send_tiles = {0: [], 1: [], 2: []}
    }
    

    
    this.__tiles = []
};

tileDealerBase.prototype.__seatNum = 4;
tileDealerBase.prototype.__map_tiles = [
    4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    4, 4, 4, 4, 4, 4, 4, 4, 4, 4
];
tileDealerBase.prototype.__assigned_tiles = {0: [], 1: [], 2: [], 3: []};
tileDealerBase.prototype.__first_send_tiles = {0: [], 1: [], 2: [], 3: []};
tileDealerBase.prototype.__tiles = [];
tileDealerBase.prototype.__shuffle_remained_tiles = function () {

    var remained_tiles = [];
    for(var i = 0 ;i < 4;i++)
    {
        var max = 10;
        if(i === 3)
        {
            max = 8;
        }

        for(var j = 1;j < max;j++) {
            var tile = i * 10 + j;
            for (var k = 0; k < this.__map_tiles[tile]; k++)
            {
                remained_tiles.push(tile)
            }
        }
    }

    remained_tiles = _.shuffle(remained_tiles);//洗牌

    // console.log(remained_tiles);
    for(var seat_id = 0; seat_id < this.__seatNum;seat_id++)
    {
        var assigned_tiles = this.__assigned_tiles[seat_id];
        var gap_count = 13 - assigned_tiles.length;
        var cutArray = mjutil.getArrayFromIndex2Index(remained_tiles,0,gap_count);
        assigned_tiles = mjutil.arrcat(assigned_tiles,cutArray);

        for(var tile in cutArray)
        {
            this.__map_tiles[cutArray[tile]] -= 1
        }
        remained_tiles = mjutil.remvoeArrayFromIndex2Index(remained_tiles,0,gap_count);
        assigned_tiles = _.shuffle(assigned_tiles);
        this.__tiles = mjutil.arrcat(this.__tiles,assigned_tiles);
    }

    remained_tiles = _.shuffle(remained_tiles);//再洗牌
    this.__tiles = mjutil.arrcat(this.__tiles,remained_tiles);
    console.log(this.__tiles.length)


}
tileDealerBase.prototype.get_tiles = function (count) {
    var ret = mjutil.getArrayFromIndex2Index(this.__tiles,0,count);

    for(var tile  = 0; tile < ret.length;tile++)
    {
        this.__map_tiles[ret[tile]] -= 1
    }

    this.__tiles = mjutil.remvoeArrayFromIndex2Index(this.__tiles,0,count);

    console.log(ret);

    return ret;
}
tileDealerBase.prototype.get_first_send_tiles = function (seat_id) {

    var first_send_tiles = this.__first_send_tiles[seat_id]
    return first_send_tiles

}
tileDealerBase.prototype.init_first_send_tiles = function (pputTiles) {
    var putTiles = pputTiles || false;
    var send_count_list = [];


    if(putTiles)
    {
        send_count_list = [13]
    }
    else
    {
        while(_.sum(send_count_list) < _FIRST_SEND_TILE_NUM)
        {
            var send_count = _.random(1,_FIRST_SEND_TILE_NUM - _.sum(send_count_list));
            send_count_list.push(send_count);
        }
    }

    console.log(send_count_list)
    for(var send_count in send_count_list)
    {
        for(var k in this.__first_send_tiles)
        {
            this.__first_send_tiles[k] = mjutil.arrcat(this.__first_send_tiles[k],this.get_tiles(send_count_list[send_count]))
        }


    }

    console.log(this.__first_send_tiles);
}
tileDealerBase.prototype.getSpecifiedTileCount = function (tile) {
    return this.__map_tiles[tile]
}
// var delar = new tileDealerBase();
// delar.__shuffle_remained_tiles();
// delar.init_first_send_tiles();

exports.tileDealerBase = function () {
    return tileDealerBase;
}