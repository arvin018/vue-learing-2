<template>
  <el-card>
    <div slot="header">Users</div>
    <div><el-button type="primary" @click="openModalAddRole">Add New</el-button></div>
    <el-table :data="userRole">
      <el-table-column label="User Id" align="center">
        <template slot-scope="empl">
          {{ empl.row.employeeId }}
        </template>
      </el-table-column>
      <el-table-column label="User Name" align="center">
        <template slot-scope="empl">
          <span>{{ empl.row.employeeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Role" align="center">
        <template slot-scope="empl">
          <span>{{ empl.row.role }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot-scope="empl">
          <i style="cursor: pointer;" class="el-icon-delete-solid" @click="deleteRole(empl.row.employeeId)" />
        </template>
      </el-table-column>
    </el-table>

    <!-- add new user role -->
    <el-dialog :visible.sync="addUserRoleVisible">
      <el-form :model="formRole">
        <el-row>
          <el-col :span="6">
            <el-form-item label="User Id">
              <!-- <el-input-number v-model="formRole.employeeId" :controls=false></el-input-number> -->
              <el-select v-model="formRole.employeeId">
                <el-option
                  v-for="(item, i) in employeeList"
                  :key="i"
                  :value="item.employeeId + '-' + item.name"
                  :label="item.employeeId + '-' + item.name + '-' + item.position"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="User name">
              <el-input
                disabled
                :value="formRole.employeeId != null ? formRole.employeeId.split('-')[1] : ''"
                :controls="false"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="User role">
              <el-select v-model="formRole.role">
                <el-option value="ADMIN" label="ADMIN" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">Submit</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
import { getEmployeeFilterList } from '@/api/employee'
import { insertRole } from '@/api/user'
import { deleteRole, getAllUserRole } from '@/api/user'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      userRole: null,
      addUserRoleVisible: false,
      employeeList: null,
      formRole: {
        employeeId: null,
        employeeName: null,
        role: null
      }
    }
  },
  created() {
    this.getUserRole()
  },
  methods: {
    openModalAddRole() {
      this.addUserRoleVisible = true
      this.getEmployeeList()
    },
    getUserRole() {
      getAllUserRole().then((response) => {
        console.log(response.data)
        this.userRole = response.data.data
      })
    },
    deleteRole(param) {
      const tmp = {
        employee_id: param
      }

      this.$confirm('This will permanently delete the employee role. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        // nanti delete ada di sini
        deleteRole(tmp).then((res) => {
          this.$message({
            type: 'success',
            message: 'Delete role for ' + tmp.employee_id + ' success'
          })
          this.getUserRole()
        })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: 'Delete role for ' + tmp.employee_id + ' unsuccessful'
        })
        this.getUserRole()
      })
    },
    onSubmit() {
      const data = {
        employeeId: this.formRole.employeeId.split('-')[0],
        employeeName: this.formRole.employeeId.split('-')[1],
        role: this.formRole.role
      }
      insertRole(data).then((response) => {
        Message({
          message: 'User role saved succesfully.',
          type: 'success',
          duration: 5 * 1000
        })
        this.getUserRole()
        this.addUserRoleVisible = false
        this.formRole.employeeId = null
        this.formRole.employeeName = null
        this.formRole.role = null
      }).catch((e) => {
        this.$message({
          type: 'error',
          message: 'User role can\'t be saved'
        })
        this.addUserRoleVisible = false
        this.formRole.employeeId = null
        this.formRole.employeeName = null
        this.formRole.role = null
      })
    },
    getEmployeeList() {
      getEmployeeFilterList().then((res) => {
        this.employeeList = res.data.data
      })
        .catch((err) => {
          console.error('Fetch employee list failed' + err)
        })
    }
  }
}
</script>
