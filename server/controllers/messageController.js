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

            hashtags.filter(item => item.length > 0).forEach(async (hashtagName) => {
                const hashtag = await Hashtag.findOne({ where: { name: hashtagName } })

                if (hashtag) {
                    message.addHashtag(hashtag, { through: { countMessages: hashtag.countMessages + 1 } })
                    hashtag.update({
                        countMessages: hashtag.countMessages + 1
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
    async searchMessages(req, res) {
        try {
            const data = req.body;

            if (!data?.text) return res.status(400).json({ message: 'bad request' })
            const { text } = data;

            const Limit = data.limit || 3;
            const Page = ((data.page || 1) - 1) * Limit;
            console.log(Limit)

            //получаем сообшения имеющие искомую подстроку
            const messages = await Message.findAndCountAll({
                limit: Limit, offset: Page,
                where: {
                    text: {
                        [Sequelize.Op.like]: `%${text}%`
                    }
                },
                attributes: ['text', 'id', 'likesNum'],
                include: [
                    {
                        model: User,
                        attributes: ['name', 'id', 'img', 'email']
                    },
                    {
                        model: Hashtag,
                        attributes: ['name', 'id'],
                        through: { attributes: [] } // Отключаем вывод информации о промежуточной таблице
                    }
                ]
            });

            messages.responseTitle = 'Сообщения'
            messages.responseTitleEng = 'Messages'

            if (messages?.rows.length === 0) return res.status(404).json(messages)

            return res.status(200).json(messages)
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }
    async deleteMessage(req, res) {
        try {
            if (!req.params.id) return res.status(400).json({ message: 'bad request' })
            const { id } = req.params;
            const userId = req.user.id;
            const message = await Message.findOne({
                where: { id, userId }
            })
            if (!message) return res.status(404).json({ message: 'message not found' })
            const result = message.destroy()

            return res.status(200).json(result)
        } catch (error) {
            return res.status(500).json(error.message)
        }

    }

    async getMessages(req, res) {
        try {
            const { isAuth } = req.user;
            const params = req.query;

            const Limit = +params.limit || 20;
            const Page = +params.page || 1;
            const indexFirstElement = (Page - 1) * Limit
            let where = {},
                includes = []

            if (params.userId) {
                where = {
                    userId: +params.userId
                }
            } else {
                where = {
                    userId: { [Op.not]: req.user.id }
                }
            }
            if (isAuth) {
                includes.push({
                    model: Likes,
                    where: {
                        userId: +req.user.id
                    },
                    required: false
                })
            }

            const AllMessages = await Message.findAndCountAll({
                limit: Limit, offset: indexFirstElement,
                all: true,
                where,
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
                        model: Hashtag,
                        attributes: ['name', 'id'],
                        through: {
                            attributes: []
                        }
                    }, ...includes
                ]
            })
            return res.status(200).json(AllMessages)
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