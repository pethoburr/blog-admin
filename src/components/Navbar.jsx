import '../App.css'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../App'

const Navbar = () => {
    const { logout } = useContext(AuthContext)
    const navigate = useNavigate()

    const logOut = () => {
        logout()
        navigate('/')
    }

    return(
        <>
            <nav>
                <header>
                    <h4>Apex Admins</h4>
                </header>
                <div className="links">
                    <Link to='/home'  className='home'>Home</Link>
                    <Link to='/topic'  className='topics'>Topics</Link>
                    <button className='logOutBtn' onClick={() => logOut()}>Logout</button>
                </div>
            </nav>
        </>
    )
}

export default Navbar