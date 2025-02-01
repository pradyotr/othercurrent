import { useState, useEffect, createContext, useContext } from 'react'
import { useNavigate } from 'react-router'
import { BASE_URL } from '../constants/app-constants'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [roles, setRoles] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
      const logged_user = await fetchUserData(token)
      fetchUserRoles(logged_user, token)
      navigate('/')
    } else {
      setIsAuthenticated(false)
      setUser(null)
    }
    setLoading(false)
  }

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(
        `${BASE_URL}/method/frappe.auth.get_logged_user`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const userData = await response.json()
      setUser(userData.message)
      return userData.message
    } catch (error) {
      console.error('Error fetching user data:', error)
      logout()
    }
  }

  const fetchUserRoles = async (user, token) => {
    try {
      const response = await fetch(`${BASE_URL}/resource/User/${user}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const userData = await response.json()
      setRoles(userData.data.roles.map((field) => field.role))
    } catch (error) {
      console.error('Error fetching user data:', error)
      logout()
    }
  }

  const login = async (username, password) => {
    const params = new URLSearchParams({
      grant_type: 'password',
      client_id: import.meta.env.VITE_CLIENT_ID,
      client_secret: import.meta.env.VITE_CLIENT_SECRET,
      username,
      password,
      scope: 'all openid'
    })

    try {
      const response = await fetch(
        `${BASE_URL}/method/frappe.integrations.oauth2.get_token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params
        }
      )

      const data = await response.json()
      if (data.access_token) {
        localStorage.setItem('token', data.access_token)
        setIsAuthenticated(true)
        await fetchUserData(data.access_token)
        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, loading, roles, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
