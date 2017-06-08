var db = require('../utils/db');
var configs = require(process.argv[2]);

db.init(configs.mysql());

var accountServerConfig = configs.account_server();
var accountServer = require('./account_server');
accountServer.start(accountServerConfig);



