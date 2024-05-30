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
            <div className="flex justify-between my-3">
                <h1 className='text-3xl' >Cart</h1>
                <button className='btn btn-error' onClick={() => clear()}>Empty cart <img src={emptyCart} alt="" /></button>
            </div>
           
            <div>
                {cart.map((i) => (
                    <div key={i.id} className='flex justify-between'>
                        <p>{i.name} x {i.quantity}</p>
                        <p>${i.price * i.quantity}</p>
                        <button className='btn btn-error' onClick={() => removeItem(i.id)}>Remove <img src={trash} alt="" /></button>
                    </div>
                ))}
                Total: ${getSumPrice()}
            </div>
            <div>
                <Link className='btn btn-primary mt-5 w-full' type='button' to='/checkout'>Checkout</Link>
            </div>     
        </div>
    )
}

export default Cart;