<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div>
          <el-button @click="backToEmpHome"><b><i class="el-icon-back" /></b> Back to Employee List</el-button>
        </div>
      </div>
      <div>
        <el-tabs>
          <el-tab-pane label="Data Diri">
            <employee-data-diri />
          </el-tab-pane>
          <el-tab-pane label="Data Kepegawaian">
            <employee-employment-data />
          </el-tab-pane>
          <el-tab-pane label="Keluarga" />
          <el-tab-pane label="Pendidikan">
            <EmployeePendidikanWrapper />
          </el-tab-pane>
          <el-tab-pane label="Riwayat Kerja">
            <employee-riwayat-kerja-and-mutasi />
          </el-tab-pane>
          <el-tab-pane label="Pelatihan">
            <employee-daftar-pelatihan />
          </el-tab-pane>
          <el-tab-pane label="Asuransi">
            <employee-daftar-asuransi />
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>
<script>
import EmployeeDaftarAsuransi from './EmployeeDaftarAsuransi.vue'
import EmployeeDaftarPelatihan from './EmployeeDaftarPelatihan.vue'
import EmployeeDataDiri from './EmployeeDataDiri.vue'
import EmployeeEmploymentData from './EmployeeDataKepegawaian.vue'
import EmployeePendidikanWrapper from './EmployeePendidikanWrapper.vue'
import EmployeeRiwayatKerjaAndMutasi from './EmployeeRiwayatKerjaAndMutasi.vue'
export default {
  components: { EmployeeDataDiri, EmployeeEmploymentData, EmployeePendidikanWrapper, EmployeeRiwayatKerjaAndMutasi, EmployeeDaftarPelatihan, EmployeeDaftarAsuransi },
  methods: {
    backToEmpHome() {
      this.$router.push({ path: '/employee/index' })
    }
  }

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
