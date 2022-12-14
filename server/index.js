require("dotenv").config();
const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const app = express()
const sequelize = require('./db')
const PORT = process.env.PORT || 5000
const models = require("./models/models")
const router = require("./routes/index")
const path = require("path")
const errorHandler = require('./middleware/ErrorHandingMiddleware');
const cookieParser = require("cookie-parser");

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.resolve(__dirname, "static")))
app.use(fileUpload())
app.use('/api', router)

app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log("сервер работает на " + PORT));
    } catch (e) {
        console.log(e)
    }
}
start()