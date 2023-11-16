import '../App.css'
import { useState, useEffect, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../App'
import Navbar from './Navbar'

const Topic = () => {
    const [arr, setArr] = useState([])
    const [dltErr, setDltErr] = useState(null)
    const navigate = useNavigate()
    const { token } = useContext(AuthContext)

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
            <Navbar />
            <div className="topiContainer">
                <h1>topics</h1>
                <Link to='/form' className='addTopic'>Add topic</Link>
                <ul className='topicList'>
                    {arr.length > 0 && arr.map((topic) => {
                        return(
                        <>
                            <li className='topicItem'>
                                <div className="tnd">
                                    <p className='topicTitle'>{topic.title}</p>
                                    <p className='topicDescription'>{topic.description}</p>
                                </div>
                                <div className="btns">
                                    <button onClick={() => editTopic(topic._id)}>Edit</button>
                                    <button onClick={() => dltTopic(topic._id)}>Delete</button>
                                </div>
                            </li>
                        </>
                        )
                    })}
                    { dltErr && <p>{dltErr}</p>} 
                </ul>
            </div>
        </>
    )
}

export default Topic