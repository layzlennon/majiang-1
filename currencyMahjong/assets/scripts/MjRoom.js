// Generated by CoffeeScript 1.12.5
cc.Class({
    "extends": cc.Component,
    properties: {
        tableNoLabel: null,
        _timeLabel: null,
        _seatsData: null,
        _seats: [],
        _lastMinute: null,
        _ownSeat: null,
        _weiXinInvate: null,
        _readyButton: null
    },
    onLoad: function() {
        this.initView();
        this.initEventHandlers();
        this.initSeats();
    },
    initSeats: function() {
        var i, j, ref, results, seatData;
        results = [];
        for (i = j = 0, ref = this._seatsData.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
            seatData = this._seatsData[i];
            if (seatData.userid > 0) {
                results.push(this.initSingleSeat(seatData));
            } else {
                results.push(void 0);
            }
        }
        return results;
    },
    initSingleSeat: function(seat) {
        var index;
        index = cc.director.TableGlobalData.getLocalIndex(seat.seatindex);
        cc.vv.playersManager._players[index].refreshBaseInfo(seat);
        this._seats[index].setInfo(seat);
        if (index === 0) {
            if (seat.ready) {
                this._weiXinInvate.active = true;
                return this._readyButton.active = false;
            } else {
                this._weiXinInvate.active = false;
                return this._readyButton.active = true;
            }
        }
    },
    initView: function() {
        var component, quitButton, seatComponent, seatReady, seatsNode;
        this._seatsData = cc.director.TableGlobalData.getSeats();
        seatReady = this.node.getChildByName("SeatReady");
        seatsNode = seatReady.getChildByName("Seats");
        for (var i = 0; i < seatsNode.children.length; i++) {
            seatComponent = seatsNode.children[i].getComponent("Seat");
            this._seats.push(seatComponent);
        }
        component = cc.find("Canvas/HeadTileInfo/TableNoLabel");
        this.tableNoLabel = component.getComponent(cc.Label);
        this.tableNoLabel.string = "房间: " + cc.director.TableGlobalData.getRoomId();
        component = cc.find("Canvas/HeadTileInfo/TimeLabel");
        this._timeLabel = component.getComponent(cc.Label);
        this._weiXinInvate = cc.find("Canvas/SeatReady/WeiXinInvate");
        if (this._weiXinInvate) {
            cc.vv.utils.addClickEvent(this._weiXinInvate, this.node, "MjRoom", "onBtnWeichatClicked");
        }
        this._readyButton = cc.find("Canvas/SeatReady/ReadyButton");
        if (this._readyButton) {
            cc.vv.utils.addClickEvent(this._readyButton, this.node, "MjRoom", "onBtnReadyClicked");
        }
        quitButton = cc.find("Canvas/HeadTileInfo/QuitButton");
        if (quitButton) {
            return cc.vv.utils.addClickEvent(quitButton, this.node, "MjRoom", "onBtnExitClicked");
        }
    },
    initEventHandlers: function() {
        var self;
        self = this;
        this.node.on('new_user', function(data) {
            console.log("new_user : " + JSON.stringify(data.detail));
            return self.initSingleSeat(data.detail);
        });
        return this.node.on('user_state_changed', function(data) {
            console.log("user_state_changed : " + JSON.stringify(data.detail));
            return self.initSingleSeat(data.detail);
        });
    },
    onBtnExitClicked: function() {
        if (cc.director.TableGlobalData.isHostUser()) {
            return this.onBtnDissolve();
        } else {
            return cc.vv.net.send("exit");
        }
    },
    onBtnDissolve: function() {
        var fn;
        fn = function() {
            return cc.vv.net.send("dispress");
        };
        return cc.vv.alert.show("解散房间", "解散房间不扣房卡，是否确定解散？", fn, true);
    },
    onBtnWeichatClicked: function() {},
    onBtnReadyClicked: function() {
        return cc.vv.net.send("ready");
    },
    update: function(dt) {
        var minutes = Date.now() / 1000 / 60;
        var minutes = Math.floor(minutes);
        if (this._lastMinute !== minutes) {
            this._lastMinute = minutes;
            var localTime = cc.vv.utils.getNowTimeHM();
            this._timeLabel.string = "" + localTime["hours"] + ":" + localTime["minutes"];
        }
    }
});


//# sourceMappingURL=MjRoom.js.map
