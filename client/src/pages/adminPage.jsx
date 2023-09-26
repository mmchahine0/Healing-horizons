import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import React, { useState, useEffect, useParams } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/HoursStyles.css";

const AllDoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [userRole, setUserRole] = useState('')
  useEffect(() => {
    axios
      .get('http://127.0.0.1:3500/user/ownUser')
      .then((response) => {
        setUserId(response.data.user._id);
        setUserRole(response.data.user.role)
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
      });
  }, []);

  useEffect(() => {
    const fetchDoctorAppointments = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3500/appointment/get/${userId}`);
        setAppointments(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctor appointments:', error);
        setLoading(false);
      }
    };

    fetchDoctorAppointments();
  }, [userId]);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await axios.delete(`http://127.0.0.1:3500/appointment/cancel/${appointmentId}`);
      const response = await axios.get(`http://127.0.0.1:3500/appointment/get/${userId}`);
      setAppointments(response.data.data);
      toast.success("Appointment cancelled successfully");
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error("Error cancelling appointment");
    }
  };

  return (
    <>{userRole === 'doctor' && (
      <div id="appointments-container">
        <h2 style={{padding:"10px"}}>Doctor's Appointments: </h2>
        {loading ? (
          <p>Loading appointments...</p>
        ) : (
          <ul style={{padding:"5px", margin:"10px"}} id="appointments-list">
            {appointments.map((appointment) => (
              <li key={appointment._id} className="appointment-item">
                <div className="datetime">
                  Date: {appointment.date}, Time: {appointment.time}
                </div>
                <button onClick={() => handleCancelAppointment(appointment._id)}>Cancel</button>
              </li>
            ))}
          </ul>
        )}
         <ToastContainer />
      </div>
      )}    
    </>
  );
};

const DoctorProfileImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    axios
      .get('http://127.0.0.1:3500/user/ownUser')
      .then((response) => {
        setUserRole(response.data.user.role);
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
      });
  }, []);

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleImageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await axios.post(`http://127.0.0.1:3500/util/uploadProfileimg/${userRole}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Profile image uploaded successfully:', response.data.imageUrl);
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  };

  return (
    <>{userRole === 'doctor' && (
    <div className="containerUpdate">
      <h2> Upload your Profile picture</h2>
      <div style={{padding:"5px",margin:"10px"}}>
        <input style={{padding:"5px",margin:"10px"}} type="file" accept="image/*" onChange={handleImageChange} />
        <button style={{padding:"5px",margin:"10px"}} onClick={handleImageUpload}>Upload Profile Image</button>
      </div>
    </div>
    )}
    </>
  );
};

const BioUpdateForm = () => {

  const [bio, setBio] = useState("");  
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    axios
      .get('http://127.0.0.1:3500/user/ownUser')
      .then((response) => {
        setUserRole(response.data.user.role);
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
      });
  }, []);

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(
        `http://127.0.0.1:3500/doctor/update-bio`,
        { bio }
      );
      toast.success('Bio updated successfully');
    } catch (error) {
      console.error("Error updating bio: ", error);
      toast.error('Error updating bio');
    }
  };

  return (
    <>{userRole === 'doctor' && (
    <div className="containerUpdate" >
      <h2 className="labelUpdate">Update Bio</h2>
      <form onSubmit={handleSubmit}>
        <label className="labelUpdate">
          Bio:
          <textarea
            className="textInputUpdate"
            value={bio}
            onChange={handleBioChange}
            placeholder="Enter your bio"
            rows={5}
            cols={50}
          />
        </label>
        <br />
        <button type="submit">Update Bio</button>
      </form>
      <ToastContainer/>
    </div>
    )}</>
  );
};

const SpecialtyUpdateForm = () => {

  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    axios
      .get('http://127.0.0.1:3500/user/ownUser')
      .then((response) => {
        setUserRole(response.data.user.role);
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
      });
  }, []);

  const specialties = [
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'Neurology',
    'Oncology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Urology',
  ];

  const handleSpecialtyChange = (event) => {
    setSelectedSpecialty(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedSpecialty) {
      toast.error('Please select a specialty.');
      return;
    }

    try {
      await axios.post(
        `http://127.0.0.1:3500/doctor/specialty`,
        { specialty: selectedSpecialty },
      );
    toast.success('Bio updated successfully');

    } catch (error) {
      console.error("Error updating specialty: ", error);
      toast.error('Error updating specialty');

    }
  };

  return (
    <>{userRole === 'doctor' && (

    <div className="containerUpdate">
      <h2 className="labelUpdate">Choose Specialty</h2>
      <form onSubmit={handleSubmit}>
        <label className="labelUpdate">
          Select Specialty:
          <select value={selectedSpecialty} onChange={handleSpecialtyChange}>
            <option value="">Select a specialty</option>
            {specialties.map((specialty, index) => (
              <option key={index} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">Update Specialty</button>
      </form>
      <ToastContainer/>
    </div>
    )}</>
  );
};

const UpdateOfficeHours = () => {
  const [newOfficeHours, setNewOfficeHours] = useState([
    { day: '', startTime: '', endTime: '' },
    { day: '', startTime: '', endTime: '' },
    { day: '', startTime: '', endTime: '' },
    { day: '', startTime: '', endTime: '' },
    { day: '', startTime: '', endTime: '' }
  ]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    axios
      .get('http://127.0.0.1:3500/user/ownUser')
      .then((response) => {
        setUserRole(response.data.user.role);
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
      });
  }, []);

  const handleUpdateOfficeHours = () => {
    axios
      .post(`http://127.0.0.1:3500/doctor/update-office-hours`, { officeHours: newOfficeHours })
      .then((response) => {
        toast.success('Office hours updated successfully');
        console.log('Office hours updated successfully:', response.data);
      })
      .catch((error) => {
        toast.error('Error updating office hours');
        console.error('Error updating office hours:', error);
      });
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedOfficeHours = [...newOfficeHours];
    updatedOfficeHours[index] = {
      ...updatedOfficeHours[index],
      [name]: value,
    };
    setNewOfficeHours(updatedOfficeHours);
  };

  return (
    <>{userRole === 'doctor' && (

    <div className="containerUpdate" style={{borderBottom:"black solid"}}>
      <h2 className="labelUpdate">Update Office hours</h2>

      {[...Array(5)].map((_, index) => (
        <div key={index}>
          <label className="labelUpdate">
            Day {index + 1}:
            <select className="selectInputUpdate" name="day" value={newOfficeHours[index].day} onChange={(e) => handleInputChange(index, e)}>
              <option value="">Select a day</option>
              <option value="mon">Monday</option>
              <option value="tue">Tuesday</option>
              <option value="wed">Wednesday</option>
              <option value="thu">Thursday</option>
              <option value="fri">Friday</option>
              <option value="sat">Saturday</option>
              <option value="sun">Sunday</option>
            </select>
          </label>
          <label className="labelUpdate">
            Start Time:
            <input className="textInputUpdate" type="text" name="startTime" value={newOfficeHours[index].startTime} onChange={(e) => handleInputChange(index, e)} />
          </label>
          <label className="labelUpdate">
            End Time:
            <input style={{borderBottom:"black solid"}}className="textInputUpdate" type="text" name="endTime" value={newOfficeHours[index].endTime} onChange={(e) => handleInputChange(index, e)} />
          </label>
        </div>
      ))}
      <button className="buttonUpdateUpdate" onClick={handleUpdateOfficeHours}>Update Office Hours</button>
      <ToastContainer className="Toastify__toast-containerUpdate" />
    </div>
    )}</>
  );
};


const CreateOrUpdateMedicalRecord = () => {
  const [patientId, setPatientId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState('');
  const [labReports, setLabReports] = useState('');
  const [prescriptions, setPrescriptions] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    axios
      .get('http://127.0.0.1:3500/user/ownUser')
      .then((response) => {
        setUserRole(response.data.user.role);
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
      });
  }, []);

  const handleCreateOrUpdateMedicalRecord = () => {
    axios
      .post(`http://127.0.0.1:3500/medical-records/create`, {
        patientId,
        diagnosis,
        medications,
        labReports,
        prescriptions,
        additionalNotes,
      })
      .then((response) => {
        console.log('Medical record created/updated successfully:', response.data);
        toast.success('Medical record created/updated successfully');

      })
      .catch((error) => {
        console.error('Error creating/updating medical record:', error);
        toast.error('Error creating/updating medical record');

      });
  };

  return (
    <>{userRole === 'doctor' && (

    <div className="containerUpdate">
      <h2 className="labelUpdate">Create/Update Medical Record</h2>

      <div className="inputGroup">
        <label className="labelUpdate" htmlFor="patientId">Patient ID:</label>
        <input
          className="textInputUpdate"
          type="text"
          id="patientId"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="Enter Patient ID"
        />
      </div>
      <div className="inputGroup">
        <label className="labelUpdate" htmlFor="diagnosis">Diagnosis:</label>
        <textarea
          className="textInputUpdate"
          id="diagnosis"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          placeholder="Enter Diagnosis"
        />
      </div>
      <div className="inputGroup">
        <label className="labelUpdate" htmlFor="medications">Medications:</label>
        <textarea
          id="medications"
          value={medications}
          onChange={(e) => setMedications(e.target.value)}
          placeholder="Enter Medications"
        />
      </div>
      <div className="inputGroup">
        <label className="labelUpdate" htmlFor="labReports">Lab Reports:</label>
        <textarea
          id="labReports"
          value={labReports}
          onChange={(e) => setLabReports(e.target.value)}
          placeholder="Enter Lab Reports"
        />
      </div>
      <div className="inputGroup">
        <label className="labelUpdate" htmlFor="prescriptions">Prescriptions:</label>
        <textarea
          id="prescriptions"
          value={prescriptions}
          onChange={(e) => setPrescriptions(e.target.value)}
          placeholder="Enter Prescriptions"
        />
      </div>
      <div className="inputGroup">
        <label className="labelUpdate" htmlFor="additionalNotes">Additional Notes:</label>
        <textarea
          id="additionalNotes"
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          placeholder="Enter Additional Notes"
        />
      </div>
      <button className="buttonUpdateUpdate" onClick={handleCreateOrUpdateMedicalRecord}>Create/Update Medical Record</button>
      <ToastContainer />

    </div>
    )}</>
  );
};


const UpdateOrderStatus = () => {
  const [orderId, setOrderId] = useState('');
  

  const handleUpdateOrderStatus = () => {
    axios
      .post(`http://127.0.0.1:3500/order/update-order/${orderId}`, null)
      .then((response) => {
        console.log('Order status updated successfully:', response.data);
        toast.success('Order status updated successfully');
      })
      .catch((error) => {
        console.error('Error updating order status:', error);
        toast.error('Error updating order status');
      });
  };
  return (
    <div className="containerUpdate">
      <h2 className="labelUpdate">Update an order status</h2>

      <div className="inputGroup">
        <label className="labelUpdate" htmlFor="orderId">Order ID:</label>
        <input
          className="textInputUpdate"
          type="text"
          id="orderId"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter Order ID"
        />
      </div>
      <button className="buttonUpdateUpdate" onClick={handleUpdateOrderStatus}>Update Order Status</button>
      <ToastContainer />
    </div>
  );
};

const GetAllMedsRequest = () => {
  const [requests, setRequests] = useState([]);
  const [medicineQuantities, setMedicineQuantities] = useState({});

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3500/medical-reservation/get');
        setRequests(response.data.requests);
        calculateMedicineQuantities(response.data.requests);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const calculateMedicineQuantities = (requests) => {
    const quantities = {};
    requests.forEach((request) => {
      const { medication, quantity } = request;
      quantities[medication] = (quantities[medication] || 0) + parseInt(quantity, 10);
    });
    setMedicineQuantities(quantities);
  };

  return (
    <div className="containerUpdate">
      <h2 className="labelUpdate">Meds requests:</h2>
      <ul className="labelUpdate">
        {Object.keys(medicineQuantities).map((medication) => (
          <li key={medication} style={{ paddingBottom: "10px" }}>
            Med name: {medication}<br />
            Total requested quantity: {medicineQuantities[medication]}
          </li>
        ))}
      </ul>
    </div>
  );
};

const MakeDoctorRequest = () => {
  const [userId, setUserId] = useState('');

  const [userRole, setUserRole] = useState('');
  
    useEffect(() => {
      axios.get('http://127.0.0.1:3500/user/ownUser')
        .then((response) => {
          setUserRole(response.data.user.role);
        })
        .catch((error) => {
          console.error('Error fetching user role:', error);
        });
    }, []);

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://127.0.0.1:3500/auth/make-doctor', { userId });
      toast.success('User\'s role updated to doctor');
    } catch (error) {
      console.error('Error updating user\'s role:', error);
      toast.error('Error updating user\'s role');

    }
  };

  return (
    <>
    {userRole === 'admin' && (
      <div className="containerUpdate">
        <h2 className="labelUpdate">Make User a Doctor</h2>
        <form onSubmit={handleSubmit}>
          <label className="labelUpdate">
            User ID:
            <input
              className="textInputUpdate"
              type="text"
              value={userId}
              onChange={handleUserIdChange}
              placeholder="Enter User ID"
            />
          </label>
          <button className="buttonUpdateUpdate" type="submit">Make Doctor</button>
        </form>
        <ToastContainer />
      </div>
    )}
  </>
  );
};

const CreateRoomForm = () => {
  const [roomNumber, setRoomNumber] = useState('');
  const [floorId, setFloorId] = useState('');
  const [userRole, setUserRole] = useState('');
  
  useEffect(() => {
    axios.get('http://127.0.0.1:3500/user/ownUser')
      .then((response) => {
        setUserRole(response.data.user.role);
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
      });
  }, []);

  const handleRoomNumberChange = (e) => {
    setRoomNumber(e.target.value);
  };

  const handleFloorIdChange = (e) => {
    setFloorId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:3500/room/create', {
        roomNumber,
        floorId,
      });

      console.log('Room created successfully:', response.data);
      toast.success('Room created successfully');

    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Error creating room');
    }
  };

  return (
    <>
    {userRole === 'admin' && (
    <div className="containerUpdate">
      <h2 className="labelUpdate">Create a Room</h2>
      <form onSubmit={handleSubmit}>
        <label className="labelUpdate">
          Room Number:
          <input type="text" value={roomNumber} onChange={handleRoomNumberChange} />
        </label>
        <br />
        <label className="labelUpdate">
          Floor ID:
          <input type="text" value={floorId} onChange={handleFloorIdChange} />
        </label>
        <br />
        <button className="buttonUpdateUpdate" type="submit">Create Room</button>
      </form>
      <ToastContainer/>
    </div>
    )}
    </>
  );
};

const CreateFloorForm = () => {
  const [floorNumber, setFloorNumber] = useState('');
  const [userRole, setUserRole] = useState('');
  
    useEffect(() => {
      axios.get('http://127.0.0.1:3500/user/ownUser')
        .then((response) => {
          setUserRole(response.data.user.role);
        })
        .catch((error) => {
          console.error('Error fetching user role:', error);
        });
    }, []);

  const handleFloorNumberChange = (e) => {
    setFloorNumber(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:3500/floor/create', {
        floorNumber,
      });

      console.log('Floor created successfully:', response.data);
      toast.success('Floor created successfully');
    } catch (error) {
      console.error('Error creating floor:', error);
      toast.error('Error creating floor');

    }
  };

  return (
    <>
    {userRole === 'admin' && (
    <div className="containerUpdate">
      <h2>Create a Floor</h2>
      <form onSubmit={handleSubmit}>
        <label className="labelUpdate">
          Floor Number:
          <input type="text" value={floorNumber} onChange={handleFloorNumberChange} />
        </label>
        <br />
        <button className="buttonUpdateUpdate" type="submit">Create Floor</button>
      </form>
      <ToastContainer/>
    </div>
    )}
    </>
  );
};

const FloorDetails = () => {
  const [floorNumber, setFloorNumber] = useState('');
  const [floorData, setFloorData] = useState(null);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    axios
      .get('http://127.0.0.1:3500/user/ownUser')
      .then((response) => {
        setUserRole(response.data.user.role);
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
      });
  }, []);

  const handleFloorNumberChange = (e) => {
    setFloorNumber(e.target.value);
  };

  const handleGetFloorData = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`http://127.0.0.1:3500/floor/get/${floorNumber}`);

      setFloorData(response.data.selectedFloor);
      console.log(response.data.selectedFloor);
    } catch (error) {
      console.error('Error getting floor data:', error);
      toast.error('Error getting floor data');
    }
  };

  return (
    <>
      {userRole === 'admin' && (
        <div className="containerUpdate">
          <h2 className="labelUpdate">Get Floor Data</h2>
          <form onSubmit={handleGetFloorData}>
            <label className="labelUpdate">
              Floor Number:
              <input type="text" value={floorNumber} onChange={handleFloorNumberChange} />
            </label>
            <br />
            <button className="buttonUpdateUpdate" type="submit">
              Get Floor Data
            </button>
          </form>

          {floorData && (
            <div>
              <h3 className="labelUpdate">Floor Data:</h3>
              <pre className="labelUpdate">{JSON.stringify(floorData, null, 2)}</pre>
            </div>
          )}
          <ToastContainer />
        </div>
      )}
    </>
  );
};


const RoomDetails = () => {
  const [roomId, setRoomId] = useState('');
  const [roomData, setRoomData] = useState(null);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    axios
      .get('http://127.0.0.1:3500/user/ownUser')
      .then((response) => {
        setUserRole(response.data.user.role);
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
      });
  }, []);

  const handleRoomIdChange = (e) => {
    setRoomId(e.target.value);
  };

  const handleGetRoomData = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`http://127.0.0.1:3500/room/get/${roomId}`);

      setRoomData(response.data.selectedRoom);
      console.log(response.data.selectedRoom);
    } catch (error) {
      console.error('Error getting room data:', error);
      toast.error('Error getting room data');
    }
  };

  return (
    <>
      {userRole === 'admin' && (
        <div className="containerUpdate">
          <h2 className="labelUpdate">Get Room Data</h2>
          <form onSubmit={handleGetRoomData}>
            <label className="labelUpdate">
              Room ID:
              <input type="text" value={roomId} onChange={handleRoomIdChange} />
            </label>
            <br />
            <button className="buttonUpdateUpdate" type="submit">
              Get Room Data
            </button>
          </form>

          {roomData && (
            <div>
              <h3 className="labelUpdate">Room Data:</h3>
              <pre className="labelUpdate">{JSON.stringify(roomData, null, 2)}</pre>
            </div>
          )}
          <ToastContainer />
        </div>
      )}
    </>
  );
};

const RoomReservations = () => {
  const [roomReservations, setRoomReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    axios
      .get('http://127.0.0.1:3500/user/ownUser')
      .then((response) => {
        setUserRole(response.data.user.role);
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
      });
  }, []);

  const handleGetRoomReservations = async () => {
    setLoading(true);

    try {
      const response = await axios.get('http://127.0.0.1:3500/room-reservation/get');
      setRoomReservations(response.data.data);
    } catch (error) {
      console.error('Error getting room reservations:', error);
      toast.error('Error getting room reservations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {userRole === 'admin' && (

    <div className="containerUpdate">
      <h2 className="labelUpdate">Room Reservations</h2>
      <button
        className="buttonUpdateUpdate"
        onClick={handleGetRoomReservations}
        disabled={loading}
      >
        {loading ? 'Room Reservations: ' : 'Get Room Reservations'}
      </button>

      {roomReservations.length > 0 && (
        <ul>
          {roomReservations.map((reservation) => (
            <li key={reservation._id}>{JSON.stringify(reservation)}</li>
          ))}
        </ul>
      )}

      <ToastContainer />
    </div>
    )}
    </>
  );
};

const ProductForm = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    axios
      .get('http://127.0.0.1:3500/user/ownUser')
      .then((response) => {
        setUserRole(response.data.user.role);
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:3500/products/create-product', {
        productName,
        productDescription,
        productPrice,
        productQuantity,
      });
      console.log('Product created:', response.data);
      toast.success('Product created successfully!');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Error creating product');
    }
  };

  return (
    <>
    {userRole === 'admin' && (

    <form className="containerUpdate" onSubmit={handleSubmit}>
      <h2> Create a Product </h2>
      <div>
        <label style={{padding:"5px", margin:"5px"}} className="labelUpdate" htmlFor="productName">Product Name:</label>
        <input type="text" id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} />
      </div>
      <div>
        <label style={{padding:"5px", margin:"5px"}} className="labelUpdate" htmlFor="productDescription">Product Description:</label>
        <input type="text" id="productDescription" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />
      </div>
      <div>
        <label style={{padding:"5px", margin:"5px"}} className="labelUpdate" htmlFor="productPrice">Product Price:</label>
        <input type="number" id="productPrice" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
      </div>
      <div>
        <label style={{padding:"5px", margin:"5px"}} className="labelUpdate" htmlFor="productQuantity">Product Quantity:</label>
        <input type="number" id="productQuantity" value={productQuantity} onChange={(e) => setProductQuantity(e.target.value)} />
      </div>
      <button className="buttonUpdateUpdate" type="submit">Create Product</button>
      <ToastContainer />
    </form>
    )}
    </>
  );
};

const ProductImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [productId, setProductId] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    axios
      .get('http://127.0.0.1:3500/user/ownUser')
      .then((response) => {
        setUserRole(response.data.user.role);
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
      });
  }, []);

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };
  const handleProductIdChange = (event) => {
    setProductId(event.target.value);
  };

  const handleImageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await axios.post(`http://127.0.0.1:3500/util/uploadProductimg/${productId}`, formData, {
      });
      toast.success("Image uploaded successfully")
      console.log('Image uploaded successfully:', response.data.imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error while uploading the image')
    }
  };

  return (
    <>
    {userRole === 'admin' && (

    <div className="containerUpdate" >
      <label style={{padding:"5px", margin:"5px"}} className="labelUpdate" htmlFor="productId">Product ID:</label>
        <input type="text" id="productId" value={productId} onChange={handleProductIdChange} />
      
      <input style={{margin:"10px"}} type="file" accept="image/*" onChange={handleImageChange} />
      <button className="buttonUpdateUpdate" onClick={handleImageUpload}>Upload Image</button>
    </div>
    )}
    </>
  );
};

const UpdateProduct = () => {
  const [productID, setProductId] = useState('');
  const [updateData, setUpdateData] = useState({
    productDescription: '',
    productName: '',
    productPrice: '',
    productQuantity: ''
  });
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    axios
      .get('http://127.0.0.1:3500/user/ownUser')
      .then((response) => {
        setUserRole(response.data.user.role);
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
      });
  }, []);

  const handleProductIdChange = (event) => {
    setProductId(event.target.value);
  };

  const handleUpdateDataChange = (event) => {
    const { name, value } = event.target;
    setUpdateData({
      ...updateData,
      [name]: value
    });
  };

  const handleUpdateProduct = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:3500/products/update-product/${productID}`, updateData);
        toast.success('Product updated successfully');
        console.log('Product updated successfully:', response.data.message);
    } catch (error) {
      toast.error('Error updating product');
      console.error('Error updating product:', error);
    }
  };

  return (
    <>
    {userRole === 'admin' && (
    <div className="containerUpdate">
      <div style={{ padding: "5px", margin: "5px" }}>
        <label style={{padding:"5px", margin:"5px"}} className="labelUpdate" htmlFor="productId">Product ID:</label>
        <input type="text" id="productId" value={productID} onChange={handleProductIdChange} />
      </div>
      <div style={{ padding: "5px", margin: "5px" }}>
        <label style={{padding:"5px", margin:"5px"}} className="labelUpdate" htmlFor="productDescription">Update Product Description:</label>
        <input
          type="text"
          id="productDescription"
          name="productDescription"
          value={updateData.productDescription}
          onChange={handleUpdateDataChange}
        />
      </div>
      <div style={{ padding: "5px", margin: "5px" }}>
        <label style={{padding:"5px", margin:"5px"}} className="labelUpdate" htmlFor="productName">Update Product Name:</label>
        <input
          type="text"
          id="productName"
          name="productName"
          value={updateData.productName}
          onChange={handleUpdateDataChange}
        />
      </div>
      <div style={{ padding: "5px", margin: "5px" }}>
        <label style={{padding:"5px", margin:"5px"}} className="labelUpdate" htmlFor="productPrice">Update Product Price:</label>
        <input
          type="number"
          id="productPrice"
          name="productPrice"
          value={updateData.productPrice}
          onChange={handleUpdateDataChange}
        />
      </div>
      <div style={{ padding: "5px", margin: "5px" }}>
        <label style={{padding:"5px", margin:"5px"}} className="labelUpdate" htmlFor="productQuantity">Update Product Quantity:</label>
        <input
          type="number"
          id="productQuantity"
          name="productQuantity"
          value={updateData.productQuantity}
          onChange={handleUpdateDataChange}
        />
      </div>
      <button className="buttonUpdateUpdate" onClick={handleUpdateProduct}>Update Product</button>
    </div>
    )}</>
  );
};



const DeleteProduct = () => {
  const [productId, setProductId] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    axios
      .get('http://127.0.0.1:3500/user/ownUser')
      .then((response) => {
        setUserRole(response.data.user.role);
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
      });
  }, []);

  const handleProductIdChange = (event) => {
    setProductId(event.target.value);
  };

  const handleDeleteProduct = async () => {
    try {
      const response = await axios.delete(`http://127.0.0.1:3500/products/delete-product/${productId}`);
      toast.success('Product deleted successfully');
      console.log('Product deleted successfully:', response.data.message);
    } catch (error) {
      toast.error('Error deleting product');
      console.error('Error deleting product:', error);
    }
  };

  return (
    <>
    {userRole === 'admin' && (
    <div className="containerUpdate">
      <div style={{padding:"5px", margin:"5px"}}>
        <label style={{padding:"5px", margin:"5px"}} className="labelUpdate" htmlFor="productId">Product ID:</label>
        <input type="text" id="productId" value={productId} onChange={handleProductIdChange} />
      </div>
      <button className="buttonUpdateUpdate" onClick={handleDeleteProduct}>Delete Product</button>
    </div>
    )}
    </>
  );
};


const AdminPage = () => {
  return (
    <>
    <Navbar/>

    <AllDoctorAppointments/>

    <DoctorProfileImageUpload/>

    <SpecialtyUpdateForm/>

    <BioUpdateForm/>

    <UpdateOfficeHours/>

    <CreateOrUpdateMedicalRecord/>

    <UpdateOrderStatus/>

    <GetAllMedsRequest/>

    <MakeDoctorRequest/>

    <ProductForm/>

    <ProductImageUpload />

    <UpdateProduct />

    <DeleteProduct />

    <CreateFloorForm/>

    <CreateRoomForm/>

    <FloorDetails/>

    <RoomDetails/>

    <RoomReservations/>

    <div className="containerUpdate">
    <h2 style={{padding:"10px"}} className="labelUpdate">Check all users</h2>
    <a className="buttonUpdateUpdate" href="/usersList">go to all Users</a>
    </div>
    <Footer/>
    </>
  );
}

export default AdminPage;
