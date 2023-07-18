const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    shortInfo: { type: DataTypes.STRING },
    age: { type: DataTypes.STRING, allowNull: true },
    img: { type: DataTypes.STRING },
    coverImage: { type: DataTypes.STRING }
})

const Message = sequelize.define('message', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    text: { type: DataTypes.STRING, allowNull: false },
    likesNum: { type: DataTypes.INTEGER, defaultValue: 0 },
    img: { type: DataTypes.STRING, unique: true, },
    retweetCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    retweetId: { type: DataTypes.INTEGER },
})

const Likes = sequelize.define('likes', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, unique: false },
    messageId: { type: DataTypes.INTEGER, allowNull: false, },
})
const Friends = sequelize.define('friends', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, unique: true }
})

const Hashtag = sequelize.define('hashtag', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    countMessages: { type: DataTypes.INTEGER, allowNull: false },
})

const Image = sequelize.define('image', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    url: { type: DataTypes.STRING, unique: true, allowNull: false },
})

const messageHashtag = sequelize.define('messageHashtag', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    messageId: {
        type: DataTypes.INTEGER,
        references: {
            model: Message,
            key: 'id'
        }
    },
    hashtagId: {
        type: DataTypes.INTEGER,
        references: {
            model: Hashtag,
            key: 'id'
        }
    }
})

User.hasMany(Message)
User.hasOne(Friends)
User.hasMany(Likes)
User.belongsTo(Friends)

Message.hasMany(Likes)
Message.belongsToMany(Hashtag, { through: messageHashtag })
Message.belongsTo(User, { onDelete: 'CASCADE' })
Message.belongsTo(Message, { as: 'retweet', foreignKey: 'retweetId' })
Message.hasOne(Message, { foreignKey: 'retweetId' })

messageHashtag.belongsTo(Message)
messageHashtag.belongsTo(Hashtag)
messageHashtag.hasMany(Message)
messageHashtag.hasMany(Hashtag)

Image.belongsTo(Message, { onDelete: 'CASCADE' })
Image.belongsTo(User, { onDelete: 'CASCADE' })

Likes.belongsTo(User, { onDelete: 'CASCADE' })
Likes.belongsTo(Message, { onDelete: 'CASCADE' })

Hashtag.belongsToMany(Message, { through: messageHashtag })

Friends.hasMany(User)
Friends.belongsTo(User, { onDelete: 'CASCADE' })

module.exports = {
    User,
    Message,
    Likes,
    Hashtag,
    Friends,
    Image,
    messageHashtag
}