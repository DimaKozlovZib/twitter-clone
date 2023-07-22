const { Schema, model } = require('mongoose')

const U_M_Model = 'user_message';

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
        max: 10, min: -10
    },
    hasLike: {
        type: Boolean,
        default: false,
    },
    goodComment: {
        type: Boolean,
    },
},
    {
        statics: {
            async setLike(userId, messageId, data) {//true or false
                return await model(U_M_Model).updateOne({ userId, messageId }, { hasLike: data })
            },
            async updateMessageShown(userId, messageId) {
                return await model(U_M_Model).updateOne({ userId, messageId }, { $inc: { showCount: 1 } })
            }
        }
    })



const USER_MESSAGE = model(U_M_Model, user_messageShema)

module.exports = {
    USER_MESSAGE
}