import React from 'react';
import './MessageMenu.css'

const MessageMenu = ({ isVisible, menu, clickEvents }) => {
    const stopDefault = (e) => {
        e.stopPropagation();
        e.preventDefault();
    }

    return (
        <div className={`hiddenMenu ${isVisible && 'active'}`} ref={menu} onClick={stopDefault}>
            <div className='hiddenMenu-item delete' onClick={clickEvents.OnDelete}>
                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.25 4.11111L11.5997 13.5549C11.5728 13.9473 11.4035 14.3146 11.1258 14.5828C10.8482 14.8509 10.4829 15 10.1035 15H3.8965C3.5171 15 3.1518 14.8509 2.87416 14.5828C2.59653 14.3146 2.42719 13.9473 2.40025 13.5549L1.75 4.11111M5.5 7.22222V11.8889M8.5 7.22222V11.8889M9.25 4.11111V1.77778C9.25 1.5715 9.17098 1.37367 9.03033 1.22781C8.88968 1.08194 8.69891 1 8.5 1H5.5C5.30109 1 5.11032 1.08194 4.96967 1.22781C4.82902 1.37367 4.75 1.5715 4.75 1.77778V4.11111M1 4.11111H13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h5>удалить</h5>
            </div>
        </div>
    );
}

export default MessageMenu;
