const { Hashtag, Message } = require('../models/models')

class hashtagRouter {
    async addHashtag(req, res) {
        const hashtagName = req.body
        console.log(hashtagName)
        const hashtag = await Hashtag.create(hashtagName)
        res.json(hashtag)
    }
    async getHashtag(req, res) {
        const { id } = req.params
        const { limit, page } = req.query
        const Limit = limit || 20;
        const Page = page ? page : 1;
        const indexFirstElement = (Page - 1) * Limit;

        const hashtag = await Hashtag.findOne({
            where: { id }
        })
        const messageWithHashtag = await Message.findAndCountAll({
            where: { hashtagId: id },
            limit: Limit,
            offset: indexFirstElement
        })
        res.json({ hashtag, messageWithHashtag })
    }
}
module.exports = new hashtagRouter()