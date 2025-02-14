import { useState, useEffect } from 'react';
// import itemsArray from './json/itemsArray.json';
import ItemDetail from './ItemDetail';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import Loading from './Loading';

const ItemDetailContainer = () => {
  const [visible, setVisible] = useState(true);
  const [item, setItem] = useState('');
  const {id} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const db = window.db;
    const docId = id.toString();
    const itemDocument = doc(db, 'items', docId);
    
    getDoc(itemDocument).then((doc) => {
      if (doc.exists()) {
        setItem({ id: doc.id, ...doc.data() });
        setVisible(false);
      } else {
        navigate('/404');
      }
    }).catch(error => {
      console.error("Error fetching data:", error);
      navigate('/404');
    });
  }, [id, navigate]);

  // Cargar producto desde archivo JSON
  // useEffect(() => {
  //   const promise = new Promise((resolve) => {
  //     setTimeout(() => {
  //       const product = itemsArray.find(item => item.id == id);

  //       if(!product){
  //         navigate('/404');
  //       } else {
  //       resolve(product);
  //     }}, 200);
  //   })
  //   promise.then((product) => {
  //     setItem(product);
  //   })
  // }, [id, navigate]);

  return (
    <div>
      <div className="hero bg-base-200 flex justify-center align-middle">
        {visible ? <Loading /> : <ItemDetail item={item} />}
      </div>   
    </div>
  );
}

export default ItemDetailContainer;