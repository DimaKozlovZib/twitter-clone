const ApiError = require("../error/ApiError")
const bcrypt = require("bcrypt")
const uuid = require("uuid")
const path = require("path")
const jwt = require("jsonwebtoken")
const { User, Image } = require("../models/models")

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
            console.log(name, email, password, age)

            if (!email || !password || !name) { return next(ApiError.badRequest("Некоректный запрос.")) }

            const candidateEmail = await User.findOne({ where: { email } })

            if (candidateEmail && candidateEmail !== null) {
                return next(ApiError.badRequest("Пользователь с такой почтой уже существует."))
            }
            const hashPassword = await bcrypt.hash(password, 6)
            const user = await User.create({ name, password: hashPassword, email, age })
            //let filename;
            //if (img) {
            //    filename = uuid.v4() + ".jpg";
            //    img.mv(path.resolve(__dirname, '..', 'static', filename))
            //    const image = await Image.create({ url: filename, userId: user.id })
            //}
            const { accessToken, refreshToken } = generateJwt({ id: user.id, email: user.email })
            res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json({ user, accessToken })
        } catch (error) {
            return res.json({ error })
        }

    }
    async login(req, res, next) {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return next(ApiError.badRequest("Пользователь не найден."))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.badRequest("Указан не верный пароль."))
        }
        const tokens = generateJwt(user.id, user.email)
        return res.json(tokens)
    }

    async auth(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1]

            if (!token) {
                return res.status(401).json({ message: 'не авторизован1' })
            }
            const decoded = jwt.verify(token, process.env.SECRET_REFRESH_KEY)
            console.log(decoded)

            const tokens = generateJwt(id, email)

            return res.json(tokens)

        } catch (error) {
            return res.status(401).json({ message: 'не авторизован1' })
        }
    }
    async getFriends(req, res) {

    }
    async getUser(req, res) {

    }
}
module.exports = new userRouter()