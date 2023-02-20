const ApiError = require("../error/ApiError")
const bcrypt = require("bcrypt")
const uuid = require("uuid")
const path = require("path")
const jwt = require("jsonwebtoken")
const fs = require('fs')
const { User, Image, Message } = require("../models/models")
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

            if (!email || !password || !name) { return next(ApiError.badRequest("Некоректный запрос.")) }

            const candidateEmail = await User.findOne({ where: { email } })

            if (candidateEmail && candidateEmail !== null) {
                return next(ApiError.badRequest("Пользователь с такой почтой уже существует."))
            }
            const hashPassword = await bcrypt.hash(password, 6)

            // random cover image
            const dirpath = path.join(__dirname, '..', 'static-cover');

            const files = fs.readdirSync(dirpath)

            function getImage(files) {
                if (files) {
                    const imageIndex = Math.floor(Math.random() * (files.length - 1))
                    return files[imageIndex]
                }
            }
            const userCoverPath = getImage(files)

            const user = await User.create({ name, password: hashPassword, email, age, coverImage: userCoverPath })

            const { accessToken, refreshToken } = generateJwt({ id: user.id, email: user.email })
            res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json({ user, accessToken })
        } catch (error) {
            return res.json({ error })
        }

    }
    async autoLogin(req, res, next) {
        try {
            const { email, id } = req.user
            const user = await User.findOne({ where: { email } })
            if (!user) {
                return res.status(401).json({ message: 'не авторизован' })
            }
            //let comparePassword = bcrypt.compareSync(password, user.password)
            //if (!comparePassword) {
            //    return next(ApiError.badRequest("Указан не верный пароль."))
            //}
            const { accessToken, refreshToken } = generateJwt({ id, email })
            res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json({ accessToken, user })
        } catch (error) {
            console.error(error)
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ where: { email } })

            if (!user) {
                return res.status(401).json({ message: 'не авторизован' })
            }

            let comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) {
                return next(ApiError.badRequest("Указан не верный пароль."))
            }

            const { accessToken, refreshToken } = generateJwt({ id: user.id, email })
            res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json({ accessToken, user })
        } catch (error) {
            console.error(error)
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

            return res.json({ accessToken, newRefreshToken })

        } catch (error) {
            console.log(error)
            return res.status(401).json({ message: 'не авторизован' })
        }
    }
    async getFriends(req, res) {

    }
    async getUser(req, res) {
        const { id } = req.params;
        const { isAuth } = req.user;

        const userObj = await User.findOne({ where: { id }, attributes: ['img', 'name', 'email', 'id', 'coverImage'], })
        const messages = await Message.findAndCountAll({
            where: { userId: id },
            attributes: [
                [Sequelize.fn('sum', Sequelize.col('likesNum')), 'total_likesNum'],
            ],
            group: ['likesNum'],
            raw: true
        });
        console.log(messages)

        const user = {
            ...userObj.dataValues,
            countMessages: messages?.count[0]?.count,
            totalLikesNum: +messages.rows[0]?.total_likesNum
        }

        if (isAuth && req.user.id === +id) {
            return res.json({ user, canEdit: true })
        }
        return res.json({ user, canEdit: false })
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

}
module.exports = new userRouter()