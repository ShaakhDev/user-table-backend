export default async function UsersModel(sequelize, Sequelize) {
    return sequelize.define('users', {
        user_id: {
            type: Sequelize.DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4()
        },
        user_name: {
            type: Sequelize.DataTypes.STRING(64),
            allowNull: false
        },
        user_phone: {
            type: Sequelize.DataTypes.STRING(13),
            is: /^998[389][012345789][0-9]{7}$/,
            allowNull: false,
            unique: true
        },
        user_attempts: {
            type: Sequelize.DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 0
        },
        user_password: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true
        }
    })
}