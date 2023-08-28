function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // Пока остаются элементы для перетасовки
    while (currentIndex != 0) {

        // Выберите оставшийся элемент
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // И замените его текущим элементом
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array
}
module.exports = shuffle
