<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="Riwayat Kerja (Di Luar Allo)">
        <employee-riwayat-kerja-luar-allo />
      </el-tab-pane>
      <el-tab-pane label="Riwayat Mutasi Kerja (Saat di Allo)">
        <el-table>
          <el-table-column label="Tahun Mulai" />
          <el-table-column label="Tahun Berakhir" />
          <el-table-column label="Grade" />
          <el-table-column label="Jabatan" />
          <el-table-column label="Organisasi" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import EmployeeRiwayatKerjaLuarAllo from './EmployeeRiwayatKerjaLuarAllo.vue'
export default {
  name: 'RiwayatKerjaComponent',
  components: { EmployeeRiwayatKerjaLuarAllo }
}
</script>
