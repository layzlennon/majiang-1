
if cc.sys.isNative
    console.log 'SocketIO'
    window.io = SocketIO
# else
#     console.log 'require socket-io'
#     window.io = require "socket-io"

Global = cc.Class {
    extends: cc.Component,
    statics: {
        ip: "",
        sio: null,
        isPinging: false,
        fnDisconnect: null,
        handlers: {},
        addHandler: (event, fn) ->

            if this.handlers[event]
                console.log "event:" + event + "' handler has been registered."
                return
            
            handler = (data) ->
                if event isnt "disconnect" and typeof data is "string"
                    data = JSON.parse data
                fn data

            this.handlers[event] = handler

            if this.sio
                console.log "register:function " + event
                this.sio.on event, handler

        connect: (fnConnect, fnError) ->
            self = this
            opts = {
                'reconnection': false,
                'force new connection': true,
                'transports': ['websocket', 'polling']
            }

            this.sio = window.io.connect this.ip, opts
            # console.log "sssss: " + JSON.stringify this.sio
            this.sio.on "reconnect", (data) ->
                console.log "reconnect"
            this.sio.on "connect", (data) ->
                console.log "connect" + JSON.stringify data
                self.sio.connected = true
                fnConnect data
            this.sio.on "disconnect", (data) ->
                console.log "disconnect"
                self.sio.connected = false
                self.close()
            this.sio.on "connect_failed", (data) ->
                console.log "connect_failed"
            for key, value of this.handlers
                if typeof value is "function"
                    if key is 'disconnect'
                        this.fnDisconnect = value
                    else
                        console.log "register:function " + key
                        this.sio.on key , value
            
            this.startHearbeat()

        startHearbeat: () ->
            self = this
            this.sio.on 'game_pong', () ->
                console.log 'game_pong'
                self.lastRecieveTime = Date.now()
            this.lastRecieveTime = Date.now()
            console.log "1111111111111"
            if not self.isPinging
                console.log "222222222"
                self.isPinging = true
                callBack = () ->
                    if self.sio
                        console.log "start heart ping"
                        if Date.now() - self.lastRecieveTime > 10000
                            self.close()
                        else
                            self.ping()
                    else
                        console.log "net is disconnnect"
                setInterval callBack, 5000
        send: (event, data) ->
            if this.sio.connected
                if data isnt null and typeof data is "object"
                    data = JSON.stringify data
                
                console.log("sendC2Smsg: " + JSON.stringify(data))
                this.sio.emit event, data
        
        ping: () ->
            this.send 'game_ping'
        sendPlayTile: (tile) ->
            param = {
                action: 'play'
                tile: tile
            }
            this.sendTableCallGet param
        sendTableCallGet: (data) ->
            data['roomId'] = cc.director.TableGlobalData.getRoomId() 
            data['seatId'] = cc.director.TableGlobalData.getSeatId()
            this.send 'table_call_get', data
        close: () ->
            console.log "close"
            if this.sio and this.sio.connected
                this.sio.connected = false
                this.sio.disconnect()
                this.sio = null
            if this.fnDisconnect
                this.fnDisconnect()
                this.fnDisconnect = null
                # this.sio.disconnect()
                this.sio = null
    }
}
