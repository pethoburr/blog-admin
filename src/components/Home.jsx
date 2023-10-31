import '../App.css'
import { useEffect, useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../App'

const Home = () => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])
  const { token, logout } = useContext(AuthContext)

  const getPosts = () => {
    console.log(`token: ${token}`)
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
      const ified = JSON.stringify(response)
      console.log(`comments: ${ified.comments}`)
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
    console.log(`posts on each update: ${jayed}`)
  },[posts])

  const logOut = () => {
    logout()
    navigate('/')
  }

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
                        //copy[post].comments = updatedComments
                        //setPosts(copy)
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
     <button onClick={() => logOut()}>Logout</button>
     <Link to='/topic'>Topics</Link>
     <button onClick={() => {addPost()}}>Add Post</button>
     <h1>Posts</h1>
     <ul>
      {posts.length > 0 && posts.map((post) => {
        return(
          <>
            <li key={post._id} >
                <div>{post.title}: {post.text}</div>
                {post.comments.map((cmnt) => {
                    return(
                      <>
                        <div key={cmnt._id}>{cmnt.sender}:{cmnt.text}|{cmnt.time}<button onClick={() => {deleteComment(cmnt._id, post._id)}}>Delete</button></div>
                      </>  
                    )  
                })}
                <button onClick={() => {editPost(post._id)}}>Edit Post</button><button onClick={() => {deletePost(post._id)}}>Delete Post</button>
            </li>
          </> 
        )
      })}
     </ul>
    </>
  )
}

export default Home