import Layout from './Layout';
import Home from './Home';
import NewPost from './NewPost';
import PostPage from './PostPage';
import About from './About';
import Missing from './Missing';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {format} from 'date-fns'
import api from './api/posts';
import EditPage from './EditPage';
import useWindowSize from './hooks/useWindowSize';
import useAxiosFetch from './hooks/useAxiosFetch';
import { DataProvider } from './context/DataContext';

function App() {
  //const [posts, setPosts] = useState(JSON.parse(localStorage.getItem('postslist')) || [])
  //locally store data
  // useEffect(() => {
  //   localStorage.setItem('postslist', JSON.stringify(posts))
  // }, [posts])
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const { width } = useWindowSize();

  const { data, fetchError, isLoading } = useAxiosFetch('http://localhost:3500/posts');
  
  useEffect(() => {
    setPosts(data);
  }, [data])
  // useEffect(() => {
  //   const fetchPosts = async() => {
  //     try {
  //       const response = await api.get('./posts')
  //       if(response && response.data) setPosts(response.data)
      
  //     } catch (err) {
  //       if(err.response){
  //         //not in the 200 response range
  //         console.log(err.response.data);
  //         console.log(err.response.status);
  //         console.log(err.response.headers);
  //       } else{
  //         console.log(`Error: ${err.message}`);
  //       }
  //     }
  //   }
  //   fetchPosts()
  // }, [])

  useEffect(() => {
    const filterResults = posts.filter((post) =>
      ((post.body).toLowerCase()).includes(search.toLowerCase())
      || ((post.title).toLowerCase()).includes(search.toLowerCase()))
    setSearchResults(filterResults.reverse())
  }, [posts, search])

  const handleDelete = async (id) => {
    try{
      await api.delete(`/posts/${id}`)
      const postList = posts.filter(post => post.id !== id)
      setPosts(postList)
      navigate('/')
    } catch (err) {
      console.log(`Error:${err.message}`);
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const id = posts.length ? posts[posts.length -1].id +1 : 1
    const dateTime = format(new Date(), 'MMMM dd, yyyy pp')
    const newPost = {id, title: postTitle, dateTime, body: postBody}
    try {
      const response =  await api.post('/posts', newPost)
      setPosts([...posts, response.data])
      setPostTitle('')
      setPostBody('')
      navigate('/')
    } catch (err) {
      console.log(`Error:${err.message}`);
    }
  }
  const handleEdit = async(id) => {
    const dateTime = format(new Date(), 'MMMM dd, yyyy pp')
    const updatePost = {id, title: editTitle, dateTime, body: editBody}
    try {
      const response = api.put(`/posts/${id}`, updatePost)
      setPosts(posts.map(post => post.id === id ? {...response.data} : post))
      setEditBody('')
      setEditTitle('')
      navigate('/')
    }catch (err) {
      console.log(`Error:${err.message}`);
    }
  }

  return (
      <Routes>
        <Route path="/" element={<Layout
          search={search}
          setSearch={setSearch}
          width={width}/>}
         >
          <Route index element={<Home posts={searchResults} fetchError={fetchError} isLoading={isLoading}/>} />
          <Route path='post'>
            <Route index element={
              <NewPost handleSubmit={handleSubmit}
              postTitle= {postTitle}
              setPostTitle = {setPostTitle}
              postBody={postBody}
              setPostBody={setPostBody} />} 
              />
            <Route path=':id' element={
              <PostPage posts={posts} 
              handleDelete={handleDelete}/>} 
              />
          </Route>

          <Route path='edit/:id' element={
              <EditPage
                posts={posts}
                handleEdit={handleEdit}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                editBody={editBody}
                setEditBody={setEditBody}/>}
            />
          <Route path='about' element={<About />} />
          <Route path='*' element={<Missing />} />
        </Route>
      </Routes>
     
    
  )}
export default App;
