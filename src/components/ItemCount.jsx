import { useEffect, useState } from 'react';

const ItemCount = ({stock}) =>   {
  const [count, setCount] = useState(1);
  const [stockItem, setStockItem] = useState(stock);

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

  const onAdd = () => {
    if (stockItem >= count) {
      setStockItem(stockItem - count);
      alert(`Se han agregado ${count} productos al carrito`);
      setCount(1);
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
        <button className='' onClick={onAdd}>Agregar al carrito</button>
      </div>       
    </div>
  );
}

export default ItemCount;