import React, { memo, useEffect } from 'react';
import './MessageAddInput.css'
import { CompositeDecorator, Editor, EditorState } from 'draft-js';

const hashtag = memo((props) =>
(<span {...props} className='hashtag'>
    {props.children}
</span>))

const ExcessCharsSpan = memo((props) =>
    (<span className="excess-chars" {...props}>{props.children}</span>))

const MessageAddInput = memo(({ setValue }) => {
    const HASHTAG_REGEX = /(^|\B)(#(?![0-9_]+\b)([a-zA-Z0-9_]{2,12}))(\b|\r)/g;
    const compositeDecorator = new CompositeDecorator([
        {
            strategy: hashtagStrategy,
            component: hashtag,
        },
        {
            strategy: highlightExcessChars,
            component: ExcessCharsSpan,
        },
    ]);
    const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty(compositeDecorator));

    function hashtagStrategy(contentBlock, callback, contentState) {
        findWithRegex(HASHTAG_REGEX, contentBlock, callback);
    }

    function findWithRegex(regex, contentBlock, callback) {
        const text = contentBlock.getText();
        let matchArr, start;
        while ((matchArr = regex.exec(text)) !== null) {
            start = matchArr.index;
            callback(start, start + matchArr[0].length);
        }
    }

    function highlightExcessChars(contentBlock, callback, contentState) {
        const blockText = contentBlock.getText();
        const excessChars = blockText.slice(140); // Получаем символы с индекса 140 и далее

        if (excessChars.length > 0) {
            const startIndex = blockText.lastIndexOf(excessChars);
            callback(startIndex, startIndex + excessChars.length);
        }
    };

    useEffect(() => {
        const contentState = editorState.getCurrentContent();
        const text = contentState.getPlainText();
        setValue(text);
    }, [editorState]);

    return (
        <div className='MessageAddInput'>
            <Editor placeholder='Расскажите что-то новое?!' editorState={editorState} onChange={setEditorState} />
        </div>
    );
})

export default MessageAddInput;
