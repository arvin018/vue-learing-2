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
            <!-- <el-option label="SVP" value="SVP" />
        <el-option label="VP" value="VP" />
        <el-option label="AVP" value="AVP" />
        <el-option label="Manager" value="Manager" />
        <el-option label="Asst" value="Asst" /> -->
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
              <el-dropdown-item @click.native="employeeBulkVisible = true">Bulk Add Employee</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div style="height: 700px; overflow: auto;">
        <el-tabs @tab-click="handleTabsClick">
          <el-tab-pane style="height: 400px; overflow-y: auto;" label="Active Employee">
            <el-table
              v-loading="listLoading"
              :data="employees != null ? employees.filter((emp) => {return emp.is_employee_active === true}) : null"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row
            >
              <el-table-column label="Employee Id" align="center">
                <template slot-scope="scope">
                  {{ scope.row.employeeId }}
                </template>
              </el-table-column>
              <el-table-column label="Name" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Status" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.employmentStatus }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Organization" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.organizationName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Title" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.positionTitle }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="Grade">
                <template slot-scope="scope">
                  <span>{{ scope.row.grade }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="Position Released">
                <template slot-scope="scope">
                  <span>{{ scope.row.is_position_released ? 'YES' : 'NO' }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="Action">
                <template slot-scope="scope">
                  <!-- <el-button @click="deleteSingle(scope.row.employeeId)">Delete</el-button>
              <el-button @click="view(scope.row.employeeId)">Edit</el-button> -->
                  <el-dropdown>
                    <span class="el-dropdown-link">
                      <i class="el-icon-more el-icon--right" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <!-- <el-dropdown-item @click.native="">Detail</el-dropdown-item> -->
                      <el-dropdown-item @click.native="transferFormOpen(scope.row.employeeId)">Transfer</el-dropdown-item>
                      <!-- <el-dropdown-item @click.native="">Resign</el-dropdown-item> -->
                      <el-dropdown-item @click.native="releaseEmployeePosition(scope.row.employeeId);">
                        Release Position
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="view(scope.row.employeeId);">Edit</el-dropdown-item>
                      <el-dropdown-item @click.native="deleteSingle(scope.row.employeeId)">Delete</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane style="height: 400px; overflow-y: auto;" label="Inactive Employee">
            <el-table
              v-loading="listLoading"
              :data="employees != null ? employees.filter((emp) => {return emp.is_employee_active === false}) : null"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row
            >
              <el-table-column label="Employee Id" align="center">
                <template slot-scope="scope">
                  {{ scope.row.employeeId }}
                </template>
              </el-table-column>
              <el-table-column label="Name" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Status" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.employmentStatus }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Organization" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.organizationName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Title" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.positionTitle }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="Grade">
                <template slot-scope="scope">
                  <span>{{ scope.row.grade }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="Position Released">
                <template slot-scope="scope">
                  <span>{{ scope.row.is_position_released ? 'YES' : 'NO' }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="Action">
                <template slot-scope="scope">
                  <!-- <el-button @click="deleteSingle(scope.row.employeeId)">Delete</el-button>
                  <el-button @click="view(scope.row.employeeId)">Edit</el-button> -->
                  <el-dropdown>
                    <span class="el-dropdown-link">
                      <i class="el-icon-more el-icon--right" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <!-- <el-dropdown-item @click.native="">Detail</el-dropdown-item> -->
                      <!-- <el-dropdown-item @click.native="transferFormOpen(scope.row.employeeId)">Transfer</el-dropdown-item> -->
                      <!-- <el-dropdown-item @click.native="">Resign</el-dropdown-item> -->
                      <el-dropdown-item @click.native="view(scope.row.employeeId);">Edit</el-dropdown-item>
                      <!-- <el-dropdown-item @click.native="deleteSingle(scope.row.employeeId)">Delete</el-dropdown-item> -->
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
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

    <el-dialog title="Employee Transfer Form" :visible.sync="transferFormVisible" width="70%">
      <el-form ref="empForm" :model="form">
        <el-form-item
          label="Employee Id"
          :rules="[{ required: true, message: 'Please input employee id'}]"
          prop="employeeId"
          aria-readonly="true"
        >
          <el-input-number v-model="form.employeeId" :controls="false" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item
          label="Name"
          :rules="[{ required: true, message: 'Please input employee name'}]"
          prop="name"
        >
          <el-input v-model="form.name" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item
          label="Status"
          :rules="[{ required: true, message: 'Please input employment status', trigger: 'change'}]"
          prop="employmentStatus"
        >
          <!-- <el-select v-model="form.employmentStatus" placeholder="Select Status">
            <el-option
            v-for="(item, i) in listEmployeeStatus"
            :key="i"
            :label="item"
            :value="item"
            />
          </el-select> -->
          <el-input disabled :value="form.employmentStatus" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="Current Organization"
              :rules="[{ required: true, message: 'Please input organization', trigger: 'change'}]"
              prop="organizationId"
            >
              <el-input disabled :value="form.organizationId" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="Transfer Organization"
              :rules="[{ required: true, message: 'Please input organization', trigger: 'change'}]"
              prop="transferOrganizationId"
            >
              <el-select v-model="form.transferOrganizationId" placeholder="Select Organization">
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
            <el-form-item
              label="Current Position"
              :rules="[{ required: true, message: 'Please input position', trigger: 'change'}]"
              prop="positionId"
            >
              <el-input disabled :value="form.positionId" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="Transfer Position"
              :rules="[{ required: true, message: 'Please input position', trigger: 'change'}]"
              prop="transferPositionId"
            >
              <el-select v-model="form.transferPositionId" placeholder="Select Position">
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
          label="Effective date"
          :rules="[{ required: true, message: 'Please input effective date', trigger: 'change'}]"
          prop="effectiveDate"
        >
          <el-date-picker v-model="form.effectiveDate" type="date" placeholder="Pick a date" style="width: 100%;" />
        </el-form-item>
        <el-form-item
          label="Transfer reason"
          :rules="[{ required: true, message: 'Please input reason', trigger: 'change'}]"
          prop="transferReason"
        >
          <el-input v-model="form.transferReason" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button @click="closeModal('transferEmp')">Cancel</el-button>
          <el-button type="primary" @click="saveTransfer()">Confirm</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="Employee Bulk Form" :visible.sync="employeeBulkVisible" width="50%">
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

  </div>
</template>

<script>
import { getList, save, deleteSingle, getSingle,
  getSearch, filterByStatus, filterByOrg, filterByGrade, getEmplGrade,
  updateEmpl, getEmploymentStatus, transferEmployee, saveBulk, releasePositionEmployee } from '@/api/employee'
import { getAllName } from '@/api/organization'
import { Message, MessageBox } from 'element-ui'
import { getByLevel, getDanglingPosition } from '@/api/position'
import { getByLayer } from '@/api/organization'
// import Pagination from '@/components/Pagination'
import { scrollTo } from '@/utils/scroll-to'

export default {
  name: 'Employee',
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
      tabsClickedIndex: parseInt(0),
      query: null,
      status: null,
      orgname: null,
      grade: null,
      empGradeOption: null,
      empFormState: null,
      transferFormVisible: false,
      employeeBulkVisible: false,
      listOrgName: [],
      listEmployeeStatus: [],
      danglingPositionList: [],
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
  watch: {
    form: {
      handler() {
        this.checkForm()
      },
      deep: true
    }
  },
  created() {
    this.fetchData(this.tabsClickedIndex)
    this.getAllNames()
    this.fetchEmplGrade()
    this.fetchEmplStatus()
    this.fetchByLayer(2)
    this.fetchByLevel(2)
    this.$store.dispatch('employee/fetchAllEmployee', { 'page': 1, isActiveEmployee: true })
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
        this.fetchData(this.tabsClickedIndex)
        this.employeeBulkVisible = false
      }).catch(() => {
        Message({
          message: 'Error in inserting bulk employee',
          type: 'error',
          duration: 5 * 1000
        })
        this.employeeBulkVisible = false
      })
    },
    getRequestParams(page, isActiveEmp) {
      const params = {
        'page': page,
        isActiveEmployee: isActiveEmp
      }
      return params
    },
    getRequestParams2(page, query) {
      const params = {
        'page': page,
        'query': query,
        'is_deleted': parseInt(tabActive) === parseInt(0)
      }
      return params
    },
    fetchData(tabActive) {
      const tabsDefault = parseInt(tabActive) === parseInt(0)
      const params = this.getRequestParams(
        this.page,
        tabsDefault
      )
      this.listLoading = true
      getList(params).then((response) => {
        this.employees = response.data.data.content
        this.listLoading = false
        this.currentPage = response.data.data.currentPage
        this.lastPage = response.data.data.lastPage
        this.allData = response.data.data.allData
        this.pageSize = response.data.data.pageSize
      })
    },
    getAllNames() {
      getAllName().then((response) => {
        this.listOrgName = response.data
        // console.log(listName)
      })
        .catch(function(error) {
          return error
        })
    },
    handlePageChange(value) {
      this.page = value
      this.fetchData(this.tabsClickedIndex)
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleSearch() {
      const params = this.getRequestParams2(
        this.page,
        this.query
      )
      console.log(params)
      if (params.query === '' || !params.query) {
        this.fetchData(this.tabsClickedIndex)
      } else {
        getSearch(params).then(response => {
          this.employees = response.data
          this.listLoading = false
          this.currentPage = response.data.currentPage
          this.lastPage = response.data.lastPage
          this.allData = response.data.allData
          this.pageSize = response.data.pageSize
        })
      }
    },
    handleFilterByStatus() {
      const params = this.getRequestParams2(
        this.page,
        this.status
      )
      this.listLoading = true
      filterByStatus(params).then((response) => {
        this.employees = response.data.content
        this.listLoading = false
        this.currentPage = response.data.currentPage
        this.lastPage = response.data.lastPage
        this.allData = response.data.allData
        this.pageSize = response.data.pageSize
      })
      console.log(params)
    },
    handleFilterByOrg() {
      const params = this.getRequestParams2(
        this.page,
        this.orgname
      )
      console.log(params)
      this.listLoading = true
      filterByOrg(params).then(response => {
        this.employees = response.data.content
        this.listLoading = false
        this.currentPage = response.data.currentPage
        this.lastPage = response.data.lastPage
        this.allData = response.data.allData
        this.pageSize = response.data.pageSize
      })
    },
    handleFilterByGrade() {
      const params = this.getRequestParams2(
        this.page,
        this.grade
      )
      this.listLoading = true
      filterByGrade(params).then(response => {
        this.employees = response.data.content
        this.listLoading = false
        this.currentPage = response.data.currentPage
        this.lastPage = response.data.lastPage
        this.allData = response.data.allData
        this.pageSize = response.data.pageSize
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
              this.fetchData(this.tabsClickedIndex)
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
              this.fetchData(this.tabsClickedIndex)
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
              this.fetchData(this.tabsClickedIndex)
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
              this.fetchData(this.tabsClickedIndex)
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
    // transfer(employeeId) {
    //   console.log('employeeId = ' + employeeId)
    //   const data = { employeeId: employeeId }

    //   getSingle(data).then((response) => {
    //     this.fetchEmplGrade()
    //     this.form = {
    //       employeeId: response.data.employeeId,
    //       name: response.data.name,
    //       employmentStatus: response.data.employmentStatus,
    //       organizationId: response.data.organizationId,
    //       positionId: response.data.positionId,
    //       grade: response.data.grade
    //     }
    //     this.listLoading = false
    //   })
    // },
    saveTransfer() {
      console.log(this.form)
      const transferData = {
        employeeId: this.form.employeeId,
        organizationBefore: this.form.organizationId.split('-')[0],
        organizationAfter: this.form.transferOrganizationId,
        positionBefore: this.form.positionId.split('-')[0],
        positionAfter: this.form.transferPositionId,
        effectiveDate: this.form.effectiveDate,
        transferReason: this.form.transferReason
      }
      this.listLoading = true
      transferEmployee(transferData).then(() => {
        Message({
          message: 'Employee transferred succesfully.',
          type: 'success',
          duration: 5 * 1000
        })
        this.transferFormVisible = false
        this.fetchData(this.tabsClickedIndex)
        this.listLoading = false
      }).catch((err) => {
        console.log(err)
        Message({
          message: 'Employee transfer failed',
          type: 'error',
          duration: 5 * 1000
        })
      })
    },
    deleteSingle(employeeId) {
      console.log('employeeId = ' + employeeId)
      MessageBox.confirm('Delete this data', 'Confirm deletion', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        const data = { employeeId: employeeId }
        deleteSingle(data).then(() => {
          Message({
            message: 'Employee deleted succesfully.',
            type: 'success',
            duration: 5 * 1000
          })
          this.listLoading = false
          this.fetchData(this.tabsClickedIndex)
        })
      })
    },
    fetchEmplGrade() {
      getEmplGrade().then((res) => {
        this.empGradeOption = res.data.data
      })
    },
    submitBulkEmployee() {
      this.$refs.uploadBulkEmployee.submit()
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
      this.fetchData(this.tabsClickedIndex)
      if (modalType === 'addEmp') {
        this.employeeFormVisible = false
        this.resetAddEmpForm()
      } else if (modalType === 'transferEmp') {
        this.transferFormVisible
        this.resetAddEmpForm()
      }
    },
    openModalAddEmp() {
      this.resetAddEmpForm()
      this.employeeFormVisible = true
      this.fetchEmplGrade()
      this.empFormState = 'add'
    },
    transferFormOpen(employeeId) {
      this.resetAddEmpForm()
      getDanglingPosition().then((res) => {
        this.danglingPositionList = res.data
      })
      this.transferFormVisible = true
      getSingle({ employeeId: employeeId }).then((response) => {
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
    releaseEmployeePosition(empId) {
      releasePositionEmployee({ id: empId }).then((response) => {
        Message({
          message: response.data.message,
          type: 'success',
          duration: 5 * 1000
        })
        this.fetchData(this.tabsClickedIndex)
      }).catch(() => {
        Message({
          message: 'Error in releasing employee from the position',
          type: 'error',
          duration: 5 * 1000
        })
      })
    },
    handleTabsClick(obj, e) {
      this.tabsClickedIndex = parseInt(obj.index)
      this.fetchData(obj.index)
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
