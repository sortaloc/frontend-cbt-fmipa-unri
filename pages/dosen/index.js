import React from 'react';
import { Row, Col, Card, Avatar } from 'antd';

import ProfilDosen from '../../components/dosen/Profil';

export default () => (
  <Row type="flex" gutter={16} style={{ margin: '40px' }}>
    <Col order={2} xs={24} md={5}>
      <ProfilDosen />
    </Col>
    <Col order={1} xs={24} md={19} style={{ display: 'flex', marginBottom: '20px' }}>
      <Card style={{ width: '100%', height: '100%', paddingBottom: '100px' }}>
        <h1
          style={{
            marginTop: '40px',
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          Selamat Datang
          <br /> di Portal Computer Based Test <br /> FMIPA Universitas Riau
        </h1>
        <div style={{ padding: '10px', textAlign: 'center', marginBottom: '40px' }}>
          <p>
            Ini merupakan layanan yang dapat digunakan oleh dosen, untuk melakukan beberapa hal
            terkait sistem Computer Based Test
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ textAlign: 'center', marginRight: '20px' }}>
            <Avatar shape="square" size={100} style={{ marginBottom: '5px', backgroundColor: 'maroon' }} icon="bank" />
            <p>Informasi Kelas</p>
          </div>
          <div style={{ textAlign: 'center', marginRight: '20px' }}>
            <Avatar shape="square" size={100} icon="file-text" style={{ marginBottom: '5px', backgroundColor: 'brown' }} />
            <p>Kelola Bank Soal</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Avatar shape="square" size={100} icon="schedule" style={{ marginBottom: '5px', backgroundColor: 'olive' }} />
            <p>Kelola Ujian</p>
          </div>
        </div>
      </Card>
    </Col>
  </Row>
);
