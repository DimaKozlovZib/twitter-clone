const { Message, Image, User, Likes, Hashtag } = require('../models/models')
const uuid = require("uuid")
const path = require("path")
const ApiError = require("../error/ApiError")
const jwt = require("jsonwebtoken")
const { Sequelize, Op } = require("sequelize");

class messageRouter {
    async addMessage(req, res, next) {
        try {
            const { text, hashtags } = req.body;
            const { id } = req.user;

            if (!text || !id || !hashtags) return res.status(400).json({ message: 'bad request' });

            const message = await Message.create({ text, userId: id });

            res.status(200).json({ message })

            hashtags.forEach(async (hashtagName) => {
                const hashtag = await Hashtag.findOne({ where: { name: hashtagName } })

                if (hashtag) {
                    message.addHashtag(hashtag, { through: { countMessages: hashtag.countMessages + 1 } })
                    hashtag.update('countMessages', {
                        by: 1
                    })
                } else {
                    const newHashtag = await Hashtag.create({ name: hashtagName, countMessages: 1 })
                    message.addHashtag(newHashtag)
                }
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json(error.message)
        }
    }

    async deleteMessage(req, res) {
        const { id } = req.params;
        const message = await Message.destroy({
            where: { id }
        })
        const image = await Image.destroy({
            where: { messageId: id }
        })
        return res.json(message)
    }

    async getMessages(req, res) {
        try {
            const { isAuth } = req.user;
            const { page, limit } = req.query;

            const Limit = limit || 20;
            const Page = page || 1;
            const indexFirstElement = (Page - 1) * Limit;

            if (isAuth) {
                if (!req.query.userId && !req.user.id) return res.status(400).json({ message: 'bad request' });

                const AllMessages = await Message.findAndCountAll({
                    limit: Limit, offset: indexFirstElement,
                    where: {
                        userId: +req.query.userId || { [Op.not]: req.user.id }
                    },
                    order: [
                        ['createdAt', 'DESC'],
                        ['likesNum', 'DESC'],
                    ],
                    include: [
                        {
                            model: User,
                            attributes: ['img', 'name', 'email', 'id'],
                            raw: true,

                        }, {
                            model: Likes,
                            where: {
                                userId: req.user.id
                            },
                            required: false
                        }, {
                            model: Hashtag,
                            attributes: ['name', 'id'],
                            through: {
                                attributes: []
                            }
                        }
                    ]
                })
                return res.json(AllMessages)
            }

            const AllMessages = await Message.findAndCountAll({
                limit: Limit, offset: indexFirstElement,
                include: [
                    {
                        model: User,
                        attributes: ['img', 'name', 'email', 'id'],
                        raw: true
                    }, {
                        model: Hashtag,
                        attributes: ['name', 'id'],
                        through: {
                            attributes: []
                        }
                    }
                ]
            })

            return res.json(AllMessages)
        } catch (error) {
            console.log(error)
            return res.status(500).json(error.message)
        }

    }
    async likeMessage(req, res) {
        try {
            const { mesId } = req.body.params;
            const { id } = req.user;

            if (!id && !mesId) return res.status(400).json({ message: 'bad request' })

            const userLike = await Likes.findOne({ where: { userId: id, messageId: mesId } })

            if (!userLike) {
                await Likes.create({ messageId: mesId, userId: id })
                await Message.increment('likesNum', {
                    by: 1,
                    where: {
                        id: mesId
                    }
                })
                const message = await Message.findOne({ where: { id: mesId }, attributes: ['likesNum'] })

                return res.json({ likeIsActive: true, likesNum: message.dataValues.likesNum })

            } else {
                await Likes.destroy({ where: { messageId: mesId, userId: id } })
                await Message.decrement('likesNum', {
                    by: 1,
                    where: {
                        id: mesId
                    }
                })
                const message = await Message.findOne({ where: { id: mesId }, attributes: ['likesNum'] })

                return res.status(200).json({ likeIsActive: false, likesNum: message.dataValues.likesNum })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json(error.message)
        }
    }
}
module.exports = new messageRouter()