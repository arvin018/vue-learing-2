import { getList, getSingle } from '@/api/employee'

const getDefaultState = () => {
  return {
    employeeData: {
      content: null,
      currentPage: null,
      lastPage: null,
      allData: null,
      pageSize: null
    },
    formEmployee: {
      employeeId: '',
      name: '',
      employmentStatus: '',
      organizationId: '',
      positionId: '',
      gradeId: '',
      joinDate: '',
      endDate: ''
    },
    listLoading: false,
    modalBulkUploadVisible: false,
    tabsSummaryEmployeeClicked: '0',
    empTransferModalVisible: false
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
    localStorage.removeItem('employee')
  },
  SET_EMPLOYEE_ALL: (state, datas) => {
    state.employeeData.content = datas.content
    state.employeeData.currentPage = datas.currentPage
    state.employeeData.lastPage = datas.lastPage
    state.employeeData.allData = datas.allData
    state.employeeData.pageSize = datas.pageSize
  },
  SET_LIST_LOADING: (state, datas) => {
    state.listLoading = datas
  },
  SET_BULK_UPLOAD_MODAL_VISIBLE: (state, datas) => {
    state.modalBulkUploadVisible = datas
  },
  SET_TABS_EMP_SUMMARY_CLICKED: (state, datas) => {
    state.tabsSummaryEmployeeClicked = datas
  },
  SET_EMP_TRANSFER_MODAL_VISIBLE: (state, datas) => {
    state.empTransferModalVisible = datas
  },
  RESET_FORM_EMPLOYEE: (state) => {
    state.formEmployee.employeeId = ''
    state.formEmployee.name = ''
    state.formEmployee.employmentStatus = ''
    state.formEmployee.organizationId = ''
    state.formEmployee.positionId = ''
    state.formEmployee.gradeId = ''
    state.formEmployee.joinDate = ''
    state.formEmployee.endDate = ''
    state.formEmployee.effectiveDate = ''
    state.formEmployee.transferReason = ''
    state.formEmployee.transferOrganizationId = ''
    state.formEmployee.transferPositionId = ''
  },
  SET_FORM_EMPLOYEE: (state, datas) => {
    state.formEmployee.employeeId = datas.employeeId
    state.formEmployee.name = datas.name
    state.formEmployee.employmentStatus = datas.employmentStatus
    state.formEmployee.organizationId = datas.organizationName
    state.formEmployee.positionId = datas.positionTitle
    state.formEmployee.gradeId = datas.grade
    state.formEmployee.joinDate = datas.joinDate
    state.formEmployee.endDate = datas.endDate
  }
}

const actions = {
  fetchAllEmployee({ commit }, params) {
    return new Promise((resolve, reject) => {
      commit('SET_LIST_LOADING', true)
      getList(params).then((response) => {
        commit('SET_EMPLOYEE_ALL', response.data.data)
        commit('SET_LIST_LOADING', false)
        resolve()
      }).catch((e) => {
        reject(e)
      })
    })
  },
  setBulkUploadEmployeeVisibility({ commit }, params) {
    commit('SET_BULK_UPLOAD_MODAL_VISIBLE', params)
  },
  employeeSummaryTabHandler({ commit }, params) {
    commit('SET_TABS_EMP_SUMMARY_CLICKED', params)
  },
  setEmployeeTransferVisibility({ commit }, params) {
    commit('SET_EMP_TRANSFER_MODAL_VISIBLE', params)
  },
  resetFormEmployee({ commit }) {
    commit('RESET_FORM_EMPLOYEE')
  },
  getSingleEmployee({ commit }, empId) {
    return new Promise((resolve, reject) => {
      getSingle({ employeeId: empId }).then((response) => {
        commit('SET_FORM_EMPLOYEE', response.data)
        resolve()
      }).catch((e) => {
        reject(e)
      })
    })
  },
  setListLoading({ commit }, params) {
    commit('SET_LIST_LOADING', params)
  },
  setAllEmployee({ commit }, params) {
    commit('SET_EMPLOYEE_ALL', params)
  },
  resetEmployeeState({ commit }) {
    commit('RESET_STATE')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
