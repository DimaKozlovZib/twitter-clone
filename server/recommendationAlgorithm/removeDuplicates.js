
function removeDuplicates(arr) {
    const uniqueArr = [];
    const takenIds = []

    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if (takenIds.includes(element.messageId)) continue;

        takenIds.push(element.messageId)
        uniqueArr.push(element)
    }

    return uniqueArr;
}
module.exports = removeDuplicates