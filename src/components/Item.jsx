import { Link } from "react-router-dom";

const ItemCard = ({ item }) => {
  return (
      <div className="card w-96 bg-base-100 shadow-xl">
        <Link to={'/item/' + item.id}>
          <figure><img src={item.img} alt={item.name} /></figure>
          <div className="card-body">
            <h2 className="card-title">
              {item.name}
              <div className="badge badge-secondary">NEW</div>
            </h2>
            <p>{item.description}</p>
            {/* <div className="card-actions justify-end">
              <div className="badge badge-outline">Fashion</div> 
              <div className="badge badge-outline">Products</div>
            </div> */}
            <p className='text-2xl font-semibold'>U${parseFloat(item.price).toFixed(2)}</p>
          </div>
        </Link>

      </div>
  );
}

export default ItemCard;