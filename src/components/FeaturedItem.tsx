import { Link } from "react-router-dom";

interface FeaturedItemProps {
  name: string;
  imgUrl: string;
  price: number;
  description: string;
  itemUrl: string;
}

export default function FeaturedItem({
  name,
  imgUrl,
  price,
  description,
  itemUrl,
}: FeaturedItemProps) {
  return (
    <Link
      to={itemUrl}
      state={{ name, imgUrl, price, description }}
      className="featured__item"
    >
      <img src={imgUrl} alt="featured product" className="featured__img" />
      <p className="featured__details">
        <span className="price">${price}</span>
        {name}
      </p>
    </Link>
  );
}
