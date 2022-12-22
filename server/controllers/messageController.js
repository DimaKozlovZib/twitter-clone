const { Message, Image, User, Likes } = require('../models/models')
const uuid = require("uuid")
const path = require("path")
const ApiError = require("../error/ApiError")
const jwt = require("jsonwebtoken")
const { Sequelize } = require("sequelize");

class messageRouter {
    async addMessage(req, res, next) {
        try {
            const { text } = req.body;
            const { id } = req.user;

            if (text && id) {

                if (req.files && req.files.img) {
                    const { img } = req.files;
                    const message = await Message.create({ text, img: filename, })
                    let filename = uuid.v4() + ".jpg";


                    img.mv(path.resolve(__dirname, '..', 'static', filename))
                    const image = await Image.create({ url: filename, messageId: message.id })
                }
                const message = await Message.create({ text, userId: id })

                return res.json({ message })
            }
            next(ApiError.badRequest("bad request"))
        } catch (error) {
            next(ApiError.badRequest(error.message))
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
            const token = req.headers.authorization?.split(' ')[1]
            let decoded;
            if (token) {
                decoded = jwt.verify(token, process.env.SECRET_ACCESS_KEY)
            }

            const { page, limit } = req.query;

            const Limit = limit || 20;
            const Page = page ? page : 1;
            const indexFirstElement = (Page - 1) * Limit;

            if (token && decoded) {
                const AllMessages = await Message.findAndCountAll({
                    limit: Limit, offset: indexFirstElement,
                    include: [
                        {
                            model: User,
                            attributes: ['img', 'name', 'email', 'id'],
                            raw: true
                        }, {
                            model: Likes,
                            where: {
                                userId: decoded.id
                            },
                            required: false
                        }
                    ]
                })

                return res.json(AllMessages)
            }
            const AllMessages = await Message.findAndCountAll({
                limit: Limit, offset: indexFirstElement,
                include: User
            })

            return res.json(AllMessages)
        } catch (error) {
            console.log(error)
        }

    }
    async likeMessage(req, res, next) {
        try {
            const { type, mesId } = req.body.params;
            const { id } = req.user;

            if (type === 'add' && mesId) {
                await Likes.create({ messageId: mesId, userId: id })
                await Message.increment('likesNum', {
                    by: 1,
                    where: {
                        id: mesId
                    }
                })

                return res.json({ likeIsActive: true, })

            } else if (type === 'delete' && mesId) {
                await Likes.destroy({ where: { messageId: mesId, userId: id } })
                await Message.decrement('likesNum', {
                    by: 1,
                    where: {
                        id: mesId
                    }
                })

                return res.json({ likeIsActive: false, })

            } else {
                next(ApiError.badRequest('не правильный запрос'))
            }
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }
}
module.exports = new messageRouter()