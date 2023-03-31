import React from 'react';
import useModal from '../hooks/useModal';

const ModalLayout = ({ modalTitle, children }) => {
    const [closeModal, closeOnClick] = useModal(null, '.modal-wrapper');
    return (
        <div className='modal-wrapper' onClick={closeOnClick}>
            <div className='modal'>
                <div className='modal-header'>
                    <div className='header-title'>
                        <h2>{modalTitle}</h2>
                    </div>
                    <button className='close-modal' onClick={closeModal}>
                        <span></span>
                    </button>
                </div>
                <div className='modal-contant'>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default ModalLayout;
