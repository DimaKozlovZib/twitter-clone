const { Hashtag, Message, messageHashtag, Likes } = require('../models/models');
const { Op } = require("sequelize");
const { retweetIncludeObject, media_IncludeObject, hashtag_IncludeObject, user_IncludeObject } = require('../includeObjects');
const ApiError = require('../error/ApiError');

class hashtagRouter {
    async addHashtag(req, res, next) {
        try {
            const { hashtagName } = req.body
            const hashtag = await Hashtag.create({ name: hashtagName })
            return res.status(200).json(hashtag)
        } catch (error) {
            return next(ApiError.internal(error.message))
        }
    }
    async getHashtag(req, res, next) {
        try {
            const params = req.params

            if (!params.name) return next(ApiError.badRequest());

            const hashtag = await Hashtag.findOne({
                raw: true,
                where: { name: params.name },
                attributes: ['id', 'name', 'countMessages']
            })

            if (!hashtag) return next(ApiError.notFound('Hashtag is not found'));

            res.status(200).json(hashtag)
        } catch (error) {
            console.log(error.message)
            return next(ApiError.internal(error.message))
        }
    }
    async getHashtagMessages(req, res, next) {
        try {
            const hashtagId = Number(req.params.id)
            const { isAuth } = req.user;

            if (!hashtagId) return next(ApiError.badRequest());

            const query = req.query;
            const Limit = +query.limit || 10;
            const Page = +query.page || 0;
            const indexFirstElement = Page * Limit;
            const includes = [];
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
            console.log(error.message)
            return next(ApiError.internal(error.message))
        }
    }
    async getHashtagsForInput(req, res, next) {
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
            console.log(error.message)
            return next(ApiError.internal(error.message))
        }
    }
}
module.exports = new hashtagRouter()