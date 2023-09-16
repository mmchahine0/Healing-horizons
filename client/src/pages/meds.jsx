import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from '../components/Product';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/ProductsStyles.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3500/products/all-products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching product data', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="products-page">
      <Navbar />
      <div className="product-list">
        <h2>Products</h2>
        {products.map((product) => (
          <Product
            key={product._id}  // Use product's Mongoose ID as the key
            productId={product._id}  // Pass product's Mongoose ID as a prop
            productName={product.productName}
            productDescription={product.productDescription}
            productPrice={product.productPrice}
            productQuantity={product.productQuantity}
            image={product.image}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;
