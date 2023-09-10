const { Sequelize } = require('sequelize');

const Chat_member = function (sequelize, DataTypes) {
  const model = sequelize.define(
    'chat_member',
    {
      userid: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      chatroom_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      create_date: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: true,
      },
    },
    {
      tableName: 'chat_member',
      timestamps: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    }
  );

  return model;
};

module.exports = Chat_member;
