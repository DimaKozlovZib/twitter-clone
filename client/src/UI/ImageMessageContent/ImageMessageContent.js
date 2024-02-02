import React, { useMemo, useState } from 'react';
import './ImageMessageContent.css'
import '../../styles/photoView.css';
import { MediaProvider } from '../../components/MediaProvider/MediaProvider';
import MediaView from '../MediaView/MediaView';
import { maxVisibleMedia } from '../../constans';

const ImageMessageContent = ({ messageData }) => {
    const { media } = messageData
    const [sortedMedia, setSortedMedia] = useState(media.sort((a, b) => Number(a.indexInMes) - Number(b.indexInMes)));
    const len = sortedMedia?.length;
    const mediaUrls = sortedMedia?.map(i => i.url)
    const [isViewMedia, setIsViewMedia] = useState(len > maxVisibleMedia ? 'hidden' : '');

    const getImagesForClient = (startIndex, lenght) => {
        const result = []

        for (let i = startIndex; i < lenght; i += 2) {
            const url = mediaUrls[i]
            const type = sortedMedia[i].type

            if (!url) return;
            const src = `http://localhost:5000/${url}`

            switch (type) {
                case 'image':
                    result.push((
                        <MediaView index={i} key={i} src={src} mediaType='image'>
                            <img className='image-item' src={src} loading='lazy' />
                        </MediaView>
                    ))
                    continue;
                case 'video':
                    result.push((
                        <div className='video-wrapper' key={i}>
                            <MediaView index={i} src={src} mediaType='video'>
                                <video src={src} />
                            </MediaView>
                            <svg viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.9733 8.93735C15.3397 9.69884 15.3447 10.6568 13.9733 11.5177L3.37627 18.6645C2.04478 19.3751 1.14046 18.9556 1.04553 17.418L1.00057 2.45982C0.970588 1.04355 2.13721 0.643399 3.24887 1.32244L13.9733 8.93735Z" strokeWidth="2" />
                            </svg>
                        </div>
                    ))
                    continue;
            }

        }

        return result
    };

    const fistColum = useMemo(() => getImagesForClient(0, len), [sortedMedia])
    const secondColum = useMemo(() => getImagesForClient(1, len), [sortedMedia])

    const classGenerate = (commonClass) => `${commonClass} ${isViewMedia}`;

    const seeAllMedia = () => setIsViewMedia('')

    return len > 0 && (
        <div className='ImageMessageContent'>
            <div className='image-table'>
                <MediaProvider mediaCount={len}>
                    <div className={classGenerate('colum-1')}>
                        {fistColum}
                    </div>
                    {len > 1 &&
                        <div className={classGenerate('colum-2')}>
                            {secondColum}
                        </div>
                    }
                </MediaProvider>
            </div>
            {isViewMedia === 'hidden' && (
                <button className="seeAllBtn" onClick={seeAllMedia}>
                    <p>Смотреть все медиа</p>
                </button>
            )}
        </div>
    );
}

export default ImageMessageContent;
