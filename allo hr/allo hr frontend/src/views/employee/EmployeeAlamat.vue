<template>
  <el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-col :span="6">Alamat 1</el-col>
        <el-col :span="12">
          <el-form-item>
            <el-input />
          </el-form-item>
        </el-col>
      </el-col>
      <el-col :span="12">
        <el-col :span="6">Kecamatan</el-col>
        <el-col :span="12">
          <el-form-item>
            <el-select>
              <!-- ambil dr DB -->
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
        <el-col :span="6">Alamat 2</el-col>
        <el-col :span="12">
          <el-form-item>
            <el-input />
          </el-form-item>
        </el-col>
      </el-col>
      <el-col :span="12">
        <el-col :span="6">Kab/Kota</el-col>
        <el-col :span="12">
          <el-form-item>
            <el-input placeholder="Autofill" />
          </el-form-item>
        </el-col>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-col :span="12">
          <el-form-item label="RT"><el-input /></el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="RW"><el-input /></el-form-item>
        </el-col>
      </el-col>
      <el-col :span="12">
        <el-col :span="6">Provinsi</el-col>
        <el-col :span="12">
          <el-form-item>
            <el-input placeholder="Autofill" />
          </el-form-item>
        </el-col>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-col :span="6">Kodepos</el-col>
        <el-col :span="12">
          <el-form-item>
            <el-input />
          </el-form-item>
        </el-col>
      </el-col>
      <el-col :span="12">
        <el-col :span="6">Status Tempat Tinggal</el-col>
        <el-col :span="12">
          <el-form-item>
            <el-input placeholder="Autofill" />
          </el-form-item>
        </el-col>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-col :span="6">Kelurahan</el-col>
        <el-col :span="12">
          <el-form-item>
            <el-input />
          </el-form-item>
        </el-col>
      </el-col>
    </el-row>
  </el-row>
</template>
<script>
export default {

}
</script>
