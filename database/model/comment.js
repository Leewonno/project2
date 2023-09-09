const { Sequelize } = require("sequelize");

const Comment = function (sequelize, DataTypes) {
    const model = sequelize.define('comment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        userid: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        song_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT('tiny'),
            allowNull: false,
        },
        create_date: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: true,
        },
        update_date: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: true,
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