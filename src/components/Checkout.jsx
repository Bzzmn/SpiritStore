import { useState, useContext, useEffect } from 'react';
import { CartContext } from './context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore } from 'firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';

const Checkout = () => {
    const { cart, getSumPrice, getCountItems, clear } = useContext(CartContext);

    const [errors, setErrors] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: ''
    });

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [orderId, setOrderId] = useState('');
    const [counter, setCounter] = useState(5);

    const navigate = useNavigate();

    const generateOrder = () => {

        if (!validate()) return;

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

    const validate = () => {
        let tempErrors = {};
        tempErrors.firstname = firstname ? '' : 'First name is required';
        tempErrors.lastname = lastname ? '' : 'Last name is required';
        tempErrors.email = email ? (/\S+@\S+\.\S+/.test(email) ? '' : 'Email is not valid') : 'Email is required';
        tempErrors.phone = phone ? (phone.length === 10 ? '' : 'Phone number must be 10 digits') : 'Phone number is required';
        setErrors(tempErrors);

        return Object.values(tempErrors).every(x => x === "");
    }

    useEffect(() => {
        if (orderId) {
            const interval = setInterval(() => {
                setCounter(prevCounter => prevCounter - 1); 
            }, 1000);
    
            setTimeout(() => {
                clearInterval(interval); 
                clear();                
                navigate('/');           
            }, 5000);  
    
            return () => clearInterval(interval);  
        }
    }, [orderId, navigate, clear]);



    if (getCountItems() === 0) {
        return (
            <div className='flex flex-col justify-center max-w-md text-center mx-auto '>
           
                <p>Your cart is empty</p>
                <Link className='btn btn-primary mt-2' type='button' to='/'>Return to store</Link>
            </div>
        )
    } 

    return (
        <div className='px-4'>

            {orderId && (

                            <div role="alert" className="alert alert-success my-5 max-w-5xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>
                                <p>Tu compra ha sido confirmada!</p>
                                <p>Tu numero de orden es: {orderId}</p>
                                <p>Te redigiremos a la tienda en {counter} segudos</p>
                            </span>
                            </div>

                        )}

            <div className='justify-center grid md:grid-cols-2 mx-auto gap-8 max-w-5xl' >
                <form className="w-full max-w-lg justify-end">
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                            First Name
                        </label>
                        <input 
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                            id="grid-first-name" 
                            type="text" 
                            placeholder="Jane" 
                            onInput={(e) => {setFirstname(e.target.value)}} 
                            onBlur={validate} />
                        <p className="text-red-500 text-xs italic">{errors.firstname}</p>
                        </div>
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                            Last Name
                        </label>
                        <input 
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                            id="grid-last-name" 
                            type="text" 
                            placeholder="Doe" 
                            onInput={(e) => {setLastname(e.target.value)}} 
                            onBlur={validate} />
                            <p className="text-red-500 text-xs italic">{errors.lastname}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                            Email
                        </label>
                        <input 
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                            id="grid-password" 
                            type="email" 
                            placeholder="janedoe@mail.com" 
                            onInput={(e) => {setEmail(e.target.value)}}
                            onBlur={validate} />
                            <p className="text-red-500 text-xs italic">{errors.email}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                            Phone
                        </label>
                        <input 
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                            id="grid-password" 
                            type="phone" 
                            placeholder="9876543210" 
                            onInput={(e) => {setPhone(e.target.value)}}
                            onBlur={validate} />
                            <p className="text-red-500 text-xs italic">{errors.phone}</p>
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
                                <td>${item.price.toFixed(2)}</td>
                            </tr>           
                                ))
                            }

                            <tr>
                                <td colSpan='2'>Total</td>
                                <td>${getSumPrice().toFixed(2)}</td>
                            </tr>

                        </tbody>
                    </table>
                    <button type='button' className='btn btn-primary mt-2 w-full' onClick={generateOrder}>Complete purchase</button>

            
                </div>
                
            </div>

        </div>
    )
}

export default Checkout;
