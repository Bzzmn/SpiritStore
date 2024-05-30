import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ItemCount = ({stock, onAdd}) =>   {
  const [count, setCount] = useState(1);
  const [stockItem, setStockItem] = useState(stock);
  const [visible, setVisible] = useState(true);

  const add = () => {
    if (count < stock){
      setCount(count + 1);
    }

    else if (count === stock){
      alert('No hay más stock disponible');
    }
  }
  const subtract = () => {
    if (count > 1)
    setCount(count - 1);
  }

  const addToCart = () => {
    if (stockItem >= count) {
      setStockItem(stockItem - count);
      onAdd(count);
      setCount(1);
      setVisible(false)
    }
    else {
      alert('No hay suficiente stock');
    }
  }

  useEffect(() => {
    setStockItem(stock);  
  }, [stock])

  return (
    <div>
      <div className='w-full flex justify-between'>
        <button className='w-[30%] h-8 bg-primary rounded-l-lg text-xl text-black' onClick={subtract}>-</button>
        <button className='h-8 w-[40%] bg-base-200'>{count}</button>
        <button className='w-[30%] h-8 bg-primary rounded-r-lg text-black' onClick={add}>+</button>
      </div>
      <div className='btn btn-primary mt-2'>
        {visible?<button className='' onClick={addToCart}>Agregar al carrito</button>
        :<Link className='' to="/cart">Finalizar compra</Link>}
      </div>       
    </div>
  );
}

export default ItemCount;