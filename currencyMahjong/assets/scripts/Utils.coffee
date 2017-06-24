cc.Class {
    extends: cc.Component

    properties: {
    
    }

    addClickEvent: (node, target, component, handler) ->
        eventHandler = new cc.Component.EventHandler
        eventHandler.target = target
        eventHandler.component = component
        eventHandler.handler = handler
        clickEvents = node.getComponent(cc.Button).clickEvents
        clickEvents.push eventHandler
    addSlideEvent: (node, target, component, handler) ->
        eventHandler = new cc.Component.EventHandler()
        eventHandler.target = target
        eventHandler.component = component
        eventHandler.handler = handler

        slideEvents = node.getComponent(cc.Slider).slideEvents
        slideEvents.push eventHandler

    runSendTileAction: (tileNode) ->
        pos = tileNode.getPosition()
        tileNode.setPosition(cc.pAdd(pos,cc.p(0, 20)))
        actMove = cc.moveTo(0.5,pos)
        tileNode.runAction(cc.EaseElasticOut.create(actMove, 0.2))
    update: (dt) ->
        # do your update here
}
