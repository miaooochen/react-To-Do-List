import Header from './Header';
import SearchItem from './SearchItem';
import AddItem from './AddItem';
import Content from './Content';
import Footer from './Footer';
import { useState, useEffect } from "react";

function App() {
  
  const API_URL = 'http://localhost:3500/items';
  const [items, setItems] = useState(JSON.parse(localStorage.getItem('shoppinglist')) || []);
  const [newItem, setNewItem] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
      localStorage.setItem('shoppinglist', JSON.stringify(items))
    }, [items])

  const handleCheck = (id) => {
    const listItems = items.map((item) => 
        {return item.id === id ? {...item, checked: !item.checked} : item})
        setItems(listItems);
  };

  const handleDelete = (id) => {
    const listItems = items.filter((item) => item.id !== id)
    setItems(listItems);
  };


  const addItem = (item) => {
    const id = items.length ? items[items.length -1].id +1 : 1
    const mynewItem = {id, checked: false, item}
    const listItems = [...items, mynewItem]
    setItems(listItems);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log('submitted')
    if (!newItem) return;
    addItem(newItem);
    setNewItem('');
  };

  return (
    <div className="App">
      <Header title="Grocery List"/>
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem
        search={search}
        setSearch={setSearch}
      />
      <Content 
        items={items.filter(item => ((item.item).toLowerCase()).includes(search.toLowerCase()))}
        handleCheck = {handleCheck}
        handleDelete = {handleDelete}
        />
      <Footer length={items.length}/>
    </div>
  );
}

export default App;
