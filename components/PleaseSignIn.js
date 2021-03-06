/* eslint-disable react/prop-types */
import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, Icon } from 'antd';
import Router, { withRouter } from 'next/router';
import NProgress from 'nprogress';
import Meta from './Meta';
import { CURRENT_USER_QUERY } from './User';
import Login from './Login';

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

const { Footer } = Layout;

const Logo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  h1 {
    display: inline-block;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
    font-size: 33px;
    font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
    vertical-align: middle;
    padding: 0;
    margin: 0;
  }
  img {
    display: inline-block;
    vertical-align: middle;
    height: 44px;
    margin-right: 16px;
  }
`;

const SubLogo = styled.div`
  text-align: center;
  margin-top: 12px;
  margin-bottom: 40px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
`;

const PleaseSignIn = props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading }) => {
      if (loading) return <p>Loading...</p>;
      if (!data) return <p>Server Error..</p>;

      if (!data.me) {
        return (
          <Layout style={{ flex: 1, alignItems: 'center' }}>
            <Meta />
            <div style={{ width: '400px', marginTop: '80px' }}>
              <Logo>
                <img src="../static/logo-ur.png" alt="logo" />
                <h1>CBT FMIPA UR</h1>
              </Logo>
              <SubLogo>
                <p>Portal Computer Based Test FMIPA UR</p>
              </SubLogo>
              <Login />
            </div>

            <Footer>
              <SubLogo>
                Made with <Icon type="heart" color="red" style={{ margin: '0px 5px' }} /> by Haris
                Sucipto
              </SubLogo>
            </Footer>
          </Layout>
        );
      }
      // authrization
      const alamatAkses = props.router.pathname.split('/')[1];
      const HAKAKSES = ['admin', 'dosen', 'mahasiswa'];
      const hakAksesSaya = data.me.permissions;

      // check authriztion
      // jika hak akses tidadk sama dengan hak akses yang dimiliki maka anda ditendang
      if (HAKAKSES.filter(akses => akses === alamatAkses).length) {
        if (!hakAksesSaya.includes(alamatAkses.toUpperCase())) {
          return <p>Anda Tidak Memiliki Hak Akses ke sini</p>;
        }
      }

      return props.children;
    }}
  </Query>
);

PleaseSignIn.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default withRouter(PleaseSignIn);
