cc.Class {
    extends: cc.Component

    properties: {
        
        _players: null
    }
    init: () ->
        
        this._players = []
        for i in [0...4]
            Player = require "Player"
            player = new Player()
            player.onInit()
            this._players.push player
            player.setIndexPlayer(i)

        self = this
    
        cc.director.GlobalEvent.on "touchPlayTile", (data) ->
            console.log "touchPlayTile" + JSON.stringify data
            localIndex = data.seatId
            playTile = data.tileId
            tilePos = data.tilePos
            isSendTileF = data.isSendTileF
            self._players[localIndex].dropTiles(playTile, tilePos, isSendTileF)
            cc.director.GlobalEvent.emit "play_tile", {
                        seatId: localIndex
                        isSendTileF: isSendTileF
                        tileWorldARPos: data.tileWorldARPos
                        }

        cc.director.GlobalEvent.on "table_call", (data) ->
            msg = data['result']
            console.log "PlayersManager data : " + JSON.stringify data
            if msg["action"] is "init_tiles"
                cc.director.GlobalEvent.emit "game_begin", {}
                # {"cmd":"table_call","result":
                #{"cmd":"init_tiles","header_seat_id":0,"seatId":0,
                #"tiles":[3,19,1,2,11,9,17,2,24,14,8,25,21]}}
                for i in [0...4]
                    localIndex = cc.director.TableGlobalData.getLocalIndex msg['seatId']
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
                #"first_tile":true,
                #"standup_tiles":[1,11,14,17,19,2,2,21,24,25,3,8,9],
                #"peng_tiles":[],"gang_tiles":[],"chi_tiles":[]}}
                localIndex = cc.director.TableGlobalData.getLocalIndex msg['seatId']
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
                    self._players[localIndex].refreshTiles {
                        send_tile: -1
                        }, self
                
                cc.director.GlobalEvent.emit "send_tile", {
                    seatId: localIndex }
        
            if msg['action'] is "table_info"

                console.log "table_info " + JSON.stringify msg
                players = msg['players']
                for i in [0...players.length]
                    player = players[i]
                    localIndex = cc.director.TableGlobalData.getLocalIndex player['seatId']
                    parseMsg = {
                        standup_tiles: player["standup_tiles"],
                        peng_tiles: player['peng_tiles'],
                        gang_tiles: player['gang_tiles'],
                        chi_tiles: player['chi_tiles']
                    }
                    self._players[localIndex].refreshTiles parseMsg, self
                
                cc.director.loadScene "MjGameScene"
                

    refreshMsg: (msg) ->

    update: (dt) ->
        # do your update here
}
