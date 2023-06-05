<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="filter-container">
          <el-input v-model="query" placeholder="Name Search" style="width: 200px; margin: 5px;" class="filter-item" @keyup.enter.native="handleSearch" />
          <el-button class="filter-item" type="primary" icon="el-icon-search" style="margin: 5px;" @click="handleSearch" />
          <el-select
            v-model="status"
            placeholder="Filter by Status"
            style="width: 150px ; margin: 5px;"
            @change="handleFilterByStatus"
          >
            <el-option
              v-for="(item, i) in listEmployeeStatus"
              :key="i"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-select
            v-model="orgname"
            placeholder="Filter by Organization"
            style="width: 200px; margin: 5px;"
            @change="handleFilterByOrg"
          >
            <el-option
              v-for="(item, i) in listOrgName"
              :key="i"
              :label="item.title"
              :value="item.positionId"
            />
          </el-select>
          <el-select
            v-model="grade"
            placeholder="Filter by Grade"
            style="width: 150px ; margin: 5px;"
            @change="handleFilterByGrade"
          >
            <el-option
              v-for="item in empGradeOption"
              :key="item.gradeId"
              :label="item.gradeName"
              :value="item.gradeId"
            />
          </el-select>
        </div>
        <div>
          <el-dropdown>
            <el-button type="primary" style="margin: 5px;">
              Add<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="openModalAddEmp">Add New Employee</el-dropdown-item>
              <el-dropdown-item @click.native="openModalBulkAddEmp">Bulk Add Employee</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <!-- ========== table employee and tabs -->
      <div style="height: 700px; overflow: auto;">
        <el-tabs @tab-click="handleTabsClick">
          <el-tab-pane style="height: 400px; overflow-y: auto;" label="Active Employee">
            <employee-table />
          </el-tab-pane>
          <el-tab-pane style="height: 400px; overflow-y: auto;" label="Inactive Employee">
            <employee-table />
          </el-tab-pane>
        </el-tabs>
      </div>
      <br>
      <el-pagination
        style="text-align: center;"
        background
        layout="prev, pager, next"
        :total="allData"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        @current-change="handlePageChange"
      />
    </el-card>

    <el-dialog title="Employee Form" :visible.sync="employeeFormVisible">
      <el-form ref="empForm" :model="form">
        <el-form-item
          label="Employee Id"
          :rules="[{ required: true, message: 'Please input employee id'}]"
          prop="employeeId"
        >
          <el-input-number v-model="form.employeeId" :controls="false" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="Name"
          :rules="[
            { required: true, message: 'Please input employee name'},
            { pattern: /^([a-zA-Z\s'.]+)$/ , message: 'Can\'t input number'}
            // { pattern: /^[\d\s]+$/ , message: 'Can\'t input number'}
          ]"
          prop="name"
        >
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="Status"
          :rules="[{ required: true, message: 'Please input employment status', trigger: 'change'}]"
          prop="employmentStatus"
        >
          <el-select v-model="form.employmentStatus" placeholder="Select Status">
            <el-option
              v-for="(item, i) in listEmployeeStatus"
              :key="i"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="form.employmentStatus === 'CONTRACT'" label="End Date">
          <el-date-picker v-model="form.endDate" type="date" placeholder="Pick end date" />
        </el-form-item>
        <el-form-item
          label="Organization"
          :rules="[{ required: true, message: 'Please input organization', trigger: 'change'}]"
          prop="organizationId"
        >
          <el-select v-model="form.organizationId" placeholder="Select Organization">
            <el-option
              v-for="item in organizations"
              :key="item.organizationId"
              :label="item.name"
              :value="item.organizationId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="Position"
          :rules="[{ required: true, message: 'Please input position', trigger: 'change'}]"
          prop="positionId"
        >
          <el-select v-model="form.positionId" placeholder="Select Position">
            <el-option
              v-for="item in positions"
              :key="item.positionId"
              :label="item.title"
              :value="item.positionId"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="Grade"
          :rules="[{ required: true, message: 'Please input grade', trigger: 'change'}]"
          prop="gradeId"
        >
          <el-select v-model="form.gradeId" placeholder="Select Grade">
            <el-option
              v-for="item in empGradeOption"
              :key="item.gradeId"
              :label="item.gradeName"
              :value="item.gradeId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="Join Date"
          :rules="[{ required: true, message: 'Please input join date', trigger: 'change'}]"
          prop="joinDate"
        >
          <el-date-picker v-model="form.joinDate" type="date" placeholder="Pick join date" />
        </el-form-item>
        <el-form-item>
          <el-button @click="closeModal('addEmp')">Cancel</el-button>
          <el-button type="primary" :disabled="!formValid" @click="save()">Confirm</el-button>
        </el-form-item>
      </el-form>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="employeeFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="save()">Confirm</el-button>
      </span> -->
    </el-dialog>

    <!-- =============== employee transfer -->
    <employee-transfer-modal />

    <!-- ================ upload bulk -->
    <employee-upload-bulk />

  </div>
</template>

<script>
import { save, getSingle,
  getSearch, filterByStatus, filterByOrg, filterByGrade, getEmplGrade,
  updateEmpl, getEmploymentStatus } from '@/api/employee'
import { getAllName } from '@/api/organization'
import { Message } from 'element-ui'
import { getByLevel } from '@/api/position'
import { getByLayer } from '@/api/organization'
// import Pagination from '@/components/Pagination'
import { scrollTo } from '@/utils/scroll-to'
import EmployeeTable from './EmployeeTable.vue'
import EmployeeUploadBulk from './EmployeeUploadBulk.vue'
import EmployeeTransferModal from './EmployeeTransferModal.vue'

export default {
  name: 'Employee',
  components: { EmployeeTable, EmployeeUploadBulk, EmployeeTransferModal },
  // components: { Pagination },
  data() {
    return {
      formValid: false,
      employees: null,
      organizations: null,
      positions: null,
      listLoading: true,
      employeeFormVisible: false,
      selectedEmployeeId: null,
      currentPage: null,
      pageSize: null,
      allData: null,
      // tabsClickedIndex: parseInt(0),
      query: null,
      status: null,
      orgname: null,
      grade: null,
      empGradeOption: null,
      empFormState: null,
      // transferFormVisible: false,
      employeeBulkVisible: false,
      listOrgName: [],
      listEmployeeStatus: [],
      form: {
        employeeId: '',
        name: '',
        employmentStatus: '',
        organizationId: '',
        positionId: '',
        gradeId: '',
        joinDate: '',
        endDate: '',
        effectiveDate: '',
        transferReason: '',
        transferOrganizationId: '',
        transferPositionId: ''
      }
    }
  },
  computed: {
    getEmpSummaryTabsClicked() {
      return this.$store.state.employee.tabsSummaryEmployeeClicked
    }
  },
  watch: {
    form: {
      handler() {
        this.checkForm()
      },
      deep: true
    }
  },
  created() {
    this.fetchData('0')
    this.getAllNames()
    this.fetchEmplGrade()
    this.fetchEmplStatus()
    this.fetchByLayer(2)
    this.fetchByLevel(2)
    this.$store.dispatch('employee/setBulkUploadEmployeeVisibility', false)
  },
  methods: {
    getRequestParams(page, isActiveEmp) {
      const params = {
        'page': page,
        isActiveEmployee: isActiveEmp
      }
      return params
    },
    getRequestParams2(page, query) {
      const tabsDefault = parseInt(this.getEmpSummaryTabsClicked) === parseInt(0)
      const params = {
        'page': page,
        'query': query,
        isActiveEmployee: tabsDefault
      }
      return params
    },
    fetchData(tabActive) {
      console.log('tab active = ', tabActive)
      const tabsDefault = parseInt(tabActive) === parseInt(0)
      const params = this.getRequestParams(
        this.page,
        tabsDefault
      )
      this.$store.dispatch('employee/fetchAllEmployee', params).then(() => {
        this.currentPage = this.$store.state.employee.employeeData.currentPage
        this.lastPage = this.$store.state.employee.employeeData.lastPage
        this.allData = this.$store.state.employee.employeeData.allData
        this.pageSize = this.$store.state.employee.employeeData.pageSize
      })
    },
    getAllNames() {
      getAllName().then((response) => {
        this.listOrgName = response.data.data
        // console.log(listName)
      })
        .catch(function(error) {
          return error
        })
    },
    handlePageChange(value) {
      this.page = value
      this.fetchData(this.getEmpSummaryTabsClicked)
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleSearch() {
      const params = this.getRequestParams2(
        parseInt(1),
        this.query
      )
      console.log(params)
      if (params.query === '' || !params.query) {
        this.fetchData(this.getEmpSummaryTabsClicked)
      } else {
        getSearch(params).then(response => {
          // this.employees = response.data
          // this.listLoading = false
          // this.currentPage = response.data.currentPage
          // this.lastPage = response.data.lastPage
          // this.allData = response.data.allData
          // this.pageSize = response.data.pageSize
          this.$store.dispatch('employee/setListLoading', true)
          this.$store.dispatch('employee/setAllEmployee', response.data.data)
          this.$store.dispatch('employee/setListLoading', false)
        })
      }
    },
    handleFilterByStatus() {
      const params = this.getRequestParams2(
        parseInt(1),
        this.status
      )
      this.listLoading = true
      filterByStatus(params).then((response) => {
        // this.employees = response.data.content
        // this.listLoading = false
        // this.currentPage = response.data.currentPage
        // this.lastPage = response.data.lastPage
        // this.allData = response.data.allData
        // this.pageSize = response.data.pageSize
        this.$store.dispatch('employee/setListLoading', true)
        this.$store.dispatch('employee/setAllEmployee', response.data)
        this.$store.dispatch('employee/setListLoading', false)
      })
      console.log(params)
    },
    handleFilterByOrg() {
      const params = this.getRequestParams2(
        parseInt(1),
        this.orgname
      )
      console.log(params)
      this.listLoading = true
      filterByOrg(params).then(response => {
        // this.employees = response.data.content
        // this.listLoading = false
        // this.currentPage = response.data.currentPage
        // this.lastPage = response.data.lastPage
        // this.allData = response.data.allData
        // this.pageSize = response.data.pageSize
        this.$store.dispatch('employee/setListLoading', true)
        this.$store.dispatch('employee/setAllEmployee', response.data)
        this.$store.dispatch('employee/setListLoading', false)
      })
    },
    handleFilterByGrade() {
      const params = this.getRequestParams2(
        parseInt(1),
        this.grade
      )
      this.listLoading = true
      filterByGrade(params).then(response => {
        // this.employees = response.data.content
        // this.listLoading = false
        // this.currentPage = response.data.currentPage
        // this.lastPage = response.data.lastPage
        // this.allData = response.data.allData
        // this.pageSize = response.data.pageSize
        this.$store.dispatch('employee/setListLoading', true)
        this.$store.dispatch('employee/setAllEmployee', response.data)
        this.$store.dispatch('employee/setListLoading', false)
      })
    },
    save() {
      this.$refs.empForm.validate((valid) => {
        if (valid) {
          this.listLoading = true

          if (this.empFormState === 'add') {
            save(this.form).then(() => {
              Message({
                message: 'Employee saved succesfully.',
                type: 'success',
                duration: 5 * 1000
              })
              this.listLoading = false
              this.fetchData(this.getEmpSummaryTabsClicked)
              this.employeeFormVisible = false
              this.resetAddEmpForm()
            }).catch((err) => {
              Message({
                message: 'Adding employee failed, make sure employee id is not duplicate',
                type: 'error',
                duration: 5 * 1000
              })
              console.error(err)
              this.listLoading = false
              this.fetchData(this.getEmpSummaryTabsClicked)
              this.employeeFormVisible = false
              this.resetAddEmpForm()
            })
          } else if (this.empFormState === 'update') {
            console.log(this.form)
            updateEmpl(this.form).then(() => {
              Message({
                message: 'Employee saved succesfully.',
                type: 'success',
                duration: 5 * 1000
              })
              this.listLoading = false
              this.fetchData(this.getEmpSummaryTabsClicked)
              this.employeeFormVisible = false
              this.resetAddEmpForm()
            }).catch((err) => {
              Message({
                message: 'Update employee failed',
                type: 'error',
                duration: 5 * 1000
              })
              console.error(err)
              this.listLoading = false
              this.fetchData(this.getEmpSummaryTabsClicked)
              this.employeeFormVisible = false
              this.resetAddEmpForm()
            })
          }
        } else {
          Message({
            message: 'Mandatory field is not filled',
            type: 'error',
            duration: 5 * 1000
          })
        }
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
    fetchByLevel(level) {
      const data = { level: level }
      this.listLoading = true
      getByLevel(data).then((response) => {
        this.positions = response.data
        this.listLoading = false
      })
    },
    view(employeeId) {
      console.log('employeeId = ' + employeeId)
      this.empFormState = 'update'
      this.listLoading = true
      const data = { employeeId: employeeId }

      getSingle(data).then((response) => {
        this.employeeFormVisible = true
        this.form = {
          employeeId: response.data.employeeId,
          name: response.data.name,
          employmentStatus: response.data.employmentStatus,
          organizationId: response.data.organizationName,
          positionId: response.data.positionTitle,
          grade: response.data.grade,
          joinDate: new Date(response.data.joinDate),
          endDate: new Date(response.data.endDate)
        }
        this.listLoading = false
      })
    },
    fetchEmplGrade() {
      getEmplGrade().then((res) => {
        this.empGradeOption = res.data.data
      })
    },
    checkForm() {
      this.$refs.empForm.validate((valid) => {
        if (valid) {
          this.formValid = true
        } else {
          this.formValid = false
        }
      })
    },
    fetchEmplStatus() {
      getEmploymentStatus().then((res) => {
        this.listEmployeeStatus = res.data.data
      })
    },
    resetAddEmpForm() {
      this.form.employeeId = ''
      this.form.name = ''
      this.form.employmentStatus = ''
      this.form.organizationId = ''
      this.form.positionId = ''
      this.form.gradeId = ''
      this.form.joinDate = ''
      this.form.endDate = ''
      this.form.effectiveDate = ''
      this.form.transferReason = ''
      this.form.transferOrganizationId = ''
      this.form.transferPositionId = ''
    },
    closeModal(modalType) {
      this.listLoading = false
      this.fetchData(this.getEmpSummaryTabsClicked)
      if (modalType === 'addEmp') {
        this.employeeFormVisible = false
        this.resetAddEmpForm()
      }
    },
    openModalAddEmp() {
      // this.resetAddEmpForm()
      // this.employeeFormVisible = true
      // this.fetchEmplGrade()
      // this.empFormState = 'add'
      this.$router.push({ path: '/employee/add' })
    },
    handleTabsClick(obj, e) {
      // this.tabsClickedIndex = parseInt(obj.index)
      this.$store.dispatch('employee/employeeSummaryTabHandler', obj.index)
      this.fetchData(obj.index)
    },
    openModalBulkAddEmp() {
      this.$store.dispatch('employee/setBulkUploadEmployeeVisibility', true)
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
