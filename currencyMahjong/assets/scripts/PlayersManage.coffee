cc.Class {
    extends: cc.Component

    properties: {
        
        _players: null
    }
    onLoad: () ->
        cc.vv.playersManager = this
        this._players = []
        for i in [0...4]
            Player = require "Player"
            player = new Player()
            player.onInit()
            this._players.push player
            player.setIndexPlayer(i)

        self = this
        this.node.on "table_call", (data) ->
            msg = data.detail['result']
            console.log "PlayersManager data : " + JSON.stringify data.detail
            if msg["action"] is "init_tiles"
                # {"cmd":"table_call","result":
                #{"cmd":"init_tiles","header_seat_id":0,"seatId":0,
                #"tiles":[3,19,1,2,11,9,17,2,24,14,8,25,21]}}
                for i in [0...4]
                    localIndex = cc.vv.gameNetMgr.getLocalIndex msg['seatId']
                    if i == parseInt localIndex
                    
                        self._players[i].refreshTiles  {
                            standup_tiles: msg["tiles"]
                            }, self
                    else
                        localIndex = i
                        tiles =
                        [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
                        self._players[i].refreshTiles {
                            standup_tiles: tiles
                            } , self
                    console.log "localIndex : " + i
                    cc.director.GlobalEvent.emit "stand_tiles", {
                        seatId: i
                        }
            if msg['action'] is "send_tile"
                # {"action":"send_tile","seatId":0,
                #"tile":12,"remained_count":83,
                #"standup_tiles":[1,11,14,17,19,2,2,21,24,25,3,8,9],
                #"peng_tiles":[],"gang_tiles":[],"chi_tiles":[]}}
                localIndex = cc.vv.gameNetMgr.getLocalIndex msg['seatId']
                if msg["tile"] and msg["tile"] > 0

                    parseMsg = {
                        standup_tiles: msg["tiles"],
                        send_tile: msg["tile"],
                        peng_tiles: msg['peng_tiles'],
                        gang_tiles: msg['gang_tiles'],
                        chi_tiles: msg['chi_tiles']
                    }
                    
                    self._players[localIndex].refreshTiles parseMsg, self

                else
                    self._players[localIndex].refreshTiles { send_tile: -1 }, self
                
                cc.director.GlobalEvent.emit "send_tile", {
                    seatId: localIndex }
    refreshMsg: (msg) ->

    update: (dt) ->
        # do your update here
}
