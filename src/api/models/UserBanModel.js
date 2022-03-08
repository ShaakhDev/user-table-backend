export default async function UserBanModel(sequelize, Sequelize) {
    return sequelize.define('user_bans', {
        ban_id: {
            type: Sequelize.DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.DataTypes.UUIDV4,
        },
        ban_expire_date: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false
        }
    })
}