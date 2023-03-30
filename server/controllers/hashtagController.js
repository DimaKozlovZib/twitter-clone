const { Hashtag, Message } = require('../models/models');
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
    async getHashtagsForInput(req, res) {
        try {
            const { hashtag } = req.query;
            console.log(req)

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
}
module.exports = new hashtagRouter()