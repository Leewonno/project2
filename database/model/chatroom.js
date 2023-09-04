const ChatRoom = function (sequelize, DataTypes) {
    const model = sequelize.define('chatroom', {
        id: {
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true, 
            allowNull: false, 
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false, 
        },
        tag: {
            type: DataTypes.STRING, // 데이터 유형을 정수로 지정
            allowNull: true, 
        },
        member: {
            type: DataTypes.INTEGER, 
            allowNull: true, 
        },
        cover_img: {
            type: DataTypes.BIGINT, 
            allowNull: true, 
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