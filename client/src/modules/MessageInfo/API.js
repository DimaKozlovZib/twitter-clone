const { $host } = require("../../API")

export const findOneMessage = async (messageId) => {
    try {
        const response = await $host.post('/message/getMessageInfo', { messageId })
        console.log(response)
        return response
    } catch (error) {
        console.error(error)
        return error
    }
}