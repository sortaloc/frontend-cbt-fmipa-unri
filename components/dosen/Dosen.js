import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const CURRENT_DOSEN_QUERY = gql`
  query {
    currentDosen {
      email
      dosen {
        id
        nama
      }
      permissions
    }
  }
`;

const ProfilDosen = props => (
  <Query {...props} query={CURRENT_DOSEN_QUERY}>
    {payload => props.children(payload)}
  </Query>
);

export default ProfilDosen;
export { CURRENT_DOSEN_QUERY };