const { Message, Media, User, Likes, Hashtag, Comment, Friends } = require('./models/models')

const media_IncludeObject = {
    model: Media,
    attributes: ['url', 'id', 'type', 'indexInMes'],
}

const hashtag_IncludeObject = {
    model: Hashtag,
    attributes: ['name', 'id'],
    through: {
        attributes: []
    }
}

const user_IncludeObject = {
    model: User,
    attributes: ['img', 'name', 'email', 'id'],
    raw: true,
}

const retweetIncludeObject = {
    model: Message,
    as: 'retweet',
    attributes: ['text', 'id', 'likesNum', 'retweetCount', 'retweetId'],
    include: [
        {
            model: User,
            attributes: ['img', 'name', 'email', 'id'],
            raw: true,

        }, {
            model: Hashtag,
            attributes: ['name', 'id'],
            through: {
                attributes: []
            }
        }, {
            model: Media,
            attributes: ['url', 'id', 'type'],
        },
    ]

}

const friend_IncludeObject = (id, require = true) => {
    return {
        model: Friends,
        where: { userId: id },
        attributes: [],
        require
    }
}

module.exports = {
    media_IncludeObject,
    hashtag_IncludeObject,
    user_IncludeObject,
    retweetIncludeObject,
    friend_IncludeObject
}