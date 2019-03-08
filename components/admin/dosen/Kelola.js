import React, { Component } from 'react';
import { Card, Form, Input, Select, Button, Avatar, Alert } from 'antd';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

import Dosens from './Dosens';
import ListDosen from './ListDosen';

const { Option } = Select;
const { Search } = Input;

const SEARCH_DOSEN_QUERY1 = gql`
  query SEARCH_DOSEN_QUERY($searchTerm: String!, $jurusan: String!, $prodi: String!) {
    dosens(
      where: {
        AND: [
          { OR: [{ nama_contains: $searchTerm }, { nip_contains: $searchTerm }] }
          { prodi_some: { nama_contains: $prodi, jurusan: { nama_contains: $jurusan } } }
        ]
      }
    ) {
      id
      nama
      nip
      user {
        id
        email
        passwordKasih
      }
    }
  }
`;

const jurusans = ['semua', 'fisika', 'matematika', 'kimia', 'ilmu komputer'];
const prodi = {
  fisika: ['semua', 'Fisika A'],
  matematika: ['semua', 'Matematika A'],
  'ilmu komputer': ['semua', 'sistem informasi', 'manajemen informatika'],
  kimia: ['semua', 'Kimia A'],
  semua: [],
};

class KelolaDosen extends Component {
  state = {
    jurusan: '',
    prodi: '',
    prodies: [],
    loading: false,
    dosens: this.props.dosens,
    keyword: '',
  };

  handleJurusanChange = async (value, client) => {
    this.setState({ loading: true });
    const res = await client.query({
      query: SEARCH_DOSEN_QUERY1,
      variables: { searchTerm: '', jurusan: value === 'semua' ? '' : value, prodi: '' },
    });

    this.setState({
      prodies: prodi[value],
      jurusan: value,
      prodi: prodi[value][0],
      dosens: res.data.dosens,
      loading: false,
      keyword: '',
    });
  };

  handleProdiChange = async (value, client) => {
    this.setState({ loading: true });
    const res = await client.query({
      query: SEARCH_DOSEN_QUERY1,
      variables: {
        searchTerm: '',
        jurusan: this.state.jurusan,
        prodi: value === 'semua' ? '' : value,
      },
    });

    this.setState({
      prodi: value,
      dosens: res.data.dosens,
      loading: false,
      keyword: '',
    });
  };

  handleCari = async (value, client) => {
    this.setState({ loading: true });
    const { jurusan, prodi } = this.state;
    console.log(value, jurusan, prodi);
    const res = await client.query({
      query: SEARCH_DOSEN_QUERY1,
      variables: {
        searchTerm: value,
        jurusan: jurusan === 'semua' ? '' : jurusan,
        prodi: prodi === 'semua' ? '' : prodi,
      },
    });

    this.setState({
      dosens: res.data.dosens,
      loading: false,
    });
  };

  render() {
    return (
      <Card
        title="Kelola Akun Dosen"
        style={{ margin: '20px', padding: '24px' }}
        extra={<Button>Tambah Akun</Button>}
      >
        <ApolloConsumer>
          {client => (
            <Form>
              <Form.Item
                label="Jurusan"
                style={{ maxWidth: '480px' }}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
              >
                <Select
                  defaultValue={jurusans[0]}
                  placeholder="Pilih Jurusan"
                  onChange={value => this.handleJurusanChange(value, client)}
                >
                  {jurusans.map(jurusan => (
                    <Option key={jurusan} value={jurusan}>
                      {jurusan.toUpperCase()}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Program Studi"
                style={{ maxWidth: '480px' }}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
              >
                <Select
                  placeholder="Pilih Prodi"
                  disabled={!this.state.jurusan.length || this.state.jurusan === 'semua'}
                  value={this.state.prodi}
                  onChange={value => this.handleProdiChange(value, client)}
                >
                  {this.state.prodies.map(prodiku => (
                    <Option key={prodiku} value={prodiku}>
                      {prodiku.toUpperCase()}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Total Akun"
                style={{ maxWidth: '480px' }}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
              >
                <p>{this.state.dosens.length} Akun</p>
              </Form.Item>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: '20px',
                }}
              >
                <Search
                  onChange={(e) => {
                    e.persist();
                    this.setState({ keyword: e.target.value });
                  }}
                  value={this.state.keyword}
                  style={{ maxWidth: '480px' }}
                  placeholder="Masukan Nama atau NIP"
                  enterButton="Cari akun"
                  onSearch={value => this.handleCari(value, client)}
                />
              </div>
            </Form>
          )}
        </ApolloConsumer>
        <ListDosen dosens={this.state.dosens} loading={this.state.loading} />
      </Card>
    );
  }
}

const Kelola = () => (
  <Dosens>
    {({ data, loading }) => {
      if (loading) return <p>Loading...</p>;
      return <KelolaDosen dosens={data.dosens} />;
    }}
  </Dosens>
);

export default Kelola;
