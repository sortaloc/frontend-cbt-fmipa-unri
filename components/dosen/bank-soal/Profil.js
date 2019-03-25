import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import { Card, List, Avatar, Row, Col, Button } from 'antd';

import ListSoal from './ListSoal';

const CURRENT_QUERY = gql`
  query CURRENT_QUERY($id: ID!) {
    bankSoal(where: { id: $id }) {
      id
      nama
      prodi {
        id
        nama
        jurusan {
          id
          nama
        }
      }
      mataKuliah {
        id
        nama
      }
      dosen {
        id
        nama
      }
      soals {
        id
        pertanyaan
        jawaban {
          id
          title
          content
        }
        kunciJawaban
        tingkatKesulitan
      }
    }
  }
`;

const ProfilAdmin = ({ id }) => (
  <Query query={CURRENT_QUERY} variables={{ id }} fetchPolicy="network-only">
    {({ data, loading }) => {
      if (loading) return <p>Loading...</p>;
      if (!data) return <p>Loading..</p>;
      console.log(data, 'data profil');

      return (
        <Row type="flex" gutter={16} style={{ margin: '40px' }}>
          <Col xs={24} md={8}>
            <Card title="Informasi Bank Soal" loading={loading}>
              {/* <HeaderAvatar>
            <Avatar size={144} icon="user" />
            <div>
              <p>
                {data.admin.permissions
                  .filter(permission => !['USER'].includes(permission))
                  .join(' ')}
              </p>
            </div>
          </HeaderAvatar> */}

              <List>
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon="file-text" />}
                    title={<a>Nama Bank Soal</a>}
                    description={data.bankSoal.nama}
                  />
                </List.Item>
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon="info" />}
                    title={<a>Jumlah Soal</a>}
                    description={data.bankSoal.soals.length}
                  />
                </List.Item>
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon="mail" />}
                    title={<a> Mata Kuliah</a>}
                    description={data.bankSoal.mataKuliah.nama}
                  />
                </List.Item>
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon="deployment-unit" />}
                    title={<a>Jurusan</a>}
                    description={data.bankSoal.prodi.jurusan.nama}
                  />
                </List.Item>
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon="cluster" />}
                    title={<a>Prodi</a>}
                    description={data.bankSoal.prodi.nama}
                  />
                </List.Item>
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon="user" />}
                    title={<a>Dosen</a>}
                    description={data.bankSoal.dosen.nama}
                  />
                </List.Item>
              </List>
            </Card>
          </Col>
          <Col xs={24} md={16}>
            <Card
              title="Daftar Soal"
              extra={
                <Button
                  type="primary"
                  onClick={() => Router.push(`/dosen/bank-soal/tambah-soal?id=${data.bankSoal.id}`)}
                >
                  Tambah Soal
                </Button>
              }
            >
              <ListSoal
                soals={data.bankSoal.soals}
                bankSoal={data.bankSoal.id}
                loading={loading}
                idDosen={data.bankSoal.id}
              />
            </Card>
          </Col>
        </Row>
      );
    }}
  </Query>
);

export default ProfilAdmin;
export { CURRENT_QUERY };
