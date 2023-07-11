import React, { memo, useState } from 'react';
import useInput from '../../hooks/useInput';
import './FormInput.css';

const FormInput = memo(({ placeholder, img, state, setError, setState, type, validations, title }) => {
    const [focus, setFocus] = useState(false);
    const { error, onChange, onBlur } = useInput(state, setError, setState, validations)

    const changeFocus = (e) => setFocus(true)
    return (
        <div className='FormInput-wrapper'>
            <h5>{title}</h5>
            <div className={`FormInput ${!focus || 'focus'}`}>
                {img || <></>}
                <input type={type} placeholder={placeholder} onFocus={changeFocus} value={state} onChange={onChange} onBlur={onBlur} />
            </div>
            {error && <p className='error'>{error}</p>}
        </div>
    );
})

export default FormInput;
