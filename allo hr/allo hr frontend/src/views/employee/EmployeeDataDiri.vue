<template>
  <el-row>
    <el-form ref="formDataDiri">
      <br>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-col :span="6">NIK</el-col>
          <el-col :span="12">
            <el-form-item>
              <el-input />
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="6">Golongan Darah</el-col>
          <el-col :span="12">
            <el-form-item>
              <el-select>
                <el-option value="1">A</el-option>
                <el-option value="2">B</el-option>
                <el-option value="3">AB</el-option>
                <el-option value="4">O</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-col :span="6">Nama Lengkap</el-col>
          <el-col :span="12">
            <el-form-item>
              <el-input />
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="6">Warga Negara</el-col>
          <el-col :span="12">
            <el-form-item>
              <el-select>
                <el-option value="1">WNI</el-option>
                <el-option value="2">WNA</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-col :span="6">Tempat Lahir</el-col>
          <el-col :span="12">
            <el-form-item>
              <el-input />
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="6">Telp. Pribadi</el-col>
          <el-col :span="12">
            <el-form-item>
              <el-input />
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-col :span="6">Tanggal Lahir</el-col>
          <el-col :span="12">
            <el-form-item>
              <DatePicker />
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="6">Nomor CUG</el-col>
          <el-col :span="12">
            <el-form-item>
              <el-input />
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-col :span="6">Agama</el-col>
          <el-col :span="12">
            <el-form-item>
              <el-select>
                <el-option value="1">Islam</el-option>
                <el-option value="2">Kristen</el-option>
                <el-option value="3">Katolik</el-option>
                <el-option value="4">Hindu</el-option>
                <el-option value="5">Buddha</el-option>
                <el-option value="6">Konghucu</el-option>
                <el-option value="7">Aliran Kepercayaan</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="6">Email Kantor</el-col>
          <el-col :span="12">
            <el-form-item>
              <el-input />
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-col :span="6">Jenis Kelamin</el-col>
          <el-col :span="12">
            <el-form-item>
              <el-select>
                <el-option value="L">Laki-Laki</el-option>
                <el-option value="P">Perempuan</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="6">Nomor Rekening ALLO</el-col>
          <el-col :span="12">
            <el-form-item>
              <el-input />
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>

      <!-- alamat Lengkap -->
      <br>
      <el-row><label>Alamat Sesuai KTP</label></el-row>
      <br><br>
      <employee-alamat />

      <!-- alamat domisili -->
      <br>
      <el-row><label>Alamat Domisili</label></el-row>
      <br><br>
      <employee-alamat />
    </el-form>
  </el-row>
</template>
<script>
import { DatePicker } from 'element-ui'
import EmployeeAlamat from './EmployeeAlamat.vue'

export default {
  components: { DatePicker, EmployeeAlamat }
}
</script>

<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }

  .box-card {
    width: 100%;
  }
</style>
