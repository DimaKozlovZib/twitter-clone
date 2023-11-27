import React from 'react';
import './ImageTable.css'
import Image from '../../UI/Image/Image';
import Video from '../../UI/Video/Video';

const ImageTable = ({ customOrderedFiles, deleteImage }) => {
    const len = customOrderedFiles.length;

    const getMediaForClient = (startIndex) => {
        const result = []

        for (let i = startIndex; i < len; i += 2) {
            const file = customOrderedFiles[i]

            if (!file) return;
            //type: 'image/*' or 'video/mp4'

            if (file.type.split('/')[0] === 'video') {
                result.push(<Video key={i} deleteImage={deleteImage} file={file} index={i} />)
                continue;
            }
            result.push(<Image key={i} deleteImage={deleteImage} img={file} index={i} />)
        }

        return result
    }

    return (
        <>
            {
                len !== 0 &&
                <div className='image-list'>
                    <div className='colum-1'>
                        {getMediaForClient(0)}
                    </div>
                    {len > 1 &&
                        <div className='colum-2'>
                            {getMediaForClient(1)}
                        </div>
                    }
                </div>
            }
        </>

    );
}

export default ImageTable;
