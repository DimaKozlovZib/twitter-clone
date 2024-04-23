import React, { Component } from 'react';
import './MessageList.css';
import MessagePost from '../../components/messagePost/messagePost';
import { setSavedDataAction, setViewedDataAction } from '../../store/index';
import { connect } from 'react-redux';
import { getMessages } from '../../API/messagesApi.js';
import LoaderHorizontally from '../../UI/LoaderHorizontally/LoaderHorizontally.js';
import { messageShown } from './API.js';

class MessageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messagesArray: [],
            //succesDeleteId: null,
            viewedMessages: [],
            isLoading: true,
            page: 0
        };

        this.maxViewedMessagesCount = 5
        this.changePageElement = React.createRef()
        this.limit = 4;
        this.first = true
    }

    getData = (page, viewedData) => {
        this.setState({ isLoading: true });

        const viewedDataJSON = JSON.stringify(viewedData);
        getMessages({ limit: this.limit, viewedDataJSON }).then((res) => {
            if (!res) return;
            this.setState(prevState => ({
                messagesArray: [...prevState.messagesArray, { data: res?.data, page }],
                isLoading: false,
            }));
        });

    }

    seeOnChangePageElement = (entries, observer) => {
        const len = this.state.messagesArray.length

        entries.forEach(async (entry) => {
            // Текст блока полностью видим на экране
            if (entry.intersectionRatio !== 1 || len === 0) return;

            this.setState({
                page: this.state.page + 1
            })
        })
    };

    componentDidMount() {
        const { messagesArray, page } = this.state;
        const { savedData, isAuth, viewedData } = this.props;
        const len = messagesArray.length

        if (len === 0 && savedData.data) {
            const savedList = savedData.data;
            this.setState({
                messagesArray: savedList,
                isLoading: false,
                page: savedList[savedList.length - 1].page
            });
            window.scrollTo(0, savedData.scroll);
        }

        if (isAuth !== null && (this.first && page === 0 && messagesArray.length === 0)) {
            this.first = false
            this.getData(page, viewedData);
        }

        const observer = new IntersectionObserver(this.seeOnChangePageElement, {
            threshold: 1,
        });

        observer.observe(this.changePageElement.current);
    }

    componentDidUpdate(prevProps, prevState) {
        const { viewedData, isAuth } = this.props;
        const { messagesArray, page, viewedMessages } = this.state;

        if (isAuth !== null && (prevState.page !== page || (this.first && page === 0 && messagesArray.length === 0))) {
            this.first = false
            this.getData(page, viewedData);
        }

        //if (prevState.succesDeleteId !== succesDeleteId && succesDeleteId !== null) {
        //    const [id, page] = succesDeleteId;
        //    this.setState({
        //        messagesArray: messagesArray.filter(item => item.page === page).data.filter(mes => mes.id !== id),
        //        succesDeleteId: null
        //    })
        //}

        if (prevState.messagesArray !== messagesArray) {
            if (messagesArray.length > 0) {
                const newState = messagesArray.reduce((res, cur) => [...res, ...cur?.data], [])
                    .map(i => i.id)

                this.props.setViewedDataAction(newState)
            } else {
                this.props.setViewedDataAction([])
            }
        }

        if (prevState.viewedMessages !== viewedMessages && viewedMessages.length >= this.maxViewedMessagesCount) {
            messageShown(viewedMessages)
            this.setState({
                viewedMessages: []
            })
        }
    }

    componentWillUnmount() {
        if (this.state.messagesArray.length > 0) {
            const objToSave = { data: this.state.messagesArray, scroll: window.pageYOffset };

            this.props.setSavedDataAction(objToSave);
        }
    }

    addViewedMessage = (id) => {
        if (!id || !Number(id) || this.state.viewedMessages.includes(id)) return;

        this.setState({
            viewedMessages: [...this.state.viewedMessages, id]
        })
    }

    render() {
        const { isLoading, messagesArray } = this.state;
        return (
            <div className='messagesList'>
                {
                    messagesArray.length > 0 ?
                        messagesArray.reduce((arr, i) => [...arr, ...i.data], [])
                            .map(item =>
                                <MessagePost
                                    addViewedMessage={this.addViewedMessage}
                                    //setDelete={this.setSuccesDeleteId}
                                    messageObject={item}
                                    key={item.id}
                                />)
                        : ''
                }
                <div className='changePageElement' ref={this.changePageElement}></div>
                {isLoading && (<div className='moduleData_loader-wrapper'><LoaderHorizontally /></div>)}
            </div >
        );
    }
}

const mapStateToProps = state => ({
    isAuth: state.isAuth,
    savedData: state.savedData,
    viewedData: state.viewedData
});

const mapDispatchToProps = dispatch => ({
    setSavedDataAction: data => dispatch(setSavedDataAction(data)),
    setViewedDataAction: data => dispatch(setViewedDataAction(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageList);
