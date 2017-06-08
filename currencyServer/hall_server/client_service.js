var crypto  = require('../utils/crypto');
var express = require('express');

var db = require('../utils/db');
var http = require('../utils/http');

var room_service = require('./room_service');

var gameConfigs = require('../game/gameConfigs');

var app = express();

var config = null;

//设置跨域访问
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By",' 3.2.1');
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

function check_account(req,res) {
	// body...
	console.log('check_account start');
	var account = req.query.account;
	var sign = req.query.sign;
	console.log(req.query);
	if(account == null || sign == null)
	{
		http.send(res,1,"unknown error");
		return false;
	}

	var serverSign = crypto.md5(account + req.ip + config.ACCOUNT_PRI_KEY);
	console.log(serverSign);
	if(serverSign != sign)
	{
		http.send(res,2,"login failed");
		return false;
	}

    console.log('check_account end');

    return true;
}
app.get('/create_user',function (req,res) {

    if(!check_account(req,res))
    {
        return ;
    }

    var account = req.query.account;
    var name = req.query.name;
    var coins = 1000;
    var gems = 21;
    console.log(req.query);
    db.is_user_exist(account,function (ret) {
       if (!ret)
       {
           db.create_user(account,name,coins,gems,0,null,function (ret) {

               if(ret == null)
               {
                   http.send(res,2,"system error");
               }
               else
               {
                   http.send(res,0,"ok")
               }
           })
       }
       else
       {
           http.send(ret,1,"account have already exist");
       }
    });

});
app.get('/create_private_room',function (req,res) {

    var data = req.query;
    if(!check_account(req,res))
    {
        return ;
    }
    var account = data.account;
    var conf = data.conf;

    db.get_user_data(account,function (userData) {
        if(data == null)
        {
            http.send(res,1,"system error");
            return;
        }

        var userId = userData.userid;
        var name = userData.name;

        db.get_room_id_of_user(userId,function (roomId) {
            if(roomId != null)
            {
                http.send(res,-1,"user is playing in room now");
                return;
            }
            room_service.createRoom(account,userId,conf,function (err,roomId) {
                if(err == 0 && roomId != null)
                {
                    room_service.enterRoom(userId,name,roomId,function (errcode,enterInfo) {
                        if(enterInfo)
                        {
                            var ret = {
                                roomid:roomId,
                                ip:enterInfo.ip,
                                port:enterInfo.port,
                                token:enterInfo.token,
                                time:Date.now()
                            };

                            ret.sign = crypto.md5(ret.roomid + ret.token + ret.time + config.ROOM_PRI_KEY);
                            http.send(res,0,"ok",ret);

                        }
                        else
                        {
                            http.send(res,errcode,"room doesn't exist.");
                        }
                    });
                }
                else
                {
                    http.send(res,err,"create failed.");
                }
            });
        })

    })

});
app.get('/get_create_table_conf',function (req,res) {

    // var data = req.query;
    if(!check_account(req,res))
    {
        return;
    }
    var gameRuleConf = gameConfigs.gameRuleConfig();
    console.log(JSON.stringify(gameRuleConf));
    http.send(res,0,"ok",gameRuleConf);

});
app.get('/login',function(req, res) {
	// body...
	if (!check_account(req,res)) 
	{
		return ;
	}
	//::ffff:192.168.1.102
	var ip = req.ip;
	if(ip.indexOf("::ffff:")!= -1)
	{
		ip = ip.substr(7);
	}

	var account = req.query.account;
	db.get_user_data(account,function(data) {
		// body...
        console.log("get_user_data");
        console.log(data);
		if(data == null)//没有获取用户数据，说明用户不存在,完成需要创建
		{
			http.send(res,0,"Ok");
			return;
		}
        var ret = {
            account:data.account,
            userid:data.userid,
            name:data.name,
            lv:data.lv,
            exp:data.exp,
            coins:data.coins,
            gems:data.gems,
            ip:ip,
            sex:data.sex,
        };

        db.get_room_id_of_user(data.userid,function(roomId){
            //如果用户处于房间中，则需要对其房间进行检查。 如果房间还在，则通知用户进入
            if(roomId != null){
                //检查房间是否存在于数据库中
                db.is_room_exist(roomId,function (retval){
                    if(retval){
                        ret.roomid = roomId;
                    }
                    else{
                        //如果房间不在了，表示信息不同步，清除掉用户记录
                        db.set_room_id_of_user(data.userid,null);
                    }
                    http.send(res,0,"ok",ret);
                });
            }
            else {
                http.send(res,0,"ok",ret);
            }
        });
	});


});
app.get('/enter_private_room',function(req,res){

    console.log ("enter_private_room");
    var data = req.query;
    var roomId = data.roomid;
    if(roomId == null){
        http.send(res,-1,"parameters don't match api requirements.");
        return;
    }
    if(!check_account(req,res)){
        return;
    }

    var account = data.account;

    db.get_user_data(account,function (data) {

        if(data == null){
            http.send(res,-1,"system error");
            return;
        }

        var userId = data.userid;
        var name = data.name;
        room_service.enterRoom(userId,name,roomId,function (errcode,enterInfo) {
            if(enterInfo){
                var ret = {
                    roomid:roomId,
                    ip:enterInfo.ip,
                    port:enterInfo.port,
                    token:enterInfo.token,
                    time:Date.now()
                };
                ret.sign = crypto.md5(roomId + ret.token + ret.time + config.ROOM_PRI_KEY);
                http.send(res,0,"ok",ret);
            }
            else{
                http.send(res,errcode,"enter room failed.");
            }
        })
    })

});
exports.start = function(mainConfig) {
	// body...
	config = mainConfig;
	app.listen(config.CLIENT_PORT);
	console.log('client service is listening on port: '+config.CLIENT_PORT);
}

