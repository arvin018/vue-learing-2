<template>
  <div class="app-container">
    <div>
      <el-form ref="formEmployementData">
        <!-- data pribadi pegawai -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-col :span="6">NIP</el-col>
            <el-col :span="12">
              <el-form-item>
                <el-input />
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="12">
            <el-col :span="6">Status Bergabung</el-col>
            <el-col :span="12">
              <el-form-item>
                <el-select>
                  <el-option
                    v-for="item in dropdown_list.status_bergabung_dropdown"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-col :span="6">Nama Pegawai</el-col>
            <el-col :span="12">
              <el-form-item>
                <el-input />
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="12">
            <el-col :span="6">Status Kepegawaian</el-col>
            <el-col :span="12">
              <el-form-item>
                <!-- nanti ambil dari api -->
                <el-select>
                  <el-option :value="'PERMANENT'" label="PERMANENT" />
                  <el-option :value="'CONTRACT'" label="CONTRACT" />
                  <el-option :value="'PROBATION'" label="PROBATION" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-col :span="6">Join Date</el-col>
            <el-col :span="12">
              <el-form-item>
                <DatePicker />
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="12">
            <el-col :span="6">Resign Date</el-col>
            <el-col :span="12">
              <DatePicker :disabled="true" />
            </el-col>
          </el-col>
        </el-row>

        <!-- ========== penempatan Pegawai -->
        <br><br>
        <el-row :gutter="20">
          <label>Penempatan Pegawai</label>
        </el-row>
        <br><br>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-col :span="6">Grade</el-col>
            <el-col :span="12">
              <!-- ambil dari api grade -->
              <el-form-item>
                <el-select>
                  <el-option value="tes">hehe</el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="12">
            <el-col :span="6">Jabatan</el-col>
            <el-col :span="12">
              <!-- ambil dari api position -->
              <el-form-item>
                <el-select>
                  <el-option value="tes">hehe</el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-col :span="6">Organisasi</el-col>
            <el-col :span="12">
              <!-- ambil dari api organization -->
              <el-form-item>
                <el-select>
                  <el-option value="tes">hehe</el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="12">
            <el-col :span="6">Lokasi Penempatan</el-col>
            <el-col :span="12">
              <!-- ambil dari api organization -->
              <el-form-item>
                <el-select>
                  <el-option
                    v-for="item in dropdown_list.lokasi_penempatan_dropdown"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>

        <!-- ========== misc. -->
        <br><br>
        <el-row :gutter="20">
          <label>Lainnya</label>
        </el-row>
        <br><br>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-col :span="6">Tanggal Akhir Kontrak</el-col>
            <el-col :span="12">
              <!-- if permanent, show text only (not a datepicker) -->
              <el-form-item>
                <DatePicker />
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
      </el-form>

    </div>
  </div>
</template>
<script>
import { DatePicker } from 'element-ui'

export default {
  name: 'EmploymentDataComponent',
  components: { DatePicker },
  data() {
    const status_bergabung = [
      { value: 1, label: 'Aktif' },
      { value: 2, label: 'Non-aktif' },
      { value: 3, label: 'Cancel Join' }
    ]
    const office_placement = [
      { value: 1, label: 'Menara Bank Mega' },
      { value: 2, label: 'KC MBM' },
      { value: 3, label: 'KC Indofood Tower' }
    ]
    return {
      dropdown_list: {
        status_bergabung_dropdown: status_bergabung,
        lokasi_penempatan_dropdown: office_placement
      }
    }
  }
}
</script>
