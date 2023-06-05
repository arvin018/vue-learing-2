<template>
  <el-table
    v-loading="getListLoading"
    :data="getEmployeeDataInStore.content"
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
</template>

<script>
import { deleteSingle, releasePositionEmployee } from '@/api/employee'
import { Message, MessageBox } from 'element-ui'

export default {
  name: 'Employee',
  data() {
    return {
      employees: null,
      listLoading: false,
      currentPage: null,
      lastPage: null,
      allData: null,
      pageSize: null,
      tabsClickedIndex: parseInt(0)
    }
  },
  computed: {
    getEmployeeDataInStore() {
      const employeePagination = this.$store.state.employee.employeeData
      // console.log('emp data = ', this.$store.state)
      return employeePagination
    },
    getListLoading() {
      return this.$store.state.employee.listLoading
    },
    getEmpSummaryTabsClicked() {
      return this.$store.state.employee.tabsSummaryEmployeeClicked
    }
  },
  methods: {
    deleteSingle(employeeId) {
      console.log('employeeId = ' + employeeId)
      MessageBox.confirm('Delete this data', 'Confirm deletion', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        // this.listLoading = true
        const data = { employeeId: employeeId }
        deleteSingle(data).then(() => {
          const tabsDefault = parseInt(this.getEmpSummaryTabsClicked) === parseInt(0)
          const params = { page: parseInt(1), isActiveEmployee: tabsDefault }
          this.$store.dispatch('employee/fetchAllEmployee', params)

          Message({
            message: 'Employee deleted succesfully.',
            type: 'success',
            duration: 5 * 1000
          })
        }).catch(() => {
          Message({
            message: 'Delete employee failed.',
            type: 'error',
            duration: 5 * 1000
          })
        })
      })
    },
    releaseEmployeePosition(empId) {
      releasePositionEmployee({ id: empId }).then((response) => {
        Message({
          message: response.data.message,
          type: 'success',
          duration: 5 * 1000
        })
        // this.fetchData(this.getEmpSummaryTabsClicked)
        // const tabsDefault = parseInt(this.getEmpSummaryTabsClicked) === parseInt(0)
        const params = { page: parseInt(1), isActiveEmployee: true }
        this.$store.dispatch('employee/fetchAllEmployee', params)
      }).catch(() => {
        Message({
          message: 'Error in releasing employee from the position',
          type: 'error',
          duration: 5 * 1000
        })
      })
    },
    transferFormOpen(employeeId) {
      this.$store.dispatch('employee/resetFormEmployee')

      // get single emp
      this.$store.dispatch('employee/getSingleEmployee', employeeId)

      // open modal
      this.$store.dispatch('employee/setEmployeeTransferVisibility', true)
    }
  }
}
</script>
