import React, { memo, useEffect, useMemo } from 'react';
import { useMediaContext } from '../../components/MediaProvider/MediaProvider';

const MediaView = memo(({ children, src, index, mediaType }) => {
    const { media, addMedia, openSlider } = useMediaContext()

    useEffect(() => {
        if (media[index]?.src !== src) {
            addMedia({
                index, src, mediaType
            })
        }
    }, [src]);

    const childNode = useMemo(() =>
        React.Children.map(children, (child) => {
            if (React.isValidElement(child) && (child.type === 'img' || child.type === 'video')) {
                return React.cloneElement(child, { onClick: openSlider });
            }
            return child;
        }), [openSlider])

    return (<>{childNode}</>);
});

export default MediaView;