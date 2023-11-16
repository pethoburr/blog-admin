import '../App.css'
import { useState, useEffect, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../App'

const Topic = () => {
    const [arr, setArr] = useState([])
    const [dltErr, setDltErr] = useState(null)
    const navigate = useNavigate()
    const { token, logout } = useContext(AuthContext)

    const getTopics = () => {
        if (!token) {
            navigate('/')
          }
        fetch('https://still-pond-6102.fly.dev/topics', {
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
        console.log('here' + id)
        fetch(`https://still-pond-6102.fly.dev/topics/${id}/delete`, {
            mode: 'cors',
            method: 'POST',
        })
        .then((resp) => resp.json())
        .then((resp) => {
            const fuck = JSON.stringify(resp)
            console.log('resp:' + fuck)
            if (resp.message) {
                console.log('resp' + resp.message)
                setDltErr(resp.message)
            } else {
                const updatedTopics = arr.filter((topic) => topic._id !== id)
                setArr(updatedTopics)
            }
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
                { dltErr && <p>{dltErr}</p>}
                <Link to='/form'>Add topic</Link>
            </ul>
        </>
    )
}

export default Topic