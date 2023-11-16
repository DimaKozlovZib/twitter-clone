import React from 'react';
import './ImageMessageContent.css'
import '../../styles/photoView.css';
import { MediaProvider } from '../../components/MediaProvider/MediaProvider';
import MediaView from '../MediaView/MediaView';

const ImageMessageContent = ({ messageData }) => {
    const { images } = messageData
    const len = images?.length;
    const imageUrls = images?.map(i => i.url)

    const getImagesForClient = (filesIndex) => {
        const result = filesIndex.map(i => {
            const url = imageUrls[i]

            if (!url) return;
            const src = `http://localhost:5000/${url}`

            return (
                <MediaView index={i} src={src} mediaType='image'>
                    <img className='image-item' src={src} loading='lazy' />
                </MediaView>
            )
        })
        return result
    }

    return len > 0 && (
        <div className='ImageMessageContent'>
            <div className='image-table'>
                <MediaProvider mediaCount={len}>
                    <div className='colum-1'>
                        {len > 2 ? getImagesForClient([0, 1]) : getImagesForClient([0])}
                    </div>
                    {len > 1 &&
                        <div className='colum-2'>
                            {len > 2 ? getImagesForClient([2, 3]) : getImagesForClient([1])}
                        </div>
                    }
                </MediaProvider>
            </div>
        </div>
    );
}

export default ImageMessageContent;
