const contentGeneration = require("./contentGeneration");
const removeDuplicates = require("./removeDuplicates");
const shuffle = require("./shuffle");
const varietyAuthors = require("./varietyAuthors");

async function Recommendations(userId, viewedData) {
    try {
        const content = new contentGeneration(userId, viewedData)
        //получаем данные
        const goodAppreciated = await content.userGoodAppreciatedMessage();
        const fromSubscriber = await content.getMessageFromSubscriber();
        const popularMessages = await content.getPopularMessages();
        //собираем в один массив
        const allData = [...goodAppreciated, ...fromSubscriber, ...popularMessages]
        // удаляем дубликаты
        const noВuplicates = removeDuplicates(allData)
        //перемешиваем
        const messagesAfterShuffle = shuffle(noВuplicates)
        //изменяем последовательность чтобы авторы не повторялись
        const result = messagesAfterShuffle// varietyAuthors(messagesAfterShuffle)
        return result.map(i => i.messageId);
    } catch (error) {
        console.log(error)
        return error;
    }
}

module.exports = Recommendations