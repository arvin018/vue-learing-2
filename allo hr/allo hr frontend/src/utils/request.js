import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // if the custom code is not 200, it is error.
    if (response.status !== 200) {
      Message({
        message: response.status || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 401: Token expired
      if (response.status === '401') {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(response.status || 'Error'))
    } else {
      if ('status_code' in response.data) {
        if (response.data.status_code !== 200) {
          console.warn('respons error = ', response)
          Message({
            message: response.data.message || 'Error',
            type: 'error',
            duration: 5 * 1000
          })
        }
      }

      return response
    }
  },
  error => {
    console.log('err: ' + error) // for debug

    if (error.toString().includes('401') || error.toString().includes('403')) {
      store.dispatch('user/resetToken').then(() => {
        Message({
          // message: error.message,
          message: 'Session expired or wrong credentials, please login again',
          type: 'error',
          duration: 5 * 1000
        })
        setTimeout(() => {
          location.reload()
          store.dispatch('employee/resetEmployeeState')
        }, 1500)
      })
    }
    Message({
      // message: error.message,
      message: 'Error! Please contact administrator',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
