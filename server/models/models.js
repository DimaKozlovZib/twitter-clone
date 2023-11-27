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

const basicMessageSheme = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    text: { type: DataTypes.STRING, allowNull: false },
}

const Message = sequelize.define('message', {
    ...basicMessageSheme,
    likesNum: { type: DataTypes.INTEGER, defaultValue: 0 },
    commentsCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    retweetCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    retweetId: { type: DataTypes.INTEGER },//указывает на сообщение которое было ретвитнуто в сообщении с id
})

const Comment = sequelize.define('comment', {
    ...basicMessageSheme,
    messageId: { type: DataTypes.INTEGER, allowNull: false }
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

const Media = sequelize.define('media', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    url: { type: DataTypes.STRING, unique: true, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    indexInMes: { type: DataTypes.INTEGER },
    messageId: { type: DataTypes.INTEGER, },
    userId: { type: DataTypes.INTEGER, }
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
Message.hasMany(Media, { onDelete: 'CASCADE' })
Message.belongsToMany(Hashtag, { through: messageHashtag })
Message.belongsTo(User, { onDelete: 'CASCADE' })
Message.belongsTo(Message, { as: 'retweet', foreignKey: 'retweetId' })
Message.hasOne(Message, { foreignKey: 'retweetId' })
Message.hasMany(Comment)

Comment.belongsTo(Message, { onDelete: 'CASCADE' })
Comment.belongsTo(User, { foreignKey: 'userId' })

messageHashtag.belongsTo(Message)
messageHashtag.belongsTo(Hashtag)
messageHashtag.hasMany(Message)
messageHashtag.hasMany(Hashtag)

Media.belongsTo(Message, { onDelete: 'CASCADE' })
Media.belongsTo(User, { onDelete: 'CASCADE' })

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
    Media,
    messageHashtag,
    Comment
}