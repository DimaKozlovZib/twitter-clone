import { useState } from 'react';
import useValidation from './useValidation';

const useInput = (value, setError, setValue, validations) => {
    const [isDirty, setIsDirty] = useState(false);

    const { error } = useValidation(value, setError, validations)

    const onChange = (e) => setValue(e.target.value)
    const onBlur = (e) => setIsDirty(true)

    return {
        onChange,
        onBlur,
        error: isDirty ? error : null
    }
}

export default useInput;
