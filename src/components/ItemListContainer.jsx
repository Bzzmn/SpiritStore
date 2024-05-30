// import itemsArray from './json/itemsArray.json';
import { useState, useEffect } from 'react';
import ItemList from './ItemList';
import { useParams, useNavigate } from 'react-router-dom';
import { getDocs, collection, getFirestore } from 'firebase/firestore';
// import { addDoc } from 'firebase/firestore';
import Loading from './Loading';

const ItemListContainer = ({ greeting }) => {
  const [items, setItems] = useState([]);
  const [visible, setVisible] = useState(true);

  const {id, subId}  = useParams();
  const navigate = useNavigate();

// Cargar productos desde archivo JSON
  // useEffect(() => {
  //   const promise = new Promise((resolve) => {
  //     setTimeout(() => {
        
  //       const filteredItems = 
  //         id && subId ? itemsArray.filter(item => item.category === id && item.subcategory === subId) 
  //         : id ? itemsArray.filter(item => item.category === id) 
  //         : itemsArray;
          
  //       if(id && filteredItems.length === 0){
  //         navigate('/404');
  //       } else {
  //         resolve(filteredItems);
  //       }
  //     }, 200);
  //   })
  //   promise.then((data) => {
  //     setItems(data);
  //   })
  // }, [id, subId, navigate]);
  
// Cargar todos los productos a la base de datos
  // const loadItems = () => {
  //   const db = getFirestore();
  //   const itemsCollection = collection(db, 'items');

  //   itemsArray.forEach(item => {
  //     addDoc(itemsCollection, item);
  //   })
  // }

  useEffect(() => {
    const db = getFirestore();
    const itemsCollection = collection(db, 'items');
    
    getDocs(itemsCollection).then((querySnapshot) => {
      const allItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const filteredItems = 
        id && subId ? allItems.filter(item => item.category === id && item.subcategory === subId) 
        : id ? allItems.filter(item => item.category === id) 
        : allItems;
  
      if (id && filteredItems.length === 0) {
        navigate('/404');
      } else {
        setItems(filteredItems);
        setVisible(false);
      }
    }).catch(error => {
      console.error("Error fetching data: ", error);
      navigate('/404'); 
    });
  }, [id, subId, navigate]);


  return (
    <>
      <div className="hero min-h-[50%] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">{ greeting } </h1>
            <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        
        </div>
      </div>  
      {visible?<Loading />:<ItemList items={items} />} 
    </>
  )
}
export default ItemListContainer;