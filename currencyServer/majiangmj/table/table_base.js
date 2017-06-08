/**
 * Created by sml on 2017/6/1.
 */

var _ = reqire("lodash");
var tileDealerBase = reqire("../dealer/dealer_base").tileDealerBase();
var playerBase = reqire("../player/player_base").playerBase();

    _PLAYER_WAITING = 0  // 用户刚坐下，需要点击准备按钮
    _PLAYER_READY = 1  // 用户已经准备好
    _PLAYER_PLAYING = 2  // 用户处于游戏状态
    _PLAYER_WON = 3  // 用户已经胡牌
    // 当发牌给当前玩家后，如果可以胡牌/杠牌，桌子进入状态2，否则进入状态1
    _WAITING_CRRENT_PLAYER_TO_PLAY_TILE = 1
    _WAITING_REPLY_OF_CRRENT_PLAYER = 2

    // 当前玩家出牌后，如果其它玩家可以win/gang/peng，桌子进入状态3
    _WAITING_REPLY_OF_OTHER_PLAYERS = 3

    // 抢杠状态
    _WAITING_REPLY_OF_GRAB_GANG = 4

    // 等待客户端的听牌回复
    _WAITING_TING_INFO_AFTER_PENG = 5
    _WAITING_TING_INFO_AFTER_CHI = 6
    _WAITING_TING_INFO_AFTER_SEND_TILE = 7

    _BDGET_DEFALT = 0  // 默认牌桌结算
    _BDGET_WIN = 1  // 胡牌了的结算
    _BDGET_LIJ = 2  // 流局了的结算


    _FAN_INFO = [
    // 平胡
        [[10], [4], ['ph'], '平胡'],
        [[10,20], [4], ['ph','q1s'], '平胡,清一色'],

    // 烂牌
        [[13], [4], ['13lang'], '十三浪'],
        [[14], [8], ['qx13lang'], '七星十三浪'],

    // 九幺
        [[18], [2], ['jiyao'], '九幺'],
        [[22], [4], ['jiyao','qixing'], '九幺,七星'],
        [[17, 18], [16], ['jiyao','pph'], '九幺,碰碰胡'],

        [[11, 18], [16], ['jiyao','7d'], '九幺,七对'],
        [[18, 20], [4], ['jiyao','q1s1'], '九幺,清一色'],

    // 碰碰胡
        [[17], [8], ['pph'], '碰碰胡'],
        [[17,20], [16], ['q1s','pph'], '清一色,碰碰胡'],
        [[17,18,20], [32], ['q1s','pph','jiyao'], '清一色,碰碰胡,九幺'],

    // 七对
        [[11], [8], ['7d'], '七对'],
        [[11,20], [16], ['q1s','7d'], '清一色,七对'],
        [[11,18,20], [32], ['q1s','7d','jiyao'], '清一色,七对,九幺'],

    // 清一色
        [[20], [8], ['q1s'], '清一色']

    ]

tableBase = function(player_count){

    for(var i = 0;i < player_count;i++)
    {
        this._players[i] = this._create_player()

    }
    for(var i = 0 ;i < 40;i++)
    {
        this._drop_tiles.push(0);
    }


};

tableBase.prototype.hostid = 10000;
tableBase.prototype._player_count = 0;
tableBase.prototype._players = null;
tableBase.prototype.table_state = 0;
tableBase.prototype._be_grabed_gang_sid = -1;
tableBase.prototype.waiting_actions = {};
tableBase.prototype.set_waiting_actions_timestamp = 0;
tableBase.prototype.reply_sids = [];
tableBase.prototype.reply_win_sids = [];
tableBase.prototype.can_win_is_now = []; //可以胡但是先 不能胡的玩家id
tableBase.prototype.reply_gang_sid = -1;
tableBase.prototype.reply_peng_sid = -1;
tableBase.prototype.reply_pass_sids = [];
tableBase.prototype.reply_chi_sid = -1;
tableBase.prototype._tile_dealer = null;
tableBase.prototype.reply_chi_style = -1;
tableBase.prototype.non_win_seat_ids = [];
tableBase.prototype.seqence_win_seat_ids = [];
tableBase.prototype.has_sended_cancel_sggestion = false;
tableBase.prototype._drop_tiles = null;
tableBase.prototype._laizi_tiles = [0, 0];

tableBase.prototype._reset_table_state =function () {
    console.log('_reset_table_state');
    //清除跟桌子状态有关的变量
    this._table_state = 0
    this._waiting_actions = {}
    this._set_waiting_actions_timestamp = 0
    this._reply_sids = []
    this._reply_win_sids = []
    this._can_win_is_now = [] //可以胡但是先 不能胡的玩家id
    this._reply_gang_sid = -1
    this._reply_peng_sid = -1
    this._reply_pass_sids = []
    this._reply_chi_sid = -1
    this._reply_chi_style = -1
    this._non_win_seat_ids = []
    this._sequence_win_seat_ids = []
    this._has_sended_cancel_suggestion = false
    this._winIndex = 0
    this._budget_way = _BDGET_DEFALT
    this.isSpecialGang = []
    this._be_grabed_gang_sid = -1;


};
tableBase.prototype._create_player = function () {
    return new playerBase();
};
tableBase.prototype.resetPlayer = function (seatId) {

    this._players[seatId].reset()

};
tableBase.prototype.newPlayer = function (uid, seatId, score)
{
    this._players[seatId].reset();
    this._players[seatId].set(uid);
    return this._players[seatId];
};
tableBase.prototype._locate_header_sid = function () {
    var play_round = this.createNowCardCount;
    // if(play_round <= 1)
    // {
    //
    // }
};
tableBase.prototype._create_tile_dealer = function () {

    return new tileDealerBase(this._player_count)
};
tableBase.prototype._locate_players_initialized_tiles = function () {

    this._tile_dealer.init_first_send_tiles(false)

};
tableBase.prototype.resetTableVar = function () {
    this._current_sid = 0
    this._last_message_to_current_sid = -1
    this._has_sended_tile = false
    this._reset_table_state()
    this._drop_tiles = []
    this._friendship = {}
    this._won_sequence = {}
    this._master_point_info = {}
    this._chiPengGangNum = 0
    this._firstWinSid = -1
    this._historyCreateTableBanker = -1
    this._has_put_tiles = false
    this._has_put_laizi_tiles = false
    this._laizi_tiles = [0, 0]
    this._bu_after_gang = []
    this._be_grabed_gang_sid = -1
    this._budget_way = _BDGET_DEFALT
};
tableBase.prototype._send_initialized_tiles = function (first_player_sid, to_sid) {

   var  tiles = this._tile_dealer.get_first_send_tiles(to_sid);
   this._players[to_sid]._tile_manager.init_tiles(tiles)


};
tableBase.prototype._end_game = function () {
    if(this._budget_way == _BDGET_LIJ)
    {
        //流局
    }
};
tableBase.prototype._get_win_style = function (win_sid, tile) {

    var win_style = [];
    if(this._players[win_sid]._no_action)
    {
        if(win_sid == this._header_sid)
        {
            win_style.push(8)  // 天胡 庄家起手就胡牌(还未做任何动作)

        }
        else if(this._chiPengGangNum == 0 && this._current_sid == this._header_sid)
        {
            win_style.push(9)  // 地胡 庄家出第一张牌，闲家胡牌

        }
    }

    if(8 in win_style || 9 in win_style)
    {
        return win_style;
    }

    var gang_before_play = this._players[win_sid]._gang_before_play;  // 出牌之前是否杠牌，用于判断杠上炮或者杠上花
    if(this._table_state == _WAITING_REPLY_OF_CURRENT_PLAYER)
    {
        win_style.push(0)  // 自摸
        if(gang_before_play)
        {
            win_style.push(3)
        }

    }
    else if(this._table_state == _WAITING_REPLY_OF_OTHER_PLAYERS)
    {
        win_style.push(1)  // 点炮
    }
    else if(this._table_state == _WAITING_REPLY_OF_GRAB_GANG)
    {
        this._be_grabed_gang_sid = this._current_sid;
        win_style.push(4)  // 抢杠

    }

    return win_style;


};
tableBase.prototype.set_player_win = function (win_sid, tile, win_style,current_sid) {

    var players_win_degree = [];

    for(var i = 0; i < this._player_count;i++)
    {
        players_win_degree.push(0);
    }

    var base_win_degree = 1;
    if(this._firstWinSid == -1)
    {
        for(var i = 0;i < this._player_count;i++)
        {
            this._players[i]._win_style =[]
        }
    }

    if(8 in win_style || 9 in win_style)  // 天胡 或地胡)
    {
        base_win_degree = 16
        if(8 in win_style)
        {
            this._players[win_sid]._win_style.push('th')

        }
        else
        {
            this._players[win_sid]._win_style.push('dh')
        }

        if(win_sid != current_sid)
        {
            this._players[current_sid]._win_style.append('dp')
        }
        else
        {
            this._players[win_sid]._win_style.append('zm');
        }

        for(var i = 0;i < this._player_count;i++)
        {
            if( i != win_sid)
            {
                players_win_degree[i] = base_win_degree
                players_win_degree[i] *= -1
                this._players[i].update_hu_budget(base_win_degree * -1)
            }
            else
            {
                this._players[i].update_hu_budget(base_win_degree * (this._player_count - 1))
                players_win_degree[i] = base_win_degree * (this._player_count - 1)
            }
        }
    }
    else
    {
        var player_win_tile_type = this._players[win_sid]._tile_manager._win_tile_type;
        var win_double_type = _.clone(this._players[win_sid]._tile_manager._win_double_type)
        player_win_tile_type.sort();

        for(var i = 0; i < this._FAN_INFO.length;i++)
        {
            var win_fan_info = this._FAN_INFO[i];
            var tmp_tile_types = win_fan_info[0]
            tmp_tile_types.sort()
            if(player_win_tile_type == tmp_tile_types)
            {
                base_win_degree = win_fan_info[1][0];

                for(var lp in win_fan_info[2])
                {
                    var fan = win_fan_info[2][lp];
                    this._players[win_sid]._win_style.push(fan)

                }

                break;

            }

        }

        if(win_sid != current_sid)
        {
            this._players[current_sid]._win_style.push('dp')

            for(var i = 0;i < this._player_count;i++)
            {
                if(i  === this._current_sid)
                {
                    players_win_degree[i] = base_win_degree
                    players_win_degree[i] *= -1
                    this._players[i].update_hu_budget(base_win_degree * -1)
                }
                else if(i === win_sid)
                {
                    this._players[i].update_hu_budget(base_win_degree)
                    players_win_degree[i] = base_win_degree
                }
            }
        }
        else
        {
            for(var i = 0;i < this._player_count;i++)
            {
                players_win_degree[i] = 0;
                if(i != win_sid)
                {
                    this._players[i].update_hu_budget(base_win_degree * -1)
                }
                else
                {
                    this._players[i].update_hu_budget(base_win_degree *(this._player_count - 1))
                }
            }
        }

        if(0 in win_style)
        {
            this._players[win_sid]._win_style.append('zm');
            var zm_losers = this._get_other_players(win_sid);
            for(var j = 0; j < zm_losers;j++)
            {
                players_win_degree[zm_losers[j]] = base_win_degree
                players_win_degree[zm_losers[j]] *= -1
            }

            players_win_degree[win_sid] = base_win_degree * (this._player_count - 1)

        }


        if(3 in win_style)
        {
            this._players[win_sid]._win_style.push('gk')
            var gang_multiple = 2;
            for(var i = 0; i <this._player_count;i++)
            {
                if(i != win_sid)
                {
                    players_win_degree[i] *= gang_multiple

                }
            }

            players_win_degree[win_sid] *= gang_multiple

        }

        if(4 in win_style)
        {
            this._players[win_sid]._win_style.push('qg')
            var gang_multiple = 2;
            for(var i = 0; i <this._player_count;i++)
            {
                if(i != win_sid)
                {
                    players_win_degree[i] *= gang_multiple

                }
            }

            players_win_degree[win_sid] *= gang_multiple
        }



    }


    // 计算最终的赢家得分
    var final_win_degree = 0;
    for(var k = 0; k < players_win_degree.length;k++)
    {
        if(k != win_sid)
        {
            if(players_win_degree[i] > 0)
            {
                players_win_degree[i] = this._getRealDegree(players_win_degree[i])
                final_win_degree +=  (players_win_degree[i] * -1)

            }
            else
            {
                players_win_degree[i] = this._getRealDegree(Math.abs(players_win_degree[i])) * (-1)
                final_win_degree += players_win_degree[i] * (-1)

            }
        }
    }

    players_win_degree[win_sid] = final_win_degree

    return players_win_degree;

};
tableBase.prototype._broadcast_create_win_message = function (win_sid, tile) {

    var tile_manager = self._players[win_sid]._tile_manager;

    this._players[win_sid]._win_tile = tile;
    var current_sid = self._current_sid;
    if(win_sid == current_sid)
    {
        this._players[win_sid]._win_type = 0

    }
    else {
        this._players[win_sid]._win_type = 1
        tile_manager.add(tile)

    }

    this._send_cancel_suggestion_message(win_sid)

    var win_style = self._get_win_style(win_sid, tile)
    var players_win_degree= self.set_player_win(win_sid, tile, win_style,current_sid)
    var degree = players_win_degree[win_sid]
    var win_coin = degree;
    var description = ""


    var real_win_coin = players_win_degree[win_sid];
    var losers = this._get_other_players(win_sid);
    var losers_info = {'name': [], 'uid': [], 'coin': [], 'tip': [], 'state': []}

    for(var i = 0;i < losers;i++)
    {
        var real_lose_coin = players_win_degree[i];
        this._players[i].update_create_lose_budget('lose', real_lose_coin,
                                                    degree, description,
                                                    this._players[win_sid]._name,
                                                    this._players[win_sid]._uid);
        losers_info['name'].push(this._players[i]._name)
        losers_info['uid'].push(this._players[i]._uid)
        losers_info['coin'].push(-real_lose_coin)
    }

    this._players[win_sid].update_create_win_budget('win', real_win_coin, degree, description,
                                                    losers_info);

    //发消息
}
tableBase.prototype._getRealDegree = function (degree) {

    return degree;
}
tableBase.prototype._get_other_players = function (sid) {
    var targets = [];
    for(var i = 0;i < this._player_count;i++)
    {
        if(i != sid)
        {
            targets.push(i);
        }
    }

    return targets;
}
tableBase.prototype._start_game_init = function () {

    this._round_id += 1
    this.createNowCardCount += 1
    this._tile_dealer = this._create_tile_dealer()

};
tableBase.prototype.handleAfterCheckAction = function (sid,action) {
    var actions = this.waiting_actions[sid];
    console.log('handleAfterCheckAction sid :'+sid + "action: "+action + "waiting actions:" + actions);
    if('win' in actions && action in ['pass','play'])
    {
        //过胡
    }
};
tableBase.prototype.checkWaitingAction=function (sid,action) {
    console.log("_check_waiting_action,_waiting_actions:" + this._waiting_actions)
    if(sid in this.waiting_actions)
    {
        var actions = this.waiting_actions[sid]
        if (action in actions) {
            this.handleAfterCheckAction(sid,action)
            delete this.waiting_actions[sid]
            return true
        }
        else {
            console.log(action + 'not in waiting action:' + actions);

        }
    }
    else
    {
        console('not waiting seat_id:'+this.waiting_actions)

    }
    return false
};
tableBase.prototype.handle_play=function (sid,action,tile) {
    this.crrent_action_messages = {};

};
tableBase.prototype.handlePlayerAction =function (sid,action) {

    if(!this.checkWaitingAction(sid,action))
    {
        return;
    }

    delete  this.crrent_action_messages[sid];
    if(action in ['play'])
    {

    }
    else if(action in ['win'])
    {

    }
    else if(action in ['gang'])
    {

    }
    else if(action in ['peng'])
    {

    }
    else if(action in ['chi'])
    {

    }
    else if(action in ['pass'])
    {

    }
};
tableBase.prototype.doTableCall =function (sid,action) {

    if(action == 'leave')
    {

    }
    else if(action == 'share')
    {

    }
    else if(action == 'invite')
    {

    }
    else
    {
        this.handlePlayerAction(sid,action);
    }

};

exports.tableBase = function () {

    // console.log(tableBase.prototype)
    return tableBase;
};