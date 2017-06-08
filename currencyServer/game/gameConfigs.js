/**
 * Created by sml on 2017/5/21.
 */
const gameRuleConfigs = [
    {
        gamesTypeName:'血战到底',
        gamesRuleDetail:
        [
            {
                ruleName:'局数',
                detail:['4局(房卡X2)','8局(房卡X3)'],
                default:1
            },
            {
                ruleName:'胡牌方式',
                detail:['只能自摸','自摸和点炮'],
                default:1

            },
            {
                ruleName:'杠',
                detail:['可抢杠','不可抢杠'],
                default:1
            },
            {
                ruleName:'吃牌',
                detail:['可吃牌','不可吃牌'],
                default:1
            },
            {
                ruleName:'字牌',
                detail:['字可以成顺','字不可以成顺'],
                default:1
            },
            {
                ruleName:'天地胡',
                detail:['有天胡','有地胡','有天地胡'],
                default:2
            },
            {
                ruleName:'庄家',
                detail:['庄家翻倍','庄家不翻倍'],
                default:1
            }


        ]



    },
    {
        "gamesTypeName":'血流成河',
        "gamesRuleDetail":[
            {
                ruleName:'局数',
                detail:['4局(房卡X2)','8局(房卡X3)'],
                default:1
            },
            {
                ruleName:'胡牌方式',
                detail:['只能自摸','自摸和点炮'],
                defualt:2
            },
            {
                ruleName:'庄位',
                detail:['胡牌者坐庄','点炮者坐庄'],
                default:1
            },
            {
                ruleName:'局数',
                detail:['4局(房卡X2)','8局(房卡X3)'],
                default:1
            }
        ]

    }
];
exports.gameRuleConfig=function(){

    return gameRuleConfigs;
};