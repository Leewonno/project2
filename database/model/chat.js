const { Sequelize } = require("sequelize");

const Chat = function (sequelize, DataTypes) {
    const model = sequelize.define('chat', {
        chatroom_id: {
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true, 
            allowNull: false, 
        },
        userid: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        create_date: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: true
        },
    }, {
        tableName: 'chat',
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    
    return model;
}

module.exports = Chat;