// Generated by CoffeeScript 1.12.5

cc.Class({
    "extends": cc.Component,
    properties: {
        itemTemplate: {
            "default": null,
            type: cc.Node
        },
        gameTypeItemTemplate: {
            "default": null,
            type: cc.Node
        },
        scrollView: {
            "default": null,
            type: cc.ScrollView
        },
        gameTypeScrollView: {
            "default": null,
            type: cc.ScrollView
        },
        spawnCount: 0,
        totalCount: 0,
        spacing: 0,
        bufferZone: 0
    },
    onLoad: function() {
        var data, onCreate, self;
        this.content = this.scrollView.content;
        this.gameTypeContent = this.gameTypeScrollView.content;
        this.msgRuleItems = [];
        this.msgRulesMsg = [];
        this.msgGameTypeItems = [];
        this.gameTypeMainIndex = 0;
        self = this;
        onCreate = function(ret)
        {
            var itemMsg, mainIndex;
            cc.vv.wc.hide();
            if (ret.errcode) {
                return cc.vv.alert.show("提示", "获取房间配置失败");
            } else {
                for (var i = 0; i <  ret.length; i++) {
                    self.msgRulesMsg.push(ret[i]);
                }
                cc.log('this.msgRulesMsg : ' + JSON.stringify(self.msgRulesMsg));
                self.gameTypeListInitialize();
                mainIndex = self.gameTypeMainIndex;
                itemMsg = self.msgRulesMsg[mainIndex]['gamesRuleDetail'];
                self.ruleListInitialize(itemMsg);
            }
        };
        data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign
        };
        cc.vv.wc.show("获取房间配置");
        cc.vv.http.sendRequest("/get_create_table_conf", data, onCreate);
        cc.log("listViewCtrl onLoad");
    },
    gameTypeListInitialize: function() {
        var gameItemComponent, gameTypeItem;
        if (this.msgRulesMsg.length <= 0) {
            return;
        }
        this.gameTypeMainIndex = 0;
        this.gameTypeContent.height = this.msgRulesMsg.length * (this.gameTypeItemTemplate.height + this.spacing) + this.spacing;
        for (var i = 0; i < this.msgRulesMsg.length; i++) {
            gameTypeItem = cc.instantiate(this.gameTypeItemTemplate);
            this.gameTypeContent.addChild(gameTypeItem);
            gameTypeItem.setPosition(0, -gameTypeItem.height * (0.5 + i) - this.spacing * (i + 1));
            gameItemComponent = gameTypeItem.getComponent('gameTypeItem');
            gameItemComponent.show(this.msgRulesMsg[i], i, this);
            this.msgGameTypeItems.push(gameItemComponent)
        }
    },
    ruleListInitialize: function(ruleMsg) {
        var item, itemComponent;
        if (ruleMsg.length <= 0) {
            return;
        }
        cc.log('ruleListInitialize' + JSON.stringify(ruleMsg));
        this.content.removeAllChildren();
        this.msgRuleItems = [];
        this.content.height = ruleMsg.length * (this.itemTemplate.height + this.spacing) + this.spacing;
        for (var i = 0; i <  ruleMsg.length; i++) {
            item = cc.instantiate(this.itemTemplate);
            this.content.addChild(item);
            item.setPosition(-25, -item.height * (0.5 + i) - this.spacing * (i + 1));
            itemComponent = item.getComponent('Item');
            itemComponent.show(ruleMsg[i], i);
            this.msgRuleItems.push(itemComponent)
        }
    },
    gameTypeClickCallBack: function(index) {
        this.gameTypeMainIndex = index;
        this.ruleListInitialize(this.msgRulesMsg[index]['gamesRuleDetail']);
    },
    okButtonCreateGame: function() {
        var conf, configIndex, data,  item,  onCreate,  self;
        self = this;
        onCreate = function(ret) {
            cc.log("create room " + JSON.stringify(ret));
            if (ret.errcode !== 0) {
                cc.vv.wc.hide();
                if (ret.errcode === 222) {
                    return cc.vv.alert.show('提示', '房卡不足,创建房间失败');
                } else {
                    return cc.vv.alert.show('提示', '创建房间失败: ' + ret.errmsg);
                }
            } else {
                return cc.vv.gameNetMgr.connectGameServer(ret);
            }
        };
        conf = [];
        conf.push(this.gameTypeMainIndex);
        for (var i = 0; i < this.msgRuleItems.length; i++) {
            item = this.msgRuleItems[i];
            configIndex = item.getConfigIndex();
            conf.push(configIndex);
        }
        data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            conf: conf
        };
        cc.vv.wc.show("正在创建房间");
        cc.vv.http.sendRequest("/create_private_room", data, onCreate);
    },
    update: function(dt) {}
});

//# sourceMappingURL=CreatePopListViewCtrl.js.map