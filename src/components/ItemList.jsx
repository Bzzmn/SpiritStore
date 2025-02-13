import ItemCard from "./Item";

const ItemList = ({ items }) => {
  return (
      <div className="flex flex-wrap gap-4 justify-center py-10">
        {items.map((item) => (
            <ItemCard key={item.id.toString()} item={item} />
        ))}
      </div>
  )
}

export default ItemList;