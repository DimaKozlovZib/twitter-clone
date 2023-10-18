import React from 'react';
import './ImageMessageContent.css'

const ImageMessageContent = ({ images }) => {
    const len = images?.length;
    const imageUrls = images?.map(i => i.url)

    const getImagesForClient = (filesIndex) => {
        const result = filesIndex.map(i => {
            const url = imageUrls[i]

            if (!url) return;

            return (<img className='image-item' src={`http://localhost:5000/${url}`} loading='lazy' />)
        })
        return result
    }

    return len > 0 && (
        <div className='ImageMessageContent'>
            <div className='image-table'>
                <div className='colum-1'>
                    {len > 2 ? getImagesForClient([0, 1]) : getImagesForClient([0])}
                </div>
                {len > 1 &&
                    <div className='colum-2'>
                        {len > 2 ? getImagesForClient([2, 3]) : getImagesForClient([1])}
                    </div>
                }
            </div>
        </div>
    );
}

export default ImageMessageContent;
