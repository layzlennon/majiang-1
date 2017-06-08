var HALL_IP = "localhost";
var HALL_CLIENT_PORT = 9001;
var HALL_ROOM_PORT = 9002;
var ACCOUNT_PRI_KEY = "@#$%^&**zj&^%$#@sml";
var ROOM_PRI_KEY = "~sml@#$%^&**&^%$#@zj";

var LOCAL_IP = 'localhost';

exports.mysql = function() {
	return {
		HOST:'localhost',
		USER:'root',
		PSWD:'1',
		DB:'mahjong',
		PORT:3306,
	}
};

exports.account_server = function() {
	// body...
	return {
		CLIENT_PORT:9000,
		HALL_IP:HALL_IP,
		HALL_CLIENT_PORT:HALL_CLIENT_PORT,
		ACCOUNT_PRI_KEY:ACCOUNT_PRI_KEY,
		DEALDER_API_IP:LOCAL_IP,
		DEALDER_API_PORT:12581,
		VERSION:'20161227',
	}
};

exports.hall_server = function () {
	return {
		HALL_IP:HALL_IP,
		CLIENT_PORT:HALL_CLIENT_PORT,
		FOR_ROOM_IP:LOCAL_IP,
		ROOM_PORT:HALL_ROOM_PORT,
		ACCOUNT_PRI_KEY:ACCOUNT_PRI_KEY,
		ROOM_PRI_KEY:ROOM_PRI_KEY
	}
};

exports.game_server = function () {

	return {
		SERVER_ID:"001",
		HTTP_PORT:9003,
		HTTP_TICK_TIME:5000,
		HALL_IP:LOCAL_IP,
		FOR_HALL_IP:LOCAL_IP,
		HALL_ROOM_PORT:HALL_ROOM_PORT,
		ROOM_PRI_KEY:ROOM_PRI_KEY,
		HALL_CLIENT_IP:HALL_IP,
		CLIENT_PORT:10000
	}
};

