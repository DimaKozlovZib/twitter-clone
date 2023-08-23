const { Op } = require("sequelize")
const { Message, Friends, User } = require("../models/models")
const { USER_MESSAGE } = require("../models/mongoModels")
const { Sequelize } = require("../db")
const moment = require("moment/moment")

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
    async getMessageFromSubscriber() {
        try {
            //получаем людей которые подписанны на пользователя
            const usersFromFriends = await User.findAll({
                attributes: ['id'],
                include: [{
                    model: Friends,
                    where: { userId: this.userId },
                    attributes: [],
                    required: true
                }],
            })
            const subscribersId = usersFromFriends.map(i => i.id);
            // возвращаем сообщения которые созданны не позже недели
            const maxTime = moment().subtract(1, 'week').toDate();
            const messages = await Message.findAll({
                attributes: ['id'],
                where: {
                    userId: {
                        [Op.or]: subscribersId
                    },
                    createdAt: {
                        [Op.gt]: maxTime
                    }
                }
            });
            if (messages.length === 0) {
                return []
            }
            const subscribersMessageId = messages.map(i => i.id);
            //проверяем сколько раз пользователь видел найденные сообщения и фильтруем от трёх и больше раз
            const maxShow = 2;
            const verifiedMessages = await USER_MESSAGE.find({
                id: { $in: subscribersMessageId }, showCount: { $lte: maxShow }
            }).select('messageId').exec()
            return verifiedMessages.map(i => i?.messageId);
        } catch (error) {
            console.log(error)
        }
    }
    async getPopularMessages() {
        try {
            const commentsCount = `
            (SELECT COUNT(*)
            FROM (
              SELECT DISTINCT "comments"."userId"
              FROM "comments"
                WHERE "comments"."messageId" = "message"."id"
            ) as count)`;
            const commentsFactor = 2;
            //получаем количество ретвитов
            const retweetsCount = `
            (SELECT COUNT(*)
            FROM (
              SELECT DISTINCT "messages"."userId"
              FROM "messages"
                WHERE "messages"."retweetId" = "message"."id"
            ) as count)`;
            const retweetFactor = 3;
            //получаем количество людей, которые лайкнули сообщение
            const likesCount = `
            (SELECT COUNT(*) 
            FROM "likes" 
            WHERE "likes"."messageId" = "message"."id" 
            AND "likes"."userId" != "message"."userId")`;
            const likesFactor = 1;
            //получаем сообщения с сортировкой по популярности на основании лайков, комментариев и ретвитов
            const maxTime = moment().subtract(4, 'day').toDate();
            const messages = await Message.findAll({
                attributes: ['id', 'retweetCount', 'commentsCount', 'likesNum',
                    [Sequelize.literal(`
                    (${commentsCount} * ${commentsFactor}) 
                    + (${retweetsCount} * ${retweetFactor}) 
                    + (${likesCount} * ${likesFactor})`), 'popularity']],
                where: {
                    createdAt: {
                        [Op.gt]: maxTime
                    }
                }
            });
            //проверяем сколько раз пользователь видел найденные сообщения и фильтруем от трёх и больше раз
            const maxShow = 2;
            const verifiedMessages = await USER_MESSAGE.find({
                id: { $in: messages }, showCount: { $lte: maxShow }
            }).select('messageId').exec();
            return verifiedMessages.map(i => i?.messageId);
        } catch (error) {
            console.log(error)
        }
    }
}
//module.exports = contentGeneration

const cl = new contentGeneration(9)
cl.getPopularMessages()
