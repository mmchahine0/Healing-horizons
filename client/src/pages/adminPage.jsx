import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/HoursStyles.css"

const UpdateOfficeHours = () => {
  const [newOfficeHours, setNewOfficeHours] = useState([
    { day: '', startTime: '', endTime: '' },
    { day: '', startTime: '', endTime: '' },
    { day: '', startTime: '', endTime: '' },
    { day: '', startTime: '', endTime: '' },
    { day: '', startTime: '', endTime: '' }
  ]);

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
    <div className="containerUpdate" style={{borderBottom:"black solid"}}>
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
  );
};


const CreateOrUpdateMedicalRecord = () => {
  const [patientId, setPatientId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState('');
  const [labReports, setLabReports] = useState('');
  const [prescriptions, setPrescriptions] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

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
    <div className="containerUpdate">
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

const GetAllRequestsForDoctor = () => {
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

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:3500/auth/make-doctor', { userId });
      toast.success('User\'s role updated to doctor');

    } catch (error) {
      console.error('Error updating user\'s role:', error);
      toast.error('Error updating user\'s role');

    }
  };

  return (
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
  );
};


const AdminPage = () => {
  return (
    <>
    <Navbar/>
    <UpdateOfficeHours/>

    <CreateOrUpdateMedicalRecord/>

    <UpdateOrderStatus/>

    <GetAllRequestsForDoctor/>

    <MakeDoctorRequest/>
    <Footer/>
    </>
  );
}

export default AdminPage;