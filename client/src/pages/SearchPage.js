import React from 'react';
import Layout from './Layout';
import Search from '../modules/Search/Search';
import { Helmet } from 'react-helmet-async';
import { PROJECT_NAME } from '../constans';

const SearchPage = () => {
    return (
        <Layout>
            <Helmet>
                <title>{`Поиск | ${PROJECT_NAME} | Школьный проект КДМ`}</title>
            </Helmet>
            <Search />
        </Layout>
    );
}

export default SearchPage;
