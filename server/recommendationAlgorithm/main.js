const contentGeneration = require("./contentGeneration");
const shuffle = require("./shuffle");
const varietyAuthors = require("./varietyAuthors");

async function Recommendations(userId) {
    try {
        const content = new contentGeneration(userId)
        //получаем данные
        const goodAppreciated = await content.userGoodAppreciatedMessage();
        const fromSubscriber = await content.getMessageFromSubscriber();
        const popularMessages = await content.getPopularMessages();
        //собираем в один массив
        const allData = [...goodAppreciated, ...fromSubscriber, ...popularMessages]
        // удаляем дубликаты
        const removeDuplicates = Array.from(new Set(allData))
        //перемешиваем
        const messagesAfterShuffle = shuffle(removeDuplicates)
        //изменяем последовательность чтобы авторы не повторялись
        const result = varietyAuthors(messagesAfterShuffle)
        return result;
    } catch (error) {
        console.log(error)
        return error;
    }
}

module.exports = Recommendations