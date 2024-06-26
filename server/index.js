require("dotenv").config();
const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const app = express()
const sequelize = require('./db')
const PORT = process.env.PORT || 3000
//const models = require("./models/models")
//const analiticModels = require("./models/mongoModels")
const router = require("./routes/index")
const path = require("path")
const errorHandler = require('./middleware/ErrorHandingMiddleware');
const cookieParser = require("cookie-parser");
const { default: mongoose } = require("mongoose");

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.resolve(__dirname, 'static-images', "static")))
app.use(express.static(path.resolve(__dirname, 'static-images', "static-cover")))
app.use(express.static(path.resolve(__dirname, 'static-images', "static-avatars")))
app.use(fileUpload())
app.use('/api', router)

app.use(errorHandler)

const start = async () => {
    try {
        await mongoose.connect(`mongodb://root:password@app-mongo:27017/?authSource=admin`)
            .then(() => console.log("MongoDB succes connect"))

        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log("сервер работает на " + PORT));
    } catch (e) {
        console.log(e)
    }
}
start() 