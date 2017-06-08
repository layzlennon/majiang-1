/**
 * Created by sml on 2017/6/1.
 */
var mjutil = require("../mjutil");
var tableBase = require("./table_base").tableBase();

// 下面几个变量表示桌子状态 """
// 当发牌给当前玩家后，如果可以胡牌/杠牌，桌子进入状态2，否则进入状态1
var _WAITING_CURRENT_PLAYER_TO_PLAY_TILE = 1;

var _WAITING_REPLY_OF_CURRENT_PLAYER = 2;
//当前玩家出牌后，如果其它玩家可以win/gang/peng，桌子进入状态3
var _WAITING_REPLY_OF_OTHER_PLAYERS = 3;

// 抢杠状态
var _WAITING_REPLY_OF_GRAB_GANG = 4;

// 等待客户端的听牌回复
var _WAITING_TING_INFO_AFTER_PENG = 5;
var _WAITING_TING_INFO_AFTER_CHI = 6;
var _WAITING_TING_INFO_AFTER_SEND_TILE = 7;

var _FAN_INFO = [
    [[10], [4], ['ph'], '平胡'],
    [[10,20], [4], ['ph','q1s'], '平胡,清一色'],
    [[13], [4], ['13lang'], '十三浪'],
    [[14], [8], ['qx13lang'], '七星十三浪'],
    [[18], [2], ['jiuyao'], '九幺'],
    [[22], [4], ['jiuyao','qixing'], '九幺,七星'],
    [[17, 18], [16], ['jiuyao','pph'], '九幺,碰碰胡'],
    [[11, 18], [16], ['jiuyao','7d'], '九幺,七对'],
    [[18, 20], [4], ['jiuyao','q1s1'], '九幺,清一色'],
    [[17], [8], ['pph'], '碰碰胡'],
    [[17,20], [16], ['q1s','pph'], '清一色,碰碰胡'],
    [[17,18,20], [32], ['q1s','pph','jiuyao'], '清一色,碰碰胡,九幺'],
    [[11], [8], ['7d'], '七对'],
    [[11,20], [16], ['q1s','7d'], '清一色,七对'],
    [[11,18,20], [32], ['q1s','7d','jiuyao'], '清一色,七对,九幺'],
    [[20], [8], ['q1s'], '清一色']

];

function currencyTable() {
    this.players = []
}

exports.createCurrentTable = function (player_count)
{
    mjutil.extend(currencyTable,tableBase)
    var cTable = new currencyTable();
    console.log(cTable)
    return cTable
};


// function Animal(){ }
// Animal.prototype.species = "动物";
//
// function Cat(name,color){
//     this.name = name;
//     this.color = color;
// }
//
// mjutil.extend(Cat,Animal)
// var cat1 = new Cat('mao','red');
// console.log(cat1.species)