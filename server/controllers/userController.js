const ApiError = require("../error/ApiError")
const bcrypt = require("bcrypt")
const uuid = require("uuid")
const path = require("path")
const jwt = require("jsonwebtoken")
const fs = require('fs')
const { User, Media, Message, Friends, Hashtag } = require("../models/models")
const { Sequelize } = require("../db")
const { Op } = require("sequelize")
const { media_IncludeObject, hashtag_IncludeObject, user_IncludeObject, retweetIncludeObject } = require("../includeObjects")

const generateJwt = (payload) => {
    const accessToken = jwt.sign(
        payload,
        process.env.SECRET_ACCESS_KEY,
        { expiresIn: '24h' }
    )
    const refreshToken = jwt.sign(
        payload,
        process.env.SECRET_REFRESH_KEY,
        { expiresIn: '30d' }
    )
    return {
        accessToken, refreshToken
    }
}

class userRouter {
    async registration(req, res, next) {
        try {
            const { name, email, password, age } = req.body

            if (!email || !password || !name) return next(ApiError.badRequest("bad requst"));

            const candidateEmail = await User.findOne({ where: { email } })

            if (candidateEmail) {
                return next(ApiError.badRequest("Пользователь с такой почтой уже существует."))
            }
            const hashPassword = await bcrypt.hash(password, 6)

            // random cover image
            const dirpath = path.join(__dirname, ...process.env.PATH_TO_DIST.split('/'), 'static-cover');

            const files = fs.readdirSync(dirpath)

            function getImage() {
                if (!files) return null;

                const imageIndex = Math.floor(Math.random() * (files.length - 1))
                return files[imageIndex]
            }
            const userCoverPath = getImage()

            const user = await User.create({ name, password: hashPassword, email, age, coverImage: userCoverPath })

            const d = await Friends.create({ userId: user.id })
            d.addUser(user)
            const { accessToken, refreshToken } = generateJwt({ id: user.id, email: user.email })
            res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.status(200).json({ user, accessToken })
        } catch (error) {
            return next(ApiError.internal(error.message))
        }

    }

    async autoLogin(req, res, next) {
        try {
            const { email, id } = req.user
            const user = await User.findOne({
                where: { email },
                attributes: ['img', 'name', 'email', 'age', 'id', 'coverImage', 'shortInfo']
            })

            if (!user) return res.status(401).json({ message: 'не авторизован' });

            //let comparePassword = bcrypt.compareSync(password, user.password)
            //if (!comparePassword) {
            //    return next(ApiError.badRequest("Указан не верный пароль."))
            //}
            const { accessToken, refreshToken } = generateJwt({ id, email })
            res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.status(200).json({ accessToken, user })
        } catch (error) {
            return next(ApiError.internal(error.message))
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) return res.status(400).json({ message: 'bad request' });

            const user = await User.findOne({ where: { email } });

            if (!user) return res.status(401).json({ message: 'не авторизован' });

            let comparePassword = bcrypt.compareSync(password, user.password);
            if (!comparePassword) {
                return res.status(400).json({ message: 'Указан неверный пароль' })
            }

            const { accessToken, refreshToken } = generateJwt({ id: user.id, email })
            res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.status(200).json({ accessToken, user })
        } catch (error) {
            return next(ApiError.internal(error.message))
        }
    }

    async auth(req, res, next) {
        try {
            const { refreshToken } = req.cookies;

            if (!refreshToken) {
                return res.status(401).json({ message: 'не авторизован' })
            }

            const { id, email } = jwt.verify(refreshToken, process.env.SECRET_REFRESH_KEY)
            const user = await User.findOne({ where: { id } })

            if (!user) {
                return next(ApiError.badRequest("Пользователь не найден."))
            }

            const { newRefreshToken, accessToken } = generateJwt({ id, email })

            res.cookie('refreshToken', newRefreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.status(200).json({ accessToken, newRefreshToken })

        } catch (error) {
            console.log(error)
            return res.status(401).json({ message: 'не авторизован' })
        }
    }

    async getFriends(req, res, next) {
        try {
            const { id } = req.user;
            const params = req.query;

            const limit = params?.limit || 20
            const page = params.page || 0;
            const offset = page * limit

            const friends = await User.findAndCountAll({
                limit, offset,
                attributes: ['id', 'name', 'email', 'img'],
                where: { id: { [Op.ne]: id } },
                include: {
                    model: Friends,
                    where: { userId: id },
                    attributes: [],
                    through: { attribute: [] },
                    require
                }
            })
            return res.status(200).json(friends)

        } catch (error) {
            return next(ApiError.internal(error.message))
        }
    }

    async getUser(req, res, next) {
        try {
            const { id } = req.params;
            const { isAuth } = req.user;

            if (!Number(id) || !id) return res.status(400).json({ message: 'bad request' })

            const userObj = await User.findOne({
                where: { id },
                attributes: ['img', 'age', 'name', 'email', 'id', 'coverImage', 'shortInfo'],
                include: isAuth ? {
                    model: Friends,
                    where: { userId: req.user?.id, },
                    required: false,
                    through: {
                        attributes: []
                    }
                } : []
            })

            if (!userObj) return res.status(404).json({ message: 'user is not found' })

            const messages = await Message.findAndCountAll({
                where: { userId: id },
                attributes: [
                    [Sequelize.fn('sum', Sequelize.col('likesNum')), 'total_likesNum'],
                ],
                group: ['likesNum'],
                raw: true
            });

            const user = {
                ...userObj.dataValues,
                totalLikesNum: +messages.rows[0]?.total_likesNum
            }

            if (isAuth && req.user.id === +id) {
                return res.status(200).json({ user, canEdit: true })
            }
            return res.status(200).json({ user, canEdit: false })
        } catch (error) {
            console.log(error)
            return next(ApiError.internal(error.message))
        }
    }

    async getUserMessages(req, res, next) {
        try {
            const { id } = req.params;
            const query = req.query;

            if (!id || !Number(id)) return res.status(400).json('error: bad request')

            const viewedData = req.viewedData?.messages || [];

            const Limit = +query?.limit || 20;
            const Offset = (+query?.page || 0) * Limit;

            if (Limit <= 0 || Offset < 0) return res.status(400).json('error: bad request')

            const messages = await Message.findAll({
                offset: Offset, limit: Limit,
                where: { userId: id, id: { [Op.notIn]: viewedData } },
                attributes: ['text', 'id', 'likesNum', 'retweetCount', 'retweetId', 'createdAt', 'commentsCount'],
                include: [user_IncludeObject, hashtag_IncludeObject, media_IncludeObject, retweetIncludeObject],
                order: [['createdAt', 'DESC']]

            })
            return res.status(200).json(messages)
        } catch (error) {
            console.log(error)
            return next(ApiError.internal(error.message))
        }
    }

    async setCover(req, res, next) {
        try {
            const { id } = req.user;
            const file = req.files.file;

            if (!file && !"image/jpeg,image/png,image/gif,image/webp".split(',').includes(file.mimetype)) {
                return res.status(415).json({ message: 'не передан файл или файл не правильного типа' })
            }

            const oldCover = await Media.findOne({ where: { userId: id } })
            if (oldCover) {
                const oldCoverPath = path.resolve(__dirname, ...process.env.PATH_TO_DIST.split('/'), 'static', oldCover.url)
                fs.unlink(oldCoverPath, console.log)
                await Media.destroy({ where: { id: oldCover.id } })
            }

            const filename = uuid.v4() + ".jpg";
            file.mv(path.resolve(__dirname, ...process.env.PATH_TO_DIST.split('/'), 'static', filename))

            const newCover = await Media.create({ url: filename, userId: id, type: 'image' })

            await User.update({ coverImage: newCover.url }, { where: { id: id } })

            return res.status(200).json({ message: 'success', url: filename })

        } catch (error) {
            console.log(error)
            return next(ApiError.internal(error.message))
        }

    }

    async setAvatar(req, res, next) {
        try {
            const { email, id } = req.user;
            const file = req.files?.file;

            if (!file && !"image/jpeg,image/png,image/gif,image/webp".split(',').includes(file.mimetype)) {
                return res.status(415).json({ message: 'не передан файл или файл не правильного типа' })
            }

            const user = await User.findOne({ where: { id } })
            const oldAvatar = user?.img

            if (oldAvatar) {
                const oldAvatarPath = path.resolve(__dirname, ...process.env.PATH_TO_DIST.split('/'), 'static-avatars', oldAvatar)
                fs.unlink(oldAvatarPath, console.log)
                await Media.destroy({ where: { userId: id, url: oldAvatar } })
            }


            const filename = uuid.v4() + ".jpg";
            file.mv(path.resolve(__dirname, ...process.env.PATH_TO_DIST.split('/'), 'static-avatars', filename))
            const newAvatar = await Media.create({ url: filename, userId: id, type: 'image' })

            await User.update({ img: filename }, { where: { id } })

            return res.status(200).json({ message: 'success', url: filename })

        } catch (error) {
            console.log(error)
            return next(ApiError.internal(error.message))
        }

    }

    async changeInfo(req, res, next) {
        try {
            const { email, id } = req.user;
            const data = req.body;

            const user = await User.findOne({ where: { id, email } });

            if (!user) return res.status(401).json({ message: 'не авторизован' });

            if (Object.keys(data).length === 0) return res.status(400).json({ message: 'bad request' });

            const allNewData = {};

            for (const item in data) {
                if (!['shortInfo', 'age', 'name'].includes(item)) {
                    return res.status(400).json({ message: `you cant change ${item}` });
                }

                if (data[item] !== user.dataValues[item]) {
                    allNewData[item] = data[item]
                }
            }

            if (Object.keys(allNewData).length === 0) return res.status(400).json({ message: 'you not give new data' });

            await User.update({ ...allNewData }, { where: { id: id } })

            const newUserData = await User.findOne({ where: { id: id }, attributes: ['img', 'name', 'email', 'age', 'id', 'coverImage', 'shortInfo'] })

            return res.status(200).json({ user: newUserData })
        } catch (error) {
            return next(ApiError.internal(error.message))
        }
    }

    async subscribe(req, res, next) {
        try {
            const userId = req.body?.userId;
            const { email, id } = req.user;

            if (!userId || !Number(userId)) return res.status(400).json({ message: 'bad request' })

            const newFutureFriend = await User.findOne({ where: { id: userId } })

            if (!newFutureFriend) return res.status(404).json({ message: 'user not found' })

            const [userFriends] = await Friends.findOrCreate({ where: { userId: id } });

            userFriends.addUser(newFutureFriend)

            return res.status(200).json({ message: 'succes' })
        } catch (error) {
            return next(ApiError.internal(error.message))
        }
    }

    async unsubscribe(req, res, next) {
        try {
            const userId = req.body?.userId;
            const { email, id } = req.user;

            if (!userId || !Number(userId)) return res.status(400).json({ message: 'bad request' })

            const oldFriend = await User.findOne({ where: { id: userId } })

            if (!oldFriend) return res.status(404).json({ message: 'user not found' })

            const userFriends = await Friends.findOne({ where: { userId: id } });

            userFriends.removeUser(oldFriend)

            return res.status(200).json({ message: 'succes' })
        } catch (error) {
            return next(ApiError.internal(error.message))
        }
    }

    async logout(req, res, next) {
        try {
            res.clearCookie('refreshToken')
            return res.status(200).json({ message: 'succes' })
        } catch (error) {
            return next(ApiError.internal(error.message))
        }
    }
    async getFirstConnectionUsers(req, res, next) {
        try {
            const user = req.user;

            const friends = await User.findAll({
                attributes: ['id'],
                raw: true,
                where: { id: { [Op.ne]: user.id } },
                include: [{
                    model: Friends,
                    where: { userId: user.id },
                    attributes: [],
                    through: {
                        attributes: []
                    }
                }]
            })
            if (!friends || friends.length === 0) return res.status(400).json({ users: [] })

            const friendsOfFriends = await User.findAll({
                attributes: ['id'],
                raw: true,
                where: { id: { [Op.notIn]: friends.map(i => i.id), [Op.ne]: user.id } },
                include: [{
                    attributes: [],
                    model: Friends,
                    where: { userId: { [Op.in]: friends.map(i => i.id) } },
                    through: {
                        attributes: []
                    }
                }]
            })

            if (!friendsOfFriends || friendsOfFriends.length === 0) return res.status(400).json({ users: [] })

            const uniqueFriends = Array.from(new Set(friendsOfFriends))
            // Перемешайте элементы списка
            const shuffled = uniqueFriends.sort(() => 0.5 - Math.random());

            // Получите первые три элемента
            const randomThree = shuffled.slice(0, 3);

            const result = []
            for (let index = 0; index < randomThree.length; index++) {
                const element = randomThree[index];

                const user = await User.findOne({
                    where: { id: element.id },
                    attributes: ['id', 'name', 'email', 'img']
                })

                const mutualFriends = await User.findAndCountAll({
                    limit: 3,
                    where: { id: { [Op.col]: 'friend.userId', [Op.in]: friends.map(i => i.id) } },
                    attributes: ['id', 'img'],
                    include: [{
                        model: Friends,
                        where: { userId: { [Op.or]: friends.map(i => i.id) } },
                        required: true,
                        attributes: [],
                        through: {
                            attributes: []
                        },
                        include: [{
                            model: User,
                            required: true,
                            where: { id: element.id },
                            attributes: [],
                            through: {
                                attributes: []
                            }
                        }]
                    }],
                })

                result.push({ user, mutualFriends })
            }

            return res.status(200).json({ users: result })
        } catch (error) {
            console.log(error)
            return next(ApiError.internal(error.message))
        }
    }
}
module.exports = new userRouter()