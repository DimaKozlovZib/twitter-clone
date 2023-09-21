import React from 'react';
import './ImageTable.css'
import Image from '../../UI/Image/Image';

const ImageTable = ({ images, deleteImage }) => {
    const len = images.length;

    const getImagesForClient = (filesIndex) => {
        const result = filesIndex.map(i => {
            const img = images[i]

            if (!img) return;

            return <Image key={i} deleteImage={deleteImage} img={img} index={i} />
        })
        return result
    }

    return (
        <>
            {
                len !== 0 &&
                <div className='image-list'>
                    <div className='colum-1'>
                        {len > 2 ? getImagesForClient([0, 1]) : getImagesForClient([0])}
                    </div>
                    {len > 1 &&
                        <div className='colum-2'>
                            {len > 2 ? getImagesForClient([2, 3]) : getImagesForClient([1])}
                        </div>
                    }
                </div>
            }
        </>

    );
}

export default ImageTable;
