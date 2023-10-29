import '../App.css'
import { useState, useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../App'

const Postform = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [topics, setTopics] = useState('')
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [topic, setTopic] = useState(undefined)
    const [published, setPublished] = useState(false)
    const { token } = useContext(AuthContext)

    const getTopics = () => {
        fetch('http://localhost:3000/topics', {
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((resp) => resp.json())
            .then((resp) => {
                console.log(resp)
                setTopics(resp.topics)
            })
            .catch((err) => console.log(err))
    }

    const editing = () => {
        fetch(`http://localhost:3000/posts/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((resp) => resp.json())
            .then((resp) => {
                console.log('rn post' + resp.post.topic._id)
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
        console.log('id on mount' + id)
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
        console.log('post form submitted')
        console.log('id' + id)
        e.preventDefault()
        if (id) {
            fetch(`http://localhost:3000/posts/${id}/update`, {
                mode: 'cors',
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ title, text, topic, published })
            })
            .then((resp) => resp.json())
            .then((resp) => {
                console.log(resp)
                navigate('/home')
            })
            .catch((err) => console.log(err))
        } else {
            fetch('http://localhost:3000/posts/create', {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ title, text, topic, published })
        })
        .then((resp) => resp.json())
        .then((resp) => {
            console.log(`form submit response: ${resp}`)
            navigate('/home')
        })
        .catch((err) => console.log(err))
        }
    }

    return(
        <>
            <form onSubmit={(e) => {handleSubmit(e)}}>
                <label htmlFor='title'>Title:
                    <input type='text' name='title' id='title' required placeholder='enter title' value={title ? title : ''} onChange={(e) => {handleTitleChange(e)}} />
                </label>
                <label htmlFor='text'>text:
                    <input type='text' name='text' id='text' required placeholder='enter text' value={text ? text : ''} onChange={(e) => {handleTextChange(e)}} />
                </label>
                <label htmlFor='topic'>topic:
                    <select type='text' name='topic' id='topic' required value={topic} onChange={(e) => {handleTopicChange(e)}}>
                       {topics.length > 0 && topics.map((ting) => {
                            return(
                                <>
                                    <option></option>
                                    <option value={ting._id}>{ting.title}</option>
                                </>
                            )
                       })}
                    </select>
                </label>
                <label htmlFor='published'>published:
                    <input type='checkbox' name='published' id='published' value={published ? published : ''} onChange={(e) => {handlePublishedChange(e)}} />
                </label>
                <button type='submit'>Submit</button>
            </form>
        </>
    )
}

export default Postform