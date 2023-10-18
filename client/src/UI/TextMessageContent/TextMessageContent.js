import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TextMessageContent = ({ hashtags, originalText }) => {
    const hashtagsNames = hashtags.map(i => i.name)
    const HASHTAG_REGEX = /(^|\B)(#(?![0-9_]+\b)([a-zA-Z0-9_]{2,18}))(\b|\r)/g;

    const jsxGenerate = () => {
        const result = []
        let arr;
        let lastIndex = 0;

        while ((arr = HASHTAG_REGEX.exec(originalText)) !== null) {
            const indexStart = arr.index;
            const indexEnd = indexStart + arr[0].length;
            if (lastIndex < indexStart) {
                result.push((<p className='text'>{originalText.slice(lastIndex, indexStart)}</p>))
            }

            const hashtagWord = originalText.slice(indexStart, indexEnd)
            result.push(
                hashtagsNames.includes(arr[0].slice(1)) ?
                    (<Link className='hashtag' to={`/twitter-clone/hashtag/${arr[0].slice(1)}`}>{hashtagWord}</Link>) :
                    (<p className='text'>{hashtagWord}</p>)
            )

            lastIndex = indexEnd;
        }
        if (lastIndex !== originalText.length) {
            result.push((<p className='text'>{originalText.slice(lastIndex)}</p>))
        }

        return result;
    }

    const [text, setText] = useState(jsxGenerate());

    return (
        <div className='TextMessageContent'>
            {text ? text : <></>}
        </div>
    );
}

export default TextMessageContent;
