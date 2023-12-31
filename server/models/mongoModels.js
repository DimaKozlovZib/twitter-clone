const { Schema, model } = require('mongoose')

const U_M_Model = 'user_message';
const maxPositiveGrade = 4;
const minNegativeGrade = -2;

const user_messageShema = new Schema({
    userId: {
        type: Number,
        required: true,
    },
    messageId: {
        type: Number,
        required: true,
    },
    showCount: {
        type: Number,
        default: 0
    },
    grade: {
        type: Number,
        default: 0,
        max: maxPositiveGrade, min: minNegativeGrade
    },
    hasLike: {
        type: Boolean,
        default: false,
    },
    commentMood: {
        type: String,
        default: null
    },
},
    {
        statics: {
            async setLike(userId, messageId, data) {//data: true or false
                await model(U_M_Model).updateOne({ userId, messageId }, { hasLike: data })
                this.gradeCalculate(userId, messageId)
            },
            async updateMessageShown(userId, messageArrayId) {
                await model(U_M_Model).updateMany({ userId, messageId: { $in: messageArrayId } }, { $inc: { showCount: 1 } },
                    { upsert: true })
                messageArrayId.forEach(messageId => this.gradeCalculate(userId, messageId));
            },
            async setCommentMood(userId, messageId, data) {//data: 'positively', 'negatively', 'neutral'
                const object = await model(U_M_Model).updateOne({ userId, messageId }, { commentMood: data })

                if (!object?.id) {
                    const newAction = new USER_MESSAGE({ userId, messageId, showCount: 1, commentMood: data, })
                    await newAction.save()
                }
                this.gradeCalculate(userId, messageId)
            },
            async gradeCalculate(userId, messageId) {
                try {
                    const object = await model(U_M_Model).findOne({ userId, messageId })
                    const { hasLike, commentMood } = object;
                    let gradeResult = 0;

                    //оцениваем настроение комментария
                    if (commentMood === 'positively') {
                        gradeResult += 2;
                    } else if (commentMood === 'negatively') {
                        gradeResult -= 2;
                    }
                    // принимаем в расчет лайк
                    if (hasLike) {
                        gradeResult += 2;
                    }

                    await object.updateOne({ grade: gradeResult })
                } catch (error) {
                    console.log(error)
                }
            }
        },
    })

const U_R_Model = 'user_recommendation';
const user_recommendation = new Schema({
    userId: {
        type: Number,
        required: true,
    },
    messagesId: {//main data
        type: [Number],
        required: true,
    },
    expireAt: {
        type: Date,
        expires: 60 * 60 * 24 * 1.5 //1.5 дня в сек
    }
}, {
    statics: {
        async setRecommendation(userId, data) {
            try {
                await model(U_R_Model).updateOne({ userId }, { messagesId: data })
            } catch (error) {
                console.log(error)
            }
        },
        async getRecommendation(userId) {
            try {
                const result = await model(U_R_Model).findOne({ userId })
                return result?.data;
            } catch (error) {
                console.log(error)
            }
        },
    }
})

const USER_RECOMMENDATION = model(U_R_Model, user_recommendation)
const USER_MESSAGE = model(U_M_Model, user_messageShema)

module.exports = {
    USER_MESSAGE, USER_RECOMMENDATION
}