/* eslint-disable react/prop-types */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import { Card, Row, Col, Button } from 'antd';
import TableMahasiswa from './TableMahasiswa';
import TableBeritaAcara from './TableBeritaAcara';

import ListKelas from './ListKelasHasil';
import ProfilUjian from './ProfilUjian';
import PrintHasilUjian from './PrintHasilUjian';

const CURRENT_QUERY = gql`
  query CURRENT_QUERY($id: ID!) {
    ujian(where: { id: $id }) {
      id
      nama
      soalMahasiswas {
        id
        mahasiswa {
          image
          id
          nama
          nim
        }
        skor
      }

      dosen {
        id
        nama
      }
      prodi {
        id
        nama
        jurusan {
          id
          nama
        }
      }
      kelas {
        id
        nama
        mataKuliah {
          id
          nama
        }
        mahasiswas {
          id
          nama
          nim
          image
        }
      }
      bankSoal {
        id
        nama
      }
      tanggalPelaksanaan
      lokasi
      soals {
        id
      }

      durasiPengerjaan
      beritaAcaraUjian {
        id
        mahasiswa {
          id
          nama
          nim
        }
        teralambat
        wajah
        sakit
        menyontek
        alatDilarang
      }
      tidakHadirs {
        id
        mahasiswa {
          id
          nama
          nim
        }
      }
    }
  }
`;

class ProfilAdmin extends React.Component {
  render() {
    const { id } = this.props;

    return (
      <Query query={CURRENT_QUERY} variables={{ id }} fetchPolicy="network-only">
        {({ data, loading }) => {
          if (!data) return <p>Loading..</p>;
          console.log(data, 'data profil');

          return (
            <Row type="flex" gutter={16} style={{ margin: '40px' }}>
              <Col xs={24}>
                <Card
                  title="Informasi Hasil Ujian"
                  loading={loading}
                  style={{ marginBottom: '15px' }}
                  extra={
                    <>
                      <Button
                        style={{ marginRight: '20px' }}
                        type="primary"
                        onClick={() =>
                          Router.push({
                            pathname: '/dosen/ujian/soals',
                            query: { id: data.ujian.id },
                          })
                        }
                      >
                        Lihat Distribusi Soal
                      </Button>
                      <Button
                        type="dashed"
                        onClick={() =>
                          Router.push({
                            pathname: '/dosen/ujian/print-hasil',
                            query: { id: data.ujian.id },
                          })
                        }
                      >
                        Preview Cetak Hasil Ujian
                      </Button>
                    </>
                  }
                >
                  <ProfilUjian
                    ujian={data.ujian}
                    grid={{
                      gutter: 16,
                      lg: 3,
                      md: 2,
                      xs: 1,
                    }}
                  />
                </Card>
              </Col>
              <Col xs={24} style={{ marginBottom: '15px' }}>
                <Card title="Peserta Ujian:">
                  <ListKelas
                    idUjian={id}
                    mahasiswas={data.ujian.soalMahasiswas}
                    loading={loading}
                    kelas={data.ujian.kelas.id}
                  />
                </Card>
              </Col>
              <Col md={24} style={{ marginBottom: '15px' }}>
                <Card title="Berita Acara Ujian" loading={loading}>
                  <TableBeritaAcara mahasiswas={data.ujian.beritaAcaraUjian} />
                </Card>
              </Col>
              <Col md={7} style={{ marginBottom: '15px' }}>
                <Card title="Peserta Tidak Hadir" loading={loading}>
                  <TableMahasiswa mahasiswas={data.ujian.tidakHadirs} />
                </Card>
              </Col>
            </Row>
          );
        }}
      </Query>
    );
  }
}

export default ProfilAdmin;
export { CURRENT_QUERY };
