export default async function UserSessionsModel(sequelize, Sequelize) {
    return sequelize.define('user_sessions', {
        session_id: {
            type: Sequelize.DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.DataTypes.UUIDV4,
        },
        session_inet: {
            type: Sequelize.DataTypes.INET,
            allowNull: false,
        },
        session_user_agent: {
            type: Sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        session_user_device: {
            type: Sequelize.DataTypes.ENUM,
            values: ["Android", "IOS", "other"],
            allowNull: false
        }
    })
}