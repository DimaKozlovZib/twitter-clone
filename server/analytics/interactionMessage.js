const { Message } = require("../models/models");
const { USER_MESSAGE } = require("../models/mongoModels");


const userHasThisMessage = async (userId, messageId) => {//проверяем не принадлежит ли сообщение пользователю
    if (!userId || !messageId) return false;

    const message = await Message.findOne({ where: { id: messageId } })
    if (message?.userId === userId) return true;
    return false;
}

class interactionMessage {
    async setLike(userId, messageId, data) {
        try {
            if (userHasThisMessage(userId, messageId)) return;

            const userAction = await USER_MESSAGE.findOne({ userId, messageId })
            if (userAction) {
                USER_MESSAGE.setLike(userId, messageId, data)
                USER_MESSAGE.updateMessageShown(userId, messageId)
                return;
            }

            const newAction = new USER_MESSAGE({ userId, messageId, hasLike: data })
            await newAction.save()
            await USER_MESSAGE.updateMessageShown(userId, messageId)
        } catch (error) {
            console.dir(error)
        }
    }
    async setMessageShown(req, res, next) {
        try {
            const userId = req.user?.id;
            const messageId = req.body?.mesId;

            if (await userHasThisMessage(userId, messageId)) return res.sendStatus(400);

            const userAction = await USER_MESSAGE.findOne({ userId, messageId })

            if (userAction) {
                await USER_MESSAGE.updateMessageShown(userId, messageId)
                return res.sendStatus(200)
            }

            const newAction = new USER_MESSAGE({ userId, messageId, showCount: 1 })

            await newAction.save()
            return res.sendStatus(200)
        } catch (error) {
            console.log(error)
            return res.sendStatus(500)
        }
    }
}
module.exports = new interactionMessage();