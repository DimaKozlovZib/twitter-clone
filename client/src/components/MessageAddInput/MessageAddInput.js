import React, { memo, useEffect, useRef, useState } from 'react';
import './MessageAddInput.css'
import { Editor, EditorState } from 'draft-js';
import HelperHashtagInput from '../../UI/HelperHashtagInput/HelperHashtagInput';
import { compositeDecorator } from './decorators';

const MessageAddInput = memo(({ setValue }) => {
    const [isInputActive, setIsInputActive] = useState(false);
    const editorBlock = useRef()

    const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty(compositeDecorator));

    useEffect(() => {
        const contentState = editorState.getCurrentContent();
        const text = contentState.getPlainText();
        setValue(text);

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
