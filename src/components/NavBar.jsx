import CartWidget from "./CartWidget";
import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/logo-white.png';

const NavBar = () => {
  return (
  <div className="z-10 sticky top-0 w-full bg-[#1d232a]">
  <div className="navbar w-full bg-base-100 px-10 max-w-5xl mx-auto ">
  <div className="navbar-start flex justify-between lg:justify-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 " fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
      </div>
      <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
   
        <li>
          <NavLink to={'/category/zapatillas'}>Zapatillas</NavLink>
          <ul className="p-2">
            <li><NavLink to={'/category/zapatillas/deportivas'}>Deportivas</NavLink></li>
            <li><NavLink to={'/category/zapatillas/urbanas'}>Urbanas</NavLink></li>
          </ul>
        </li>
        <li><NavLink to={'/category/poleras'}>Poleras</NavLink></li>
        <li><NavLink to={'/category/hoodies'}>Hoodies</NavLink></li>
        <li><NavLink to={'/category/pantalones'}>Pantalones</NavLink></li>
      </ul>
    </div>
    <Link className="logo p-0 flex translate-x-24 lg:translate-x-0" to={'/'}><img src={logo} alt="logo" /></Link>
  </div>
  <div className="navbar-center hidden lg:flex ">
    <ul className="menu menu-horizontal px-1">
      <li>
        <details>
          <summary><NavLink to={'/category/zapatillas'}>Zapatillas</NavLink></summary>
          <ul className="p-2">
            <li><NavLink to={'/category/zapatillas/deportivas'}>Deportivas</NavLink></li>
            <li><NavLink to={'/category/zapatillas/urbanas'}>Urbanas</NavLink></li>
          </ul>
        </details>
      </li>
      <li><NavLink to={'/category/poleras'}>Poleras</NavLink></li>
      <li><NavLink to={'/category/hoodies'}>Hoodies</NavLink></li>
      <li><NavLink to={'/category/pantalones'}>Pantalones</NavLink></li>
    </ul>
  </div>
  <div className="navbar-end">
  <CartWidget />
  </div>
</div>
</div>

  );
};
export default NavBar;



