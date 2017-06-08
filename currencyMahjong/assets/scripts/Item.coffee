cc.Class {
    extends: cc.Component

    properties: {
        # foo:
        #   default: null      # The default value will be used only when the component attaching
        #                        to a node for the first time
        #   type: cc
        #   serializable: true # [optional], default is true
        #   visible: true      # [optional], default is true
        #   displayName: 'Foo' # [optional], default is property name
        #   readonly: false    # [optional], default is false
        ruleTypeLabel: {
            default: null,
            type: cc.Label
        },
        btnItem1: {
            default: null,
            type: cc.Button
        },
        btnItem2: {
            default: null,
            type: cc.Button
        },
        btnItem3: {
            default: null,
            type: cc.Button
        },
        ruleLabel1: {
            default: null,
            type: cc.Label
        },
        ruleLabel2: {
            default: null,
            type: cc.Label
        },
        ruleLabel3: {
            default: null,
            type: cc.Label
        },
        sprite: {
            default: null,
            type: cc.SpriteFrame
        },
        checkedSprite: {
            default: null,
            type: cc.SpriteFrame
        }

    }
    onLoad: () ->
        this.index = 0
        this.msgRuleOne = null


    btnCheck1: () ->
        cc.log "btnCheck1...."
        # this.btnItem1.node.active = false
        targetSprite = this.btnItem1.getComponent cc.Sprite
        targetSprite.spriteFrame = this.checkedSprite

        targetSprite = this.btnItem2.getComponent cc.Sprite
        targetSprite.spriteFrame = this.sprite

        targetSprite = this.btnItem3.getComponent cc.Sprite
        targetSprite.spriteFrame = this.sprite
        this.msgRuleOne['default'] = 1
    btnCheck2: () ->
        targetSprite = this.btnItem2.getComponent cc.Sprite
        targetSprite.spriteFrame = this.checkedSprite

        targetSprite = this.btnItem1.getComponent cc.Sprite
        targetSprite.spriteFrame = this.sprite

        targetSprite = this.btnItem3.getComponent cc.Sprite
        targetSprite.spriteFrame = this.sprite
        this.msgRuleOne['default'] = 2
    btnCheck3: () ->

        targetSprite = this.btnItem3.getComponent cc.Sprite
        targetSprite.spriteFrame = this.checkedSprite

        targetSprite = this.btnItem2.getComponent cc.Sprite
        targetSprite.spriteFrame = this.sprite

        targetSprite = this.btnItem1.getComponent cc.Sprite
        targetSprite.spriteFrame = this.sprite
        this.msgRuleOne['default'] = 3
    show: (msg, index) ->
        this.index = index
        this.node.active = true
        this.msgRuleOne = msg

        this.ruleTypeLabel.string = msg['ruleName']
        this.btnItem1.node.active = false
        this.btnItem2.node.active = false
        this.btnItem3.node.active = false
        for i in [0...msg['detail'].length]
            if i is 0
                this.ruleLabel1.string = msg['detail'][i]
                this.btnItem1.node.active = true
            if i is 1
                this.ruleLabel2.string = msg['detail'][i]
                this.btnItem2.node.active = true
            if i is 2
                this.ruleLabel3.string = msg['detail'][i]
                this.btnItem3.node.active = true
        if Number msg['default'] == 1
            this.btnCheck1()
        else if Number msg['default'] == 2
            this.btnCheck2()
        else
            this.btnCheck3()
            
        cc.log 'show msg ' + JSON.stringify msg

    getConfigIndex: () ->
        return this.msgRuleOne['default']
        # do your update here
}
