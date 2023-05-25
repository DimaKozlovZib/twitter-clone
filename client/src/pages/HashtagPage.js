import React from 'react';
import Layout from './Layout';
import HashtagInfo from '../modules/HashtagInfo/HashtagInfo';

const HashtagPage = () => {
    return (
        <Layout canClose>
            <HashtagInfo />
        </Layout>
    );
}

export default HashtagPage;
