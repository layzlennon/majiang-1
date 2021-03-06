/**
 * Created by sml on 2017/5/30.
 */
var crypto = require("../utils/crypto");
var db = require("../utils/db");
var app = require("express")();
var server = require('http').Server(app);
var io = require("socket.io")(server);

var tokenMgr = require('./tokenmgr');
var roomMgr = require("./roommgr");
var userMgr = require("./usermgr");

exports.start = function(config) {

    io.on('connection',function (socket)
    {
        console.log("connection ....123456789")
        socket.emit('connection_ok',{errcode:0});
        socket.on('login',function (data)
        {
            data = JSON.parse(data);
            if(socket.userId != null)
            {
                return;
            }

            var token = data.token;
            var roomId = data.roomid;
            var time = data.time;
            var sign = data.sign;

            console.log(roomId);
            console.log(token);
            console.log(time);
            console.log(sign);

            if(token == null || roomId == null || sign == null || time == null){
                console.log(1);
                socket.emit('login_result',{errcode:1,errmsg:"invalid parameters 5"});
                return;
            }

            var md5 = crypto.md5(roomId + token + time + config.ROOM_PRI_KEY);
            if(md5 != sign){
                console.log(2);
                socket.emit('login_result',{errcode:2,errmsg:"login failed. invalid sign!"});
                return;
            }

            if(tokenMgr.isTokenValid(token)==false){
                console.log(3);
                socket.emit('login_result',{errcode:3,errmsg:"token out of time."});
                return;
            }

            var userId = tokenMgr.getUserID(token);
            var roomId = roomMgr.getUserRoom(userId);

            userMgr.bind(userId,socket);
            socket.userId = userId;

            var roomInfo = roomMgr.getRoom(roomId);

            var seatIndex = roomMgr.getUserSeat(userId);
            roomInfo.seats[seatIndex].ip = socket.handshake.address;

            var userData = null;
            var seats = [];
            for(var i = 0; i < roomInfo.seats.length; ++i){
                var rs = roomInfo.seats[i];
                var online = false;
                if(rs.userId > 0){
                    online = userMgr.isOnline(rs.userId);
                }

                seats.push({
                    userid:rs.userId,
                    ip:rs.ip,
                    score:rs.score,
                    name:rs.name,
                    online:online,
                    ready:rs.ready,
                    seatindex:i
                });

                if(userId == rs.userId){
                    userData = seats[i];
                }
            }

            //通知前端
            var ret = {
                errcode:0,
                errmsg:"ok",
                data:{
                    roomid:roomInfo.id,
                    conf:roomInfo.conf,
                    numofgames:roomInfo.numOfGames,
                    seats:seats
                }
            };
            socket.emit('login_result',ret);
            userMgr.broacastInRoom('new_user_comes_push',userData,userId);

            //socket.gameMgr = roomInfo.gameMgr;

            //玩家上线，强制设置为TRUE
            //socket.gameMgr.setReady(userId);


            socket.emit('login_finished');

            if(roomInfo.dr != null){
                var dr = roomInfo.dr;
                var ramaingTime = (dr.endTime - Date.now()) / 1000;
                var data = {
                    time:ramaingTime,
                    states:dr.states
                }
                userMgr.sendMsg(userId,'dissolve_notice_push',data);
            }
        });

        socket.on('disconnect',function(data){
            var userId = socket.userId;
            if(!userId){
                return;
            }
            var data = {
                userid:userId,
                online:false
            };

            //通知房间内其它玩家
            userMgr.broacastInRoom('user_state_push',data,userId);

            //清除玩家的在线信息
            userMgr.del(userId);
            socket.userId = null;
        });

        socket.on('game_ping',function(data){
            var userId = socket.userId;
            if(!userId){
                return;
            }
            //console.log('game_ping');
            socket.emit('game_pong');
        });

        //退出房间
        socket.on('exit',function(data){
            var userId = socket.userId;
            if(userId == null){
                return;
            }

            var roomId = roomMgr.getUserRoom(userId);
            if(roomId == null){
                return;
            }

            // //如果游戏已经开始，则不可以
            // if(socket.gameMgr.hasBegan(roomId)){
            //     return;
            // }

            //如果是房主，则只能走解散房间
            if(roomMgr.isCreator(userId)){
                return;
            }

            //通知其它玩家，有人退出了房间
            userMgr.broacastInRoom('exit_notify_push',userId,userId,false);

            roomMgr.exitRoom(userId);
            userMgr.del(userId);

            socket.emit('exit_result');
            socket.disconnect();
        });

        //解散房间
        socket.on('dispress',function(data){
            var userId = socket.userId;
            if(userId == null){
                return;
            }

            var roomId = roomMgr.getUserRoom(userId);
            if(roomId == null){
                return;
            }

            //如果游戏已经开始，则不可以
            // if(socket.gameMgr.hasBegan(roomId)){
            //     return;
            // }

            //如果不是房主，则不能解散房间
            if(roomMgr.isCreator(roomId,userId) == false){
                return;
            }

            userMgr.broacastInRoom('dispress_push',{},userId,true);
            userMgr.kickAllInRoom(roomId);
            roomMgr.destroy(roomId);
            socket.disconnect();
        });

        //解散房间
        socket.on('dissolve_request',function(data){
            var userId = socket.userId;
            console.log(1);
            if(userId == null){
                console.log(2);
                return;
            }

            var roomId = roomMgr.getUserRoom(userId);
            if(roomId == null){
                console.log(3);
                return;
            }

            //如果游戏未开始，则不可以
            if(socket.gameMgr.hasBegan(roomId) == false){
                console.log(4);
                return;
            }

            var ret = socket.gameMgr.dissolveRequest(roomId,userId);
            if(ret != null){
                var dr = ret.dr;
                var ramaingTime = (dr.endTime - Date.now()) / 1000;
                var data = {
                    time:ramaingTime,
                    states:dr.states
                }
                console.log(5);
                userMgr.broacastInRoom('dissolve_notice_push',data,userId,true);
            }
            console.log(6);
        });

        socket.on('dissolve_agree',function(data){
            var userId = socket.userId;

            if(userId == null){
                return;
            }

            var roomId = roomMgr.getUserRoom(userId);
            if(roomId == null){
                return;
            }

            var ret = socket.gameMgr.dissolveAgree(roomId,userId,true);
            if(ret != null){
                var dr = ret.dr;
                var ramaingTime = (dr.endTime - Date.now()) / 1000;
                var data = {
                    time:ramaingTime,
                    states:dr.states
                }
                userMgr.broacastInRoom('dissolve_notice_push',data,userId,true);

                var doAllAgree = true;
                for(var i = 0; i < dr.states.length; ++i){
                    if(dr.states[i] == false){
                        doAllAgree = false;
                        break;
                    }
                }

                if(doAllAgree){
                    socket.gameMgr.doDissolve(roomId);
                }
            }
        });

        socket.on('dissolve_reject',function(data){
            var userId = socket.userId;

            if(userId == null){
                return;
            }

            var roomId = roomMgr.getUserRoom(userId);
            if(roomId == null){
                return;
            }

            var ret = socket.gameMgr.dissolveAgree(roomId,userId,false);
            if(ret != null){
                userMgr.broacastInRoom('dissolve_cancel_push',{},userId,true);
            }
        });
    })

    server.listen(config.CLIENT_PORT,function () {
        console.log("game socket server is listening on " + config.CLIENT_PORT);

    });


}