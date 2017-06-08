/**
 * Created by sml on 2017/5/30.
 */

var db = require('../utils/db');

var rooms = {};
var creatingRooms = {};
var userLocation = {};
var totalRooms = 0;

var DI_FEN = [1,2,5];
var MAX_FAN = [3,4,5];
var JU_SHU = [4,8];
var JU_SHU_COST = [2,3];
function generateRoomId() {
    var roomId = "";
    for(var i = 0;i < 6;i++)
    {
        roomId += Math.floor(Math.random() * 10);

    }
    return roomId;
}

function constructRoomFromDb(dbData)
{
    var roomInfo = {
        uuid:dbData.uuid,
        id:dbData.id,
        numOfGames:dbData.num_of_turns,
        createTime:dbData.create_time,
        nextButton:dbData.next_button,
        seats:new Array(4),
        conf:JSON.parse(dbData.base_info)
    };

    if(roomInfo.conf.type == "xlch")
    {
        roomInfo.gameMgr = require("./gamemgr_xlch");
    }
    else
    {
        roomInfo.gameMgr = require("./gamemgr_xzdd");
    }

    var roomId = roomInfo.id;

    for(var i = 0;i < 4;i++)
    {
        var s = roomInfo.seats[i] = {};
        s.userId = dbData['user_id' + i];
        s.score = dbData['user_score' + i];
        s.name = dbData['user_name' + i];
        s.ready = false;
        s.seatIndex = i;
        s.numZiMo = 0;
        s.numJiePao = 0;
        s.numDianPao = 0;
        s.numAnGang = 0;
        s.numMingGang = 0;
        s.numChaJiao = 0;

        if(s.userId > 0)
        {
            userLocation[s.userId] = {
                roomId:roomId,
                seatIndex:i
            }
        }
    }

    rooms[roomId] = roomInfo;
    totalRooms++;
    return roomInfo;

}
//roomConf:0,1,3,1,1,1,2,1
exports.createRoom = function (creator, roomConf, gems,ip,port,callback) {

    if(roomConf.length <= 1)
    {
        callback(1,null);
        return;
    }

    var cost = JU_SHU_COST[roomConf[1]];
    if(cost > gems)
    {
        callback(2222,null);
        return;
    }

    var funCreate = function () {
        var roomId = generateRoomId();
        if(rooms[roomId] != null || creatingRooms[roomId] != null) {
            funCreate();
        }
        else
        {
            creatingRooms[roomId] = true;
            db.is_room_exist(roomId,function (ret) {
                if(ret)
                {
                    delete creatingRooms[roomId];
                    funCreate()
                }
                else
                {
                    var createTime = Math.ceil(Date.now() / 1000);
                    var roomInfo = {
                        uuid:"",
                        id:roomId,
                        numOfGames:0,
                        createTime:createTime,
                        nextButton:0,
                        seats:[],
                        conf:{
                            type:roomConf.type,
                            baseScore:DI_FEN[2],
                            zimo:true,
                            menqing:true,
                            tiandihu:true,
                            maxFan:MAX_FAN[1],
                            maxGames:JU_SHU[1],
                            creator:creator
                        }
                    };

                    // if(roomConf.type == 'xzdd')
                    // {
                    // roomInfo.gameMgr = require('./gamemgr_xzdd');

                    // }

                    for(var i = 0; i < 4 ; ++i)
                    {
                        roomInfo.seats.push({
                            userId:0,
                            score:0,
                            name:"",
                            ready:false,
                            seatIndex:i,
                            numZiMo:0,
                            numJiePao:0,
                            numDianPao:0,
                            numAnGang:0,
                            numMingGang:0,
                            numChaJiao:0,
                        });
                    }

                    var conf = roomInfo.conf;

                    db.create_room(roomInfo.id,roomInfo.conf,ip,port,createTime,function(uuid)
                    {
                        delete creatingRooms[roomId];
                        if(uuid != null)
                        {
                            roomInfo.uuid = uuid;
                            rooms[roomId] = roomInfo;
                            totalRooms++;
                            callback(0,roomId)
                        }
                        else
                        {
                            callback(3,null);
                        }
                    });


                }
            })
        }
    };
    funCreate()
};

exports.destroy = function (roomId) {
    var roomInfo = rooms[roomId];
    if(roomInfo == null)
    {
        return;
    }
    for(var i = 0; i < 4;i++)
    {
        var userId = roomInfo.seats[i].userId;
        if(userId > 0)
        {
            delete userLocation[userId];
            db.set_room_id_of_user(userId,null);
        }
    }

    delete rooms[roomId];
    totalRooms--;
    db.delete_room(roomId);
};

exports.getTotalRooms = function () {

    return totalRooms;
};


exports.getRoom = function (roomId) {
    return rooms[roomId];
};

exports.isCreator = function (roomId,userId) {
    var roomInfo = rooms[roomId];
    if(roomInfo == null)
    {
        return false;
    }

    return roomInfo.conf.creator = userId;
};

exports.enterRoom = function (roomId, userId, userName, callback) {
    var fnTakeSeat = function (room) {
        if(exports.getUserRoom(userId) == roomId)
        {
            //已经在房间里面了 不做处理
            return 0;
        }
        for(var i = 0; i< 4; ++i)
        {
            var seat = room.seats[i];
            if(seat.userId <= 0)
            {
                seat.userId = userId;
                seat.name = userName;
                userLocation[userId] = {
                    roomId:roomId,
                    seatIndex:i
                }

                db.update_seat_info(roomId,i,seat.userId,"",seat.name);
                return 0;//正常进入
            }
        }
        //房间已经满了
        return 1;
    }

    var room = rooms[roomId];
    if(room)
    {
        var ret = fnTakeSeat(room);
        callback(ret);
    }
    else
    {
        db.get_room_data(roomId,function (dbData) {
            if(dbData == null)
            {
                callback(2);
            }
            else
            {
                room = constructRoomFromDb(dbData);
                var ret = fnTakeSeat(room);
                callback(ret);
            }
        })
    }
};
exports.getUserRoom = function (userId) {
    var location = userLocation[userId];
    if(location != null)
    {
        return location.roomId;
    }

    return null;
};
exports.getUserSeat = function (userId) {

    var location = userLocation[userId];
    if(location != null)
    {
        return location.seatIndex;
    }

    return null;
};
exports.getUserLocation = function () {

    return userLocation;
};

exports.exitRoom = function (userId) {

    var location = userLocation[userId];
    if(location == null)
    {
        return;
    }


    var roomId = location.roomId;
    var seatIndex = location.seatIndex;
    var room = rooms[roomId];

    delete userLocation[userId];

    if(room == null)
    {
        return;
    }

    var seat = room.seats[seatIndex];
    seat.userId = 0;
    seat.name = "";

    var numOfPlayers = 0;
    for(var i = 0; i < room.seats.length;i++)
    {
        if(room.seats[i].userId > 0)
        {
            numOfPlayers++;
        }
    }

    db.set_room_id_of_user(userId,null);

    if(numOfPlayers === 0)
    {
        exports.destroy(roomId);
    }

};
exports.setReady = function (userId,value) {
    var roomId = exports.getUserRoom(userId);
    if(roomId == null)
    {
        return;
    }

    var room = exports.getRoom(roomId);
    if(room == null)
    {
        return;
    }

    var seatIndex = exports.getUserSeat(userId);
    if(seatIndex == null)
    {
        return;
    }

    var s = room.seats[seatIndex];
    s.ready = value
};

exports.isReady = function (userId) {

    var roomId = exports.getUserRoom(userId);
    if(roomId == null){
        return;
    }

    var room = exports.getRoom(roomId);
    if(room == null){
        return;
    }

    var seatIndex = exports.getUserSeat(userId);
    if(seatIndex == null){
        return;
    }

    var s = room.seats[seatIndex];
    return s.ready;

};