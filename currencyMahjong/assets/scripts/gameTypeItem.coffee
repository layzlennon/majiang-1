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
         ItemBG: {
            default: null,
            type: cc.Button
        },
        ItemLabel: {
            default: null,
            type: cc.Label
        }
    }
    onLoad: () ->
        this.mainIndex = 0
        this.pObj = null


    show: (msg, index, pObj) ->
        this.mainIndex = index
        this.pObj = pObj
        cc.log 'gameTypeItem' + JSON.stringify msg
        this.node.active = true
        this.ItemLabel.string = msg['gamesTypeName']
    buttonOkCallBack: () ->
        this.pObj.gameTypeClickCallBack this.mainIndex
    update: (dt) ->
        # do your update here
}
