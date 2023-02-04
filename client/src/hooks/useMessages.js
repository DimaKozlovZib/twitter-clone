import { useEffect, useState } from "react";
import { getMessages } from "../API/messagesApi";


const useMessages = (page, limit, isAuth, onlyThisUserId = null) => {
    const [messagesArray, setMessagesArray] = useState([]);
    const [messagesCount, setMessagesCount] = useState(null);

    useEffect(() => {
        if (isAuth !== null) getData()
    }, [page, isAuth]);

    const getData = async () => {
        const res = await getMessages(page, limit, isAuth, onlyThisUserId);
        if (res) {
            setMessagesCount(res.data.count)
            setMessagesArray([...messagesArray, ...res.data.rows])
        }
    }

    return { messagesArray, messagesCount }
}

export default useMessages;