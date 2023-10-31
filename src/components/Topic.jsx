import '../App.css'
import { useState, useEffect, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../App'

const Topic = () => {
    const [arr, setArr] = useState([])
    const navigate = useNavigate()
    const { token, logout } = useContext(AuthContext)

    const getTopics = () => {
        fetch('http://localhost:3000/topics', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((resp) => resp.json())
        .then((resp) => setArr(resp.topics))
        .catch((err) => console.log(err))
    }

    const logOut = () => {
        logout()
        navigate('/')
    }

    const editTopic = (id) => {
        navigate(`/form/${id}`)
    }

    const dltTopic = (id) => {
        fetch(`http://localhost:3000/topics/${id}/delete`, {
            mode: 'cors',
            method: 'POST',
        })
        .then((resp) => resp.json())
        .then((resp) => {
            console.log(resp)
            const updatedTopics = arr.filter((topic) => topic._id !== id)
            setArr(updatedTopics)
        })
        .catch((err) => console.log(err))
    }

    useEffect(() => {
        getTopics()
    },[])
    
    return(
        <>
            <button onClick={() => logOut()}>Log Out</button>
            <div>topics</div>
            <ul>
                {arr.length > 0 && arr.map((topic) => {
                    return(
                    <>
                        <div>
                            <p>{topic.title}</p>
                            <p>{topic.description}</p>
                            <button onClick={() => editTopic(topic._id)}>Edit</button>
                            <button onClick={() => dltTopic(topic._id)}>Delete</button>
                        </div>
                    </>
                    )
                })}
                <Link to='/form'>Add topic</Link>
            </ul>
        </>
    )
}

export default Topic