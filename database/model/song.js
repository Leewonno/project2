const Song = function (sequelize, DataTypes) {
    const model = sequelize.define('song', {
        id: {
            type: DataTypes.INTEGER, // 데이터 유형을 정수로 지정
            primaryKey: true, // 기본 키로 지정
            autoIncrement: true, // 자동 증가 기능 사용
            allowNull: false, // null이 아닌 값이어야 함
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
        artist: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        album: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lyrics: {
            type: DataTypes.TEXT('long'),
            allowNull: false,
        },
        writer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        composer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        genre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        playtime: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        release_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        cover_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        song_url: {
            type: DataTypes.STRING,
            allowNull: false,
        }

    }, {
        tableName: 'song',
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    
    return model;
}

module.exports = Song;