const ApiError = require("../error/ApiError")
const bcrypt = require("bcrypt")
const uuid = require("uuid")
const path = require("path")
const jwt = require("jsonwebtoken")
const fs = require('fs')
const { User, Image, Message, Friends } = require("../models/models")
const { Sequelize } = require("../db")

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
            const dirpath = path.join(__dirname, '..', 'static-cover');

            const files = fs.readdirSync(dirpath)

            function getImage() {
                if (!files) return null;

                const imageIndex = Math.floor(Math.random() * (files.length - 1))
                return files[imageIndex]

            }
            const userCoverPath = getImage()

            const user = await User.create({ name, password: hashPassword, email, age, coverImage: userCoverPath })

            Friends.create({ userId: user.id })

            const { accessToken, refreshToken } = generateJwt({ id: user.id, email: user.email })
            res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.status(200).json({ user, accessToken })
        } catch (error) {
            return res.status(500).json(error.message)
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
            return res.status(500).json(error.message)
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
            return res.status(500).json(error.message)
        }
    }

    async auth(req, res) {
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
    async getFriends(req, res) {

    }
    async getUser(req, res) {
        try {
            const { id } = req.params;
            const { isAuth } = req.user;

            if (!Number(id) || !id) return res.status(400).json({ message: 'bad request' })

            const userObj = await User.findOne({
                where: { id },
                attributes: ['img', 'age', 'name', 'email', 'id', 'coverImage', 'shortInfo'],
                include: [
                    {
                        model: Friends,
                        where: { userId: req.user.id, },
                        required: false
                    }
                ]
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
                countMessages: messages?.count[0]?.count,
                totalLikesNum: +messages.rows[0]?.total_likesNum
            }

            if (isAuth && req.user.id === +id) {
                return res.status(200).json({ user, canEdit: true })
            }
            return res.status(200).json({ user, canEdit: false })
        } catch (error) {
            console.log(error)
            return res.status(500).json(error.message)
        }
    }

    async setCover(req, res) {
        try {
            const { email, id } = req.user;
            const file = req.files.file;

            if (!file && !"image/jpeg,image/png,image/gif,image/webp".split(',').includes(file.mimetype)) {
                return res.status(415).json({ message: 'не передан файл или файл не правильного типа' })
            }

            const oldCover = await Image.findOne({ where: { userId: id } })
            if (oldCover) {
                const oldCoverPath = path.resolve(__dirname, '..', 'static', oldCover.url)
                fs.unlink(oldCoverPath, console.log)
                await Image.destroy({ where: { id: oldCover.id } })
            }

            const filename = uuid.v4() + ".jpg";
            file.mv(path.resolve(__dirname, '..', 'static', filename))
            const newCover = await Image.create({ url: filename, userId: id })

            await User.update({ coverImage: newCover.url }, { where: { id: id } })

            return res.status(200).json({ message: 'success', url: filename })

        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }

    }

    async setAvatar(req, res) {
        try {
            const { email, id } = req.user;
            const file = req.files?.file;

            if (!file && !"image/jpeg,image/png,image/gif,image/webp".split(',').includes(file.mimetype)) {
                return res.status(415).json({ message: 'не передан файл или файл не правильного типа' })
            }

            const user = await User.findOne({ where: { id } })
            const oldAvatar = user?.img

            console.log(file, oldAvatar)

            if (oldAvatar) {
                const oldAvatarPath = path.resolve(__dirname, '..', 'static-avatars', oldAvatar)
                fs.unlink(oldAvatarPath, console.log)
                await Image.destroy({ where: { userId: id, url: oldAvatar } })
            }


            const filename = uuid.v4() + ".jpg";
            file.mv(path.resolve(__dirname, '..', 'static-avatars', filename))
            const newAvatar = await Image.create({ url: filename, userId: id })

            await User.update({ img: filename }, { where: { id } })

            return res.status(200).json({ message: 'success', url: filename })

        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }

    }

    async changeInfo(req, res) {
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
            return res.status(500).json(error.message)
        }
    }

    async subscribe(req, res) {
        try {
            const userId = req.body?.userId;
            const { email, id } = req.user;

            if (!userId || !Number(userId)) return res.status(400).json({ message: 'bad request' })

            const newFutureFriend = await User.findOne({ where: { id: userId } })

            if (!newFutureFriend) return res.status(404).json({ message: 'user not found' })

            const userFriends = await Friends.findOne({ where: { userId: id } });

            userFriends.addUser(newFutureFriend)

            return res.status(200).json({ message: 'succes' })
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    async unsubscribe(req, res) {
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
            return res.status(500).json(error.message)
        }
    }
}
module.exports = new userRouter()