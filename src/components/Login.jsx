import '../App.css'
import { useState,useContext } from 'react'
import { useNavigate  } from 'react-router-dom'
import { AuthContext } from '../App'
import Lion from '../assets/roaringlion.jpg'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState(null)
    const [userError, setUserError] = useState(false)
    const [invalidUser, setInvalidUser] = useState(false)
    const [passError, setPassError] = useState(false)
    const [bothError, setBothError] = useState(false)
    const [userClass, setUserClass] = useState('form-control')
    const [passClass, setPassClass] = useState('form-control')
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()

    const auth = (e) => {
        e.preventDefault()
        const data = {
            username: username,
            password: password
        }
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
                login(response.token)
                if (response.token) {
                    navigate('/home')
                } else {
                    const jayed = JSON.stringify(response)
                    console.log(`resp: ${jayed}`)
                    if (response.message === 'Missing credentials') {
                        console.log('missing credentials resp:' + response)
                        setBothError(true)
                        console.log('after' + bothError)
                        setUserError(false)
                        setPassError(false)
                        setUserClass('form-control is-invalid')
                        setPassClass('form-control is-invalid')
                    }

                   if (response.message === 'Incorrect username') {
                        console.log('incorrect username')
                        setUserError(true)
                        setInvalidUser(false)
                        setPassError(false)
                        setBothError(false)
                        console.log(`after: ${userError}`)
                        setUserClass('form-control is-invalid')
                        setPassClass('form-control')
                   }
                   
                   if (response.message === 'Incorrect password') {
                        console.log('incorrect password')
                        setPassError(true)
                        setInvalidUser(false)
                        setUserError(false)
                        setBothError(false)
                        console.log(`after: ${passError}`)
                        setPassClass('form-control is-invalid')
                        setUserClass('form-control')
                   }

                   if (response === "Must be admin user") {
                    setInvalidUser(true)
                    setUserError(true)
                    setPassError(false)
                    setBothError(false)
                    setUserClass('form-control is-invalid')
                    setPassClass('form-control')
                   }

                   if (response === "Not Found") {
                    setInvalidUser(true)
                    setInvalidUser(false)
                    setUserClass('form-control is-invalid')
                    setPassClass('form-control is-invalid')
                    setBothError(true)

                   }
                }
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
    <div className="formContainer">
        <img src={Lion} alt="Lion roaring" />
        <div className="form">
            <form method='POST' className={ userError || passError || bothError ? '' : 'was-validated'} action='https://still-pond-6102.fly.dev/admin/log-in'>
                <h2>Log In</h2>
                <div className="form-floating mb-3">
                    <input type='text' id='username' name='username' className={userClass} required onChange={(e) => {handleUserNameChange(e)}} placeholder='enter username' />
                    <label htmlFor='username'>Username</label>
                    { userError ? <div className='invalid-feedback' >{ invalidUser ? 'Only admin user access allowed' : 'Incorrect username' }</div> : ''}
                </div>
                <div className="form-floating mb-3">
                    <input type='password' id='password' className={passClass} required onChange={(e) => {handlePasswordChange(e)}} name='password' placeholder='enter password' />
                    <label htmlFor='password'>Password</label>
                    { passError ? <div className='invalid-feedback' >Incorrect password</div> : ''}
                </div>
                { bothError ? <div className='bothErr'>Incorrect username and/or password</div> : ''}
                <button type='submit' className='btn btn-primary' onClick={(e) => {auth(e)}}>Log in</button>
            </form>
        </div>
    </div>
    </>
  )
}

export default Login