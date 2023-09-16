import React from 'react';
import axios from 'axios';

const Product = ({ productId, productName, productDescription, productPrice, productQuantity, image }) => {
  const handleAddToCart = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:3500/cart/add-to-cart', {
        product: productId, // Use the product ID here
        productQuantity: 1,
      });
      console.log('Product added to cart:', response.data);
    } catch (error) {
      console.error('Error adding product to cart', error);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={productName} />
      </div>
      <div className="product-details">
        <h3>{productName}</h3>
        <p>{productDescription}</p>
        <p>Price: ${productPrice}</p>
        <p>Available Quantity: {productQuantity}</p>
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
};

export default Product;
