<template>
  <div class="app-container">
    <div>Grade</div>
    <el-card>
      <div slot="header">
        <div><el-button type="primary" @click="openModalAddGrade">Add Grade</el-button></div>
      </div>
      <div>
        <el-row>
          <el-table
            :data="gradeSummaryTable"
          >
            <el-table-column label="Code"><template slot-scope="gradeIter">{{ gradeIter.row.gradeId }}</template></el-table-column>
            <el-table-column label="Title"><template slot-scope="gradeIter">{{ gradeIter.row.gradeName }}</template></el-table-column>
            <el-table-column label="Alias"><template slot-scope="gradeIter">{{ gradeIter.row.alias }}</template></el-table-column>
            <el-table-column label="Grade"><template slot-scope="gradeIter">{{ gradeIter.row.level }}</template></el-table-column>
            <el-table-column label="Action">
              <template slot-scope="gradeIter">
                {{ gradeIter.id }}
                <el-button @click="deleteGrade(gradeIter.row.gradeId)">Delete</el-button>
                <!-- <el-button @click="openModalAssignEmp(gradeIter.row.gradeId)">Assign Employee</el-button> -->
                <el-button @click="openModalEdit(gradeIter.row.gradeId)">Edit</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </div>
    </el-card>

    <!-- ============= modal assign emp =========== -->
    <!-- <el-dialog width="50%" style="height: 100%;" title="Assign Employee to Grade" :visible.sync="assignEmpVisible">
      <el-row style="height: 500px; overflow-y: auto;">
        <el-row>
          <el-col :span="20">
            <el-transfer
              v-model="selectedAssignedEmployee"
              :data="assignableEmployee != null ? assignableEmployee : []"
              filterable
            />
          </el-col>
          <el-col :span="4">
            <el-row><el-button type="primary" @click="assignEmployee">Assign</el-button></el-row>
            <br>
            <el-row><el-button @click="assignEmpVisible = false">Cancel</el-button></el-row>
          </el-col>
        </el-row>
        <divider />
        <el-table :data="employeeAssigned">
          <el-table-column label="Grade Id" align="center">
            <template slot-scope="gradeAsgd">
              {{ gradeAsgd.row.employeeId }}
            </template>
          </el-table-column>
          <el-table-column label="Grade Title" align="center">
            <template slot-scope="gradeAsgd">
              <span>{{ gradeAsgd.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot-scope="gradeAsgd">
              <i style="cursor: pointer;" class="el-icon-delete-solid" @click="UnassignEmployee(gradeAsgd.row.employeeId)" />
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-dialog> -->

    <!-- ============== modal add & edit grade ================ -->
    <el-dialog title="Add Grade" :visible.sync="addGradeModalVisible">
      <el-row>
        <el-form ref="addGradeForm" :model="formAddGrade">
          <el-row>
            <el-col>
              <p><b>Grade Level</b></p>
            </el-col>
            <el-col>
              <el-form-item
                :rules="[{ required: true, message: 'Please input grade title'}]"
                prop="grade_name"
              ><el-input v-model="formAddGrade.grade_name" label="Level" /></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <p><b>Grade Alias</b></p>
            </el-col>
            <el-col>
              <el-form-item
                :rules="[{ required: true, message: 'Please input grade alias'}]"
                prop="grade_alias"
              ><el-input v-model="formAddGrade.grade_alias" label="Grade Alias" /></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <p><b>Grade</b></p>
            </el-col>
            <el-col>
              <el-form-item
                :rules="[
                  { required: true, message: 'Please input grade level'},
                  { pattern: /^[G]{1}([0-9]+)$/ , message: 'Level must start with G and followed by numbers (ex. G150)'}
                ]"
                prop="level"
              ><el-input v-model="formAddGrade.level" label="Grade" /></el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div>
          <el-button type="primary" :disabled="!formValid" @click="saveNewGrade">Submit</el-button>
          <el-button @click="closeModalAddGrade">Close</el-button>
        </div>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { addGrade, deleteGrade, getListGrade, getSingleGrade, updateGrade } from '@/api/grade'
import { Message } from 'element-ui'
export default {
  name: 'Grade',
  data() {
    return {
      selectedAssignedEmployee: [],
      assignableEmployee: null,
      assignEmpVisible: false,
      addGradeModalVisible: false,
      employeeAssigned: null,
      gradeSummaryTable: null,
      formAddGrade: {
        grade_id: '',
        grade_name: '',
        grade_alias: '',
        level: ''
      },
      formValid: false,
      saveButtonState: false
    }
  },
  watch: {
    formAddGrade: {
      handler() {
        this.checkForm()
      },
      deep: true
    }
  },
  created() {
    this.fetchSummary()
  },
  methods: {
    fetchSummary() {
      getListGrade().then((response) => {
        const tmp = response.data.data
        this.gradeSummaryTable = tmp.map((item) => {
          return {
            ...item,
            gradeId: 'GRD' + item.gradeId,
            level: (item.level !== null ? 'G' + item.level : 'No level')
          }
        })
      })
    },
    openModalAssignEmp(params) {
      this.assignEmpVisible = true
    },
    closeModalAssignEmp() {
      this.assignEmpVisible = false
    },
    deleteGrade(params) {
      const param = {
        'grade_id': params
      }
      deleteGrade(param).then((response) => {
        console.log(response)
        Message({
          message: 'Delete grade with code ' + params + ' success',
          type: 'success',
          duration: 5 * 1000
        })
        this.fetchSummary()
      }).catch(() => {
        Message({
          message: 'Delete grade with code ' + params + ' failed',
          type: 'error',
          duration: 5 * 1000
        })
      })
    },
    openModalAddGrade() {
      this.saveButtonState = false
      this.resetAddGradeForm()
      this.addGradeModalVisible = true
    },
    closeModalAddGrade() {
      this.addGradeModalVisible = false
    },
    saveNewGrade() {
      const body = {
        gradeId: '',
        gradeName: this.formAddGrade.grade_name,
        level: this.formAddGrade.level.substring(1),
        alias: this.formAddGrade.grade_alias
      }
      if (this.saveButtonState) {
        body.gradeId = this.formAddGrade.grade_id
        updateGrade(body).then((response) => {
          Message({
            message: 'Update grade ' + response.data.data.gradeName + ' successful',
            type: 'success',
            duration: 5 * 1000
          })
          this.fetchSummary()
          this.closeModalAddGrade()
        }).catch((e) => {
          console.error('error on update grade: ', e)
          Message({
            message: 'Error in updating grade',
            type: 'error',
            duration: 5 * 1000
          })
        })
      } else {
        addGrade(body).then((response) => {
          Message({
            message: 'Adding grade ' + response.data.data.gradeName + ' successful',
            type: 'success',
            duration: 5 * 1000
          })
          this.fetchSummary()
          this.closeModalAddGrade()
        }).catch((e) => {
          console.error('error on insert grade: ', e)
          Message({
            message: 'Error in insert new grade',
            type: 'error',
            duration: 5 * 1000
          })
        })
      }
    },
    resetAddGradeForm() {
      this.formAddGrade.grade_name = ''
    },
    checkForm() {
      this.$refs.addGradeForm.validate((valid) => {
        if (valid) {
          this.formValid = true
        } else {
          this.formValid = false
        }
      })
    },
    openModalEdit(gradeId) {
      this.saveButtonState = true
      this.formValid = false
      const param = {
        grade_id: gradeId
      }
      getSingleGrade(param).then((response) => {
        const tmp = response.data.data
        this.formAddGrade.grade_id = tmp.gradeId
        this.formAddGrade.grade_name = tmp.gradeName
        this.formAddGrade.grade_alias = tmp.alias
        this.addGradeModalVisible = true
      })
    }
  }
}
</script>

<style>

</style>
