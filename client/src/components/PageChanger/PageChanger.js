import React from 'react';
import './PageChanger.css'

const PageChanger = ({ page, setpage, limit, count }) => {
    const lastPageIndex = Math.floor(count / limit);

    const createChangePageBtns = () => {
        const backBtns = [],
            nextBtns = [];

        for (let index = page + 2; (index <= page + 4 && index <= lastPageIndex); index++) nextBtns.push(index);

        for (let index = page; (0 < index && index >= page - 4); index--) backBtns.unshift(index);


        return (<>
            {backBtns.map(i => (
                <button onClick={() => changePage(i - 1)} key={i}>{i}</button>
            ))}
            <button disabled className='thisPage'>{page + 1}</button>
            {nextBtns.map(i => (
                <button onClick={() => changePage(i - 1)} key={i}>{i}</button>
            ))}
        </>)
    }

    const changePage = (newPage) => setpage(newPage)


    return (
        <div className='PageChanger'>
            <button className='back-btn' disabled={page === 0} onClick={() => changePage(page - 1)}>
                <svg width="14" height="28" viewBox="0 0 14 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 26.25L1.33337 14L13 1.75" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            <div className='pageIndexes'>
                {createChangePageBtns()}
            </div>
            <button className='next-btn' disabled={page + 1 === lastPageIndex} onClick={() => changePage(page + 1)}>
                <svg width="14" height="28" viewBox="0 0 14 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 26.25L12.6666 14L1 1.75" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
}

export default PageChanger;
