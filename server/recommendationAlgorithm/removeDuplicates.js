
function removeDuplicates(arr) {
    const uniqueArr = [];
    const seen = new Set();

    for (let index = 0; index < arr.length; index++) {
        const { messageId, userId } = arr[index]['dataValues']
        const key = `${messageId}-${userId}`

        if (!seen.has(key)) {
            uniqueArr.push(arr[index])
            seen.add(key)
        }
    }
    return uniqueArr;
}
module.exports = removeDuplicates