import '../App.css'
import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'
import Navbar from './Navbar'

const Home = () => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])
  const { token } = useContext(AuthContext)

  const getPosts = () => {
    if (!token) {
      navigate('/')
    }
    fetch('https://still-pond-6102.fly.dev/admin/posts', {
        mode: 'cors',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        }
    })
    .then((resp) => resp.json())
    .then(function(response) {
      setPosts(response)
    })
    .catch(function(err) {
      console.log(err)
    })
  }
 
  useEffect(() => {
    getPosts()
  },[])

  useEffect(() => {
    const jayed = JSON.stringify(posts)
    console.log(`posts: ${jayed}`)
  },[posts])

  const deleter = (id) => {
    const updated = comments.filter((comment) => comment._id !== id)
    setComments(updated) 
  }

  const deleteComment = (id, user) => {
    fetch(`https://still-pond-6102.fly.dev/posts/${user}/comments/${id}/delete`, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ commentId: id })
        })
        .then((resp) => resp.json())
        .then((resp) => {
            console.log('deleted:' + resp)
            deleter(id)
            let updatedComments = []
            posts.map((post) => {
                post.comments.map((cmnt) => {
                    if (cmnt._id === id) {
                        updatedComments = post.comments.filter((cmnt) => cmnt._id !== id)
                        const copy = posts
                        copy.map((pst) => {
                          pst.comments.map((com) => {
                            if (com._id === id) {
                              pst.comments = updatedComments
                              setPosts(copy)
                            }
                          })
                          console.log('comment text:' + pst.comments[0].text)
                        })
                    } 
                }) 
            })
        })
        .catch((err) => console.log(err))
  }

  const editPost = (id) => {
    navigate(`/post-form/${id}/update`)
  }

  const deletePost = (id) => {
    fetch(`https://still-pond-6102.fly.dev/posts/${id}/delete`, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        }
    })
      .then((resp) => resp.json())
      .then((resp) => {
        console.log(resp)
        const updated = posts.filter((post) => post._id !== id)
        setPosts(updated)
      })
      .catch((err) => console.log(err))

  }

  const addPost = () => {
    navigate('/post-form')
  }

  return (
    <>
     <Navbar />
     <h1>Posts</h1>
     <button onClick={() => {addPost()}}>Add Post</button>
     <ul className='ulc'>
      {posts.length > 0 && posts.map((post) => {
        return(
          <>
            <li key={post._id} className='container'>
              <div className="post">
                <h3>{post.title}</h3>
                <p className='time'>{post.time}</p>
                <div className='text'>{post.text}</div>
                <div className="editNdlt">
                  <button onClick={() => {editPost(post._id)}} className='editPost'>Edit Post</button>
                  <button className='dltPost' onClick={() => {deletePost(post._id)}}>Delete Post</button>
                </div>
                {post.published ? <div className='yes'>PUBLISHED</div> : <div className='no'>NOT PUBLISHED</div>}
              </div>
              { post.comments.length > 0 ? <ul className="comments">
                  <h4>Comments</h4>
                  {post.comments.map((cmnt) => {
                      return(
                        <>
                          <li key={cmnt._id} className='cmnt'>
                            <div className='ctext'>
                                <p className='user'>{cmnt.sender.username}</p>
                                <p className='time'>{cmnt.time}</p>
                              <p className='txt'>{cmnt.text}</p>
                            </div>
                              <button className='dltCmnt' onClick={() => {deleteComment(cmnt._id, post._id)}}>Delete</button>
                          </li>
                        </>  
                      )  
                  })}
                </ul> : <p className='noComment'>No comments!</p>}
                
            </li>
          </> 
        )
      })}
     </ul>
    </>
  )
}

export default Home