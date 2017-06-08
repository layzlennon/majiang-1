cc.Class {
    extends: cc.Component

    properties: {
        itemTemplate: {
            default: null,
            type: cc.Node
        },
        gameTypeItemTemplate: {
            default: null,
            type: cc.Node
        },
        scrollView: {
            default: null,
            type: cc.ScrollView
        },
        gameTypeScrollView: {
            default: null,
            type: cc.ScrollView
        },
        spawnCount: 0,
        totalCount: 0,
        spacing: 0,
        bufferZone: 0,

    }
    onLoad: () ->
        this.content = this.scrollView.content
        this.gameTypeContent = this.gameTypeScrollView.content

        this.msgRuleItems = []
        this.msgRulesMsg = []
        this.msgGameTypeItems = []
        this.gameTypeMainIndex = 0
        self = this
        onCreate = (ret) ->
            cc.vv.wc.hide()
            if ret.errcode
                cc.vv.alert.show "提示", "获取房间配置失败"
            else
                for i in [0...ret.length]
                    self.msgRulesMsg.push ret[i]
                cc.log 'this.msgRulesMsg : ' + JSON.stringify self.msgRulesMsg
                self.gameTypeListInitialize()
                mainIndex = self.gameTypeMainIndex
                itemMsg = self.msgRulesMsg[mainIndex]['gamesRuleDetail']
                self.ruleListInitialize itemMsg
                    
                  
        data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign
        }
        cc.vv.wc.show "获取房间配置"
        cc.vv.http.sendRequest "/get_create_table_conf", data, onCreate

        cc.log "listViewCtrl onLoad"
        # this.initialize()
    gameTypeListInitialize: () ->
        if this.msgRulesMsg.length <= 0
            return
        this.gameTypeMainIndex = 0
        this.gameTypeContent.height = this.msgRulesMsg.length *
        (this.gameTypeItemTemplate.height + this.spacing) + this.spacing
        for i in [0...this.msgRulesMsg.length]
            gameTypeItem = cc.instantiate this.gameTypeItemTemplate
            this.gameTypeContent.addChild gameTypeItem
            gameTypeItem.setPosition 0, -gameTypeItem.height *
                (0.5 + i) - this.spacing * (i + 1)

            gameItemComponent = gameTypeItem.getComponent 'gameTypeItem'
            gameItemComponent.show(this.msgRulesMsg[i], i, this)
            this.msgGameTypeItems.push gameItemComponent
    
    ruleListInitialize: (ruleMsg) ->
        if ruleMsg.length <= 0
            return
        cc.log 'ruleListInitialize' + JSON.stringify ruleMsg
        
        this.content.removeAllChildren()
        this.msgRuleItems = []
        this.content.height = ruleMsg.length *
        (this.itemTemplate.height + this.spacing) + this.spacing
        for i in [0...ruleMsg.length]
            item = cc.instantiate this.itemTemplate
            this.content.addChild item
            item.setPosition -25, -item.height *
                (0.5 + i) - this.spacing * (i + 1)
            itemComponent = item.getComponent 'Item'
            itemComponent.show(ruleMsg[i], i)
            
            this.msgRuleItems.push itemComponent
    gameTypeClickCallBack: (index) ->

        this.gameTypeMainIndex = index
        this.ruleListInitialize this.msgRulesMsg[index]['gamesRuleDetail']

    okButtonCreateGame: () ->
        self = this
        onCreate = (ret) ->
            cc.log "create room " + JSON.stringify ret

            if ret.errcode isnt 0
                cc.vv.wc.hide()
                if ret.errcode is 222
                    cc.vv.alert.show '提示', '房卡不足,创建房间失败'
                else
                    cc.vv.alert.show '提示', '创建房间失败: ' + ret.errmsg
            else
                cc.vv.gameNetMgr.connectGameServer ret
                    

        conf = []
        conf.push this.gameTypeMainIndex
        for i in [0...this.msgRuleItems.length]
            item = this.msgRuleItems[i]
            configIndex = item.getConfigIndex()
            conf.push configIndex

        data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            conf: conf
        }
        cc.vv.wc.show "正在创建房间"
        cc.vv.http.sendRequest "/create_private_room", data, onCreate
    update: (dt) ->
        # do your update here
}
