'use strict';

const Sequelize = require('sequelize');
require('dotenv').config();
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

// model
db.User = require("./model/user")(sequelize, Sequelize);
// db.Song = require("./model/song")(sequelize, Sequelize);
// db.S_like = require("./model/s_like")(sequelize, Sequelize);
db.Profile = require("./model/profile")(sequelize, Sequelize);
// db.P_like = require("./model/p_like")(sequelize, Sequelize);
// db.Playlist = require("./model/playlist")(sequelize, Sequelize);
// db.Comment = require("./model/comment")(sequelize, Sequelize);
// db.ChatRoom = require("./model/chatroom")(sequelize, Sequelize);
// db.Chat = require("./model/chat")(sequelize, Sequelize);

// 관계형성
db.User.hasOne(db.Profile, { foreignKey: { name: "userid", allowNull: false}, sourceKey: "userid" });
db.Profile.belongsTo(db.User, { foreignKey: "userid", allowNull: false, primaryKey: true, sourceKey: "userid" });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;


