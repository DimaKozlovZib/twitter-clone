const { User, Hashtag, Friends } = require("../models/models")
const { Op } = require("sequelize")

class generaleRouter {
    async search(req, res) {
        try {
            const { isAuth, id } = req.user;
            const limit = Number(req.query.limit) || 3
            const onlyModel = req.query.onlyModel || null;
            const needFriend = req.query.needFriend || null;
            const page = Number(req.query.page) || 1
            const searchString = req.query.searchString

            if (!searchString || searchString.lenght === 0) return res.status(400).json('bad request')

            const offset = (page - 1) * limit

            const searchUsers = async () => {
                try {
                    const result = await User.findAndCountAll({
                        limit, offset,
                        where: {
                            [Op.or]: [{ 'name': { [Op.iLike]: `%${searchString}%` } }, { 'shortInfo': { [Op.iLike]: `%${searchString}%` } }],
                            id: { [Op.ne]: id }
                        },
                        attributes: ['img', 'name', 'email', 'id', 'shortInfo'],
                        include: (isAuth && needFriend) ? {
                            model: Friends,
                            where: { userId: req.user?.id, },
                            required: false,
                            through: {
                                attributes: []
                            }
                        } : []
                    })

                    if (!result) return {}
                    return result
                } catch (error) { return {} }
            }
            const searchHashtags = async () => {
                try {
                    const result = await Hashtag.findAndCountAll({
                        limit, offset,
                        where: {
                            name: { [Op.iLike]: `%${searchString}%` }
                        },
                        attributes: ['name', 'id', 'countMessages']
                    })

                    if (!result) return {}
                    return result
                } catch (error) { return {} }
            }

            const users = onlyModel && onlyModel !== 'user' ? null : await searchUsers()
            const hashtags = onlyModel && onlyModel !== 'hashtag' ? null : await searchHashtags()

            return res.status(200).json({
                users, hashtags
            })
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}
module.exports = new generaleRouter()