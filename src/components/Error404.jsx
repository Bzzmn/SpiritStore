import { Link } from 'react-router-dom';

const Error404 = () => {
  return (
    <div className='flex flex-col items-center flex-grow justify-center'>
      <h1 className='text-3xl'>Error 404</h1>
      <p>Ouch! Pagina no econtrada ...</p>
      <img className='py-10' src="https://midu.dev/images/this-is-fine-404.gif" />
      <p><Link to={"/"} className='btn btn-primary'>Volver al inicio</Link></p>
    </div>
  );
}

export default Error404;