const { Message, Image } = require('../models/models')
const uuid = require("uuid")
const path = require("path")
const ApiError = require("../error/ApiError")

class messageRouter {
    async addMessage(req, res) {
        try {
            const { text } = req.body;

            if (text) {
                const { img } = req.files
                let filename = uuid.v4() + ".jpg";

                img.mv(path.resolve(__dirname, '..', 'static', filename))

                const message = await Message.create({ text, img: filename })
                const image = await Image.create({ url: filename, messageId: message.id })

                return res.json({ message, image })
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

        const AllMessages = await Message.findAndCountAll({ limit: Limit, offset: indexFirstElement })

        return res.json(AllMessages)
    }
}
module.exports = new messageRouter()