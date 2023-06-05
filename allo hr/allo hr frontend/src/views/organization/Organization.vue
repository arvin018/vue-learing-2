<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="filter-container">
          <el-input v-model="query" placeholder="Name Search" style="width: 200px; margin: 5px;" class="filter-item" @keyup.enter.native="handleSearch" />
          <el-button class="filter-item" type="primary" icon="el-icon-search" style="margin: 5px;" @click="handleSearch" />
          <el-select
            v-model="layer"
            placeholder="Filter by Layer"
            style="width: 150px ; margin: 5px;"
            @change="handleFilterByLayer"
          >
            <el-option
              v-for="item in layerOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="parent"
            placeholder="Filter by Report To"
            style="width: 200px; margin: 5px;"
            filterable
            @change="handleFilterByReport"
          >
            <el-option
              v-for="(item, i) in listName"
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
            @click="openModalAddOrg"
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

      <!-- ========= table organization -->
      <div style="height: 700px; overflow: auto;">
        <el-tabs @tab-click="handleTabsClick">
          <el-tab-pane style="height: 400px; overflow-y: auto;" label="Active Organization">
            <el-table
              v-loading="listLoading"
              :data="organizations != null ? organizations.filter((org) => {return org.is_deleted === false}) : null"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row
            >
              <el-table-column label="Code" align="center">
                <template slot-scope="scope">
                  {{ scope.row.organization_code }}
                </template>
              </el-table-column>
              <el-table-column label="Name" align="center">
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column label="Layer" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.layer | layerName }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="Reporting To">
                <template slot-scope="scope">
                  <span>{{ scope.row.parentOrganizationName }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="Action">
                <template slot-scope="scope">
                  <el-button
                    @click="deleteSingle(scope.row.organizationId)"
                  >Delete
                  </el-button>
                  <el-button
                    @click="view(scope.row.organizationId)"
                  >Edit
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane style="height: 400px; overflow-y: auto;" label="Inactive Organization">
            <el-table
              v-loading="listLoading"
              :data="organizations != null ? organizations.filter((org) => {return org.is_deleted === true}) : null"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row
            >
              <el-table-column label="Code" align="center">
                <template slot-scope="scope">
                  {{ scope.row.organization_code }}
                </template>
              </el-table-column>
              <el-table-column label="Name" align="center">
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column label="Layer" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.layer | layerName }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="Reporting To">
                <template slot-scope="scope">
                  <span>{{ scope.row.parentOrganizationName }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="Action">
                <template slot-scope="scope">
                  <!-- <el-button
                    v-show="!scope.row.is_deleted === true"
                    @click="deleteSingle(scope.row.organizationId)"
                  >Delete
                  </el-button> -->
                  <el-button
                    v-show="scope.row.is_deleted === true"
                    @click="restoreDeleted(scope.row.organizationId)"
                  >Restore
                  </el-button>
                  <!-- <el-button
                    @click="view(scope.row.organizationId)"
                  >Edit
                  </el-button> -->
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

    <el-dialog title="Organization Form" :visible.sync="organizationFormVisible">
      <el-form ref="orgForm" :model="form">
        <el-form-item
          label="Title"
          :rules="[{ required: true, message: 'Please input organization title'}]"
          prop="name"
        >
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="Layer"
          :rules="[{ required: true, message: 'Please input organization layer'}]"
          prop="layer"
        >
          <el-select v-model="form.layer" placeholder="Select Layer">
            <el-option label="President" value="1" />
            <el-option label="Directorate" value="2" />
            <el-option label="Division" value="3" />
            <el-option label="Department" value="4" />
            <el-option label="Team" value="5" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="Reporting To"
          :rules="[{ required: true, message: 'Please input reporting to'}]"
          prop="parentOrganizationId"
        >
          <el-select v-model="form.parentOrganizationId" placeholder="Select Organization" filterable>
            <el-option
              v-for="item in parentOrganizations"
              :key="item.organizationId"
              :label="item.name"
              :value="item.organizationId"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item
          label="Approval To"
          :rules="[{ required: true, message: 'Please input approval to'}]"
          prop="parentApprovalOrganizationId"
        >
          <el-select v-model="form.parentApprovalOrganizationId" placeholder="Select Approver">
            <el-option
              v-for="item in parentOrganizations"
              :key="item.organizationId"
              :label="item.name"
              :value="item.organizationId"
            />
          </el-select>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="organizationFormVisible = false">Cancel</el-button>
        <el-button type="primary" :disabled="!formValid" @click="save()">Confirm</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Organization Chart"
      :visible.sync="dialogChart"
      width="80%"
    >
      <organization-chart id="orgChart" :datasource="dataChart" style="height: auto; width: 100%;" />
      <el-button style="margin: 5px;" @click="exportToPDF">Export to PDF</el-button>
      <el-button style="margin: 5px;" @click="exportToPNG">Export to Image</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogChart = false">Close</el-button>
      </span>
    </el-dialog>

    <!-- <el-dialog
      title="Organization Chart"
      :visible.sync="dialogChart"
      width="80%"
    >
      <organization-chart id="orgChart" :datasource="dataChart" style="height: auto;" />
      <el-button style="margin: 5px;" @click="exportToPDF">Export to PDF</el-button>
      <el-button style="margin: 5px;" @click="exportToPNG">Export to Image</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogChart = false">Close</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { getList, getByLayer, save, deleteSingle, getSingle, getSearch, getFilterLayer, getAllName, getFilterParent, getChartData, updateOrg, restoreDeletedData } from '@/api/organization'
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
    layerName: function(value) {
      switch (value) {
        case '0':
          return 'BoC'
          // break
        case '1':
          return 'President'
          // break
        case '2':
          return 'Directorate'
          // break
        case '3':
          return 'Division'
        case '4':
          return 'Department'
          // break
        case '5':
          return 'Team'
        default:
          return 'No mapping'
      }
    }
  },
  data() {
    return {
      formValid: false,
      organizations: null,
      parentOrganizations: null,
      listLoading: true,
      organizationFormVisible: false,
      selectedOrganizationId: null,
      currentPage: null,
      pageSize: null,
      allData: null,
      query: null,
      layer: null,
      parent: null,
      listName: [],
      dataChart: {},
      dialogChart: false,
      tabsClickedIndex: 0,
      form: {
        organizationId: '',
        name: '',
        layer: '',
        parentOrganizationId: ''
        // parentApprovalOrganizationId: ''
      },
      layerOptions: [
        {
          label: 'BoC',
          value: 0
        },
        {
          label: 'President',
          value: 1
        },
        {
          label: 'Directorate',
          value: 2
        },
        {
          label: 'Division',
          value: 3
        },
        {
          label: 'Department',
          value: 4
        },
        {
          label: 'Team',
          value: 5
        }
      ],
      saveButtonState: false
    }
  },
  watch: {
    'form.layer': function(newVal, oldVal) {
      console.log('layer = ', newVal)
      this.fetchByLayer(newVal)
    },
    organizationFormVisible: function(newVal, oldVal) {
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
    this.getAllName()
  },
  methods: {
    checkForm() {
      this.$refs.orgForm.validate((valid) => {
        if (valid) {
          this.formValid = true
        } else {
          this.formValid = false
        }
      })
    },
    init() {
      this.selectedOrganizationId = null
      this.form = {
        organizationId: '',
        name: '',
        layer: '',
        parentOrganizationId: ''
      }
    },
    getRequestParams(page, query, isDeleted) {
      const params = {
        'page': page,
        'query': query,
        'is_deleted': isDeleted
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
        // console.log(response.data.content)
        this.organizations = response.data.data.content.map((val) => {
          return {
            ...val,
            organization_code: 'ORG' + val.organizationId
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
      // this.fetchData(this.tabsClickedIndex)

      if (this.paginationState === 'fetch') {
        this.fetchData(this.tabsClickedIndex)
      } else if (this.paginationState === 'search') {
        this.handleSearch()
      } else if (this.paginationState === 'filterLayer') {
        this.handleFilterByLayer()
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
        this.query,
        parseInt(this.tabsClickedIndex) === parseInt(1)
      )
      // console.log(params)
      this.paginationState = 'search'
      if (params.query === '' || !params.query) {
        this.fetchData(this.tabsClickedIndex)
      } else {
        this.listLoading = true
        getSearch(params).then((response) => {
        // console.log(response.data)
          this.organizations = response.data.data.content.map((val) => {
            return {
              ...val,
              organization_code: 'ORG' + val.organizationId
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
    getAllName() {
      getAllName().then((response) => {
        this.listName = response.data.data.map((val) => {
          return {
            ...val,
            title: val.title + ' - ' + this.layerOptions.filter((item) => { return parseInt(item.value) === parseInt(val.layer) })[0].label
          }
        })
        // console.log(listName);
      })
        .catch(function(error) {
          return error
        })
    },
    getChartData() {
      getChartData().then((response) => {
        const responseData = response.data.data
        this.assignDataChart(responseData)
      })
    },
    async fetchByLayer(layer) {
      var parentLayer = parseInt(layer) - 1
      const data = { layer: parentLayer }
      const data2 = { layer: parentLayer - 1 }

      this.listLoading = true

      const parentOrg = await getByLayer(data).then((response) => {
        // this.parentOrganizations = response.data.data
        this.listLoading = false
        return response.data.data
      })
      const parentOrg2 = await getByLayer(data2).then((response) => {
        // this.parentOrganizations = response.data.data
        this.listLoading = false
        return response.data.data
      })

      this.parentOrganizations = parentOrg.concat(parentOrg2)
    },
    handleFilterByLayer() {
      const params = this.getRequestParams(
        this.page,
        this.layer,
        parseInt(this.tabsClickedIndex) === parseInt(1)
      )
      this.paginationState = 'filterLayer'
      // console.log(params);
      getFilterLayer(params).then((response) => {
        this.organizations = response.data.data.content.map((val) => {
          return {
            ...val,
            organization_code: 'ORG' + val.organizationId
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
        this.parent,
        parseInt(this.tabsClickedIndex) === parseInt(1)
      )
      // console.log(params)
      this.paginationState = 'filterReport'
      getFilterParent(params).then((response) => {
        this.organizations = response.data.data.content.map((val) => {
          return {
            ...val,
            organization_code: 'ORG' + val.organizationId
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
      this.$refs.orgForm.validate((valid) => {
        if (valid) {
          this.listLoading = true
          if (this.saveButtonState) {
            save(this.form).then((response) => {
              Message({
                message: response.data.status_code === 200 ? 'Organization saved succesfully.' : response.data.message,
                type: response.data.status_code === 200 ? 'success' : 'error',
                duration: 5 * 1000
              })
              this.listLoading = false
              this.fetchData(this.tabsClickedIndex)
              this.getAllName()
              this.organizationFormVisible = false
            })
          } else {
            updateOrg(this.form).then((response) => {
              Message({
                message: response.data.status_code === 200 ? 'Organization saved succesfully.' : response.data.message,
                type: response.data.status_code === 200 ? 'success' : 'error',
                duration: 5 * 1000
              })
              this.listLoading = false
              this.fetchData(this.tabsClickedIndex)
              this.getAllName()
              this.organizationFormVisible = false
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
    view(organizationId) {
      this.listLoading = true
      this.saveButtonState = false
      const data = { organizationId: organizationId }
      getSingle(data).then((response) => {
        console.log(response.data.data)
        this.organizationFormVisible = true
        this.form = {
          organizationId: response.data.data.organizationId,
          name: response.data.data.name,
          layer: response.data.data.layer,
          parentOrganizationId: response.data.data.parentOrganizationId
        }
        this.listLoading = false
      })
    },
    openModalAddOrg() {
      this.organizationFormVisible = true
      this.saveButtonState = true
    },
    deleteSingle(organizationId) {
      MessageBox.confirm('Delete this data', 'Confirm deletion', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        const data = { organizationId: organizationId }
        deleteSingle(data).then((response) => {
          if (response.data.status_code === 422) {
            this.assignDataChart(response.data.data)
            this.dialogChart = true
          } else if (response.data.status_code === 200) {
            Message({
              message: 'Organization deleted succesfully.',
              type: 'success',
              duration: 5 * 1000
            })
          }
          this.listLoading = false
          this.fetchData(this.tabsClickedIndex)
        })
      })
    },
    exportToPDF() {
      html2pdf(document.getElementById('orgChart'), {
        margin: 1,
        filename: 'organization_chart.pdf',
        jsPDF: {
          orientation: 'landscape'
        },
        html2canvas: {
          scrollX: 0
        }
      })
    },
    exportToPNG() {
      var element = document.getElementById('orgChart')

      htmlToImage.toPng(element)
        .then(function(dataUrl) {
          downloadjs(dataUrl, 'organization_chart.png')
        })
    },
    handleTabsClick(obj, e) {
      this.tabsClickedIndex = parseInt(obj.index)
      this.fetchData(obj.index)
    },
    restoreDeleted(id) {
      this.listLoading = true
      restoreDeletedData({ id: id }).then((response) => {
        Message({
          message: 'Organization restored succesfully.',
          type: 'success',
          duration: 5 * 1000
        })
        this.listLoading = false
        this.fetchData(this.tabsClickedIndex)
      }).catch(() => {
        Message({
          message: 'Organization restore failed.',
          type: 'error',
          duration: 5 * 1000
        })
      })
    },
    assignDataChart(responseData) {
      const nest = (items, id = null, link = 'parentId') =>
        items
          .filter(item => item[link] === id)
          .map(item => {
            // console.log(item)
            return ({ ...item, children: nest(items, item.id) })
          })
      // console.log('ini response = ', response.data.data)
      const parsedData = nest(responseData)
      // console.log('parse data chart = ', parsedData)
      this.dataChart = Object.assign(parsedData[0])
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
