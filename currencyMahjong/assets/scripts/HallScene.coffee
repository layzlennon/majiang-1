cc.Class {
    extends: cc.Component

    properties: {

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
