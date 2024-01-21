const { Hashtag, Message, messageHashtag, Likes, User, Media } = require('../models/models');
const { Op } = require("sequelize");
const { Sequelize } = require('../db');
const { retweetIncludeObject, media_IncludeObject, hashtag_IncludeObject, user_IncludeObject } = require('../includeObjects');

class hashtagRouter {
    async addHashtag(req, res) {
        try {
            const { hashtagName } = req.body
            console.log(hashtagName)
            const hashtag = await Hashtag.create({ name: hashtagName })
            return res.status(200).json(hashtag)
        } catch (error) {
            return res.status(500).json(error)
        }
    }
    async getHashtag(req, res) {
        try {
            const params = req.params

            if (!params.name) return res.status(400).json({ message: 'bad request' })

            const hashtag = await Hashtag.findOne({
                raw: true,
                where: { name: params.name },
                attributes: ['id', 'name', 'countMessages']
            })

            if (!hashtag) return res.status(404).json({ message: 'hashtag is not defined' })

            res.status(200).json(hashtag)
        } catch (error) {
            console.log(error)
            return res.status(500).json(error.message)
        }
    }
    async getHashtagMessages(req, res) {
        try {
            const hashtagId = Number(req.params.id)
            const { isAuth } = req.user;

            if (!hashtagId) return res.status(400).json({ message: 'bad request' })

            const query = req.query;
            const Limit = +query.limit || 10;
            const Page = +query.page || 0;
            const indexFirstElement = Page * Limit
            const includes = []
            const viewedData = req.viewedData?.messages || [];

            if (isAuth) {
                includes.push({
                    model: Likes,
                    where: {
                        userId: req.user.id
                    },
                    required: false
                })
            }

            const messages = await messageHashtag.findAll({
                limit: Limit, offset: indexFirstElement,
                attributes: ['createdAt'],
                where: { hashtagId },
                include: [{
                    model: Message,
                    where: { id: { [Op.notIn]: viewedData } },
                    required: true,
                    attributes: ['text', 'id', 'likesNum', 'retweetCount', 'retweetId', 'createdAt', 'commentsCount', 'userId'],
                    include: [
                        user_IncludeObject,
                        hashtag_IncludeObject,
                        media_IncludeObject,
                        retweetIncludeObject, ...includes
                    ]
                }],
                order: [['createdAt', 'DESC']]
            })

            res.status(200).json(messages)
        } catch (error) {
            console.log(error)
            return res.status(500).json(error.message)
        }
    }
    async getHashtagsForInput(req, res) {
        try {
            const { hashtag } = req.query;

            const hashtagsToInput = await Hashtag.findAndCountAll({
                limit: 5,
                where: {
                    name: {
                        [Op.like]: `%${hashtag}%`
                    }
                },
                attributes: ['id', 'name']
            })

            return res.status(200).json({ hashtagsToInput })
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }
}
module.exports = new hashtagRouter()