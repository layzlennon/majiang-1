/**
 * Created by sml on 2017/5/30.
 */
var roomMgr = require('./roommgr');

var userList = {};

var userOnline = 0;

exports.bind = function (userId,socket) {
    userList[userId] = socket;
    userOnline++;
};

exports.del = function (userId, socket) {

    delete userList[userId];
    userOnline--;
};


exports.get = function (userId) {

    return userList[userId];
};


exports.isOnline = function (userId) {
    var data = userList[userId];
    if(data != null)
    {
        return true;
    }

    return false;
};

exports.getOnlineCount = function () {
    return userOnline;
};


exports.sendMsg = function (userId,event,msgdata) {
    var userInfo = userList[userId];
    if(userInfo == null)
    {
        return;
    }

    var socket = userInfo;
    if(socket == null)
    {
        return;
    }

    socket.emit(event,msgdata);
};

exports.kickAllInRoom = function (roomId) {
    if(roomId == null)
    {
        return;
    }

    var roomInfo = roomMgr.getRoom(roomId);
    if(roomInfo == null)
    {
        return;
    }

    for(var i = 0; i < roomInfo.seats.length;i++)
    {
        var rs = roomInfo.seats[i];
        if(rs.userId > 0)
        {
            var socket = userList[rs.userId];
            exports.del(rs.userId);
            socket.disconnect()
        }
    }
};

exports.broacastInRoom = function (event,data,sender,includingSender) {

    var roomId = roomMgr.getUserRoom(sender);
    if(roomId == null)
    {
        return;
    }

    var roomInfo = roomMgr.getRoom(roomId);
    if(roomInfo == null)
    {
        return;
    }

    for(var i = 0; i < roomInfo.seats.length;i++)
    {
        var rs = roomInfo.seats[i];

        if(rs.userId == sender && includingSender != true)
        {
            continue;
        }

        var socket = userList[rs.userId];
        if(socket != null)
        {
            socket.emit(event,data);
        }
    }

};
