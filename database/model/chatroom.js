const ChatRoom = function (sequelize, DataTypes) {
    const model = sequelize.define('chatroom', {
        id: {
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true, 
            allowNull: false, 
        },
        name: {
            type: DataTypes.STRING, // 데이터 유형을 정수로 지정
            allowNull: false, // null이 아닌 값이어야 함
        },
        tag: {
            type: DataTypes.STRING, // 데이터 유형을 정수로 지정
            allowNull: true, 
        },
        member: {
            type: DataTypes.INTEGER, // 데이터 유형을 정수로 지정
            allowNull: true, // null이 아닌 값이어야 함
        },
        cover_img: {
            type: DataTypes.BIGINT, // 데이터 유형을 정수로 지정
            allowNull: trun, // null이 아닌 값이어야 함
        }
      
    }, {
        tableName: 'chatroom',
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    
    return model;
}

module.exports = ChatRoom;