import { Link } from "react-router-dom";

interface ProductCategoryProps {
  productClass: string;
  imgUrl: string;
  productTitle: string;
  productDescription: string;
  categoryUrl: string;
}

export default function ProductCategory({
  productClass,
  imgUrl,
  productTitle,
  productDescription,
  categoryUrl,
}: ProductCategoryProps) {
  return (
    <article className={`product spacing ${productClass}`}>
      <img src={imgUrl} alt="" className="product__image" />
      <h3 className="product__title">{productTitle}</h3>
      <p>{productDescription}</p>
      <Link to={categoryUrl} className="btn">
        Shop now
      </Link>
    </article>
  );
}
