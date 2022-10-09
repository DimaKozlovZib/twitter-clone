require("dotenv").config();
const express = require('express')
const cors = require('cors')
const app = express()
const sequelize = require('./db')
const PORT = process.env.PORT || 5000
const models = require("./models/models")
const router = require("./routes/index")

app.use(cors())
app.use(express.json())
app.use('/api', router)

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