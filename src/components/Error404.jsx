import { Link } from 'react-router-dom';

const Error404 = () => {
  return (
    <div>
      <h1>Error 404</h1>
      <p>Page not found</p>
      <p><Link to={"/"} className='btn btn-primary'>Volver al inicio</Link></p>
    </div>
  );
}

export default Error404;