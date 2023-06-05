<template>
  <div>
    <el-row>
      <el-button type="primary">Tambah Asuransi</el-button>
    </el-row>
    <el-row>
      <el-table>
        <el-table-column label="Nomor Asuransi (Nomor BPJS / Nomor Polis)" />
        <el-table-column label="Nama Peserta" />
        <el-table-column label="Jenis Asuransi" />
      </el-table>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'EmployeePelatihanComponent'
}
</script>
