<template>
  <el-dialog title="Employee Bulk Form" :visible.sync="getVisibility" width="50%" :before-close="beforeCloseModal">
    <el-upload
      ref="uploadBulkEmployee"
      action=""
      :http-request="uploadBulkHttpRequest"
      :auto-upload="false"
      :multiple="false"
      accept="text/csv"
    >
      <el-button slot="trigger" type="primary">Select file</el-button>
      <el-button style="margin-left: 10px;" type="success" @click="submitBulkEmployee">Confirm</el-button>
      <div slot="tip" class="el-upload__tip">.csv format</div>
    </el-upload>
  </el-dialog>
</template>
<script>
import { saveBulk } from '@/api/employee'
import { Message } from 'element-ui'
export default {
  computed: {
    getVisibility() {
      return this.$store.state.employee.modalBulkUploadVisible
    },
    getEmpSummaryTabsClicked() {
      return this.$store.state.employee.tabsSummaryEmployeeClicked
    }
  },
  methods: {
    uploadBulkHttpRequest() {
      const fd = new FormData()
      fd.append('files', this.$refs.uploadBulkEmployee.uploadFiles[0].raw)

      // console.log('file => ', this.$refs.uploadBulkEmployee.uploadFiles[0].raw)
      // call api save bulk
      saveBulk(fd).then((response) => {
        Message({
          message: response.data.message,
          type: 'success',
          duration: 5 * 1000
        })
        const tabsDefault = parseInt(this.getEmpSummaryTabsClicked) === parseInt(0)
        const params = { page: parseInt(1), isActiveEmployee: tabsDefault }
        this.$store.dispatch('employee/fetchAllEmployee', params)
        this.$refs.uploadBulkEmployee.clearFiles()
        this.$store.dispatch('employee/setBulkUploadEmployeeVisibility', false)
      }).catch((e) => {
        Message({
          message: 'Error in inserting bulk employee',
          type: 'error',
          duration: 5 * 1000
        })
        console.error(e)
        this.$refs.uploadBulkEmployee.clearFiles()
        this.$store.dispatch('employee/setBulkUploadEmployeeVisibility', false)
      })
    },
    submitBulkEmployee() {
      this.$refs.uploadBulkEmployee.submit()
    },
    beforeCloseModal(done) {
      this.$store.dispatch('employee/setBulkUploadEmployeeVisibility', false)
    }
  }
}
</script>
