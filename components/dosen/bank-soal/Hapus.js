import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Button, Popconfirm, Icon, Alert } from 'antd';

import { SEARCH_LIST } from './List';

const HAPUS_MUTATION = gql`
  mutation HAPUS_MUTATION($id: ID!) {
    deleteBankSoal(id: $id) {
      id
    }
  }
`;

class Hapus extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  };

  render() {
    return (
      <Mutation
        mutation={HAPUS_MUTATION}
        variables={{ id: this.props.id }}
        refetchQueries={[
          {
            query: SEARCH_LIST,
            variables: {
              searchTerm: this.props.keyword,
              jurusan: this.props.jurusan,
              prodi: this.props.prodi,
            },
          },
        ]}
      >
        {(deleteItem, { error, loading, called }) => (
          <>
            {error && <Alert message="Error Saat Mengahapus" type="error" closable />}

            <Popconfirm
              title="Are you sure？"
              icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
              onConfirm={deleteItem}
            >
              <Button type="danger" loading={loading}>
                Delete
              </Button>
            </Popconfirm>
          </>
        )}
      </Mutation>
    );
  }
}

export default Hapus;
export { HAPUS_MUTATION };
