cc.Class({
    extends: cc.Component,
    properties: {
    
    },
    addClickEvent:function(node, target, component, handler){
        var eventHandler = new cc.Component.EventHandler
        eventHandler.target = target
        eventHandler.component = component
        eventHandler.handler = handler
        var clickEvents = node.getComponent(cc.Button).clickEvents
        clickEvents.push(eventHandler)
    },
    addSlideEvent:function(node, target, component, handler)
    {
        var eventHandler = new cc.Component.EventHandler()
        eventHandler.target = target
        eventHandler.component = component
        eventHandler.handler = handler

        var slideEvents = node.getComponent(cc.Slider).slideEvents
        slideEvents.push(eventHandler)
    },
    runSendTileAction:function(tileNode)
    {
        var pos = tileNode.getPosition()
        tileNode.setPosition(cc.pAdd(pos, cc.p(0, 20)))
        var actMove = cc.moveTo(0.5, pos)
        tileNode.runAction(cc.EaseElasticOut.create(actMove, 0.2))
    },

    tilesSortNumber:function(a, b){
        return b - a

    },
    //或许当前时分秒
    getNowTimeHM:function ()
    {
        var date = new Date();
        var h = date.getHours();
        if (h < 10) {
            h = "0" + h;
        }
        var m = date.getMinutes();
        if (m < 10) {
            m = "0" + m;
        }
        else {
            m = m;
        }
        return {hours:h,minutes:m}
    }
});
