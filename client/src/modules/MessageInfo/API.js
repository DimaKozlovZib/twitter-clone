const { $authHost } = require("../../API")

export const findOneMessage = async (messageId) => {
    try {
        const response = await $authHost.post('/message/getMessageInfo', { messageId }, {
            validateStatus: function (status) {
                return status < 500; // Resolve only if the status code is less than 500
            }
        })
        console.log(response)
        return response
    } catch (error) {
        console.error(error)
        return error
    }
}