import { CartContext } from "./context/CartContext";
import { Link } from "react-router-dom";
import { useContext } from "react";
import trash from '../assets/icons/trash.svg';
import emptyCart from '../assets/icons/empty-cart.svg';

const Cart = () => {

    const { cart, removeItem, clear, getCountItems, getSumPrice } = useContext(CartContext);

    if (getCountItems() === 0) {
        return (
            <div>
                <h1>Cart</h1>
                <p>Your cart is empty</p>
                <Link className='btn btn-primary mt-2' type='button' to='/'>Volver a la tienda</Link>
            </div>
        )
    }
    return (
        <div>
            <div className="max-w-4xl flex flex-col mx-auto px-5">
            <div className="flex justify-between my-3">
                <h1 className='text-3xl' >Carro de compras</h1>
                <button className='btn btn-error' onClick={() => clear()}>Vaciar carro <img src={emptyCart} alt="" /></button>
            </div>
           
            <div>
                {cart.map((i) => (
                    <div key={i.id} className='flex justify-between py-1'>
                        <p>{i.name} x {i.quantity}</p>
                        <p>${(i.price * i.quantity).toFixed(2)}</p>
                        <button className='btn btn-error' onClick={() => removeItem(i.id)}>Eliminar <img src={trash} alt="" /></button>
                    </div>
                ))}
                Total: ${getSumPrice().toFixed(2)}
            </div>
            <div>
                <Link className='btn btn-primary mt-5 w-full' type='button' to='/checkout'>Finalizar compra</Link>
            </div>     
        </div>

        </div>
       
    )
}

export default Cart;