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
        createRoomPop: {
            default: null,
            type: cc.Node
        },
        joinRoomPop: {
            default: null,
            type: cc.Node
        }

    }

    onLoad: () ->
        # this.addComponent "CreateRoomPop"
        this.addComponent "WaitingConnection"
        this.addComponent "Alert"
        # this.addComponent "JoinRoomNode"
    createRoomClick: () ->
        this.createRoomPop.active = true
    joinRoomClick: () ->
        this.joinRoomPop.active = true
    update: (dt) ->
        # do your update here
        if cc.vv && cc.vv.userMgr.roomData
            cc.vv.userMgr.enterRoom cc.vv.userMgr.roomData
            cc.vv.userMgr.roomData = null
}
