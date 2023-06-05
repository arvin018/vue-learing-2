<template>

  <el-dialog title="Employee Transfer Form" :visible.sync="getVisibility" width="70%" :before-close="closeModal">
    <el-form ref="empFormTransfer" :model="formTransferEmp">
      <el-row>
        <el-input-number v-model="formEmployeeDatas.employeeId" :controls="false" autocomplete="off" disabled />
      </el-row>
      <el-row>
        <el-input v-model="formEmployeeDatas.name" autocomplete="off" disabled />
      </el-row>
      <el-row>
        <el-input disabled :value="formEmployeeDatas.employmentStatus" />
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-input disabled :value="formEmployeeDatas.organizationId !== null ? formEmployeeDatas.organizationId.split('-')[1] : null" />
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="Transfer Organization"
            :rules="[{ required: true, message: 'Please input organization', trigger: 'change'}]"
            prop="organizationAfter"
          >
            <el-select v-model="formTransferEmp.organizationAfter" placeholder="Select Organization">
              <el-option
                v-for="item in organizations"
                :key="item.organizationId"
                :label="item.name"
                :value="item.organizationId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-input disabled :value="formEmployeeDatas.positionId !== null ? formEmployeeDatas.positionId.split('-')[1] : null" label="Current Position" />
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="Transfer Position"
            :rules="[{ required: true, message: 'Please input position', trigger: 'change'}]"
            prop="positionAfter"
          >
            <el-select v-model="formTransferEmp.positionAfter" placeholder="Select Position">
              <el-option
                v-for="item in danglingPositionList"
                :key="item.pos_id"
                :label="item.pos_name"
                :value="item.pos_id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="Grade"
        :rules="[{ required: true, message: 'Please input grade', trigger: 'change'}]"
        prop="gradeIdAfter"
      >
        <el-select v-model="formTransferEmp.gradeIdAfter" placeholder="Select Grade">
          <el-option
            v-for="item in empGradeOption"
            :key="item.gradeId"
            :label="item.gradeName"
            :value="item.gradeId"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="Effective date"
        :rules="[{ required: true, message: 'Please input effective date', trigger: 'change'}]"
        prop="effectiveDate"
      >
        <el-date-picker v-model="formTransferEmp.effectiveDate" type="date" placeholder="Pick a date" style="width: 100%;" />
      </el-form-item>
      <el-form-item
        label="Transfer reason"
        :rules="[{ required: true, message: 'Please input reason', trigger: 'change'}]"
        prop="transferReason"
      >
        <el-input v-model="formTransferEmp.transferReason" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button @click="closeModal">Cancel</el-button>
        <el-button type="primary" :disabled="!formValid" @click="saveTransfer">Confirm</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { getEmplGrade, transferEmployee } from '@/api/employee'
import { getByLayer } from '@/api/organization'
import { getDanglingPosition } from '@/api/position'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      danglingPositionList: [],
      formTransferEmp: {
        employeeId: '',
        effectiveDate: '',
        transferReason: '',
        organizationBefore: '',
        organizationAfter: '',
        positionBefore: '',
        positionAfter: '',
        gradeIdBefore: '',
        gradeIdAfter: ''
      },
      organizations: [],
      empGradeOption: [],
      formValid: false
    }
  },
  computed: {
    formEmployeeDatas() {
      return this.$store.state.employee.formEmployee
    },
    getVisibility() {
      return this.$store.state.employee.empTransferModalVisible
    },
    getEmpSummaryTabsClicked() {
      return this.$store.state.employee.tabsSummaryEmployeeClicked
    }
  },
  watch: {
    formTransferEmp: {
      handler() {
        this.checkForm()
      },
      deep: true
    }
  },
  created() {
    this.fetchDanglingPosition()
    this.fetchByLayer(2)
    this.fetchEmplGrade()
  },
  methods: {
    saveTransfer() {
      const formEmployeeSingle = this.formEmployeeDatas
      const transferData = {
        employeeId: formEmployeeSingle.employeeId,
        organizationBefore: formEmployeeSingle.organizationId.split('-')[0],
        organizationAfter: this.formTransferEmp.organizationAfter,
        positionBefore: formEmployeeSingle.positionId.split('-')[0],
        positionAfter: this.formTransferEmp.positionAfter,
        effectiveDate: this.formTransferEmp.effectiveDate,
        transferReason: this.formTransferEmp.transferReason,
        gradeIdBefore: formEmployeeSingle.gradeId.split('-')[0],
        gradeIdAfter: this.formTransferEmp.gradeIdAfter
      }
      this.$store.dispatch('employee/setListLoading', true)
      transferEmployee(transferData).then(() => {
        Message({
          message: 'Employee transferred succesfully.',
          type: 'success',
          duration: 5 * 1000
        })
        // this.transferFormVisible = false

        const tabsDefault = parseInt(this.getEmpSummaryTabsClicked) === parseInt(0)
        const params = { page: parseInt(1), isActiveEmployee: tabsDefault }
        this.$store.dispatch('employee/fetchAllEmployee', params)

        this.$store.dispatch('employee/setListLoading', false)

        this.closeModal()
      }).catch((err) => {
        console.log(err)
        Message({
          message: 'Employee transfer failed',
          type: 'error',
          duration: 5 * 1000
        })
      })
    },
    closeModal() {
      this.resetTransferForm()
      this.$store.dispatch('employee/setEmployeeTransferVisibility', false)
    },
    fetchDanglingPosition() {
      getDanglingPosition().then((res) => {
        this.danglingPositionList = res.data.data
      })
    },
    fetchByLayer(layer) {
      const data = { layer: layer }
      this.listLoading = true
      getByLayer(data).then((response) => {
        this.organizations = response.data.data
        this.listLoading = false
      })
    },
    fetchEmplGrade() {
      getEmplGrade().then((res) => {
        this.empGradeOption = res.data.data
      })
    },
    resetTransferForm() {
      this.formTransferEmp.employeeId = ''
      this.formTransferEmp.effectiveDate = ''
      this.formTransferEmp.transferReason = ''
      this.formTransferEmp.organizationBefore = ''
      this.formTransferEmp.organizationAfter = ''
      this.formTransferEmp.positionBefore = ''
      this.formTransferEmp.positionAfter = ''
      this.formTransferEmp.gradeIdBefore = ''
      this.formTransferEmp.gradeIdAfter = ''
    },
    checkForm() {
      this.$refs.empFormTransfer.validate((valid) => {
        if (valid) {
          this.formValid = true
        } else {
          this.formValid = false
        }
      })
    }
  }
}
</script>
