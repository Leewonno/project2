// visitor에 대한 테이블 정의
const Visitor = function (sequelize, DataTypes){
    // sequelize는 models/index.js에 있는 sequelize (소문자)
    // DataTypes는 models/index.js에 있는 Sequelize (대문자)
    const model = sequelize.define(
        'visitor',
        {
            id : {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey:true,
                autoIncrement:true
            },
            name : {
                type: DataTypes.STRING(10),
                allowNull:false,
            },
            comment : {
                type: DataTypes.TEXT("medium")
            }
        },
        {
            tableName:"visitor",
            freezeTableName: true,
            timestamps: false,
        }
    )

    return model;

}

module.exports = Visitor;