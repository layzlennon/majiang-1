//全局数据
cc.director.TableGlobalData = {
    roomId: null,
    conf: null,
    maxNumOfGames: 0,
    numOfGames: 0,
    seats: null,
    seatIndex: -1,
    isGameIn: false,
    // 无效麻将ID
    invalid_tile_id: -1,
    
    setMaxNumOfGame:function(maxNum)
    {
        this.maxNumOfGames = maxNum;
    },
    setNumOfGames:function(numOfGame)
    {
        this.numOfGames = numOfGame
    },
    setSeats:function(seats)
    {
        this.seats = seats;
    },
    getSeats:function()
    {
        return this.seats;
    },
    setSeatId:function(seatId)
    {
        this.seatIndex = seatId
    },
    getSeatId:function()
    {
        this.seatIndex = seatId
    },
    setRoomId:function(roomId)
    {
        this.roomId = roomId;
    },
    getRoomId:function()
    {
        return this.roomId;
    },
    setGameConf:function(conf)
    {
        this.conf = conf;
    },
    setGameIn:function(gameIn)
    {
        this.isGameIn = gameIn
    },
    getGameIn:function()
    {
        return this.isGameIn
    },
    getLocalIndex:function(seatIdex)
    {
        var index = (seatIdex - this.seatIndex + 4) % 4
        return index
    },
    isHostUser: function()
    {
        return this.seatIndex === 0
    },

    getSeatIndexByID:function (userId)
    {
        var seatIndex = -1;
        for(var i = 0; i < this.seats.length;i++)
        {
            var s = this.seats[i];
            if(s.userid === userId)
            {
                seatIndex = i;
                break;
            }
        }

        return seatIndex;
    },
    getSeatByID:function(userId){
        var seatIndex = this.getSeatIndexByID(userId)

        var seat = this.seats[seatIndex]

        return seat;
    }        
}
