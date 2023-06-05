<template>
  <div>
    <el-row>
      <el-button type="primary">Tambah Riwayat Kerja</el-button>
    </el-row>
    <br><br>
    <el-row>
      <el-table>
        <el-table-column label="Tahun Mulai" />
        <el-table-column label="Tahun Berakhir" />
        <el-table-column label="Jabatan" />
        <el-table-column label="Tipe Pekerjaan" />
        <el-table-column label="Nama Perusahaan" />
      </el-table>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'EmployeeRiwayatKerjaLuarAlloComponent'
}
</script>
