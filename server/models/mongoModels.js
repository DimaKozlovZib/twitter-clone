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
            async updateMessageShown(userId, messageId) {
                await model(U_M_Model).updateOne({ userId, messageId }, { $inc: { showCount: 1 } })
                this.gradeCalculate(userId, messageId)
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



const USER_MESSAGE = model(U_M_Model, user_messageShema)

module.exports = {
    USER_MESSAGE
}