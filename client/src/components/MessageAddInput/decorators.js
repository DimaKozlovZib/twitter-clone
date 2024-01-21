import { CompositeDecorator } from "draft-js";
import { memo } from "react";

const HASHTAG_REGEX = /(^|\B)(#[^\s!@#$%^&*()=+.\/,\[{\]};:'"?><]{2,14})(?![\p{L}\p{N}_])/g;

const hashtag = memo((props) =>
(<span {...props} data-hashtagId="none" data-serverHashtagValue='none' className='hashtag'>
    {props.children}
</span>))

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

const ExcessCharsSpan = memo((props) =>
    (<span className="excess-chars" {...props}>{props.children}</span>))

function highlightExcessChars(contentBlock, callback, contentState) {
    const blockText = contentBlock.getText();
    const excessChars = blockText.slice(140); // Получаем символы с индекса 140 и далее

    if (excessChars.length > 0) {
        const startIndex = blockText.lastIndexOf(excessChars);
        callback(startIndex, startIndex + excessChars.length);
    }
};

export const compositeDecorator = new CompositeDecorator([
    {
        strategy: hashtagStrategy,
        component: hashtag,
        props: { editor: this }
    },
    {
        strategy: highlightExcessChars,
        component: ExcessCharsSpan,
    },
]);