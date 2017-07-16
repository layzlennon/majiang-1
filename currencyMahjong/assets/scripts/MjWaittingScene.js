cc.Class({
    extends: cc.Component,

    properties: {
        _tableNoLabel: null,
        _timeLabel: null,
        _seatsData: null,
        _seats: [],
        _lastMinute: null,
        _ownSeat: null,
        _weiXinInvate: null,
        _readyButton: null
    },
    onLoad: function ()
    {
        console.log("mjWaittingScene onLoad: ");
        this.initView();
        this.initEventHandlers();
        this.initSeats();
    },
    initView:function () {

        this._seatsData = cc.director.TableGlobalData.getSeats();
        var seatReady = this.node.getChildByName("SeatReady");
        var seatsNode = seatReady.getChildByName("Seats");
        for (var i = 0; i < seatsNode.children.length; i++) {
            var seatComponent = seatsNode.children[i].getComponent("Seat");
            this._seats.push(seatComponent);
        }
        var component = cc.find("Canvas/TableNoLabel");
        this._tableNoLabel = component.getComponent(cc.Label);
        this._tableNoLabel.string = "房间: " + cc.director.TableGlobalData.getRoomId();
        component = cc.find("Canvas/HeadTileInfo/TimeLabel");
        this._timeLabel = component.getComponent(cc.Label);
        this._weiXinInvate = cc.find("Canvas/SeatReady/WeiXinInvate");
        if (this._weiXinInvate) {
            cc.vv.utils.addClickEvent(this._weiXinInvate, this.node, "MjWaittingScene", "onBtnWeichatClicked");
        }
        this._readyButton = cc.find("Canvas/SeatReady/ReadyButton");
        if (this._readyButton) {
            cc.vv.utils.addClickEvent(this._readyButton, this.node, "MjWaittingScene", "onBtnReadyClicked");
        }
        var quitButton = cc.find("Canvas/HeadTileInfo/QuitButton");
        if (quitButton) {
            cc.vv.utils.addClickEvent(quitButton, this.node, "MjWaittingScene", "onBtnExitClicked");
        }
    },
    initEventHandlers: function()
    {
        cc.vv.gameNetMgr.dataEventHandler = this.node;
        var self = this;
        this.node.on('new_user', function(data) {
            console.log("new_user : " + JSON.stringify(data.detail));
            self.initSingleSeat(data.detail);
        });
        this.node.on('user_state_changed', function(data) {
            console.log("user_state_changed : " + JSON.stringify(data.detail));
            self.initSingleSeat(data.detail);
        });
    },
    initSingleSeat: function(seat) {
        var index;
        index = cc.director.TableGlobalData.getLocalIndex(seat.seatindex);
        cc.vv.playersManager._players[index].refreshBaseInfo(seat);
        this._seats[index].setInfo(seat);
        if (index === 0) {
            if (seat.ready) {
                this._weiXinInvate.active = true;
                this._readyButton.active = false;
            } else {
                this._weiXinInvate.active = false;
                this._readyButton.active = true;
            }
        }
    },
    initSeats: function() {
        for (var i =  0; i < this._seatsData.length; i++) {
            var seatData = this._seatsData[i];
            if (seatData.userid > 0)
            {
                this.initSingleSeat(seatData);

            }
        }
    },
    onBtnWeichatClicked: function() {

    },
    onBtnReadyClicked: function() {
        cc.vv.net.send("ready");
    },
    onBtnExitClicked: function() {
        if (cc.director.TableGlobalData.isHostUser()) {
            return this.onBtnDissolve();
        } else {
            return cc.vv.net.send("exit");
        }
    },
    onBtnDissolve: function() {
        var fn = function()
        {
            cc.vv.net.send("dispress");
        };
        cc.vv.alert.show("解散房间", "解散房间不扣房卡，是否确定解散？", fn, true);
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var minutes = Date.now() / 1000 / 60;
        var minutes = Math.floor(minutes);
        if (this._lastMinute !== minutes) {
            this._lastMinute = minutes;
            var localTime = cc.vv.utils.getNowTimeHM();
            this._timeLabel.string = "" + localTime["hours"] + ":" + localTime["minutes"];
        }
    }
});
