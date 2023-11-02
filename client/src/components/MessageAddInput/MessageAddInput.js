import React, { memo, useEffect, useRef, useState } from 'react';
import './MessageAddInput.css'
import { Editor } from 'draft-js';
import HelperHashtagInput from '../../UI/HelperHashtagInput/HelperHashtagInput';

const MessageAddInput = memo(({ editorState, setEditorState }) => {
    const [isInputActive, setIsInputActive] = useState(false);
    const editorBlock = useRef()

    useEffect(() => {
        const focus = editorState.getSelection().getHasFocus()
        if (isInputActive !== focus) setIsInputActive(focus)
    }, [editorState]);

    return (
        <div className='MessageAddInput'>
            <Editor placeholder='Расскажите что-то новое?!' ref={editorBlock} preserveSelectionOnBlur
                editorState={editorState} onChange={setEditorState} />
            <HelperHashtagInput editorState={editorState} editorBlock={editorBlock}
                setEditorState={setEditorState} isInputActive={isInputActive} />
        </div>
    );
})

export default MessageAddInput;
