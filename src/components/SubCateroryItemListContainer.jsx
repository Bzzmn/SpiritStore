import itemsArray from './json/itemsArray.json';
import { useState, useEffect } from 'react';
import ItemList from './ItemList';
import { useParams } from 'react-router-dom';

const SubCategoryItemListContainer = ({ greeting }) => {
  const [items, setItems] = useState([]);
  const {id, subId}  = useParams();
 
  useEffect(() => {
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve( id ? itemsArray.filter(item => item.category === id && item.subcategory === subId) : itemsArray);
      }, 200);
    })
    promise.then((data) => {
      setItems(data);
    })
  }, [id, subId]);

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
      <ItemList items={items} /> 
    </>
  )
}
export default SubCategoryItemListContainer;