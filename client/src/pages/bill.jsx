import React from 'react';
import { useLocation } from 'react-router-dom';

const BillPage = () => {
  const location = useLocation();
  const orderDetails = location.state && location.state.orderDetails;

  return (
    <div>
      <h2>Your Order Summary</h2>
      {orderDetails && (
        <div>
          <h3>Order Items:</h3>
          <ul>
            {orderDetails.items.map((item) => (
              <li key={item._id}>
                {item.productName} - ${item.productPrice} (Quantity: {item.quantity})
              </li>
            ))}
          </ul>
          <p>Total Price: ${orderDetails.totalPrice}</p>
        </div>
      )}
    </div>
  );
};

export default BillPage;

