<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="filter-container">
          <el-input v-model="query" placeholder="Title Search" style="width: 200px; margin: 5px;" class="filter-item" @keyup.enter.native="handleSearch" />
          <el-button class="filter-item" type="primary" icon="el-icon-search" style="margin: 5px;" @click="handleSearch" />
          <el-select
            v-model="level"
            placeholder="Filter by Level"
            style="width: 150px ; margin: 5px;"
            @change="handleFilterByLevel"
          >
            <el-option
              v-for="item in levelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="parent"
            placeholder="Filter by Report To"
            style="width: 200px; margin: 5px;"
            :filterable="true"
            @change="handleFilterByReport"
          >
            <el-option
              v-for="(item, i) in listTitle"
              :key="i"
              :label="item.title"
              :value="item.positionId"
            />
          </el-select>
        </div>
        <div>
          <el-button
            type="primary"
            style="margin: 5px;"
            @click="positionFormVisible = true"
          >Add
          </el-button>
          <el-button
            type="info"
            style="margin: 5px;"
            @click="dialogChart = true; getChartData()"
          >View Chart
          </el-button>
        </div>

      </div>
      <div style="height: 700px; overflow: auto;">
        <el-tabs @tab-click="handleTabsClick">
          <el-tab-pane style="height: 400px; overflow-y: auto;" label="Active position">
            <el-table
              v-loading="listLoading"
              :data="positions !== null ? positions.filter((pos) => {return pos.is_deleted === false}) : null"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row
            >
              <el-table-column label="Position Code" align="center">
                <template slot-scope="scope">{{ scope.row.position_code }}</template>
              </el-table-column>
              <el-table-column label="Title" align="center">
                <template slot-scope="scope">
                  {{ scope.row.title }}
                </template>
              </el-table-column>
              <el-table-column label="Level" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.level | levelName }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="Reporting To">
                <template slot-scope="scope">
                  <span>{{ scope.row.parentPositionTitle }}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column align="center" label="Approval To">
                <template slot-scope="scope">
                  <span>{{ scope.row.parentPositionApprovalTitle }}</span>
                </template>
              </el-table-column> -->
              <el-table-column align="center" label="Action">
                <template slot-scope="scope">
                  <el-button
                    @click="deleteSingle(scope.row.positionId)"
                  >Delete
                  </el-button>
                  <el-button
                    @click="view(scope.row.positionId)"
                  >Edit
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane style="height: 400px; overflow-y: auto;" label="Inactive position">
            <el-table
              v-loading="listLoading"
              :data="positions !== null ? positions.filter((pos) => {return pos.is_deleted === true}) : null"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row
            >
              <el-table-column label="Position Code" align="center">
                <template slot-scope="scope">{{ scope.row.position_code }}</template>
              </el-table-column>
              <el-table-column label="Title" align="center">
                <template slot-scope="scope">
                  {{ scope.row.title }}
                </template>
              </el-table-column>
              <el-table-column label="Level" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.level | levelName }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="Reporting To">
                <template slot-scope="scope">
                  <span>{{ scope.row.parentPositionTitle }}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column align="center" label="Approval To">
                <template slot-scope="scope">
                  <span>{{ scope.row.parentPositionApprovalTitle }}</span>
                </template>
              </el-table-column> -->
              <el-table-column align="center" label="Action">
                <template slot-scope="scope">
                  <el-button
                    v-show="!scope.row.is_deleted === true"
                    @click="deleteSingle(scope.row.positionId)"
                  >Delete
                  </el-button>
                  <el-button
                    v-show="scope.row.is_deleted === true"
                    @click="restoreDeleted(scope.row.positionId)"
                  >Restore
                  </el-button>
                  <el-button
                    @click="view(scope.row.positionId)"
                  >Edit
                  </el-button>
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

    <el-dialog title="Position Form" :visible.sync="positionFormVisible">
      <el-form ref="posForm" :model="form">
        <el-form-item
          label="Title"
          :rules="[{ required: true, message: 'Please input position title'}]"
          prop="title"
        >
          <el-input v-model="form.title" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="Level"
          :rules="[{ required: true, message: 'Please input position level'}]"
          prop="level"
        >
          <el-select v-model="form.level" placeholder="Select Level">
            <el-option label="President Director" value="1" />
            <el-option label="Director" value="2" />
            <el-option label="Division Head" value="3" />
            <el-option label="Department Head" value="4" />
            <el-option label="Team Member" value="5" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="Reporting To"
          :rules="[{ required: true, message: 'Please input reporting to position'}]"
          prop="parentPositionId"
        >
          <el-select v-model="form.parentPositionId" placeholder="Select Position" filterable>
            <el-option
              v-for="item in parentPositions"
              :key="item.positionId"
              :label="item.title"
              :value="item.positionId"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item
          label="Approval To"
          :rules="[{ required: true, message: 'Please input approver position'}]"
          prop="parentPositionApprovalId"
        >
          <el-select v-model="form.parentPositionApprovalId" placeholder="Select Approver Position">
            <el-option
              v-for="item in parentPositions"
              :key="item.positionId"
              :label="item.title"
              :value="item.positionId"
            />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item
          v-show="form.level === '4'"
          label="Reporting To"
          prop="parentPositionId"
        >
          <el-select v-model="form.parentPositionId2" placeholder="Select Position">
            <el-option
              v-for="item in parentPositions"
              :key="item.positionId"
              :label="item.title"
              :value="item.positionId"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item
          label="Position can have many employee?"
        >
          <el-checkbox
            v-model="form.is_can_be_filled_by_multiple_emp"
            label="Position can have many employee?"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="positionFormVisible = false">Cancel</el-button>
          <el-button :disabled="!formValid" type="primary" @click="save()">
            Confirm
          </el-button>
        </el-form-item>
      </el-form>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="positionFormVisible = false">Cancel</el-button>
        <el-button :disabled="!formValid" type="primary" @click="save()">
          Confirm
        </el-button>
      </span> -->
    </el-dialog>

    <el-dialog
      title="Position Chart"
      :visible.sync="dialogChart"
      width="80%"
      style="height: 1000px;"
    >
      <organization-chart id="orgChart" :datasource="dataChart" style="height: auto; width: 100%;" />
      <el-button style="margin: 5px;" @click="exportToPDF">Export to PDF</el-button>
      <el-button style="margin: 5px;" @click="exportToPNG">Export to Image</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogChart = false">Close</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList, getByLevel, save, deleteSingle, getSingle, getSearch, getFilterLevel, getAllTitle, getFilterParent, getChartData, restoreDeletedData } from '@/api/position'
import { Message, MessageBox } from 'element-ui'
// import Pagination from '@/components/Pagination'
import { scrollTo } from '@/utils/scroll-to'
import OrganizationChart from 'vue-organization-chart'
import 'vue-organization-chart/dist/orgchart.css'
import html2pdf from 'html2pdf.js'
import * as htmlToImage from 'html-to-image'
// import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image'
import downloadjs from 'downloadjs'

export default {
  components: {
    // Pagination,
    OrganizationChart },
  filters: {
    levelName: function(value) {
      switch (value) {
        case '0':
          return 'BoC'
          // break
        case '1':
          return 'President Director'
          // break
        case '2':
          return 'Director'
          // break
        case '3':
          return 'Division Head'
        case '4':
          return 'Department Head'
          // break
        case '5':
          return 'Team Member'
        default:
          return 'No mapping'
      }
    }
  },
  data() {
    return {
      tabsClickedIndex: 0,
      formValid: false,
      positions: null,
      parentPositions: null,
      parentPositions2: null,
      listLoading: true,
      positionFormVisible: false,
      selectedPositionId: null,
      currentPage: null,
      pageSize: null,
      allData: null,
      level: null,
      parent: null,
      dataChart: {},
      dialogChart: false,
      levelOptions: [
        {
          label: 'BoC',
          value: 0
        },
        {
          label: 'President Director',
          value: 1
        },
        {
          label: 'Director',
          value: 2
        },
        {
          label: 'Division Head',
          value: 3
        },
        {
          label: 'Department Head',
          value: 4
        },
        {
          label: 'Team Member',
          value: 5
        }
      ],
      query: null,
      listTitle: [],
      form: {
        positionId: null,
        title: null,
        level: null,
        parentPositionId: null,
        // parentPositionApprovalId: null,
        is_can_be_filled_by_multiple_emp: null
      },
      paginationState: 'fetch'
    }
  },
  watch: {
    'form.level': function(newVal, oldVal) {
      this.fetchByLevel(newVal)
      // this.fetchByLevel2(newVal2)
    },
    positionFormVisible: function(newVal, oldVal) {
      if (newVal === false) {
        this.init()
      }
    },
    form: {
      handler() {
        this.checkForm()
      },
      deep: true
    }
  },
  created() {
    this.fetchData(this.tabsClickedIndex)
    this.getAllTitle()
    // this.getChartData();
  },
  methods: {
    checkForm() {
      this.$refs.posForm.validate((valid) => {
        if (valid) {
          this.formValid = true
        } else {
          this.formValid = false
        }
      })
    },
    init() {
      this.selectedPositionId = null
      this.form = {
        positionId: null,
        title: null,
        level: null,
        parentPositionId: null
      }
    },
    getRequestParams(page, level) {
      const params = {
        'page': page,
        'query': level,
        'is_deleted': parseInt(this.tabsClickedIndex) === parseInt(1)
      }
      return params
    },
    fetchData(tabActive) {
      const params = this.getRequestParams(
        this.page,
        this.query,
        parseInt(tabActive) === parseInt(1)
      )
      this.listLoading = true
      this.paginationState = 'fetch'
      getList(params).then((response) => {
        // console.log(response.data.data.content)
        this.positions = response.data.data.content.map((val) => {
          return {
            ...val,
            position_code: 'POS' + val.positionId
          }
        })
        this.listLoading = false
        this.currentPage = response.data.data.currentPage
        this.lastPage = response.data.data.lastPage
        this.allData = response.data.data.allData
        this.pageSize = response.data.data.pageSize
      })
    },
    handlePageChange(value) {
      this.page = value
      if (this.paginationState === 'fetch') {
        this.fetchData(this.tabsClickedIndex)
      } else if (this.paginationState === 'search') {
        this.handleSearch()
      } else if (this.paginationState === 'filterLevel') {
        this.handleFilterByLevel()
      } else if (this.paginationState === 'filterReport') {
        this.handleFilterByReport()
      }

      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleSearch() {
      const params = this.getRequestParams(
        this.page,
        this.query
      )
      this.paginationState = 'search'
      // console.log(params.query)
      if (params.query === '' || !params.query) {
        this.fetchData(this.tabsClickedIndex)
      } else {
        this.listLoading = true
        getSearch(params).then((response) => {
        // console.log(response.data.datacontent)
          this.positions = response.data.data.content.map((val) => {
            return {
              ...val,
              position_code: 'POS' + val.positionId
            }
          })
          this.listLoading = false
          this.currentPage = response.data.data.currentPage
          this.lastPage = response.data.data.lastPage
          this.allData = response.data.data.allData
          this.pageSize = response.data.data.pageSize
        })
      }
    },
    getAllTitle() {
      getAllTitle().then((response) => {
        this.listTitle = response.data.data.map((val) => {
          return {
            ...val,
            title: val.title + ' - ' + this.levelOptions.filter((item) => { return parseInt(item.value) === parseInt(val.layer) })[0].label
          }
        })
        // console.log(listTitle);
      })
        .catch(function(error) {
          return error
        })
    },
    async fetchByLevel(level) {
      var parentLevel = parseInt(level) - 1
      var parentLevel2 = parseInt(level) - 2

      const data = { level: parentLevel }
      const data2 = { level: parentLevel2 }

      this.listLoading = true

      const responseData = await getByLevel(data).then((response) => {
        // this.parentPositions = response.data
        this.listLoading = false
        return response.data.data
      })

      const responseData2 = await getByLevel(data2).then((response) => {
        // this.parentPositions2 = response.data
        this.listLoading = false
        return response.data.data
      })

      this.parentPositions = responseData.concat(responseData2)
    },
    handleFilterByLevel() {
      const params = this.getRequestParams(
        this.page,
        this.level
      )
      this.paginationState = 'filterLevel'
      // console.log(params)
      getFilterLevel(params).then((response) => {
        this.positions = response.data.data.content.map((val) => {
          return {
            ...val,
            position_code: 'POS' + val.positionId
          }
        })
        this.listLoading = false
        this.currentPage = response.data.data.currentPage
        this.lastPage = response.data.data.lastPage
        this.allData = response.data.data.allData
        this.pageSize = response.data.data.pageSize
      })
    },
    handleFilterByReport() {
      const params = this.getRequestParams(
        this.page,
        this.parent
      )
      // console.log(params)
      this.paginationState = 'filterReport'
      getFilterParent(params).then((response) => {
        this.positions = response.data.data.content.map((val) => {
          return {
            ...val,
            position_code: 'POS' + val.positionId
          }
        })
        this.listLoading = false
        this.currentPage = response.data.data.currentPage
        this.lastPage = response.data.data.lastPage
        this.allData = response.data.data.allData
        this.pageSize = response.data.data.pageSize
      })
    },
    save() {
      this.$refs.posForm.validate((valid) => {
        if (valid) {
          this.listLoading = true

          save(this.form).then(() => {
            Message({
              message: 'Position saved succesfully.',
              type: 'success',
              duration: 5 * 1000
            })
            this.listLoading = false
            this.fetchData(this.tabsClickedIndex)
            this.getAllTitle()
            this.positionFormVisible = false
          }).catch(() => {
            Message({
              message: 'Error saving position',
              type: 'error',
              duration: 5 * 1000
            })
          })
        } else {
          Message({
            message: 'Mandatory field is not filled',
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    view(positionId) {
      this.listLoading = true
      const data = { positionId: positionId }
      getSingle(data).then((response) => {
        this.positionFormVisible = true
        this.form = {
          positionId: response.data.data.positionId,
          title: response.data.data.title,
          level: response.data.data.level,
          parentPositionId: response.data.data.parentPositionId
        }
        this.listLoading = false
      })
    },
    deleteSingle(positionId) {
      MessageBox.confirm('Delete this data', 'Confirm deletion', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        const data = { positionId: positionId }
        deleteSingle(data).then((response) => {
          if (response.data.status_code === 200) {
            Message({
              message: 'Position deleted succesfully.',
              type: 'success',
              duration: 5 * 1000
            })
          } else if (response.data.status_code === 422) {
            this.assignChartData(response.data.data)
            this.dialogChart = true
          }
          this.listLoading = false
          this.fetchData(this.tabsClickedIndex)
        })
      })
    },
    getChartData() {
      getChartData().then((response) => {
        const responseData = response.data.data
        this.assignChartData(responseData)
      })
    },
    assignChartData(responseData) {
      const nest = (items, id = null, link = 'parentId') =>
        items
          .filter(item => item[link] === id)
          .map(item => ({ ...item, children: nest(items, item.id) }))

      // console.log(responseData)
      const parsedData = nest(responseData)
      // console.log(parsedData)
      this.dataChart = Object.assign(parsedData[0])
      // console.log(typeof(parsedData[0]))
    },
    exportToPDF() {
      html2pdf(document.getElementById('orgChart'), {
        margin: 1,
        filename: 'position_chart.pdf'
      })
    },
    exportToPNG() {
      var element = document.getElementById('orgChart')

      htmlToImage.toPng(element)
        .then(function(dataUrl) {
          downloadjs(dataUrl, 'position_chart.png')
        })
    },
    handleTabsClick(obj, e) {
      // console.log(obj, e)
      this.tabsClickedIndex = parseInt(obj.index)
      this.fetchData(obj.index)
    },
    restoreDeleted(id) {
      this.listLoading = true
      restoreDeletedData({ id: id }).then((response) => {
        Message({
          message: 'Position restored succesfully.',
          type: 'success',
          duration: 5 * 1000
        })
        this.listLoading = false
        this.fetchData(this.tabsClickedIndex)
      }).catch(() => {
        Message({
          message: 'Position restore failed.',
          type: 'error',
          duration: 5 * 1000
        })
      })
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
