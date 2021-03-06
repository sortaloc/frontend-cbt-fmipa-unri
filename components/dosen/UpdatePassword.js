import React, { Component } from 'react';
import { Card, Form, Input, Button, Icon, Alert } from 'antd';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import PesanError from '../PesanError';

const UPDATE_PASSWORD = gql`
  mutation UPDATE_PASSWORD($password: String!, $id: ID!) {
    updatePasswordDosen(
      where: { id: $id }
      data: { user: { update: { password: $password, passwordKasih: $password } } }
    ) {
      id
      user {
        id
      }
    }
  }
`;

class UpdatePassword extends Component {
  state = {
    password: '',
  };

  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Mutation
        mutation={UPDATE_PASSWORD}
        variables={{
          id: this.props.id,
          password: this.state.password,
        }}
      >
        {(updatePassword, { error, loading, called }) => (
          <Card title="Ganti Password">
            <Form
              onSubmit={async (e) => {
                e.preventDefault();
                await updatePassword();
                this.setState({ password: '' });
              }}
            >
              {error && <PesanError error={error} />}
              {!error && !loading && called && (
                <Alert
                  message="Rubah Password Berhasil"
                  type="success"
                  showIcon
                  style={{ margin: '10px 0' }}
                />
              )}
              <Form.Item>
                <Input
                  disabled={loading}
                  prefix={<Icon type="lock" />}
                  type="text"
                  name="password"
                  placeholder="password"
                  value={this.state.password}
                  onChange={this.saveToState}
                  required
                />
              </Form.Item>

              <Button type="primary" htmlType="submit">
                Rubah Password
              </Button>
            </Form>
          </Card>
        )}
      </Mutation>
    );
  }
}

export default UpdatePassword;
