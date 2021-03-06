import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Layout, Card, List, Avatar } from 'antd';
import styled from 'styled-components';

const CURRENT_ADMIN_QUERY = gql`
  query {
    admin {
      email
      admin {
        nama
      }
    }
  }
`;

const HeaderAvatar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;

  div {
    margin-top: 20px;
    text-align: center;
    h2 {
      margin-bottom: 4px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      font-size: 20px;
      line-height: 28px;
    }
  }
`;

const ProfilAdmin = () => (
  <Query query={CURRENT_ADMIN_QUERY}>
    {({ data: { admin }, loading }) => {
      console.log(admin);
      return (
        <Card style={{ margin: '20px', padding: '24px' }} loading={loading}>
          <HeaderAvatar>
            <Avatar size={144} icon="user" />
            {/* <div>
            <h2>{admin.admin.nama.toUpperCase()}</h2>
            <p>{admin.permissions.filter(permission => !['USER'].includes(permission)).join(' ')}</p>
          </div> */}
          </HeaderAvatar>

          <List>
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon="mail" />}
                title={<a href="https://ant.design">Email</a>}
                description={admin.email}
              />
            </List.Item>
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon="mail" />}
                title={<a href="https://ant.design">Permission</a>}
                description={admin.permissions.reduce((acc, prev) => `${acc} ${prev},`, '')}
              />
            </List.Item>
          </List>
        </Card>
      );
    }}
  </Query>
);

export default ProfilAdmin;
