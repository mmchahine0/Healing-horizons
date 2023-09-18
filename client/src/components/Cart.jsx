import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/CartStyles.css"
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cartUpdated, setCartUpdated] = useState(false); 
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3500/cart/content');
      const responseData = response.data;
      setCart(responseData.cart);
      setTotalPrice(responseData.cart.totalPrice);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveFromCart = async (productId) => {
    try {
      await axios.delete(`http://127.0.0.1:3500/cart/remove/${productId}`);
      // Update the cart after removal
      fetchCart();
      setCartUpdated(!cartUpdated); 

    } catch (error) {
      console.error('Error removing item from cart', error);
      alert('An error occurred while removing the item from the cart.');
    }
  };

  const handleProceedToCheckout = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:3500/orders/create', {
        cartID: cart._id,
        cartOwner: cart.cartOwner,
      });

      if (response.data.message === 'Order created') {
        console.log("Order created");
        setTimeout(() => {
          navigate('/bill', { state: { orderDetails: response.data } });
        }, 2000);
      } else {
        alert('Failed to create an order.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('An error occurred while creating the order.');
    }
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {loading ? (
        <div style={{ fontSize: "25px" }}>Loading cart...</div>
      ) : (
        <>
          {cart ? (
            <ul className="cart-list">
              {cart.products.map((product, index) => (
                <li key={`${product._id}_${index}`} className="cart-item">
                  <div>
                    <strong>{product.productName}</strong> - ${product.productPrice}
                    <button onClick={() => handleRemoveFromCart(product._id)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No available cart items</p>
          )}

          {totalPrice !== null && (
            <p className="total-price">Total Price: ${totalPrice}</p>
          )}
        </>
      )}

      <button className="checkout-button" onClick={handleProceedToCheckout}>
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;
