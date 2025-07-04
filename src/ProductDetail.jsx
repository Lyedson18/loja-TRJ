import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  useEffect(() => {
    fetch(`https://dummyjson.com/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setMainImage(data.thumbnail);  // imagem principal inicial
      });
  }, [productId]);
  if (!product) return <p>Carregando...</p>;
  return (
    <div className="product-detail">
      <h2>{product.title}</h2>
      <img src={mainImage} alt={product.title} className="main-thumbnail" />
      <p>{product.description}</p>
      <p><strong>Preço:</strong> ${product.price}</p>
      <p><strong>Marca:</strong> {product.brand}</p>
      <p><strong>Estoque:</strong> {product.stock}</p>
      <p><strong>Avaliação:</strong> {product.rating}</p>
      <h3>Imagens:</h3>
      <div className="product-images">
        {product.images && product.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${product.title} ${idx}`}
            className={`thumbnail ${mainImage === img ? 'selected' : ''}`}
            onClick={() => setMainImage(img)}
          />
        ))}
      </div>
      <Link to="/shop" className="button-link">Voltar para a Loja</Link>
    </div>
  );
}