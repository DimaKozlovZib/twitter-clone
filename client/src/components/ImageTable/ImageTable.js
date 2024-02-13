import React, { memo, useMemo } from 'react';
import './ImageTable.css'
import Image from '../../UI/Image/Image';
import Video from '../../UI/Video/Video';

const ImageTable = memo(({ customOrderedFiles, deleteImage }) => {
    const len = customOrderedFiles.length;

    const getMediaForClient = (startIndex) => {
        const result = []

        for (let i = startIndex; i < len; i += 2) {
            const file = customOrderedFiles[i]

            if (!file) continue;
            //type: 'image/*' or 'video/mp4'

            if (file.type.split('/')[0] === 'video') {
                result.push(<Video key={i} deleteImage={deleteImage} file={file} index={i} />)
                continue;
            }
            result.push(<Image key={i} deleteImage={deleteImage} img={file} index={i} />)
        }

        return result
    }


    const mediaColums = useMemo(() => [0, 1].map(getMediaForClient), [customOrderedFiles])

    return (
        <>
            {
                len !== 0 &&
                <div className='image-list'>
                    <div className='colum-1'>
                        {mediaColums[0]}
                    </div>
                    {len > 1 &&
                        <div className='colum-2'>
                            {mediaColums[1]}
                        </div>
                    }
                </div>
            }
        </>

    );
})

export default ImageTable;
