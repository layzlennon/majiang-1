/**
 * Created by sml on 2017/5/13.
 */
var crypto = require('../utils/crypto');
var express = require('express');
var db = require('../utils/db');
var http = require('../utils/http');
var app = express();


var serverMap = {};

//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


app.get('/register_gs',function (req,res) {

    var majiangip = req.ip;
    var hallclientip = req.query.hallclientip;
    var clientport = req.query.clientport;
    var majianghttpport = req.query.majianghttpport;
    var load = req.query.load;
    var id = hallclientip + ":" + clientport;

    if(serverMap[id])
    {
        var info = serverMap[id];
        if(info.clientport != clientport || info.majianghttpport != majianghttpport || info.majiangip != majiangip)
        {
            console.log("duplicate gsid:" + id + ",addr:" + majiangip + "(" + majianghttpport + ")");
            http.send(res,1,"duplicate gsid:" + id);
            return;
        }

        info.load = load;
        http.send(res,0,"ok",{ip:majiangip});
        return;
    }

    serverMap[id] = {
        majiangip: majiangip,
        id: id,
        hallclientip: hallclientip,
        clientport: clientport,
        majianghttpport: majianghttpport,
        load: load
    };
    http.send(res,0,"ok",{ip:majiangip});
    console.log("game server registered.\n\tid:" + id + "\n\taddr:" + majiangip + "\n\thttp port:" + majianghttpport + "\n\tsocket clientport:" + clientport);

    var reqdata = {
        serverid:id,
        sign:crypto.md5(id+config.ROOM_PRI_KEY)
    };

    http.get(majiangip,majianghttpport,'/get_server_info',reqdata,function (ret,data) {
        if(ret && data.errcode == 0)
        {
            for(var i = 0; i < data.userroominfo.length;i += 2)
            {
                var userId = data.userroominfo[i];
                var roomId = data.userroominfo[i + 1];
            }
        }
        else
        {
            console.log(data.errmsg)
        }
    });


});

function chooseServer() {
    var serverinfo = null;
    for(var s in serverMap)
    {
        var info = serverMap[s];
        if(serverinfo == null)
        {
            serverinfo = info;
            break;
        }
        else
        {
            if(serverinfo.load > info.load)
            {
                serverinfo = info;
                break;
            }
        }
    }
    console.log('chooseServer ');
    console.log(serverinfo);

    return serverinfo;
}

exports.createRoom = function (accout, userId,roomConf,fnCallBack) {
    var serverinfo = chooseServer();

    if(serverinfo == null)
    {
        fnCallBack(101,null);
        return;
    }

    db.get_gems(accout,function (data) {
        if(data != null)
        {
            var reqdata = {
                userid:userId,
                gems:data.gems,
                conf:roomConf
            };

            reqdata.sign = crypto.md5(userId + roomConf + data.gems + config.ROOM_PRI_KEY);
            http.get(serverinfo.majiangip,serverinfo.majianghttpport,"/create_room",reqdata,function (ret,data) {
                if(ret)
                {
                    if(data.errcode == 0)
                    {
                        fnCallBack(0,data.roomid);
                    }
                    else
                    {
                        fnCallBack(data.errcode,null);
                    }

                    return;
                }
                fnCallBack(102,null);
            })
        }
    })


};
exports.enterRoom = function(userId,name,roomId,fnCallback){
    var reqdata = {
        userid:userId,
        name:name,
        roomid:roomId
    };
    reqdata.sign = crypto.md5(userId + name + roomId + config.ROOM_PRI_KEY);

    var checkRoomIsRuning = function(serverinfo,roomId,callback){
        var sign = crypto.md5(roomId + config.ROOM_PRI_KEY);
        http.get(serverinfo.majiangip,serverinfo.majianghttpport,"/is_room_runing",{roomid:roomId,sign:sign},function(ret,data){
            if(ret){
                if(data.errcode == 0 && data.runing == true){
                    callback(true);
                }
                else{
                    callback(false);
                }
            }
            else{
                callback(false);
            }
        });
    }

    var enterRoomReq = function(serverinfo){
        http.get(serverinfo.majiangip,serverinfo.majianghttpport,"/enter_room",reqdata,function(ret,data){
            console.log(data);
            if(ret){
                if(data.errcode == 0){
                    db.set_room_id_of_user(userId,roomId,function(ret){
                        fnCallback(0,{
                            ip:serverinfo.hallclientip,
                            port:serverinfo.clientport,
                            token:data.token
                        });
                    });
                }
                else{
                    console.log(data.errmsg);
                    fnCallback(data.errcode,null);
                }
            }
            else{
                fnCallback(-1,null);
            }
        });
    };

    var chooseServerAndEnter = function(serverinfo){
        serverinfo = chooseServer();
        if(serverinfo != null){
            enterRoomReq(serverinfo);
        }
        else{
            fnCallback(-1,null);
        }
    }

    db.get_room_addr(roomId,function(ret,ip,port){
        if(ret){
            var id = ip + ":" + port;
            var serverinfo = serverMap[id];
            if(serverinfo != null){
                checkRoomIsRuning(serverinfo,roomId,function(isRuning){
                    if(isRuning){
                        enterRoomReq(serverinfo);
                    }
                    else{
                        chooseServerAndEnter(serverinfo);
                    }
                });
            }
            else{
                chooseServerAndEnter(serverinfo);
            }
        }
        else{
            fnCallback(-2,null);
        }
    });
};

var config = null;

exports.start = function(mainConfig){
    config = mainConfig;
    app.listen(config.ROOM_PORT,config.FOR_ROOM_IP);
    console.log("room service is listening on " + config.FOR_ROOM_IP + ":" + config.ROOM_PORT);
};