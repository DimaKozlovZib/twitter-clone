import { useEffect, useState } from 'react';

const useValidation = (value, setError, validations) => {
    const [err, setErr] = useState();
    let isError = false

    const conditionError = (condition, error) => {
        if (!condition) return false;

        isError = true;
        setErr(error)
        setError(error)

    };

    useEffect(() => {
        if (!setError) return;

        for (const validation in validations) {
            switch (validation) {
                case 'isEmail':
                    const regular = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    const condition = value.toLowerCase().match(regular);
                    conditionError(!condition, 'Не действительная почта.')
                    break;
                case 'minLength':
                    conditionError(value.length < validations.minLength,
                        `В поле должно быть не меньше ${validations.minLength} символов.`)
                    break;
                case 'maxLength':
                    conditionError(value.length > validations.maxLength,
                        `В поле должно быть не больше ${validations.maxLength} символов.`)
                    break;
                case 'isNotEmpty':
                    conditionError(value.length === 0 && validations.isNotEmpty,
                        `Поле не должно быть пустым.`)
                    break;
            }

        }

        if (!isError) {
            setErr(null)
            setError(null)
        }
    }, [value, setError]);

    return { error: err }
}

export default useValidation;
