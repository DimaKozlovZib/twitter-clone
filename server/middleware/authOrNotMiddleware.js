const jwt = require("jsonwebtoken")

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') next()
    try {
        const token = req.headers?.authorization?.split(' ')[1]

        if (!token) {
            req.user = { isAuth: false }
            return next();
        }

        const decoded = jwt.verify(token, process.env.SECRET_ACCESS_KEY)
        req.user = { ...decoded, isAuth: true }
        next()
    } catch (error) {
        console.error(error)
        return res.status(401).json({ message: 'не авторизован' })
    }
}