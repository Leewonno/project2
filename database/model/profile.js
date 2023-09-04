const Profile = function (sequelize, DataTypes) {
    const model = sequelize.define('profile', {
        userid: {
            type: DataTypes.STRING(50), // 데이터 유형을 정수로 지정
            primaryKey: true, // 기본 키로 지정
            allowNull: false, // null이 아닌 값이어야 함
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        nickname: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        birth: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        profile_img: {
            type: DataTypes.STRING,
            allowNull: true,
        }
     
    }, {
        tableName: 'profile',
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    
    return model;
}

module.exports = Profile;