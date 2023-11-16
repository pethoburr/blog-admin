/* eslint-disable no-unused-vars */
import '../App.css'
import { useState, useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../App'
import Navbar from './Navbar'

const Postform = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [topics, setTopics] = useState('')
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [topic, setTopic] = useState(undefined)
    const [published, setPublished] = useState(false)
    const { token } = useContext(AuthContext)
    const date = new Date();

    const getTopics = () => {
        fetch('https://still-pond-6102.fly.dev/topics', {
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((resp) => resp.json())
            .then((resp) => {
                setTopics(resp.topics)
            })
            .catch((err) => console.log(err))
    }

    const editing = () => {
        fetch(`https://still-pond-6102.fly.dev/posts/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((resp) => resp.json())
            .then((resp) => {
                setTitle(resp.post.title)
                setText(resp.post.text)
                setTopic(resp.post.topic._id)
                setPublished(resp.post.published)
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            getTopics()
        }
        if (id) {
            editing()
        }
    },[])

    const handleTitleChange = (e) => {
        setTitle(e.target.value)
    }

    const handleTextChange = (e) => {
        setText(e.target.value)
    }

    const handleTopicChange = (e) => {
        setTopic(e.target.value)
    }
    const handlePublishedChange = (e) => {
        setPublished(e.target.checked)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (id) {
            fetch(`https://still-pond-6102.fly.dev/posts/${id}/update`, {
                mode: 'cors',
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ title, text, date, topic, published })
            })
            .then((resp) => resp.json())
            .then((resp) => {
                navigate('/home')
            })
            .catch((err) => console.log(err))
        } else {
            fetch('https://still-pond-6102.fly.dev/posts/create', {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ title, text, date, topic, published })
        })
        .then((resp) => resp.json())
        .then((resp) => {
            navigate('/home')
        })
        .catch((err) => console.log(err))
        }
    }

    return(
        <>
        <Navbar />
        <div className="postformContainer">
        <form className='postForm' onSubmit={(e) => {handleSubmit(e)}}>
            <h1>{ title === '' ? 'Add Post' : 'Update Post'}</h1>
                <div className="form-floating">
                <input type='text' name='title' id='title' className='form-control' required placeholder='enter title' value={title ? title : ''} onChange={(e) => {handleTitleChange(e)}} />
                    <label htmlFor='title'>Title </label>
                </div>
                 <div className="form-floating">
                 <textarea type='text' name='text' id='text' className='form-control' required placeholder='enter text' value={text ? text : ''} onChange={(e) => {handleTextChange(e)}} />
                    <label htmlFor='text'>text</label>
                </div>
                <label htmlFor='topic'>topic 
                    <select type='text' name='topic' className='form-select' id='topic' required value={topic} onChange={(e) => {handleTopicChange(e)}}>
                        {topics.length > 0 && topics.map((ting) => {
                            return(
                                <>
                                    <option value={ting._id}>{ting.title}</option>
                                </>
                            )
                        })}
                    </select>
                </label>
                <label htmlFor='published'>published
                    <input type='checkbox' name='published' id='published' defaultChecked={published} onChange={(e) => {handlePublishedChange(e)}} />
                </label>
                <button type='submit' className='submitBtn'>Submit</button>
            </form>
        </div>  
        </>
    )
}

export default Postform