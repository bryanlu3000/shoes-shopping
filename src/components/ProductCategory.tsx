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
      <a href={categoryUrl} className="btn">
        Shop now
      </a>
    </article>
  );
}
