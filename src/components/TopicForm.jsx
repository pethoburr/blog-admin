import '../App.css'
import { useState, useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../App'
import Navbar from './Navbar'

const TopicForm = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [titleError, setTitleError] = useState(false)
    const [descriptionErr, setDescriptionErr] = useState(false)
    const { token } = useContext(AuthContext)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (id) {
            fetch(`https://still-pond-6102.fly.dev/topics/${id}/update`, {
                mode: 'cors',
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            })
                .then((resp) => resp.json())
                .then((resp) => {
                    console.log(resp)
                    navigate('/topic')
                })
                .catch((err) => console.log(err))
        } else {
            fetch('https://still-pond-6102.fly.dev/topics/create', {
                mode: 'cors',
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            })
            .then(resp => resp.json())
            .then((resp) => {
                console.log(resp)
                navigate('/home')
            })
            .catch(err => console.log(err))
        }
    }

    const handleTitleChange = (e) => {
        setTitle(e.target.value)
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value)
    }

    const editing = () => {
        fetch(`https://still-pond-6102.fly.dev/topics/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(resp => resp.json())
        .then((resp) => {
            console.log('getting edit:' + resp)
            setTitle(resp.topic.title)
            setDescription(resp.topic.description)
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
        console.log('id:' + id)
        if (id) {
            editing()
        }
    },[])

    useEffect(() => {
        if (title === '') {
            setTitleError(true)
        } else {
            setTitleError(false)
        }

        if (description === '') {
            setDescriptionErr(true)
        } else {
            setDescriptionErr(false)
        }
    },[title, description])

    return(
        <>
            <Navbar />
            <div className='topicForm'>
                <form className='tf' onSubmit={(e) => handleSubmit(e)}>
                    <h1>{ id ? 'Update Topic' : 'Add Topic'}</h1>
                    <div className="form-floating">
                        <input type='text' id='title' className={ titleError ? 'form-control is-invalid' : 'form-control is-valid'} name='title' value={title ? title : ''} onChange={(e) => handleTitleChange(e)} placeholder='enter topic name' />
                        <label htmlFor='title'>Title</label>
                    </div>
                    <div className="form-floating">
                        <input type='text' id='description' className={ descriptionErr ? 'form-control is-invalid' : 'form-control is-valid'} name='description' value={description ? description : ''} onChange={(e) => handleDescriptionChange(e)} placeholder='enter topic description' />
                        <label htmlFor='description'>Description</label>
                    </div>  
                    <button type='submit' className='submitBtn'>Submit</button>
                </form>
            </div>
        </>
    )
}

export default TopicForm