import React from 'react';
import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  Alert,
  Select,
  DatePicker,
  Slider,
  InputNumber,
  Row,
  Col,
} from 'antd';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import locale from 'antd/lib/locale-provider/zh_CN';

import PesanError from '../../PesanError';
import { SEARCH_LIST } from './List';
import { jurusans, prodis } from '../../../lib/jurusanProdi';
import PilihKelas from './PilihKelas';
import PilihBankSoal from './PilihBankSoal';

import moment from 'moment';
import 'moment/locale/id';
import { red } from 'ansi-colors';

const { Content } = Layout;
const { Option } = Select;

const CREATE_KELAS_MUTATION = gql`
  mutation CREATE_KELAS_MUTATION($prodi: String!, $nama: String!, $dosen: ID!, $mataKuliah: ID!) {
    createKelas(
      data: {
        nama: $nama
        mataKuliah: { connect: { id: $mataKuliah } }
        prodi: { connect: { nama: $prodi } }
        dosen: { connect: { id: $dosen } }
      }
    ) {
      id
      nama
    }
  }
`;

const DEFAULTSTATE = {
  nama: '',
  jurusan: '',
  prodi: '',
  prodies: [],
  kelas: undefined,
  mataKuliah: '',
  bankSoal: undefined,
  mudah: 0,
  sedang: 0,
  susah: 0,
  errorJumlahSoal: '',
  errorPersentasiSoal: '',

  totalSoalDibutuhkan: 0,
  mudahDibutuhkan: 0,
  susahDibutuhkan: 0,
  sedangDibutuhkan: 0,
};

class TambahDosen extends React.Component {
  state = {
    ...DEFAULTSTATE,
  };

  saveToState = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  setSoal = (soals) => {
    if (!soals.length) return;
    console.log(soals);
    const susah = soals.filter(soal => soal.tingkatKesulitan === 'SUSAH').length;
    const sedang = soals.filter(soal => soal.tingkatKesulitan === 'SEDANG').length;
    const mudah = soals.filter(soal => soal.tingkatKesulitan === 'MUDAH').length;
    this.setState({ susah, sedang, mudah });
  };

  totalSoal = () => {
    const { mudah, sedang, susah } = this.state;
    return mudah + sedang + susah;
  };

  handleJurusanChange = (value) => {
    this.setState({
      prodies: prodis[value],
      jurusan: value,
      prodi: prodis[value][0],
      kelas: undefined,
      kelasNama: undefined,
      bankSoal: undefined,
    });
  };

  handleProdiChange = (value) => {
    this.setState({
      prodi: value,
      kelas: undefined,
      kelasNama: undefined,
      bankSoal: undefined,
    });
  };

  rubahKelas = (value) => {
    console.log(value, 'ini');
    this.setState({
      kelas: value.kelas,
      mataKuliah: value.mataKuliah,
      kelasNama: value.tampilkanNilai,
      bankSoal: undefined,
    });
  };

  rubahBankSoal = (value) => {
    this.setState({
      bankSoal: value,
    });
  };

  rubahJumlahSoal = (value) => {
    const mau = value.target.value;
    this.setState({
      totalSoalDibutuhkan: mau,
      errorJumlahSoal: '',
    });
    if (mau > this.totalSoal()) {
      const errorJumlahSoal = `Error Soal Tidak Mencukupi, dibutuhkan ${Math.abs(this.totalSoal() - mau)} soal lagi`;
      this.setState({ errorJumlahSoal });
    }
  };

  ErrorPersen = (buatSoal, penyimpanan, persen, text) => {
    const dibutuhkan = Math.floor((buatSoal * persen) / 100);
    const sisa = Math.floor(penyimpanan - dibutuhkan);

    console.log(sisa, dibutuhkan, 'hhh');

    if (sisa < 0) {
      console.log('kkk');
      return `${text},  dibutuhkan ${Math.abs(sisa)}  soal lagi dari ${dibutuhkan} soal `;
    } else {
      console.log('tidak');
      return '';
    }
  };

  rubahPersenMudahSoal = (value) => {
    const mau = value;

    this.setState({
      mudahDibutuhkan: mau,
      errorPersentasiSoal: this.ErrorPersen(
        this.state.totalSoalDibutuhkan,
        this.state.mudah,
        Number(mau),
        'Error Memberikan Presntasi tingkat Kesulitan Mudah, Dibutuhkan Beberapa Soal untuk soal tingkat Kesulitan Mudah',
      ),
    });
  };

  rubahPersenSedangSoal = (value) => {
    const mau = value;

    this.setState({
      sedangDibutuhkan: mau,
      errorPersentasiSoal: this.ErrorPersen(
        this.state.totalSoalDibutuhkan,
        this.state.sedang,
        Number(mau),
        'Error Memberikan Presntasi tingkat Kesulitan Sedang, Dibutuhkan Beberapa Soal untuk soal tingkat Kesulitan Sedang',
      ),
    });
  };

  rubahPersenSusahSoal = (value) => {
    const mau = value;

    this.setState({
      susahDibutuhkan: mau,
      errorPersentasiSoal: this.ErrorPersen(
        this.state.totalSoalDibutuhkan,
        this.state.susah,
        Number(mau),
        'Error Memberikan Presntasi tingkat Kesulitan Susah, Dibutuhkan Beberapa Soal untuk soal tingkat Kesulitan Susah',
      ),
    });
  };

  render() {
    return (
      <Mutation
        mutation={CREATE_KELAS_MUTATION}
        refetchQueries={[
          {
            query: SEARCH_LIST,
            variables: {
              searchTerm: '',
              jurusan: '',
              prodi: '',
            },
          },
        ]}
        variables={{
          nama: this.state.nama.toLowerCase(),
          prodi: this.state.prodi,
          dosen: this.state.dosen,
          mataKuliah: this.state.mataKuliah,
        }}
      >
        {(createMataKuliah, {
 data, error, loading, called,
}) => {
          if (!loading) console.log(data);
          return (
            <Content>
              <Card
                title="Kelola Ujian"
                style={{ maxWidth: '800px', margin: '20px auto', paddding: '20px' }}
              >
                <h2>Buat Ujian Baru</h2>
                <Form
                  method="post"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await createMataKuliah();
                    this.setState({
                      ...DEFAULTSTATE,
                    });
                    console.log(this.state);
                  }}
                >
                  <PesanError error={error} />
                  {!error && !loading && called && (
                    <Alert
                      message={`Buat  kelas  ${data.createKelas.nama} berhasil`}
                      type="success"
                      showIcon
                      style={{ margin: '10px 0' }}
                    />
                  )}
                  <Form.Item label="Nama" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    <Input
                      disabled={loading}
                      name="nama"
                      value={this.state.nama}
                      placeholder="Nama Kelas"
                      type="string"
                      required
                      onChange={this.saveToState}
                    />
                  </Form.Item>
                  <Form.Item label="Jurusan" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    <Select placeholder="Pilih Jurusan" onChange={this.handleJurusanChange}>
                      {jurusans.map(jurusan => (
                        <Option key={jurusan} value={jurusan}>
                          {jurusan.toUpperCase()}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="Program Studi" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    <Select
                      placeholder="Pilih Prodi"
                      disabled={!this.state.jurusan.length || this.state.jurusan === 'semua'}
                      value={this.state.prodi}
                      onChange={this.handleProdiChange}
                    >
                      {this.state.prodies.map(prodiku => (
                        <Option key={prodiku} value={prodiku}>
                          {prodiku.toUpperCase()}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {/* <Form.Item label="MataKuliah" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    <PilihMataKuliah
                      jurusan={this.state.jurusan}
                      prodi={this.state.prodi}
                      mataKuliahIni={this.state.mataKuliah}
                      rubahState={this.handeMataKuliahChange}
                    />
                  </Form.Item>

                  <Form.Item label="Dosen" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    <PIlihDosen dosenIni={this.state.dosen} rubahState={this.handleDosenChange} />
                  </Form.Item> */}
                  <Form.Item label="Kelas" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    <PilihKelas
                      value={this.state.kelasNama}
                      onChange={this.rubahKelas}
                      jurusan={this.state.jurusan}
                      prodi={this.state.prodi}
                    />
                  </Form.Item>{' '}
                  <Form.Item
                    label="Waktu Pelaksanaan"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <DatePicker
                      placeholder="Pilih tanggal"
                      showTime
                      onChange={value => console.log(value)}
                    />
                  </Form.Item>{' '}
                  <Form.Item
                    label="Durasi Pengerjaan"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Input placeholder="Dalam menit" />
                  </Form.Item>{' '}
                  <Form.Item label="Lokasi Ujian" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    <Input placeholder="Dalam menit" />
                  </Form.Item>{' '}
                  <Form.Item
                    label="Pilih Bank Soal"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <PilihBankSoal
                      mataKuliah={this.state.mataKuliah}
                      value={this.state.bankSoal}
                      onChange={this.rubahBankSoal}
                      setSoal={this.setSoal}
                    />
                  </Form.Item>{' '}
                  {}
                  <Card>
                    <h4>Detail Ketersedian Soal:</h4>
                    <ul>
                      <li>Total Soal Mudah: {this.state.mudah}</li>
                      <li>Total Soal Sedang: {this.state.sedang}</li>
                      <li>Total Soal Susah: {this.state.susah}</li>
                      <li>
                        <b>Total Soal yang tersedia: {this.totalSoal()}</b>
                      </li>
                    </ul>
                    <br />
                    {this.state.errorJumlahSoal && (
                      <div
                        style={{
                          color: 'red',
                          border: '2px solid pink',
                          margin: '5px',
                          padding: '10px',
                        }}
                      >
                        <i>{this.state.errorJumlahSoal} </i>
                      </div>
                    )}
                    <Form.Item
                      label="Jumlah Soal Ujian:"
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                    >
                      <Input
                        placeholder="Banyak Soal yang akan diujiankan"
                        value={this.state.totalSoalDibutuhkan}
                        type="number"
                        onChange={this.rubahJumlahSoal}
                      />
                    </Form.Item>{' '}
                    <h4>Tingkat Kesulitan </h4>
                    {this.state.errorPersentasiSoal && (
                      <div
                        style={{
                          color: 'red',
                          border: '2px solid pink',
                          margin: '5px',
                          padding: '10px',
                        }}
                      >
                        <i>{this.state.errorPersentasiSoal} </i>
                      </div>
                    )}
                    <Form.Item
                      label="Persentasi Mudah %"
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                    >
                      <Slider
                        onChange={this.rubahPersenMudahSoal}
                        value={this.state.mudahDibutuhkan}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Persentasi Sedang %"
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                    >
                      <Slider
                        value={this.state.sedangDibutuhkan}
                        onChange={this.rubahPersenSedangSoal}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Persentasi Susah %"
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                    >
                      <Slider
                        value={this.state.susahDibutuhkan}
                        onChange={this.rubahPersenSusahSoal}
                      />
                    </Form.Item>
                  </Card>
                  <Form.Item wrapperCol={{ span: 14, offset: 6 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={this.state.errorJumlahSoal || this.state.errorPersentasiSoal}
                    >
                      Buat Ujian
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Content>
          );
        }}
      </Mutation>
    );
  }
}

export default TambahDosen;
