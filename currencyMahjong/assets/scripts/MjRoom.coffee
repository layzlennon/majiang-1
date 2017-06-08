cc.Class {
    extends: cc.Component

    properties: {
        tableNoLabel: null,
        _timeLabel: null,
        _seatsData: null,
        _seats: [],
        _lastMinute: null,


    }

    onLoad: () ->
        
        this.initView()
        this.initEventHandlers()
        this.initSeats()
    initSeats: () ->
        seats = cc.vv.gameNetMgr.seats
        for i in [0...this._seatsData.length]
            if seats[i].userid > 0
                this.initSingleSeat seats[i]

    initSingleSeat: (seat) ->
        index = cc.vv.gameNetMgr.getLocalIndex seat.seatindex
        this._seats[index].setInfo seat

    initView: () ->
        this._seatsData = cc.vv.gameNetMgr.seats
        seatReady = this.node.getChildByName "SeatReady"
        seats = seatReady.getChildByName "Seats"
        for i in [0...seats.children.length]
            seatComponent = seats.children[i].getComponent("Seat")
            this._seats.push seatComponent
        
        component = cc.find "Canvas/HeadTileInfo/TableNoLabel"
        this.tableNoLabel = component.getComponent cc.Label
        this.tableNoLabel.string = "房间: " + cc.vv.gameNetMgr.roomId
        component = cc.find "Canvas/HeadTileInfo/TimeLabel"
        this._timeLabel = component.getComponent cc.Label

        weiXinInvate = cc.find "Canvas/WeiXinInvate"
        if weiXinInvate
            cc.vv.utils.addClickEvent weiXinInvate,
                this.node, "MjRoom", "onBtnWeichatClicked"
        
        readyButton = cc.find "Canvas/ReadyButton"
        if readyButton
            cc.vv.utils.addClickEvent readyButton,
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
        

    onBtnExitClicked: () -> #退出房间
        if cc.vv.gameNetMgr.isHostUser()
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
