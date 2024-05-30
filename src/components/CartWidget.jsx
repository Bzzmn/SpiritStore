import { Link } from 'react-router-dom'
import { CartContext } from './context/CartContext'
import { useContext } from 'react'

const CartWidget = () => {

  const { getCountItems } = useContext(CartContext);

  if (getCountItems() > 0) {
    return (
      <div>
        <div className="dropdown dropdown-end">
          <Link type="button" tabIndex={0} role="button" className="btn btn-ghost btn-circle" to='/cart'>
            <div className="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <span className="badge bg-primary badge-lg indicator-item text-lg ">
                {getCountItems()}
              </span>
            </div>
          </Link>
        </div>
      </div>
    ) 
  }
}

export default CartWidget