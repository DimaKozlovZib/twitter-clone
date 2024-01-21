import React, { useEffect, useState } from 'react';
import './HelperHashtagInput.css';
import { getHashtags } from './API';
import { EditorState, Modifier } from 'draft-js';

const HelperHashtagInput = ({ editorState, isInputActive, setEditorState, editorBlock }) => {
    const [hashtagHelper, setHashtagHelper] = useState([]);
    const [hashtagName, setHashtagName] = useState('');
    const [timer, setTimer] = useState(null);
    const [hashtagHelperIsActive, setHashtagHelperIsActive] = useState(false);
    const [decoratorKey, setDecoratorKey] = useState(null);

    const closeHashtagHelper = (e) => {
        setTimeout(() => {
            if (hashtagHelperIsActive) setHashtagHelperIsActive(false)
        }, 420)
    }

    useEffect(() => {
        if (!isInputActive && hashtagHelperIsActive) {
            closeHashtagHelper()
        }
    }, [isInputActive]);

    const hashtagRequest = () => {
        if (!isInputActive) return

        const selectionState = editorState.getSelection();
        const startKey = selectionState.getStartKey();
        const endKey = selectionState.getEndKey();
        const anchorOffset = selectionState.getStartOffset()
        const hashtagsArray = document.querySelectorAll('.MessageAddInput .hashtag')

        if (hashtagsArray.length === 0) return setHashtagHelperIsActive(false);

        for (let index = 0; index < hashtagsArray.length; index++) {
            const element = hashtagsArray[index];

            const elementId = element.getAttribute('data-hashtagId')
            const elementValue = element.getAttribute('data-serverHashtagValue')
            const elemText = element.textContent
            const key = element.getAttribute('offsetkey')
            const blockKey = key?.split('-')[0]

            if (elemText.slice(1).length === 0) continue;

            if (!(startKey === blockKey && endKey === blockKey)) continue;

            const endCursor = element.getAttribute('end')

            if (+endCursor < anchorOffset) continue;

            const startCursor = element.getAttribute('start')
            if (+startCursor > anchorOffset) continue;

            if (elementId !== 'none' || elementValue === elemText) return setHashtagHelperIsActive(false);

            if (decoratorKey === key && hashtagName === elemText.slice(1)
                && hashtagHelper.length > 0) return setHashtagHelperIsActive(true)

            setDecoratorKey(element.getAttribute('offsetkey'))
            setHashtagHelper([])
            getList(elemText.slice(1))
            return;
        }

        setHashtagHelperIsActive(false)
    }

    useEffect(() => {
        if (!editorState.getSelection().getHasFocus()) return

        clearTimeout(timer)
        setTimer(null)

        setTimer(setTimeout(hashtagRequest, 800))
    }, [editorState, isInputActive]);

    const getList = async (text) => {
        try {
            const response = await getHashtags(text);
            if (isInputActive) {
                setHashtagHelper(response.data.hashtagsToInput.rows);
                setHashtagHelperIsActive(true)
                setHashtagName(text)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const editHashtag = (name, id) => {
        const contentState = editorState.getCurrentContent();
        const blockMap = contentState.getBlockMap();
        const block = blockMap.get(decoratorKey.split('-')[0]);
        const hashtag = document.querySelector(`.MessageAddInput .hashtag[offsetkey="${decoratorKey}"]`)
        const end = hashtag.getAttribute('end');
        const start = hashtag.getAttribute('start');

        if (block) {
            const newText = `#${name}`
            let newSelection = editorState.getSelection();
            newSelection = newSelection.merge({
                anchorOffset: +start,
                focusOffset: +end
            });

            let newContent = Modifier.replaceText(editorState.getCurrentContent(), newSelection, newText);
            let newState = EditorState.push(editorState, newContent, 'insert-characters');

            let seEditor = editorState.getSelection();
            seEditor = seEditor.merge({
                anchorOffset: +start + newText.length,
                focusOffset: +start + newText.length
            });

            editorBlock.current.focus();

            hashtag.setAttribute('data-hashtagId', id)
            hashtag.setAttribute('data-serverHashtagValue', newText)

            setEditorState(EditorState.forceSelection(newState, seEditor))
            setHashtagHelperIsActive(false)
        }
    }

    return (
        <>
            {(hashtagHelperIsActive && hashtagHelper.length > 0) && (
                <div className='HelperHashtagInput'>
                    {
                        hashtagHelper.map(({ name, id }) => (
                            <button className='HelperHashtagInput-item' key={id} onClick={e => editHashtag(name, id)}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.875 11L5.375 1M6.625 11L9.125 1M2.25 4.125H11M1 7.875H9.75" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className='text'>{name}</p>
                            </button>
                        ))
                    }
                </div>
            )}
        </>
    );
}

export default HelperHashtagInput;
