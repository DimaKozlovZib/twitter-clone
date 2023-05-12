import React, { useState } from 'react';
import upload from '../../images/upload.svg'

const UploadFile = ({ file, setFile, firstHtml, secondHtml }) => {

    const [inputFocus, setInputFocus] = useState(false);
    console.log(file, setFile, firstHtml, secondHtml)

    const commonUploadContainer = (
        <div className='upload-container'>
            <div className='add-icon'>
                <span></span>
            </div>
            {firstHtml}
        </div>
    )

    const hasFileUploadContainer = (
        <div className='upload-container'>
            <div className='upload-icon'>
                <img src={upload} alt="upload" />
            </div>
            {secondHtml}
        </div>
    )

    const onDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setInputFocus(true)
    }

    const onDrop = (e) => {
        e.preventDefault();
        const files = [...e.dataTransfer.files]

        if ("image/jpeg,image/png,image/gif,image/webp".split(',').includes(files[0].type)) {
            setFile(files[0])
        } else {
            setInputFocus(false)
            setFile(null)
            console.error('file has wrong type')
        }
    }

    const stopActiveInput = (e) => {
        if (!document.querySelector('#upload').contains(e.relatedTarget)) {
            e.preventDefault();
            e.stopPropagation();
            setInputFocus(false)
        }
    }

    const changeInput = (e) => {
        const input = document.querySelector('#file-input')
        setFile(input.files[0])
        setInputFocus(true)
    }

    const onDragOver = (e) => e.preventDefault();

    return (
        <>
            <input id="file-input" onChange={changeInput} type="file" hidden accept="image/jpeg,image/png,image/gif,image/webp" />

            <label htmlFor="file-input" id="upload" className={`upload ${inputFocus && 'active'}`}
                onDragEnter={onDragEnter}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragEnd={stopActiveInput}
                onDragLeave={stopActiveInput}
            >
                {file ? hasFileUploadContainer : commonUploadContainer}
            </label>
        </>
    );
}

export default UploadFile;
