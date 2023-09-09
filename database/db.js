'use strict';

const Sequelize = require('sequelize');
require('dotenv').config();
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};


const sequelize = new Sequelize(config.database, config.username, config.password, config);

// model
db.User = require('./model/user')(sequelize, Sequelize);
db.Song = require('./model/song')(sequelize, Sequelize);
db.S_like = require('./model/s_like')(sequelize, Sequelize);
db.Profile = require('./model/profile')(sequelize, Sequelize);
db.P_like = require('./model/p_like')(sequelize, Sequelize);
db.Playlist = require('./model/playlist')(sequelize, Sequelize);
db.Comment = require('./model/comment')(sequelize, Sequelize);
db.ChatRoom = require('./model/chatroom')(sequelize, Sequelize);
db.Chat = require('./model/chat')(sequelize, Sequelize);

// 관계형성

// user join
db.User.hasOne(db.Profile, { foreignKey: { name: 'userid', allowNull: false }, sourceKey: 'userid' });
db.Profile.belongsTo(db.User, { foreignKey: 'userid', allowNull: false, primaryKey: true, sourceKey: 'userid' });

// playlist (pk X)
db.User.hasOne(db.Playlist, { foreignKey: { name: 'userid', allowNull: false }, sourceKey: 'userid' });
db.Playlist.belongsTo(db.User, { foreignKey: 'userid', allowNull: false, sourceKey: 'userid' });

// comment
db.User.hasOne(db.Comment, { foreignKey: { name: "userid", allowNull: false}, sourceKey: "userid" });
db.Comment.belongsTo(db.User, { foreignKey: "userid", allowNull: false, sourceKey: "userid" });

// chat
db.User.hasOne(db.Chat, { foreignKey: { name: 'userid', allowNull: false }, sourceKey: 'userid' });
db.Chat.belongsTo(db.User, { foreignKey: 'userid', allowNull: false, primaryKey: true, sourceKey: 'userid' });

// s_like 
db.User.hasOne(db.S_like, { foreignKey: { name: "userid", allowNull: false}, sourceKey: "userid" });
db.S_like.belongsTo(db.User, { foreignKey: "userid", allowNull: false, primaryKey: true, sourceKey: "userid" });

// p_like (pk X)
db.User.hasOne(db.P_like, { foreignKey: { name: 'userid', allowNull: false }, sourceKey: 'userid' });
db.P_like.belongsTo(db.User, { foreignKey: 'userid', allowNull: false, primaryKey: true, sourceKey: 'userid' });

// chat join
db.ChatRoom.hasOne(db.Chat, { foreignKey: { name: 'chatroom_id', allowNull: false }, sourceKey: 'id' });
db.Chat.belongsTo(db.ChatRoom, {
  foreignKey: 'chatroom_id',
  allowNull: false,
  primaryKey: true,
  sourceKey: 'chatroom_id',
});

// playlist join
db.Playlist.hasOne(db.P_like, { foreignKey: { name: 'p_id', allowNull: false }, sourceKey: 'id' });
db.P_like.belongsTo(db.Playlist, { foreignKey: 'p_id', allowNull: false, primaryKey: true, sourceKey: 'p_id' });

// song join
db.Song.hasOne(db.S_like, { foreignKey: { name: 'song_id', allowNull: false }, sourceKey: 'id' });
db.S_like.belongsTo(db.Song, { foreignKey: 'song_id', allowNull: false, primaryKey: true, sourceKey: 'song_id' });

db.Song.hasOne(db.Comment, { foreignKey: { name: "song_id", allowNull: false}, sourceKey: "id" });
db.Comment.belongsTo(db.Song, { foreignKey: "song_id", allowNull: false, sourceKey: "song_id" });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
