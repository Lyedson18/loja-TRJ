import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';

export default function FurnitureDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const { addToCart } = useContext(CartContext);
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setMainImage(data.thumbnail);
      });
  }, [productId]);

  const handleAddToCart = () => {
    addToCart(product);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 650);
  };

  if (!product) return <p>Carregando...</p>;

  return (
    <div className="product-detail">
      <h2>{product.title}</h2>
      <img src={mainImage} alt={product.title} className="main-thumbnail" />
      <p>{product.description}</p>
      <p><strong>Preço:</strong> ${product.price.toFixed(2)}</p>
      <p><strong>Marca:</strong> {product.brand}</p>
      <p><strong>Estoque:</strong> {product.stock}</p>
      <p><strong>Avaliação:</strong> {product.rating}</p>

      {/* Dimensões */}
      <p><strong>Dimensões (L x A x P):</strong> {product.dimensions?.width} x {product.dimensions?.height} x {product.dimensions?.depth}</p>
      <p><strong>Peso:</strong> {product.weight} kg</p>
      <p><strong>Garantia:</strong> {product.warrantyInformation}</p>
      <p><strong>Política de Retorno:</strong> {product.returnPolicy}</p>

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

      {showMessage && (
        <div
          style={{
            marginTop: '15px',
            padding: '10px 20px',
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: '700',
          }}
        >
          Produto adicionado ao carrinho!
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
        <button
          onClick={handleAddToCart}
          className="button-link"
          style={{ padding: '18px 60px', border: 'none' }}
        >
          Adicionar ao Carrinho
        </button>
        <button
          onClick={() => navigate('/furniture')}
          className="button-link"
          style={{
            padding: '18px 60px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          Voltar para Loja de Móveis
        </button>
        <button
          onClick={() => navigate('/categories')}
          className="button-link"
          style={{
            padding: '18px 60px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          Voltar para Categorias
        </button>
      </div>
    </div>
  );
}
