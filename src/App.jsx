import './App.css'
import Login from './components/Login'
import Home from './components/Home'
import Postform from './components/Postform'
import Topic from './components/Topic'
import TopicForm from './components/TopicForm'
import { createContext, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

export const AuthContext = createContext()

function App() {
  const [token, setToken] = useState(null)

  const login = (newToken) => {
    setToken(newToken)
  }

  const logout = () => {
    setToken(null)
  }

  const router = createBrowserRouter([
    {
      path: '/home',
      element: <Home />
    },
    {
      path: '/',
      element: <Login />
    },
    {
      path: '/topic',
      element: <Topic />
    },
    {
      path: '/form',
      element: <TopicForm />
    },
    {
      path: '/form/:id',
      element: <TopicForm />
    },
    {
      path: '/post-form',
      element: <Postform />
    },
    {
      path: '/post-form/:id/update',
      element: <Postform />
    }
  ])
  
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  )
}

export default App