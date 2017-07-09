cc.Class {
    extends: cc.Component

    properties: {
        tableNoLabel: null,
        _timeLabel: null,
        _seatsData: null,
        _seats: [],
        _lastMinute: null,
        _ownSeat: null,
        _weiXinInvate: null,
        _readyButton: null,

    }

    onLoad: () ->
        
        this.initView()
        this.initEventHandlers()
        this.initSeats()

    initSeats: () ->
        
        for i in [0...this._seatsData.length]
            seatData = this._seatsData[i]
            if seatData.userid > 0
                this.initSingleSeat seatData

    initSingleSeat: (seat) ->
        index = cc.director.TableGlobalData.getLocalIndex seat.seatindex

        cc.vv.playersManager._players[index].refreshBaseInfo seat
        
        this._seats[index].setInfo seat

        if index is 0
            if seat.ready
                this._weiXinInvate.active = true
                this._readyButton.active = false
            else
                this._weiXinInvate.active = false
                this._readyButton.active = true

    initView: () ->

        this._seatsData = cc.director.TableGlobalData.getSeats()
        seatReady = this.node.getChildByName "SeatReady"
        seatsNode = seatReady.getChildByName "Seats"

        for i in [0...seatsNode.children.length]
            seatComponent = seatsNode.children[i].getComponent("Seat")
            this._seats.push seatComponent
        
        component = cc.find "Canvas/HeadTileInfo/TableNoLabel"
        this.tableNoLabel = component.getComponent cc.Label
        this.tableNoLabel.string = "房间: " + cc.director.TableGlobalData.getRoomId()
        component = cc.find "Canvas/HeadTileInfo/TimeLabel"
        this._timeLabel = component.getComponent cc.Label

        this._weiXinInvate = cc.find "Canvas/SeatReady/WeiXinInvate"
        if this._weiXinInvate
            cc.vv.utils.addClickEvent this._weiXinInvate,
                this.node, "MjRoom", "onBtnWeichatClicked"
        
        this._readyButton = cc.find "Canvas/SeatReady/ReadyButton"
        if this._readyButton
            cc.vv.utils.addClickEvent this._readyButton,
                this.node, "MjRoom", "onBtnReadyClicked"
        
        quitButton = cc.find "Canvas/HeadTileInfo/QuitButton"
        if quitButton
                cc.vv.utils.addClickEvent quitButton,
                    this.node, "MjRoom", "onBtnExitClicked"
                
    initEventHandlers: () ->
        self = this
        this.node.on 'new_user', (data) ->
            console.log "new_user : " + JSON.stringify data.detail
            self.initSingleSeat data.detail
            
        this.node.on 'user_state_changed', (data) ->
            console.log "user_state_changed : " + JSON.stringify data.detail
            self.initSingleSeat data.detail
        
    onBtnExitClicked: () -> #退出房间
        if cc.director.TableGlobalData.isHostUser()
            this.onBtnDissolve()
        else
            cc.vv.net.send "exit"
            
    onBtnDissolve: () ->
        fn = () ->
            cc.vv.net.send "dispress"
        cc.vv.alert.show "解散房间", "解散房间不扣房卡，是否确定解散？", fn , true
    onBtnWeichatClicked: () ->
        #cc.vv.anysdkMgr.share("达达麻将" + title,
        #"房号:" + cc.vv.gameNetMgr.roomId + " 玩法:" +
        #cc.vv.gameNetMgr.getWanfa());
    onBtnReadyClicked: () ->
        cc.vv.net.send "ready"
    update: (dt) ->
        # do your update here
        minutes = Date.now() / 1000 / 60
        minutes = Math.floor minutes
        if this._lastMinute != minutes
            this._lastMinute = minutes
            date = new Date()
            h = date.getHours()
            if h < 10
                h = "0" + h
            else
                h
            m = date.getMinutes()
            if m < 10
               m = "0" + m
            else
                m = m
            this._timeLabel.string = "" + h + ":" + m
}
