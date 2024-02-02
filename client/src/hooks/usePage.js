import { useCallback, useEffect, useRef, useState } from "react";
import { setViewedDataAction } from "../store";
import { useDispatch } from "react-redux";

const usePage = (messagesData, setMessagesData, limit, succesDeleteId, setSuccesDeleteId) => {
    const [page, setPage] = useState(0);
    const changePageElement = useRef()
    const dispatch = useDispatch()

    useEffect(() => {
        if (messagesData.length > 0) {
            const newState = messagesData.reduce((res, cur) => [...res, ...cur?.data], [])
                .map(i => i.id)

            dispatch(setViewedDataAction(newState))
        } else {
            setViewedDataAction([])
        }
    }, [messagesData]);

    const deleteEvent = () => {
        if (succesDeleteId) {
            const [id, page] = succesDeleteId;
            setMessagesData(
                messagesData.filter(item => item.page === page)
                    .data.filter(mes => mes.id !== id)
            )
            setSuccesDeleteId(null)
        }
    }

    const event = useCallback(() => {
        if (!changePageElement.current || messagesData.length === 0) return

        const callback = (entries, observer) => {
            entries.forEach(async (entry) => {
                // Текст блока полностью видим на экране
                console.log(entry)
                if (entry.intersectionRatio !== 1 ||
                    !(messagesData[messagesData.length - 1]?.data?.length >= limit) ||
                    messagesData.length === 0) return;

                setPage(page + 1)
            })
        };
        const observer = new IntersectionObserver(callback, {
            threshold: 1,
        });

        observer.observe(changePageElement.current);
    }, [messagesData])

    return [page, setPage, changePageElement, event, deleteEvent]
}

export default usePage;
