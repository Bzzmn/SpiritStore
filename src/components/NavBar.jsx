import CartWidget from "./CartWidget";

const NavBar = () => {
  return (
    <div>

  <div className="navbar bg-base-100 px-10 max-w-5xl mx-auto">
  <div className="navbar-start flex justify-between lg:justify-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 " fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
      </div>
      <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
   
        <li>
          <a>Zapatillas</a>
          <ul className="p-2">
            <li><a>Deportivas</a></li>
            <li><a>Urbanas</a></li>
          </ul>
        </li>
        <li><a>Poleras</a></li>
        <li><a>Hoodies</a></li>
        <li><a>Pantalones</a></li>
      </ul>
    </div>
    <a className="logo p-0 flex translate-x-24 lg:translate-x-0"><img src="/src/assets/Grunge-Graffiti-Logo.svg" alt=""  /></a>
  </div>
  <div className="navbar-center hidden lg:flex ">
    <ul className="menu menu-horizontal px-1">
      <li>
        <details>
          <summary>Zapatillas</summary>
          <ul className="p-2">
            <li><a>Deportivas</a></li>
            <li><a>Urbanas</a></li>
          </ul>
        </details>
      </li>
      <li><a>Poleras</a></li>
      <li><a>Hoodies</a></li>
      <li><a>Pantalones</a></li>
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



