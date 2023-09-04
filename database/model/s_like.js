const S_like = function (sequelize, DataTypes) {
    const model = sequelize.define('s_like', {
        song_id: {
            type: DataTypes.INTEGER, // 데이터 유형을 정수로 지정
            primaryKey: true, // 기본 키로 지정
            autoIncrement: true, // 자동 증가 기능 사용
            allowNull: false, // null이 아닌 값이어야 함
        },
        // userid: {
        //     type: DataTypes.STRING(50),
        //     allowNull: false,
        // }
      
    }, {
        tableName: 's_like',
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    
    return model;
}

module.exports = S_like;