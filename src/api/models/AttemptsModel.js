export default async function AttemptsModel(sequelize, Sequelize) {
    return sequelize.define("attempts", {
        attempt_id: {
            type: Sequelize.DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        user_code: {
            type: Sequelize.DataTypes.STRING(6),
            allowNull: true
        },
        user_attempts: {
            type: Sequelize.DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 0
        },
        is_expired: {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false
        }
    })
}