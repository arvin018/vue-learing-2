<template>
  <div>
    <el-row>
      <el-button type="primary">Tambah Pelatihan</el-button>
    </el-row>
    <el-row>
      <el-table>
        <el-table-column label="Jenis Pelatihan" />
        <el-table-column label="Tahun Pelatihan" />
        <el-table-column label="Nama Pelatihan" />
        <el-table-column label="Topik Pelatihan" />
        <el-table-column label="Sertifikat Pelatihan" />
        <el-table-column label="Tanggal Kadaluarsa Sertifikat" />
      </el-table>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'EmployeePelatihanComponent'
}
</script>
