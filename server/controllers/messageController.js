const { Message, Image, User } = require('../models/models')
const uuid = require("uuid")
const path = require("path")
const ApiError = require("../error/ApiError")

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
                const user = User.findOne({ id })
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
        const { page, limit } = req.query;

        const Limit = limit || 20;
        const Page = page ? page : 1;
        const indexFirstElement = (Page - 1) * Limit;

        const AllMessages = await Message.findAndCountAll({
            limit: Limit, offset: indexFirstElement,
            include: User
        })

        return res.json(AllMessages)
    }
}
module.exports = new messageRouter()