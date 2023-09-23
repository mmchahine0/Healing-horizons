import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/RoomBookingStyles.css";

const RoomReservationForm = () => {
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
  });
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoomSelect = (roomId) => {
    const stringId = roomId.toString()
    setSelectedRoomId(stringId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedRoomId) {
      toast.error('Please select a room before reserving.');
      return;
    }
  
    try {
      const response = await axios.post(`http://127.0.0.1:3500/room-reservation/reserve-room/${selectedRoomId}`, formData);
      toast.success('Room reservation successful: ' + response.data.message);
    } catch (error) {
      toast.error('Error reserving room: ' + error.message);
    }
  };

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3500/room-reservation/getAvailableRooms');
        setAvailableRooms(response.data.data);
      } catch (error) {
        toast.error('Error fetching available rooms: ' + error.message);
      }
    };

    fetchAvailableRooms();
  }, []);

  return (
    <>
      <Navbar />
      <div className="room-reservation-container">
      <div className="room-selection">
          <h2 style={{ padding: "5px", margin: "10px" }}>Select a room:</h2>
          {availableRooms.length > 0 ? (
            <ul>
              {availableRooms.map((room) => (
                <button
                  style={{ padding: "5px", margin: "10px" }}
                  key={room._id}
                  onClick={() => handleRoomSelect(room._id)}
                  className="room-selection-button"
                >
                  Room {room.roomNumber}
                </button>
              ))}
            </ul>
          ) : (
            <p style={{ padding: "5px", margin: "10px", fontWeight:"600" }}>No available rooms to reserve at the moment.</p>
          )}
        </div>
        <form style={{padding:"5ps",margin:"10px"}} onSubmit={handleSubmit}>
          <div className="room-reservation-form-group">
            <label htmlFor="checkInDate" className="room-reservation-label">Check-in Date:</label>
            <input
              type="datetime-local"
              id="checkInDate"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleChange}
              className="room-reservation-input"
              required
            />
          </div>
          <div className="room-reservation-form-group">
            <label htmlFor="checkOutDate" className="room-reservation-label">Check-out Date:</label>
            <input
              type="datetime-local"
              id="checkOutDate"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleChange}
              className="room-reservation-input"
              required
            />
          </div>
          <button type="submit" className="room-reservation-button">Reserve Room</button>
        </form>
        <ToastContainer/>
      </div>
      <Footer />
    </>
  );
};

export default RoomReservationForm;
