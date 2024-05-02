import { useState, useEffect } from 'react';
import itemsArray from './json/itemsArray.json';
import ItemDetail from './ItemDetail';
import { useParams, useNavigate } from 'react-router-dom';

const ItemDetailContainer = () => {
  const [item, setItem] = useState('');
  const {id} = useParams();
  const navigate = useNavigate();
 
  useEffect(() => {
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        const product = itemsArray.find(item => item.id == id);

        if(!product){
          navigate('/404');
        } else {
        resolve(product);
      }}, 200);
    })
    promise.then((product) => {
      setItem(product);
    })
  }, [id, navigate]);

    return (
        <div>
          <div className="hero bg-base-200">
              <ItemDetail item={item} />
          </div>   
        </div>
    )}
export default ItemDetailContainer;