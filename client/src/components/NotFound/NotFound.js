import React from 'react';
import './NotFound.css'

const NotFound = () => {
    return (
        <div className='NotFoundPage'>
            <div className='code-wrapper'>
                <h2>4<span>0</span>4</h2>
            </div>
            <div className='title-wrapper'>
                <h3>Ошибка</h3>
                <p>Страница, которую вы ищете, не существует либо удалена.</p>
            </div>
        </div>
    );
}

export default NotFound;
