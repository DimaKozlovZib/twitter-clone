const { Message, Image, User, Likes, Hashtag, Comment } = require('../models/models')
const uuid = require("uuid")
const path = require("path")
const ApiError = require("../error/ApiError")
//const jwt = require("jsonwebtoken")
const { Sequelize, Op } = require("sequelize");
const interactionMessage = require('../analytics/interactionMessage')
const client = require('../models/redis')
const Recommendations = require('../recommendationAlgorithm/main')

class messageRouter {
    async addMessage(req, res, next) {
        try {
            const { text, hashtagsString } = req.body;
            const { id } = req.user;
            const retweetId = req.body?.retweetId;

            const f = req.files?.file
            const images = f && !f.length ? [f] : f;
            const imgLen = images?.length

            if ((!retweetId && !text)) return res.status(400).json({ message: 'no text', text: 0 });

            // проверяем изображения на типы

            const imageFileCondition = images.filter(file => {
                return !file || !"image/jpeg,image/png,image/gif,image/webp".split(',').includes(file.mimetype)
            }).length !== 0

            if (imageFileCondition) {
                return res.status(415).json({ message: 'не передан файл или файл не правильного типа' })
            }

            //проверка на ретвит
            const retweetMessage = retweetId ? await Message.findOne({ where: { id: retweetId } }) : null

            if (!retweetMessage && !text) return res.status(404).json({ message: 'bad request' });

            //создаем новый твит
            const message = await Message.create({ text, userId: id, retweetId: retweetId || null });

            //связываем твит с другим как ретвит
            if (retweetId) {
                await message.setRetweet(retweetMessage);

                if (retweetMessage.userId === id) return;

                await retweetMessage.increment('retweetCount', {
                    by: 1,
                })
            }
            //(создаем и) связываем хэштеги с твитом
            const allHashtags = hashtagsString.split(',')
            if (allHashtags?.length > 0) {
                allHashtags.forEach(async i => {
                    const hashtagName = i.slice(1);

                    if (hashtagName.trim().length === 0) return;
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
            }
            //создаем изображения

            if (imgLen > 0) {
                images.forEach(async file => {
                    const filename = 'messageImage' + uuid.v4() + ".jpg";
                    file.mv(path.resolve(__dirname, '..', 'static', filename))
                    await Image.create({ url: filename, messageId: message.id })
                })
            }

            return res.status(200).json({ message })
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
            console.log(isAuth)
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
                    },
                    {
                        model: Image,
                        attributes: ['url', 'id'],
                    },
                    {
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
            const { isAuth, id } = req.user;
            const params = req.query;

            const Limit = +params.limit || 20;
            //смотрим есть ли сообщения в redis
            const key = `messages-${id}`;
            let messages = await client.get(key, (err, data) => {
                if (err) res.status(500).json(err)
                else return data;
            })
            //если нет то вызываем алгоритм
            if (!messages || messages.length < Limit) {
                messages = await Recommendations(id)
            }
            // разделяем на два массив, для ответа и для сохранения в базу
            const dataToSave = messages.slice(Limit);
            const dataToResponse = messages.slice(0, Limit)
            //получаем данные для клиента
            const objects = await Message.findAll({
                where: { id: { [Op.or]: dataToResponse.map(i => i['dataValues']['messageId']) } },
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
                    }]
            })
            res.status(200).json(objects)
            //сохраняем массив в redis
            if (dataToSave.length === 0) return;
            client.set(key, JSON.stringify(dataToSave), function (err, reply) {
                if (err) {
                    console.error('Ошибка при установке ключа:', err);
                } else {
                    console.log('Ключ успешно установлен:', reply);
                    // Установка ограничения времени жизни в 2 дня
                    client.expire(key, 2 * 24 * 60 * 60, function (err, reply) {
                        if (err) {
                            console.error('Ошибка при установке ограничения времени жизни:', err);
                        } else {
                            console.log('Ограничение времени жизни успешно установлено:', reply);
                        }
                    });
                }
            }
            )
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