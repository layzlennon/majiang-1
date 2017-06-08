String.prototype.format = (args) ->
    if arguments.length
        result = this
        if arguments.length == 1 and typeof(args) is "object"
            for key in args
                reg = new RegExp "({"+key+"})", "g"
                result = result.replace reg, args[key]
        else
            for i in [0...arguments.length]
                if arguments[i] is undefined
                    return ""
                else
                    reg = new RegExp "({"+key+"})", "g"
                    result = result.replace reg, arguments[i]
        return result
    else
        return this



cc.Class {
    extends: cc.Component

    properties: {
        # foo:
        # default: null
        # The default value will
        # be used only when the component attaching
        #   to a node for the first time
        #   type: cc
        #   serializable: true # [optional], default is true
        #   visible: true      # [optional], default is true
        #   displayName: 'Foo' # [optional], default is property name
        #   readonly: false    # [optional], default is false
        _mima: null,
        _mimaIndex: 0,
    }
    onLoad: () ->
        if not cc.vv
            cc.director.loadScene "Loading"
            return
        # cc.vv.net.addHandler
        this.addComponent "WaitingConnection"
        cc.vv.audioMgr.playBGM "bgMain.mp3"
    update: (dt) ->
        # do your update here
    onBtnQuickStartClicked: () ->
        cc.vv.userMgr.guestAuth()

}
