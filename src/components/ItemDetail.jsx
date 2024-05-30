import ItemCount from './ItemCount';
import { CartContext } from './context/CartContext';
import { useContext } from 'react';

const ItemDetail = ({ item }) => {

  const { addItem } = useContext(CartContext);

  const onAdd = (count) => {
    addItem(item, count);
    console.log(`Se han agregado ${count} productos al carrito`);
  }


  return (
      <div className="card md:card-side bg-base-100 my-10 shadow-xl">
        <figure className='max-w-lg'><img  className='' src={item.img} alt={item.name}/></figure>
        <div className="card-body">
          <h2 className="card-title">{item.name}</h2>
          <p>{item.description}</p>
          <p className='text-2xl font-semibold'>U${parseFloat(item.price).toFixed(2)}</p>
          <p className='pb-5'>ultimas {item.stock} unidades disponibles</p>
          <div className="card-actions justify-start">
            <ItemCount stock={item.stock} onAdd={onAdd}/>
          </div>
        </div>
      </div>
  );
}

export default ItemDetail;


{/* <h2>{item.name}</h2>
<p>{item.description}</p>
<p>{item.price}</p>
<img src={item.img} alt={item.name} />
<p>stock: {item.stock}</p> */}