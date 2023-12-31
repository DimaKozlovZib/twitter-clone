const { Message } = require("../models/models");
const { PythonShell } = require('python-shell');
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
            const messagesArrayId = req.body?.arrayId;

            await USER_MESSAGE.updateMessageShown(userId, messagesArrayId)

            return res.sendStatus(200)
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }
    async determiningMood(req, res) {
        try {
            const { id } = req.user;
            const { messageId, text } = req.body;

            const commentMoodStatus = await USER_MESSAGE.findOne({ userId: id, messageId }).commentMood

            if (['positively', 'negatively', 'neutral'].includes(commentMoodStatus)) return;

            const pythonFile = 'python/mood.py';
            const polarity_threshold = 0.5;
            const subjectivity_threshold = 0.5;

            const pyshell = new PythonShell(pythonFile);

            pyshell.send(JSON.stringify(text));

            // Получаем результат из Python
            pyshell.on('message', async function (message) {
                try {
                    const result = JSON.parse(message)
                    const [polarity, subjectivity] = result;
                    let data;

                    if (polarity >= polarity_threshold && subjectivity >= subjectivity_threshold) {
                        data = 'positively';
                    } else if (polarity <= -polarity_threshold && subjectivity >= subjectivity_threshold) {
                        data = 'negatively';
                    } else {
                        data = 'neutral';
                    }

                    await USER_MESSAGE.setCommentMood(id, messageId, data)
                    return res.sendStatus(200)
                } catch (err) {
                    console.error('Ошибка при разборе JSON:', err);
                    return res.status(500).json(err)
                }
            });

            // Обрабатываем ошибки, если они возникнут
            pyshell.on('error', function (err) {
                console.error('Ошибка:', err);
                return res.status(500).json(err)
            });

            // Завершаем процесс PythonShell
            pyshell.end(function (err) {
                if (err) {
                    console.error('Ошибка:', err);
                    return res.status(500).json(err)
                }
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }
}
module.exports = new interactionMessage();