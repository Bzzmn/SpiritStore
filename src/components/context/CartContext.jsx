import { createContext, useState } from 'react';

export const CartContext = createContext();

const CartContextProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const isInCart = (id) => {
        return cart.some(i => i.id === id);
    }
    
    const addItem = (item, quantity) => {
        if (isInCart(item.id)) {
            const newCart = cart.map(i => {
                if (i.id === item.id) {
                    return { item: i.name, quantity: i.quantity + quantity }
                } else {
                    return i;
                }
            });
            setCart(newCart);
        } else {
            setCart([...cart, { ...item, quantity: quantity }]);
        }
    }

    const removeItem = (itemId) => {
        const newCart = cart.filter(i => i.id !== itemId);
        setCart(newCart);
    }

    const clear = () => {
        setCart([]);
    }
    
    const getCountItems = () => {
        return cart.reduce((acc, i) => acc + i.quantity, 0);
    }

    const getSumPrice = () => {
        return cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
    }

    return (
        <CartContext.Provider value={{ cart, addItem, removeItem, clear, getCountItems, getSumPrice }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartContextProvider;
