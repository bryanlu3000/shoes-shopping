import { useEffect } from "react";
import Header from "../components/Header";
import FeaturedItem from "../components/FeaturedItem";
import ProductCategory from "../components/ProductCategory";
import { useShopping } from "../context/ShoppingContext";
import { useAppDispatch, useAppSelector } from "../redux/reduxTypedHooks";
import {
  fetchFeaturedItems,
  fetchCategories,
  getFeaturedItems,
  getCategories,
} from "../redux/ShopSlice";
import "../css/Home.css";

export default function Home() {
  const { setIsHomepage } = useShopping();
  const dispatch = useAppDispatch();
  const featuredItems = useAppSelector(getFeaturedItems);
  const categories = useAppSelector(getCategories);

  useEffect(() => {
    setIsHomepage(true);
    dispatch(fetchFeaturedItems());
    dispatch(fetchCategories());

    return () => {
      setIsHomepage(false);
    };
  }, []);

  return (
    <>
      <Header />
      <main>
        <section className="featured">
          <div className="container">
            <h2 className="section-title">On sale event</h2>
            <div className="split">
              {featuredItems.map((item) => (
                <FeaturedItem
                  key={item.id}
                  itemUrl={`/itemdetail/${item.id}`}
                  {...item}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="categories">
          <div className="container">
            <h2 className="section-title">Shoes categories</h2>

            {categories.map(({ _id, name, imgUrl, description }) => (
              <ProductCategory
                key={_id}
                productClass={name}
                imgUrl={imgUrl}
                productTitle={`${name} shoes`}
                productDescription={description}
                categoryUrl={`/shop/${name}`}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
