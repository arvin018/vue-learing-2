<template>
  <div>
    <el-row>
      <el-button type="primary">Tambah Pendidikan</el-button>
    </el-row>
    <br><br>
    <el-row>
      <el-table>
        <el-table-column label="Jenjang Pendidikan" />
        <el-table-column label="Institusi" />
        <el-table-column label="Jurusan" />
        <el-table-column label="Tahun Masuk" />
        <el-table-column label="Tahun Lulus" />
      </el-table>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'EmployeeEducationWrapper'

}
</script>
