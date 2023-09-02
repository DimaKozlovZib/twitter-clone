function varietyAuthors(array) {
    const result = [];
    const delayedMessages = [];
    const delayedUsers = [];
    let lastUserId;
    let index = 0;

    while (result.length < array.length) {
        // получаем текуший элемент при переборе массива
        const thisItem = array[index]
        //определяем можно ли впихнуть отложенный элемент перед thisItem
        const delayedElementIndex = delayedUsers.findIndex(i => i !== lastUserId && i !== thisItem?.userId)
        //если элементы при переборе закочились 
        if (!thisItem) {
            if (delayedMessages.length === 0) break//нету отложенных - завершаем цикл
            // ищем место для отложенного элемента
            const elementPlace = result
                .findIndex((item, i) => item.userId !== delayedUsers[0] && result[i++]?.userId !== delayedUsers[0])
            // вставляем его на найденное место
            if (elementPlace !== -1) {
                result.splice(elementPlace + 1, 0, delayedMessages[0])
            };
            //удаляем
            delayedUsers.shift()
            delayedMessages.shift()
            continue;
        }

        if (delayedElementIndex !== -1) {
            //впихиваем отложенный элемент
            const newItem = delayedMessages[delayedElementIndex]
            result.push(newItem)
            lastUserId = newItem.userId
            //удаляем откуда взяли
            delayedMessages.splice(delayedElementIndex, 1)
            delayedUsers.splice(delayedElementIndex, 1)
        }
        // если последний автор равен текущему, то откладываем
        if (lastUserId === thisItem?.userId) {
            delayedUsers.push(thisItem.userId)
            delayedMessages.push(thisItem)
        } else {
            //если нет, то добавляем в список
            result.push(thisItem)
            lastUserId = thisItem?.userId
        }
        //идём дальше
        index += 1;
    }
    return result;
}
module.exports = varietyAuthors