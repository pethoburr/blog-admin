import '../App.css'
import { useState, useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../App'

const TopicForm = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const { token, logout } = useContext(AuthContext)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (id) {
            fetch(`http://localhost:3000/topics/${id}/update`, {
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
            fetch('http://localhost:3000/topics/create', {
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

    const logOut = () => {
        logout()
        navigate('/')
    }

    const editing = () => {
        fetch(`http://localhost:3000/topics/${id}`, {
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

    return(
        <>
            <button onClick={() => logOut()}>Log out</button>
            <div>topic form</div>
            <form onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor='title'>Title:
                    <input type='text' id='title' name='title' value={title ? title : ''} onChange={(e) => handleTitleChange(e)} placeholder='enter topic name' />
                </label>
                <label htmlFor='description'>Description:
                    <input type='text' id='description' name='description' value={description ? description : ''} onChange={(e) => handleDescriptionChange(e)} placeholder='enter topic description' />
                </label>
                <button type='submit'>Submit</button>
            </form>
        </>
    )
}

export default TopicForm