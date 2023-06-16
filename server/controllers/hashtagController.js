const { Hashtag, Message, messageHashtag, Likes, User } = require('../models/models');
const { Op } = require("sequelize");
const { Sequelize } = require('../db');

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
                where: { name: params.name },
                attributes: ['id', 'name', 'countMessages']
            })
            res.status(200).json(hashtag)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
    async searchHashtag(req, res) {
        try {
            const data = req.body;

            if (!data?.text) return res.status(400).json({ message: 'bad request' })
            const { text } = data;

            const Limit = data.limit || 3;
            const Page = ((data.page || 1) - 1) * Limit;



            const hashtags = await Hashtag.findAndCountAll({
                limit: Limit, offset: Page,
                where: {
                    name: { [Op.iLike]: `%${text}%` }
                },
                attributes: ['name', 'id', 'countMessages']
            })

            if (!hashtags) return res.status(404).json(hashtags)

            hashtags.responseTitle = 'Хэштеги';
            hashtags.responseTitleEng = 'Hashtags';

            return res.status(200).json(hashtags)
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
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
            console.log(hashtagsToInput, hashtag)

            return res.status(200).json({ hashtagsToInput })
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }
    async getMessages(req, res) {
        try {
            const { isAuth } = req.user;
            const params = req.params;

            if (!params?.name) return res.status(400).json({ message: 'bad request' })

            const query = req.query;

            const Limit = +query.limit || 20;
            const Page = +query.page || 1;
            const indexFirstElement = (Page - 1) * Limit

            const includes = []

            if (isAuth) {
                includes.push({
                    model: Likes,
                    where: {
                        userId: req.user.id
                    },
                    required: false
                })
            }


            const hashtag = await Hashtag.findAndCountAll({
                where: { name: params.name },
                attributes: ['id'],
                include: [
                    {
                        model: Message,
                        attributes: [],
                        through: { attributes: [] },
                    }
                ],
            })
            console.log(hashtag)

            if (!hashtag.rows[0]) return res.status(404).json({ message: 'hashtag is not defined' })

            const messages = await messageHashtag.findAndCountAll({
                limit: Limit, offset: indexFirstElement,
                attributes: [],
                where: { hashtagId: hashtag.rows[0].dataValues.id },
                include: [{
                    model: Message,
                    attributes: ["id", "userId", "text", "likesNum", "img"],
                    required: true,
                    include: [
                        {
                            model: Hashtag,
                            attributes: ['name', 'id'],
                            through: {
                                attributes: [],
                            },
                            raw: true
                        }, {
                            model: User,
                            attributes: ['img', 'name', 'email', 'id'],
                            raw: true,
                        }, ...includes
                    ]
                }]
            })

            return res.status(200).json({ messages, hashtag })
        } catch (error) {
            console.log(error)
            return res.status(500).json(error.message)
        }
    }
}
module.exports = new hashtagRouter()