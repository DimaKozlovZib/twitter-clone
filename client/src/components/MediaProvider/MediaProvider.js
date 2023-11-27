import React, { createContext, useCallback, useContext, useState } from 'react';
import useModal from '../../hooks/useModal';

const MediaContext = createContext();

const MediaProvider = ({ children, mediaCount }) => {
    const [media, setMedia] = useState([]);
    const modalPath = 'MEDIA-SLIDER-MODAL';
    const [openModal] = useModal(modalPath, null, { media, mediaCount })

    const addMedia = (fileObject) => {
        const index = fileObject.index
        setMedia((prevMedia) => {
            const updatedMedia = [...prevMedia]; // Создаем копию исходного массива
            updatedMedia[index] = fileObject; // Заменяем элемент по указанному индексу
            return updatedMedia; // Обновляем состояние
        });
    };

    const openSlider = useCallback((index) => {
        if (media.length < mediaCount) return;

        openModal({ startIndex: index })
    }, [media])

    return (
        <MediaContext.Provider value={{ media, addMedia, openSlider }}>
            {children}
        </MediaContext.Provider>
    );
}

const useMediaContext = () => {
    const context = useContext(MediaContext);
    if (!context) {
        throw new Error('useMediaContext must be used within a MediaProvider');
    }
    return context;
};

export { MediaProvider, useMediaContext };
