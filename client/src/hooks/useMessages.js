import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getMessages } from "../API/messagesApi";


const useMessages = (page, limit) => {
    const [messagesArray, setMessagesArray] = useState([]);
    const [messagesCount, setMessagesCount] = useState(null);
    const isAuth = useSelector(state => state.isAuth)
    const params = useParams();

    useEffect(() => {
        if (isAuth !== null) getData()
    }, [page, isAuth]);

    const getData = async () => {
        const res = await getMessages(page, limit, isAuth, params);
        if (res) {
            setMessagesCount(res.data.count)
            setMessagesArray([...messagesArray, ...res.data.rows])
        }
    }

    return { messagesArray, messagesCount }
}

export default useMessages;