const { Message, Media, User, Likes, Hashtag, Comment } = require('../models/models')
const uuid = require("uuid")
const path = require("path")
const ApiError = require("../error/ApiError")
//const jwt = require("jsonwebtoken")
const { Sequelize, Op } = require("sequelize");
const interactionMessage = require('../analytics/interactionMessage')
const Recommendations = require('../recommendationAlgorithm/main');
const { user_IncludeObject, hashtag_IncludeObject, media_IncludeObject, retweetIncludeObject } = require('../includeObjects');
const { USER_RECOMMENDATION } = require('../models/mongoModels');


class messageRouter {
    //async getVideo(req, res) {
    //    console.log(req)
    //    
    //    const range = req.headers.range;
    //    if (!range) {
    //        res.status(400).send("Requires Range header");
    //    }
    //
    //    const videoSize = fs.statSync(videoPath).size;
    //
    //    const CHUNK_SIZE = 10 ** 6; // 1MB
    //    const start = Number(range.replace(/\D/g, ""));
    //    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    //
    //    // Create headers
    //    const contentLength = end - start + 1;
    //    const headers = {
    //        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    //        "Accept-Ranges": "bytes",
    //        "Content-Length": contentLength,
    //        "Content-Type": "video/mp4",
    //    };
    //
    //    // HTTP Status 206 for Partial Content
    //    res.writeHead(206, headers);
    //
    //    // create video read stream for this particular chunk
    //    const videoStream = fs.createReadStream(videoPath, { start, end });
    //
    //    videoStream.pipe(res);
    //}
    async addMessage(req, res, next) {
        try {
            const { text, hashtagsString } = req.body;
            const { id } = req.user;
            const retweetId = Number(req.body?.retweetId);

            const f = req.files?.file
            const media = f && !f.length ? [f] : f;
            const filesLen = media?.length

            if (!text) return res.status(400).json({ message: 'no text', text: 0 });

            // проверяем изображения на типы

            const mediaFileCondition = media?.filter(file => {
                return !file || !"image/jpeg,image/png,image/gif,image/webp,video/mp4".split(',').includes(file.mimetype)
            }).length !== 0

            if (mediaFileCondition && f) {
                return res.status(415).json({ message: 'не передан файл или файл не правильного типа' })
            }

            //проверка на ретвит
            const retweetMessage = retweetId ? await Message.findOne({ where: { id: retweetId } }) : null

            if (!retweetMessage && retweetId) return res.status(404).json({ message: 'retweet message is not defined', retweetMessage: 0 });

            //создаем новый твит
            const message = await Message.create({ text, userId: id, retweetId: retweetId || null });

            //связываем твит с другим как ретвит
            if (retweetId) {
                await message.setRetweet(retweetMessage);

                if (retweetMessage.userId !== id) {
                    await retweetMessage.increment('retweetCount', {
                        by: 1,
                    })
                };
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
            if (filesLen > 0) {
                media.forEach(async (file, index) => {
                    let filename, type;

                    switch (file.mimetype.split('/')[0]) {
                        case 'video':
                            type = 'video';
                            filename = 'messageVideo' + uuid.v4() + ".mp4";
                            break;
                        case 'image':
                            type = 'image';
                            filename = 'messageImage' + uuid.v4() + ".jpg";
                            break;
                    }
                    file.mv(path.resolve(__dirname, ...process.env.PATH_TO_DIST.split('/'), 'static', filename))

                    await Media.create({ url: filename, messageId: message.id, type, indexInMessage: index })
                })
            }

            return res.status(200).json({ message })
        } catch (error) {
            console.log(error)
            return res.status(500).json(error.message)
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
                include: [user_IncludeObject]

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
                    user_IncludeObject,
                    hashtag_IncludeObject,
                    media_IncludeObject,
                    retweetIncludeObject, ...include
                ]
            });

            const comments = await Comment.findAndCountAll({
                where: {
                    messageId
                },
                attributes: ['text', 'id', 'messageId', 'userId'],
                include: [
                    user_IncludeObject
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
    async getMessageContent(req, res) {
        try {
            const data = req.body;
            const { id, isAuth } = req.user

            if (!data?.messageId) return res.status(400).json({ message: 'bad request' })
            const { messageId } = data;
            const includes = []

            const getRetweet = data.getRetweet || false;
            if (getRetweet) includes.push(retweetIncludeObject)

            const getLikes = data.getLikes || false;
            const likesIncludeObject = {
                model: Likes,
                where: {
                    userId: +id
                },
                required: false
            }
            if (getLikes && isAuth) includes.push(likesIncludeObject)

            const message = await Message.findOne({
                where: {
                    id: messageId
                },
                attributes: ['text', 'id', 'likesNum', 'retweetCount', 'retweetId', 'createdAt', 'commentsCount'],
                include: [
                    user_IncludeObject,
                    hashtag_IncludeObject,
                    media_IncludeObject, ...includes
                ]
            });

            return res.status(200).json({ message })
        } catch (error) {
            return res.status(500).json(error)
        }
    }
    async getMessages(req, res) {
        try {
            const { isAuth, id } = req.user;
            const params = req.query;

            const Limit = +params.limit || 20;
            const viewedData = JSON.parse(params.viewedDataJSON)

            //смотрим есть ли сохраннёные сообщения в списке
            let messages = await USER_RECOMMENDATION.getRecommendation(id)
            //если нет то вызываем алгоритм
            if (!messages || messages?.length < Limit) {
                messages = await Recommendations(id, viewedData)
            }
            // разделяем на два массив, для ответа и для сохранения в базу
            const dataToSave = messages.slice(Limit);
            const dataToResponse = messages.slice(0, Limit)
            //получаем данные для клиента
            const incl = []
            if (isAuth) {
                incl.push({
                    model: Likes,
                    where: { userId: id },
                    required: false
                })
            }

            const objects = await Message.findAll({
                where: { id: { [Op.in]: dataToResponse } },
                attributes: ['text', 'id', 'likesNum', 'retweetCount', 'retweetId', 'createdAt', 'commentsCount'],
                include: [
                    user_IncludeObject,
                    hashtag_IncludeObject,
                    media_IncludeObject,
                    retweetIncludeObject,
                    ...incl
                ]
            })

            res.status(200).json(objects)
            //сохраняем массив в mongo
            USER_RECOMMENDATION.setRecommendation(id, dataToSave);
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