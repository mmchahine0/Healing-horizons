import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/ProductCompStyles.css';

const Product = ({ productId, productName, productDescription, productPrice, productQuantity, productImage }) => {
  const [toastMessage, setToastMessage] = useState('');

  const handleAddToCart = async () => {
    try {
      if (productQuantity == 0){
        await axios.post('http://127.0.0.1:3500/medical-reservation/request', {
          medication: productId,
          quantity: 1,
        })
        toast.success('Product has been Requested');
      }
      else{
      const response = await axios.post('http://127.0.0.1:3500/cart/add-to-cart', {
        product: productId,
        productQuantity: 1,
      });
      toast.success('Product added to cart');
    }
    } catch (error) {
      console.error('Error adding product to cart', error);
      toast.error('Product could not be added to cart');
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={productImage} alt={productName} />
      </div>
      <div className="product-details">
        <h3>{productName}</h3>
        <p>{productDescription}</p>
        <p>Price: ${productPrice}</p>
        <p>Available Quantity: {productQuantity}</p>
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Product;
