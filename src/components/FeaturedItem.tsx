import { Link } from "react-router-dom";

interface FeaturedItemProps {
  name: string;
  imgUrl: string;
  price: number;
  description: string;
  itemUrl: string;
  totalRating?: number;
  reviewCount?: number;
  category: string;
}

export default function FeaturedItem({
  name,
  imgUrl,
  price,
  description,
  itemUrl,
  totalRating,
  reviewCount,
  category,
}: FeaturedItemProps) {
  return (
    <Link
      to={itemUrl}
      state={{
        name,
        imgUrl,
        price,
        description,
        totalRating,
        reviewCount,
        category,
      }}
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
