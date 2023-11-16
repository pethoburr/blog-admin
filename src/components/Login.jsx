import '../App.css'
import { useState,useContext } from 'react'
import { Link, useNavigate  } from 'react-router-dom'
import { AuthContext } from '../App'
import Lion from '../assets/roaringlion.jpg'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState(null)
    const [userError, setUserError] = useState(false)
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
        fetch('http://localhost:3000/admin/log-in', { 
            mode: 'cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'credentials': 'include'
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
                        setPassError(false)
                        setBothError(false)
                        console.log(`after: ${userError}`)
                        setUserClass('form-control is-invalid')
                        setPassClass('form-control')
                   }
                   
                   if (response.message === 'Incorrect password') {
                        console.log('incorrect password')
                        setPassError(true)
                        setUserError(false)
                        setBothError(false)
                        console.log(`after: ${passError}`)
                        setPassClass('form-control is-invalid')
                        setUserClass('form-control')
                   }

                   if (response === "Not Found") {
                    setUserError(true)
                    setUserClass('form-control is-invalid')
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
            <form method='POST' className={ userError || passError || bothError ? '' : 'was-validated'} action='http://localhost:3000/log-in'>
                <h2>Log In</h2>
                <div className="form-floating mb-3">
                    <input type='text' id='username' name='username' className={userClass} required onChange={(e) => {handleUserNameChange(e)}} placeholder='enter username' />
                    <label htmlFor='username'>Username</label>
                    { userError ? <div className='invalid-feedback' >Incorrect username</div> : ''}
                </div>
                <div className="form-floating mb-3">
                    <input type='text' id='password' className={passClass} required onChange={(e) => {handlePasswordChange(e)}} name='password' placeholder='enter password' />
                    <label htmlFor='password'>Password</label>
                    { passError ? <div className='invalid-feedback' >Incorrect password</div> : ''}
                </div>
                { bothError ? <div className='bothErr'>Missing credentials</div> : ''}
                <button type='submit' className='btn btn-primary' onClick={(e) => {auth(e)}}>Log in</button><div>Dont have an account?<Link to='/sign-up'>Sign up</Link></div>
            </form>
        </div>
    </div>
    </>
  )
}

export default Login