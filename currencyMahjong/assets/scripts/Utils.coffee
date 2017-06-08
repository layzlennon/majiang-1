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
    update: (dt) ->
        # do your update here
}
