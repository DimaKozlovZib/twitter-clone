import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { NavigatePath, hashtagPath } from '../../routes';

const TextMessageContent = ({ hashtags, originalText }) => {
    const hashtagsNames = hashtags.map(i => i.name)
    const HASHTAG_REGEX = /(^|\B)(#(?![0-9_]+\b)([a-zA-Z0-9_]{2,18}))(\b|\r)/g;

    const text = useMemo(() => {
        const result = []
        let arr;
        let lastIndex = 0;

        while ((arr = HASHTAG_REGEX.exec(originalText)) !== null) {
            const indexStart = arr.index;
            const indexEnd = indexStart + arr[0].length;
            if (lastIndex < indexStart) {
                result.push((<p className='text' key={result.length++}>{originalText.slice(lastIndex, indexStart)}</p>))
            }

            const hashtagWord = originalText.slice(indexStart, indexEnd)
            const hashtagName = arr[0].slice(1)

            result.push(
                hashtagsNames.includes(hashtagName) ?
                    (<Link className='hashtag' key={result.length++}
                        to={NavigatePath(hashtagPath(hashtagName))}>{hashtagWord}</Link>) :

                    (<p className='text' key={result.length++} >{hashtagWord}</p>)
            )

            lastIndex = indexEnd;
        }
        if (lastIndex !== originalText.length) {
            const txt = originalText.slice(lastIndex)
            result.push((<p className='text' key={result.length++}>{txt}</p>))
        }

        return result;
    }, [originalText])

    return (
        <div className='TextMessageContent'>
            {text ? text : <></>}
        </div>
    );
}

export default TextMessageContent;
