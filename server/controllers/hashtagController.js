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
        try {
            const params = req.params

            if (!params.name) return res.status(400).json({ message: 'bad request' })

            const hashtag = await Hashtag.findOne({
                where: { name: params.name },
                attributes: ['id', 'name', 'countMessages']
            })
            res.status(200).json(hashtag)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
    async getHashtagsForInput(req, res) {
        try {
            const { hashtag } = req.query;

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