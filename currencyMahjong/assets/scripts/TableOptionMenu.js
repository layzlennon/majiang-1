cc.Class({
    extends: cc.Component,

    properties: {
        _model:null,
        optionEat:{
            default:null,
            type:cc.Node
        },
        optionWin:{
            default:null,
            type:cc.Node
        },
        optionPeng:{
            default:null,
            type:cc.Node
        },
        optionPass:{
            default:null,
            type:cc.Node
        },
        optionGang:{
            default:null,
            type:cc.Node
        },
        optionBtnList:{
            default:[],
            type:[cc.Node]
        }

    },
    onLoad: function () {
        // this = this;
        cc.director.GlobalEvent.on('newOption',this.showOption,this);

    },
    clickBtnPass:function () {

    },
    showOption:function (data) {
        this._model = data.optionData;
        var mOption = this._model;
        var index = 0;


        if(mOption.hasWin())
        {

            var optionWin = cc.instantiate(this.optionWin);
            var optionC = optionWin.getComponent("OptionWin");
            optionC.praseWinParmes(mOption.getWinTileId(),mOption.getWinDegree());
            this.optionBtnList[index].addChild(optionWin)
            index += 1;
            optionWin.setPosition(cc.p(0,0))


        }

        if(mOption.hasGang())
        {
            var gangList = mOption.getGangTileIdArray();
            for(var i = 0; i <gangList.length;i++)
            {

                var optionGang = cc.instantiate(this.optionGang);
                var optionC = optionGang.getComponent("OptionGang");
                optionC.praseGangParmes(gangList[i]);
                this.optionBtnList[index].addChild(optionGang)
                index += 1;
                optionGang.setPosition(cc.p(0,0))

            }
        }

        if(mOption.hasPeng())
        {
            var optionPeng = cc.instantiate(this.optionPeng);
            var optionC = optionPeng.getComponent("OptionPeng");
            optionC.parsePengParams(mOption.getPengTileId());
            this.optionBtnList[index].addChild(optionPeng)
            index += 1;
            optionPeng.setPosition(cc.p(0,0))

        }

        if(mOption.hasEat())
        {
            var optionEat = cc.instantiate(this.optionEat);
            var optionC = optionEat.getComponent("OptionEat");
            optionC.parsePengParams(mOption.getPengTileId());
            this.optionBtnList[index].addChild(optionEat)
            optionEat.setPosition(cc.p(0,0))
        }

        if(index > 0)
        {
            this.optionPass.active = true;
        }


    }

});
