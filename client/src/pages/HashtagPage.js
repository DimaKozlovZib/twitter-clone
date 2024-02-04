import React from 'react';
import Layout from './Layout';
import HashtagInfo from '../modules/HashtagInfo/HashtagInfo';
import { Helmet } from 'react-helmet';
import { PROJECT_NAME } from '../constans';
import { useParams } from 'react-router-dom';

const HashtagPage = () => {
    const { hashtagName } = useParams()

    return (
        <Layout>
            <Helmet title={`Хештег #${hashtagName} | ${PROJECT_NAME} | Школьный проект КДМ`} />
            <HashtagInfo />
        </Layout>
    );
}

export default HashtagPage;
