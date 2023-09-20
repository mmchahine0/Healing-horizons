import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/CartStyles.css";
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cartUpdated, setCartUpdated] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [errorToast, setErrorToast] = useState('');
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
      fetchCart();
      setCartUpdated(!cartUpdated);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item from cart', error);
      toast.error('An error occurred while removing the item from the cart.');
    }
  };

  const handleRedirectToBill = () => {
    navigate('/bill');
  };

  const handleProceedToCheckout = async () => {
    const cartIdString = cart._id;
    const cartOwnerString = cart.cartOwner;
    try {
      const response = await axios.post('http://127.0.0.1:3500/order/new-order', {
        cartID: cartIdString.toString(),
        cartOwner: cartOwnerString.toString(),
        totalPrice: cart.totalPrice
      });

      if (response.data.message === 'Order created') {
        console.log("Order created");
        toast.success('Order created successfully');
        setTimeout(() => {
          navigate('/bill', { state: { orderDetails: response.data } });
        }, 2000);
      } else {
        toast.error('Failed to create an order.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('An error occurred while creating the order.');
    }
  };

  return (
    <div className="cart-container">
      <h2 style={{padding:"5px"}}>Your Cart</h2>
      {loading ? (
        <div style={{ fontSize: "25px" }}>No cart items are available...</div>
      ) : (
        <>
          {cart ? (
            <ul className="cart-list">
              {cart.products.map((product, index) => (
                <li key={`${product._id}_${index}`} className="cart-item">
                  <div style={{padding:"5px",borderTop:"#022d36 solid",borderWidth:"0.2px"}}>
                    <img className="product-imageCart"src={product.productImage} alt="Product image"/> <br/>
                    <strong>{product.productName}</strong> - ${product.productPrice}
                    <button style={{ float: "right" }} onClick={() => handleRemoveFromCart(product._id)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No available cart items</p>
          )}

          {totalPrice !== null && (
            <p style={{padding:"10px"}}className="total-price">Total Price: ${totalPrice}</p>
          )}
        </>
      )}

      <button className="checkout-button" onClick={handleProceedToCheckout}>
        Proceed to Checkout
      </button>
      <button style={{ float: "right" }} className="checkout-button" onClick={handleRedirectToBill}>
        Check your orders
      </button>

      {successToast && (
        <div className="toast-success">
          {successToast}
        </div>
      )}

      {errorToast && (
        <div className="toast-error">
          {errorToast}
        </div>
      )}

      <ToastContainer /> {/* Add this to render the toast messages */}
    </div>
  );
};

export default Cart;
