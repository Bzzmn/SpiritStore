import { useState, useContext, useEffect } from 'react';
import { CartContext } from './context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore } from 'firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';

const Checkout = () => {
    const { cart, getSumPrice, getCountItems, clear } = useContext(CartContext);

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [orderId, setOrderId] = useState('');
    const navigate = useNavigate();

    const generateOrder = () => {
        const buyer = { firstname:firstname, lastname:lastname, email:email, phone:phone };
        const items = cart.map(i => ({ id: i.id, title: i.name, price: i.price, quantity: i.quantity }));
        const date = new Date();
        const dateOrder = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        const order = { buyer:buyer, items:items, date:dateOrder, total: getSumPrice() };

        const db = getFirestore();
        const ordersCollection = collection(db,'orders');
        addDoc(ordersCollection, order).then( data => {
            setOrderId(data.id);
        }).catch((err) => {
            console.log(err);
        }); 
    }

    useEffect(() => {
        if (orderId) {
            setTimeout(() => {
                clear();
                navigate('/');
            }, 5000); // 5000 milisegundos = 5 segundos
        }
    }, [orderId, navigate, clear]);



    if (getCountItems() === 0) {
        return (
            <div>
                <h1>Checkout</h1>
                <p>Your cart is empty</p>
                <Link classNameName='btn btn-primary mt-2' type='button' to='/'>Return to store</Link>
            </div>
        )
    } 

    return (
        <>
            <div className='container justify-center grid md:grid-cols-2 '>
                <form className="w-full max-w-lg">
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                            First Name
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" onInput={(e) => {setFirstname(e.target.value)}} />
                        <p className="text-red-500 text-xs italic">Please fill out this field.</p>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                            Last Name
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Doe" onInput={(e) => {setLastname(e.target.value)}} />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                            Email
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="email" placeholder="janedoe@mail.com" onInput={(e) => {setEmail(e.target.value)}}/>
        
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                            Phone
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="phone" placeholder="999999999999" onInput={(e) => {setPhone(e.target.value)}}/>
                        </div>
                    </div>

             
                </form>
                <div>
                    <table className='table'>
                        <tbody>
                            {
                                cart.map((item, index) => (
                            <tr key={index}>
                                <td><img src={item.img} alt={item.name} width={80}/></td>
                                <td>{item.name} X {item.quantity}</td>
                                <td>${item.price}</td>
                            </tr>           
                                ))
                            }

                        </tbody>
                    </table>
                </div>
                <button type='button' className='btn btn-primary mt-2 md:w-1/2' onClick={generateOrder}>Complete purchase</button>

                {orderId && (
                    <div>
                        <p>Your order has been processed successfully.</p>
                        <p>Your order number is: {orderId}</p>
                    </div>
                )}

            </div>

        </>
    )
}

export default Checkout;
