// visitor에 대한 테이블 정의
// visitor는 예시
const Visitor = function (sequelize, DataTypes){
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