import React, { useMemo } from 'react';
//import './SeeMoreSearchItems.css';
import { useNavigate } from 'react-router-dom';
import { NavigatePath, searchPath } from '../../routes';

const SeeMoreSearchItems = ({ title, itemsCount, hasSeeMore, link }) => {
    const navigate = useNavigate();
    const smallRequestLimit = 3;
    const rusTitle = useMemo(() => {
        switch (title.toLowerCase()) {
            case 'user':
                return 'Пользователи';
            case 'hashtag':
                return 'Хэштеги';
            //case 'Messages':
            //    return 'message';
        }
    }, [title])

    const openBasicPage = () => {
        const modal = title.toLowerCase()
        navigate(NavigatePath(searchPath(modal, link)))
    }

    return (
        <button className='SeeMoreSearchItems' onClick={openBasicPage} disabled={itemsCount <= smallRequestLimit && hasSeeMore}>
            <div className='SeeMoreSearchItems-title'>
                <h4>{rusTitle}</h4>
            </div>
            {(itemsCount > smallRequestLimit && hasSeeMore) && (
                <div className='SeeMoreSearchItems-seeMore'>
                    <div className='SeeMoreSearchItems-text'>
                        <h5>Увидеть больше {itemsCount}</h5>
                    </div>
                    <div className='SeeMoreSearchItems-arrow'>
                        <span></span>
                    </div>
                </div>
            )}

        </button>
    );
}

export default SeeMoreSearchItems;
