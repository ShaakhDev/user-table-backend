export default async function Relations(db) {
    await db.users.hasMany(db.user_sessions, {
        foreignKey: {
            name: 'user_id',
            allowNull: false
        }
    })
    await db.user_sessions.belongsTo(db.users, {
        foreignKey: {
            name: 'user_id',
            allowNull: false
        }
    })
    await db.users.hasMany(db.user_bans, {
        foreignKey: {
            name: 'user_id',
            allowNull: false
        }
    })
    await db.user_bans.belongsTo(db.users, {
        foreignKey: {
            name: 'user_id',
            allowNull: false
        }
    })
    await db.users.hasMany(db.user_attempts, {
        foreignKey: {
            name: 'user_id',
            allowNull: false
        }
    })
    await db.user_attempts.belongsTo(db.users, {
        foreignKey: {
            name: 'user_id',
            allowNull: false
        }
    })
}