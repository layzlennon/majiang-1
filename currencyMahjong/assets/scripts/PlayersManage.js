// Generated by CoffeeScript 1.12.5
cc.Class({
    "extends": cc.Component,
    properties: {
        _players: null
    },
    init: function() {
        var Player, i, j, player, self;
        this._players = [];
        for (i = j = 0; j < 4; i = ++j) {
            Player = require("Player");
            player = new Player();
            player.onInit();
            this._players.push(player);
            player.setIndexPlayer(i);
        }
        self = this;
        cc.director.GlobalEvent.on("touchPlayTile", function(data) {
            var isSendTileF, localIndex, playTile, tilePos;
            console.log("touchPlayTile" + JSON.stringify(data));
            localIndex = data.seatId;
            playTile = data.tileId;
            tilePos = data.tilePos;
            isSendTileF = data.isSendTileF;
            self._players[localIndex].dropTiles(playTile, tilePos, isSendTileF);
            cc.director.GlobalEvent.emit("play_tile", {
                seatId: localIndex,
                isSendTileF: isSendTileF,
                tileWorldARPos: data.tileWorldARPos
            });
        });
        cc.director.GlobalEvent.on("table_call", function(data) {
            var k, l, localIndex, msg, parseMsg, players, ref, tiles;
            msg = data['result'];
            console.log("PlayersManager data : " + JSON.stringify(data));
            if (msg["action"] === "init_tiles") {
                cc.director.GlobalEvent.emit("game_begin", {});
                for (i = k = 0; k < 4; i = ++k) {
                    localIndex = cc.director.TableGlobalData.getLocalIndex(msg['seatId']);
                    if (i === parseInt(localIndex)) {
                        self._players[i].refreshTiles({
                            standup_tiles: msg["tiles"]
                        }, self);
                    } else {
                        localIndex = i;
                        tiles = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
                        self._players[i].refreshTiles({
                            standup_tiles: tiles
                        }, self);
                    }
                    console.log("localIndex : " + i);
                    cc.director.GlobalEvent.emit("stand_tiles", {
                        seatId: i
                    });
                }
            }
            else if (msg['action'] === "send_tile") {
                localIndex = cc.director.TableGlobalData.getLocalIndex(msg['seatId']);
                if (msg["tile"] && msg["tile"] > 0) {
                    parseMsg = {
                        standup_tiles: msg["tiles"],
                        send_tile: msg["tile"],
                        peng_tiles: msg['peng_tiles'],
                        gang_tiles: msg['gang_tiles'],
                        chi_tiles: msg['chi_tiles']
                    };
                    self._players[localIndex].refreshTiles(parseMsg, self);
                } else {
                    self._players[localIndex].refreshTiles({
                        send_tile: -1
                    }, self);
                }
                cc.director.GlobalEvent.emit("send_tile", {
                    seatId: localIndex
                });
            }
            else if (msg['action'] === "table_info") {
                console.log("table_info " + JSON.stringify(msg));
                players = msg['players'];
                for (i = l = 0, ref = players.length; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
                    player = players[i];
                    localIndex = cc.director.TableGlobalData.getLocalIndex(player['seatId']);
                    parseMsg = {
                        standup_tiles: player["standup_tiles"],
                        peng_tiles: player['peng_tiles'],
                        gang_tiles: player['gang_tiles'],
                        chi_tiles: player['chi_tiles']
                    };
                    self._players[localIndex].refreshTiles(parseMsg, self);
                }
                cc.director.loadScene("MjGameScene");
            }
            else if (msg['action'] === "play")
            {
                var localIndex = cc.director.TableGlobalData.getLocalIndex(msg['seatId']);
                var playTile = msg['tile'];
                self._players[localIndex].dropTiles(playTile, cc.p(0,0), true);

                cc.director.GlobalEvent.emit("play", {
                    seatId: localIndex
                });
            }
        });
    },
    refreshMsg: function(msg) {},
    update: function(dt) {}
});
