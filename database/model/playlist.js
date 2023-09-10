const { Sequelize } = require("sequelize");

const Playlist = function (sequelize, DataTypes) {
    const model = sequelize.define('playlist', {
        id: {
            type: DataTypes.INTEGER, // 데이터 유형을 정수로 지정
            primaryKey: true, // 기본 키로 지정
            autoIncrement: true, // 자동 증가 기능 사용
            allowNull: false, // null이 아닌 값이어야 함
        },
        // userid: {
        //     type: DataTypes.STRING(50),
        //     allowNull: false,
        // },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
        song_ids: {
            type: DataTypes.STRING,
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
        },
        like: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },

    }, {
        tableName: 'playlist',
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    return model;
}

module.exports = Playlist;