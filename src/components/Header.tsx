import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="hero">
      <div className="container spacing">
        <h1 className="primary-title">Amazing shoes in your beautiful life</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
          doloremque omnis autem ipsam modi assumenda numquam vel error repellat
          itaque, inventore voluptatum. Beatae error illo totam! Expedita
          repellendus neque ut!
        </p>
        <Link to="/shop/all" className="btn">
          Shop Now
        </Link>
      </div>
    </header>
  );
}
