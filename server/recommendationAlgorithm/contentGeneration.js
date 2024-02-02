const { Op } = require("sequelize")
const { Message, Friends, User } = require("../models/models")
const { USER_MESSAGE } = require("../models/mongoModels")
const { Sequelize } = require("../db")
const moment = require("moment/moment")

const deleteUnique = arr => arr
    .filter((item, index, arr) => (!(arr.lastIndexOf(item) === index) || !(arr.indexOf(item) === index)) && true)

const deleteDuplicates = arr => Array.from(new Set(arr))// Set хранит только уникальные значения

class contentGeneration {
    constructor(userId, viewedData) {
        this.viewedData = viewedData,
            this.userId = userId,
            this.maxTime = 30,
            this.maxShow = 5
    }
    async userGoodAppreciatedMessage() {
        try {
            if (!this.userId) return [];

            //получаем сообщения, которые понравились пользователю (this.userId)
            const messageWithGoodGrade = await USER_MESSAGE.find({ grade: { $gt: 0 }, userId: this.userId })
                .limit(80).select('messageId').exec()
            const goodMessagesId = messageWithGoodGrade.map(i => i.messageId)
            // получаем пользователей, которым тоже понравились твиты.
            if (!goodMessagesId.length) return [];
            const peopleLikeObj = await USER_MESSAGE.find({ grade: { $gt: 0 }, messageId: { $in: goodMessagesId } })
                .limit(500).select('userId').exec()
            const usersGoodGrade = peopleLikeObj.map(i => i.userId)
            //оставляем пользователей которым конравились два и больше (общих с this.userId) твита
            const filteredUsers = deleteDuplicates(deleteUnique(usersGoodGrade))
            if (!filteredUsers.length) return [];
            const messagesForResult =
                await USER_MESSAGE.find({ grade: { $gt: 0 }, userId: { $in: filteredUsers }, messageId: { $nin: messageWithGoodGrade } })
                    .limit(250).select('messageId').exec()
            //максимальное время ,когда сообщение остается актуальным
            const maxTime = moment().subtract(this.maxTime, 'day').toDate();
            const resultMessages = await Message.findAll({
                raw: true,
                where: {
                    id: { [Op.or]: messagesForResult, [Op.notIn]: this.viewedData },
                    createdAt: { [Op.gt]: maxTime }
                },
                attributes: [['id', 'messageId'], 'userId']
            });
            return resultMessages;
        } catch (error) {
            return []
        }
    }
    async getMessageFromSubscriber() {
        try {
            if (!this.userId) return [];

            // возвращаем сообщения которые созданны не позже недели
            const maxTime = moment().subtract(this.maxTime, 'day').toDate();
            const messages = await Message.findAll({
                raw: true,
                attributes: [['id', 'messageId'], 'userId'],
                where: {
                    id: { [Op.notIn]: this.viewedData },
                    createdAt: {
                        [Op.gt]: maxTime
                    }
                },
                include: [{
                    //получаем людей на которых подписан пользователь
                    model: User,
                    attributes: [],
                    where: { id: { [Op.ne]: this.userId } },
                    include: [{
                        model: Friends,
                        where: { userId: this.userId },
                        attributes: [],
                        required: true
                    }],
                    required: true
                }]
            });
            if (messages.length === 0) {
                return []
            }
            const subscribersMessageId = messages.map(i => i.messageId);
            //проверяем сколько раз пользователь видел найденные сообщения и фильтруем от трёх и больше раз
            const moreShowMessages = await USER_MESSAGE.find({//сообщегия с большим количеством просмотров
                id: { $in: subscribersMessageId }, showCount: { $gte: this.maxShow }
            }).select('messageId').exec()
            //удаляем пересечение массивов, остаются только свежие сообщения
            const verifiedMessages = messages.filter((item) => {
                return moreShowMessages.indexOf(item.messageId) === -1;
            });
            return verifiedMessages;
        } catch (error) {
            console.log(error)
            return []
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
            const maxTime = moment().subtract(this.maxTime, 'day').toDate();
            const messagesObjects = await Message.findAll({
                raw: true,
                attributes: [['id', 'messageId'], 'retweetCount', 'commentsCount', 'likesNum', 'userId',
                [Sequelize.literal(`
                    (${commentsCount} * ${commentsFactor}) 
                    + (${retweetsCount} * ${retweetFactor}) 
                    + (${likesCount} * ${likesFactor})`), 'popularity']],
                where: {
                    id: { [Op.notIn]: this.viewedData },
                    createdAt: {
                        [Op.gt]: maxTime
                    },
                    userId: { [Op.ne]: this.userId || null }
                }
            });

            const messages = messagesObjects.map(i => {
                return {
                    userId: i.userId,
                    messageId: i.messageId
                }
            })
            //проверяем сколько раз пользователь видел найденные сообщения и фильтруем
            const inappropriateMessages = await USER_MESSAGE.find({
                messageId: { $in: messages.map(i => i.messageId) }, showCount: { $gte: this.maxShow }
            }).select('messageId').exec();

            const verifiedMessages = messages.filter((item) => {
                return inappropriateMessages.indexOf(item.messageId) === -1
            })
            return verifiedMessages;
        } catch (error) {
            console.log(error)
            return []
        }
    }
}
module.exports = contentGeneration

