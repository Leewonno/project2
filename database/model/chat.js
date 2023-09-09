const { Sequelize } = require('sequelize');

const Chat = function (sequelize, DataTypes) {
  const model = sequelize.define(
    'chat',
    {
      chatroom_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      userid: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      create_date: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        primaryKey: true,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT('tiny'),
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(5),
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'chat',
      timestamps: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    }
  );

  return model;
};

module.exports = Chat;
