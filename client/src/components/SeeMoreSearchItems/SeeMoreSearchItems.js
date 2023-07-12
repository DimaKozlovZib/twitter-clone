import React, { memo, useMemo } from 'react';
import './SeeMoreSearchItems.css';
import { useNavigate } from 'react-router-dom';

const SeeMoreSearchItems = memo(({ title, titleEng, itemsCount, link }) => {
    const navigate = useNavigate();
    const smallRequestLimit = 3;
    const modal = useMemo(() => {
        switch (titleEng) {
            case 'Users':
                return 'user';
            case 'Hashtags':
                return 'hashtag';
            case 'Messages':
                return 'message';
        }
    }, [titleEng])

    const openBasicPage = () => {
        navigate(`/twitter-clone/search/${modal}/${link}`)
    }

    return (
        <button className='SeeMoreSearchItems' onClick={openBasicPage} disabled={itemsCount <= smallRequestLimit}>
            <div className='SeeMoreSearchItems-title'>
                <h4>{title}</h4>
            </div>
            {itemsCount > smallRequestLimit && (
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
})

export default SeeMoreSearchItems;
