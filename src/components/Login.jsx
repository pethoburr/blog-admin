import '../App.css'
import { useState,useContext } from 'react'
import { useNavigate  } from 'react-router-dom'
import { AuthContext } from '../App'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()

    const auth = (e) => {
        e.preventDefault()
        console.log('clicked')
        const data = {
            username: username,
            password: password
        }
        console.log(`data: ${data.username}, ${data.password}`)
        fetch('https://still-pond-6102.fly.dev/admin/log-in', { 
            mode: 'cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify(data),
            })
            .then((response) => response.json())
            .then((response) => {
                console.log(response)
                login(response.token)
                navigate('/home')
            })
            .catch(err => console.log(err))
    }
    
    const handleUserNameChange = (e) => {
        setUsername(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

  return (
    <>
    <h1>Log In</h1>
     <form method='POST' action='https://still-pond-6102.fly.dev/admin/log-in'>
        <label htmlFor='username'>
            <input type='text' id='username' required name='username' onChange={(e) => {handleUserNameChange(e)}} placeholder='enter username' />
        </label>
        <label htmlFor='password'>
            <input type='text' id='password' required onChange={(e) => {handlePasswordChange(e)}} name='password' placeholder='enter password' />
        </label>
        <button type='submit' onClick={(e) => {auth(e)}}>Log in</button>
     </form>
    </>
  )
}

export default Login