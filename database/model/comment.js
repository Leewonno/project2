const { Sequelize } = require("sequelize");

const Comment = function (sequelize, DataTypes) {
    const model = sequelize.define('comment', {
        userid: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
        },
        song_id: {
            type: DataTypes.INTEGER, // 데이터 유형을 정수로 지정
            primaryKey: true, // 기본 키로 지정
            autoIncrement: true, // 자동 증가 기능 사용
            allowNull: false, // null이 아닌 값이어야 함
        },
        content: {
            type: DataTypes.TEXT('tiny'),
            allowNull: false
        },
        create_date: {
            type: DataTypes.DATEONLY,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: true
        },
        update_date: {
            type: DataTypes.DATEONLY,
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