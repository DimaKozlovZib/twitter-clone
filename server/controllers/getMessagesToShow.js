const { Op } = require("sequelize")
const { Likes, Message } = require("../models/models")
const { USER_MESSAGE } = require("../models/mongoModels")

const deleteUnique = arr => arr
    .filter((item, index, arr) => (!(arr.lastIndexOf(item) === index) || !(arr.indexOf(item) === index)) && true)

const deleteDuplicates = arr => Array.from(new Set(arr))// Set хранит только уникальные значения

class contentGeneration {
    constructor(userId) {
        this.userId = userId
    }
    async userGoodAppreciatedMessage() {
        //получаем сообщения, которые понравились пользователю (this.userId)
        const resultMessageObj = await USER_MESSAGE.find({ grade: { $gt: 0 }, userId: this.userId })
            .limit(80).select('messageId').exec()
        const goodMessagesId = resultMessageObj.map(i => i.messageId)
        // получаем пользователей, которым тоже понравились твиты.
        const peopleLikeObj = await USER_MESSAGE.find({ grade: { $gt: 0 }, messageId: { $in: goodMessagesId } })
            .limit(500).select('userId').exec()
        const usersGooGrade = peopleLikeObj.map(i => i.userId)
        //оставляем пользователей которым конравились два и больше (общих с this.userId) твита
        return deleteDuplicates(deleteUnique(usersGooGrade))
    }
}
//module.exports = contentGeneration

const cl = new contentGeneration(9)
