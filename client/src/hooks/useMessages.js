import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getMessages } from "../API/messagesApi";

const useMessages = (page, limit) => {
    const [messagesArray, setMessagesArray] = useState([]);
    const [messagesCount, setMessagesCount] = useState(null);
    const isAuth = useSelector(state => state.isAuth)
    const params = useParams();

    const getData = async () => {
        const paramsObj = {
            userId: params?.userId,
            limit, page
        }
        const res = await getMessages(paramsObj);
        if (res) {
            setMessagesCount(res.data.count)
            setMessagesArray([...messagesArray, ...res.data.rows])
        }
    }

    useEffect(() => {
        if (isAuth !== null) getData()
    }, [page, isAuth]);

    return [messagesArray, messagesCount, setMessagesArray]
}

export default useMessages;