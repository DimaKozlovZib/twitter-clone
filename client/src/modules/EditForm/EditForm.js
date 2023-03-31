import React, { useEffect, useState } from 'react';
import UserAvatar from '../../UI/UserAvatar/UserAvatar';
import './EditForm.css';
import { useSelector } from 'react-redux';
import '../../styles/changeCover.css';
import useModal from '../../hooks/useModal';
import { editInfo } from './API';
import SuccesMessage from '../../UI/SuccesMessage/SuccesMessage';
import { setUserAction } from '../../store';

const EditForm = () => {
    const user = useSelector(state => state.user);
    const isAuth = useSelector(state => state.isAuth);
    const [openModal] = useModal('ADD_COVER-MODAL');

    const [activeBtn, setActiveBtn] = useState(false);

    const [name, setName] = useState(user.name);
    const [date, setDate] = useState(user.age);
    const [shortInfo, setShortInfo] = useState(user.shortInfo);

    const [сhangedInputs, setChangedInputs] = useState({ 'name': false, 'date': false, 'shortInfo': false });

    const [isSuccesMessageActive, setIsSuccesMessageActive] = useState(false);

    useEffect(() => {
        if (isAuth && !Object.values(сhangedInputs).find(item => item === true)) {
            setName(user.name);
            setDate(user.age);
            setShortInfo(user.shortInfo)
        }
    }, [isAuth]);

    const onChangeName = e => {
        setName(e.target.value);
        setChangedInputs({ ...сhangedInputs, name: true });
    };
    const onChangeDate = e => {
        setDate(e.target.value);
        setChangedInputs({ ...сhangedInputs, date: true });
    };
    const onChangeShortInfo = e => {
        setShortInfo(e.target.value);
        setChangedInputs({ ...сhangedInputs, shortInfo: true });
    };

    const sendChanges = async () => {
        try {

            if (!Object.values(сhangedInputs).find(item => item === true)) return null;

            const requestData = {};

            [
                [name, сhangedInputs.name, 'name'],
                [date, сhangedInputs.date, 'age'],
                [shortInfo, сhangedInputs.shortInfo, 'shortInfo']
            ].forEach(([data, isChanged, objName]) => { if (isChanged) requestData[objName] = data })

            const res = await editInfo(requestData);

            if (res && res?.status === 200) {
                setIsSuccesMessageActive(true);
                setUserAction(res.data.user);
                setChangedInputs({ 'name': false, 'date': false, 'shortInfo': false });
                setActiveBtn(false);
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if ([[name, user.name], [date, user.age], [shortInfo, user.shortInfo]]
            .every(([variable, userData]) => variable === userData)) {

            return setActiveBtn(false)
            // если пользователь изменяет или возвращает на прощлое значение
            //, то он не сможет вызвать запрос
        }
        setActiveBtn(true)
        if (isSuccesMessageActive) setIsSuccesMessageActive(false)
    }, [name, date, shortInfo]);

    return (
        <div className="EditForm">
            <div className='profile-cover'
                style={{ 'backgroundImage': `url(http://localhost:5000/${user.coverImage})` }}>
                <button className='edit-cover' onClick={openModal}>
                    <span className='edit-cover__icon'>
                        <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 15.248V18.9975H3.74948L14.8079 7.93903L11.0585 4.18955L0 15.248ZM17.7075 5.03944C18.0975 4.64949 18.0975 4.01958 17.7075 3.62963L15.3679 1.28996C14.9779 0.900011 14.348 0.900011 13.9581 1.28996L12.1283 3.1197L15.8778 6.86918L17.7075 5.03944Z" fill="black" />
                        </svg>
                    </span>
                    <span className='edit-cover__title'>Изменить обложку</span>
                </button>
            </div>

            <div className='EditForm-content'>
                <input type="file" id='input' className='inputForAvatar' />
                <label htmlFor='input' className='EditForm-avatar'>
                    <UserAvatar url={user.img} isLink={false} />
                    <svg width="39" className='addPhotoIcon' height="34" viewBox="0 0 39 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 11C1 9.93913 1.43313 8.92172 2.20412 8.17157C2.9751 7.42143 4.02078 7 5.11111 7H7.02278C7.69943 7.0001 8.36566 6.83769 8.96233 6.52718C9.559 6.21667 10.0677 5.76766 10.4432 5.22L12.1123 2.78C12.4879 2.23234 12.9966 1.78333 13.5932 1.47282C14.1899 1.16231 14.8561 0.999902 15.5328 1H23.4672C24.1439 0.999902 24.8101 1.16231 25.4068 1.47282C26.0034 1.78333 26.5121 2.23234 26.8877 2.78L28.5568 5.22C28.9323 5.76766 29.441 6.21667 30.0377 6.52718C30.6343 6.83769 31.3006 7.0001 31.9772 7H33.8889C34.9792 7 36.0249 7.42143 36.7959 8.17157C37.5669 8.92172 38 9.93913 38 11V29C38 30.0609 37.5669 31.0783 36.7959 31.8284C36.0249 32.5786 34.9792 33 33.8889 33H5.11111C4.02078 33 2.9751 32.5786 2.20412 31.8284C1.43313 31.0783 1 30.0609 1 29V11Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M25.6668 19C25.6668 20.5913 25.0171 22.1174 23.8607 23.2426C22.7042 24.3679 21.1357 25 19.5002 25C17.8647 25 16.2961 24.3679 15.1397 23.2426C13.9832 22.1174 13.3335 20.5913 13.3335 19C13.3335 17.4087 13.9832 15.8826 15.1397 14.7574C16.2961 13.6321 17.8647 13 19.5002 13C21.1357 13 22.7042 13.6321 23.8607 14.7574C25.0171 15.8826 25.6668 17.4087 25.6668 19Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </label>
                <div className='EditForm-changeInfo'>
                    {
                        isSuccesMessageActive &&
                        <SuccesMessage>Изменения сохранены.</SuccesMessage>
                    }
                    <div className='email-name__wrapper'>
                        <div className='EditForm_input name'>
                            <h4>Никнейм</h4>
                            <input maxLength='30' type='text' value={name || ''} onChange={onChangeName} />
                        </div>
                        <div className='EditForm_input date'>
                            <h4>День рождения</h4>
                            <input type='date' value={date || ''} onChange={onChangeDate} />
                        </div>
                    </div>
                    <div className='EditForm_input short-info'>
                        <h4>Краткая информация</h4>
                        <textarea autoComplete="off" value={shortInfo || ''} onChange={onChangeShortInfo} className='short-info_input' maxLength='190'></textarea>
                    </div>
                    <button className={`EditForm-btn ${activeBtn && 'active'}`} disabled={!activeBtn} onClick={sendChanges}>Сохранить</button>
                </div>
            </div>
        </div>
    );
}

export default EditForm;
