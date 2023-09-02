import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getMessages } from "../API/messagesApi";

const useMessages = (page, limit) => {
    const [messagesArray, setMessagesArray] = useState([]);
    const isAuth = useSelector(state => state.isAuth)
    const params = useParams();

    const getData = async () => {
        const paramsObj = {
            userId: params?.userId,
            limit, page
        }
        const res = await getMessages(paramsObj);
        if (res) {
            setMessagesArray([...messagesArray, ...res.data])
        }
    }

    useEffect(() => {
        if (isAuth !== null) getData()
    }, [page, isAuth]);

    return [messagesArray, setMessagesArray]
}

export default useMessages;