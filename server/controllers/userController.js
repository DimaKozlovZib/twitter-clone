const ApiError = require("../error/ApiError")
const bcrypt = require("bcrypt")
const uuid = require("uuid")
const path = require("path")
const jwt = require("jsonwebtoken")
const { User, Image } = require("../models/models")

const generateJwt = (id, email) =>
    jwt.sign(
        { id, email },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    )


class userRouter {
    async registration(req, res, next) {
        const { name, email, password, age } = req.body
        const { img } = req.files

        if (!email || !password || !name) { return next(ApiError.badRequest("Некоректный запрос.")) }

        const candidateEmail = await User.findOne({ where: { email } })

        if (candidateEmail && candidateEmail !== null) {
            return next(ApiError.badRequest("Пользователь с такой почтой уже существует."))
        }
        const candidateName = await User.findOne({ where: { name } })
        if (candidateName) {
            return next(ApiError.badRequest("Пользователь с таким именем уже существует."))
        }
        const hashPassword = await bcrypt.hash(password, 6)
        const user = await User.create({ name, password: hashPassword, email, age })
        let filename;
        if (img) {
            filename = uuid.v4() + ".jpg";
            img.mv(path.resolve(__dirname, '..', 'static', filename))
            const image = await Image.create({ url: filename, userId: user.id })
        }

        const token = generateJwt(user.id, user.email)
        return res.json({ token })
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
        const token = generateJwt(user.id, user.email)
        return res.json({ token })
    }
    async auth(req, res) {
        const { email, id } = req.body
        const token = generateJwt(id, email)

        return res.json({ token })
    }
    async getFriends(req, res) {

    }
    async getUser(req, res) {

    }
}
module.exports = new userRouter()