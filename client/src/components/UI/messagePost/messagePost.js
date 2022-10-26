import React, { useState } from 'react';
import account from "../../../images/account.svg";
import "./messagePost.css";

const MessagePost = ({ messageObject }) => {
    console.log(messageObject)
    const { text, createdAt, likesNum } = messageObject;
    const [activeLikeClass, setActiveLikeClass] = useState('');

    const whenMessageCreate = () => {
        const date = new Date()
        const [year, month, day, hours, minutes] = createdAt.match(/(\d+)/g)

        const yearNow = date.getFullYear();
        console.log(year, yearNow)
        if (Number(year) !== yearNow) return (yearNow - year) + 'г назад';

        const monthNow = date.getMonth() + 1;
        console.log(month, monthNow)
        if (Number(month) !== monthNow) return (monthNow - month) + 'м назад';

        const dayNow = date.getDate();
        if (Number(day) !== dayNow) return (dayNow - day) + 'д назад';

        const hoursNow = date.getHours();
        if (Number(hours) !== hoursNow) return (hoursNow - hours) + 'ч назад';

        const minutesNow = date.getHours();
        if (Number(minutes) !== minutesNow) return (minutesNow - minutes) + 'мин назад';

        return '1 мин назад'
    }

    const postLike = () => {
        setActiveLikeClass(activeLikeClass === 'active' ? '' : 'active')
    }

    //imageUrl, userName, userEmail,
    return (
        <div className='messagePost'>
            <div className='messagePost-container'>
                <div className='user-image'>
                    <img src={account} alt="" />
                </div>
                <div className='message-contant'>
                    <div className='user-info'>
                        <div className='user-name'>
                            name
                        </div>
                        <div className='user-email'>
                            @email
                        </div>
                        <div className='time-create'>
                            {'• ' + whenMessageCreate()}
                        </div>
                    </div>
                    <div className='message-info'>
                        <div className='message-text'>
                            <p>{text}</p>
                        </div>
                    </div>
                    <div className='message-rewiews'>
                        <button className={`likes ${activeLikeClass}`} onClick={postLike}>
                            <svg className='svg' width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.31804 2.31804C1.90017 2.7359 1.5687 3.23198 1.34255 3.77795C1.1164 4.32392 1 4.90909 1 5.50004C1 6.09099 1.1164 6.67616 1.34255 7.22213C1.5687 7.7681 1.90017 8.26417 2.31804 8.68204L10 16.364L17.682 8.68204C18.526 7.83812 19.0001 6.69352 19.0001 5.50004C19.0001 4.30656 18.526 3.16196 17.682 2.31804C16.8381 1.47412 15.6935 1.00001 14.5 1.00001C13.3066 1.00001 12.162 1.47412 11.318 2.31804L10 3.63604L8.68204 2.31804C8.26417 1.90017 7.7681 1.5687 7.22213 1.34255C6.67616 1.1164 6.09099 1 5.50004 1C4.90909 1 4.32392 1.1164 3.77795 1.34255C3.23198 1.5687 2.7359 1.90017 2.31804 2.31804V2.31804Z" stroke="black" stroke-opacity="0.7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <h5>{likesNum}</h5>
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default MessagePost;
