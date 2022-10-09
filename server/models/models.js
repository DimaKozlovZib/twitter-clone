const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    dateBorn: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false },
    img: { type: DataTypes.STRING },
})

const Message = sequelize.define('message', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.STRING },
    title: { type: DataTypes.STRING, allowNull: false },
    likesNum: { type: DataTypes.INTEGER },
    img: { type: DataTypes.STRING, unique: true, },
})

const Likes = sequelize.define('likes', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, unique: true, },
    messageId: { type: DataTypes.INTEGER, allowNull: false, unique: true, },
})
const Friends = sequelize.define('friends', {
    count: { type: DataTypes.INTEGER },
})

const Hashtag = sequelize.define('hashtag', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
})

User.hasMany(Message)
User.hasOne(Friends)
User.hasMany(Likes)

Message.hasMany(Likes)
Message.hasMany(Hashtag)
Message.belongsTo(Message)
Message.belongsTo(Hashtag)

Likes.belongsTo(User)
Likes.belongsTo(Message)

Hashtag.hasMany(Message)

Friends.hasMany(User)
Friends.belongsTo(User)

module.exports = {
    User,
    Message,
    Likes,
    Hashtag,
    Friends,
}