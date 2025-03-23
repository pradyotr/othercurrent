import fetchIntercept from 'fetch-intercept'

const unregister = fetchIntercept.register({
  request: function (url, config) {
    const token = localStorage.getItem('token')
    const newConfig = url.endsWith('frappe.integrations.oauth2.get_token')
      ? config
      : {
          ...config,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
    return [url, newConfig]
  }
})

export default unregister
