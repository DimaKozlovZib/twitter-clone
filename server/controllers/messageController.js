const { Message, Image, User, Likes, Hashtag, Comment } = require('../models/models')
const uuid = require("uuid")
const path = require("path")
const ApiError = require("../error/ApiError")
const jwt = require("jsonwebtoken")
const { Sequelize, Op } = require("sequelize");
const interactionMessage = require('../analytics/interactionMessage')

class messageRouter {
    async addMessage(req, res, next) {
        try {
            const { text, hashtags } = req.body;
            const { id } = req.user;
            const retweetId = req.body?.retweetId

            if ((!retweetId && !text)) return res.status(400).json({ message: 'bad request' });

            const retweetMessage = await Message.findOne({ where: { id: retweetId } })

            if (!retweetMessage && retweetId) return res.status(404).json({ message: 'bad request' });

            const message = await Message.create({ text, userId: id, retweetId: retweetId || null });

            res.status(200).json({ message })

            if (retweetId) {
                await message.setRetweet(retweetMessage);

                if (retweetMessage.userId === id) return;

                await retweetMessage.increment('retweetCount', {
                    by: 1,
                })
                return;
            }

            if (!hashtags || !(hashtags.length === 0)) return;

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
    async addComment(req, res, next) {
        try {
            const { text, messageId } = req.body;
            const { id } = req.user;

            if (!text || !messageId) return res.status(400).json({ message: 'bad request' });

            const message = await Message.findOne({ where: { id: messageId } })

            if (!message) return res.status(404).json({ message: 'bad request' });

            const comment = await Comment.create({ text, userId: id, messageId });

            const CommentObject = await Comment.findOne({
                where: { id: comment.id },
                attributes: ['text', 'id', 'createdAt', 'messageId', 'userId'],
                include: [{
                    model: User,
                    attributes: ['name', 'id', 'img', 'email']
                }]

            })

            res.status(200).json(CommentObject)

            message.increment('commentsCount', { by: 1 })
        } catch (error) {
            console.log(error)
            return res.status(500).json(error.message)
        }
    }
    async getMessageInfo(req, res) {
        try {
            const data = req.body;
            const { id, isAuth } = req.user

            if (!data?.messageId) return res.status(400).json({ message: 'bad request' })
            const { messageId } = data;

            const include = isAuth ?
                [{
                    model: Likes,
                    where: {
                        userId: +req.user.id
                    },
                    required: false
                }] : []

            const message = await Message.findOne({
                where: {
                    id: messageId
                },
                attributes: ['text', 'id', 'likesNum', 'retweetCount', 'retweetId', 'createdAt', 'commentsCount'],
                include: [
                    {
                        model: User,
                        attributes: ['name', 'id', 'img', 'email']
                    },
                    {
                        model: Hashtag,
                        attributes: ['name', 'id'],
                        through: { attributes: [] } // Отключаем вывод информации о промежуточной таблице
                    }, {
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
                            }
                        ]
                    }, ...include
                ]
            });

            const comments = await Comment.findAndCountAll({
                where: {
                    messageId
                },
                attributes: ['text', 'id', 'messageId', 'userId'],
                include: [
                    {
                        model: User,
                        attributes: ['img', 'name', 'email', 'id'],
                        raw: true,

                    }
                ]
            })

            if (!message) return res.status(404).json('message is not defined')

            return res.status(200).json({ message, comments })
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

            res.status(200).json(result)

            if (!message.retweetId) return;
            const retweetMessage = await Message.findOne({ where: { id: message.retweetId } })

            if (!retweetMessage || retweetMessage.userId === userId) return;

            retweetMessage.decrement('retweetCount', { by: 1 })
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
            } else if (isAuth && !params.userId) {
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
                attributes: ['text', 'id', 'likesNum', 'retweetCount', 'retweetId', 'createdAt', 'commentsCount'],
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
                            }
                        ]
                    }
                    , ...includes
                ]
            })
            return res.status(200).json(AllMessages)
        } catch (error) {
            console.log(error)
            return res.status(500).json(error.message)
        }

    }
    async likeMessage(req, res, next) {
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

                res.json({ likeIsActive: true, likesNum: message.dataValues.likesNum })
                interactionMessage.setLike(id, mesId, true)
            } else {
                await Likes.destroy({ where: { messageId: mesId, userId: id } })
                await Message.decrement('likesNum', {
                    by: 1,
                    where: {
                        id: mesId
                    }
                })
                const message = await Message.findOne({ where: { id: mesId }, attributes: ['likesNum'] })

                res.status(200).json({ likeIsActive: false, likesNum: message.dataValues.likesNum })
                interactionMessage.setLike(id, mesId, false)
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json(error.message)
        }
    }
}
module.exports = new messageRouter()