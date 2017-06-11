cc.Class {
    extends: cc.Component

    properties: {
        nums: {
          default: [],
          type: [cc.Label]
        }
        _inputIndex: 0,

    }
    onResetClicked: () ->
        for i in [0...this.nums.length]
            this.nums[i].string = " "
        this._inputIndex = 0
    onDelClicked: () ->
        if this._inputIndex > 0
            this._inputIndex -= 1
            this.nums[this._inputIndex].string = ""
    onCloseClicked: () ->
        this.node.active = false

    onInput: (num) ->
        if this._inputIndex >= this.nums.length
            return
        this.nums[this._inputIndex].string = num
        this._inputIndex += 1
        if this._inputIndex is this.nums.length
            roomId = this.parseRoomID()
            console.log("roomID: " + roomId)
            this.onInputFinished roomId
    
    onInputFinished: (roomId) ->
        self = this
        cc.vv.userMgr.enterRoom(roomId, (ret) ->
            if ret.errcode is 0
                self.node.active = false
            else
                content = "房间[" + roomId + "]不存在，请重新输入!"
                if ret.errcode is 1
                    content = "房间[" + roomId + "]已满!"
                cc.vv.alert.show "提示", content
                self.onResetClicked()
            )
    parseRoomID: () ->
        str = ""
        for i in [0...this.nums.length]
            str += this.nums[i].string
        return str
    onN0Clicked: () ->
        this.onInput 0
    onN1Clicked: () ->
        this.onInput 1
    onN2Clicked: () ->
        this.onInput 2
    onN3Clicked: () ->
        this.onInput 3
    onN4Clicked: () ->
        this.onInput 4
    onN5Clicked: () ->
        this.onInput 5
    onN6Clicked: () ->
        this.onInput 6
    onN7Clicked: () ->
        this.onInput 7
    onN8Clicked: () ->
        this.onInput 8
    onN9Clicked: () ->
        this.onInput 9
    update: (dt) ->
        # do your update here
}
