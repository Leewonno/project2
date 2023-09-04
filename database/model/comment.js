const { Sequelize } = require("sequelize");

const Comment = function (sequelize, DataTypes) {
    const model = sequelize.define('comment', {
        userid: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
        },
        song_id: {
            type: DataTypes.INTEGER, 
            primaryKey: true,
            autoIncrement: true, 
            allowNull: false, 
        },
        content: {
            type: DataTypes.TEXT('tiny'),
            allowNull: false
        },
        create_date: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: true
        },
        update_date: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: true
        }
    }, {
        tableName: 'comment',
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    
    return model;
}

module.exports = Comment;