import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/ProfileStyles.css';
import { useNavigate } from 'react-router-dom';

const UserProfile = ({
  userId,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [newDateOfBirth, setNewDateOfBirth] = useState(new Date());
  const [newAllergies, setNewAllergies] = useState('');
  const [newMedicalHistory, setNewMedicalHistory] = useState('');
  const [newCriticalConditions, setNewCriticalConditions] = useState('');
  const [medicalRecords, setMedicalRecords] = useState(null);
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newMedications, setNewMedications] = useState([]);
  const [newLabReports, setNewLabReports] = useState([]);
  const [newPrescriptions, setNewPrescriptions] = useState([]);
  const [newAdditionalNotes, setNewAdditionalNotes] = useState('');
  const [showUpdateDateOfBirthModal, setShowUpdateDateOfBirthModal] = useState(false);
  const [newDateOfBirthInput, setNewDateOfBirthInput] = useState('');

  const handleAllergiesChange = (event) => {
    setNewAllergies(event.target.value);
  };

  const handleMedicalHistoryChange = (event) => {
    setNewMedicalHistory(event.target.value);
  };

  const handleCriticalConditionsChange = (event) => {
    setNewCriticalConditions(event.target.value);
  };

  const fetchMedicalRecords = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:3500/medical-records/getAUser/${userId}`);
      setMedicalRecords(response.data.medicalRecords[0]);
      setNewDiagnosis(response.data.medicalRecords[0].diagnosis);
      setNewMedications(response.data.medicalRecords[0].medications);
      setNewLabReports(response.data.medicalRecords[0].labReports);
      setNewPrescriptions(response.data.medicalRecords[0].prescriptions);
      setNewAdditionalNotes(response.data.medicalRecords[0].additionalNotes);
    } catch (error) {
      console.error('Error fetching medical records:', error);
    }
  };

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const handleUpdateDateOfBirth = () => {
    setNewDateOfBirth(newDateOfBirthInput);
    setShowUpdateDateOfBirthModal(false);
    notifySuccess('Date of Birth updated successfully');
  };

  const handleUpdateSurveys = () => {
    if (!newAllergies || !newMedicalHistory) {
      notifyError('Allergies and Medical History are required.');
      return;
    }

    const formattedDateOfBirth = newDateOfBirth ? new Date(newDateOfBirth).toISOString().split('T')[0] : '';

    const updatedSurvey = {
      userId: userId,
      allergies: newAllergies,
      medicalHistory: newMedicalHistory,
      criticalConditions: newCriticalConditions,
      dateofbirth: formattedDateOfBirth,
    };

    axios.post('http://127.0.0.1:3500/survey/submit', updatedSurvey)
      .then(response => {
        console.log('Survey updated successfully:', response.data);
        setNewDateOfBirth(response.data.dateofbirth);
        setNewAllergies(response.data.allergies);
        setNewMedicalHistory(response.data.medicalHistory);
        setNewCriticalConditions(response.data.criticalConditions);
        window.location.reload();
      })
      .catch(error => {
        console.error('Error updating survey:', error);
        notifyError('Error updating surveys');
      });
  };

  useEffect(() => {
    const fetchUserSurvey = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3500/survey/get/${userId}`);
        setNewDateOfBirth(response.data.dateofbirth);
        setNewAllergies(response.data.allergies);
        setNewMedicalHistory(response.data.medicalHistory);
        setNewCriticalConditions(response.data.criticalConditions);
      } catch (error) {
        console.error('Error fetching user survey:', error);
      }
    };

    fetchUserSurvey();
  }, [userId]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:3500/user/getUser/${userId}`)
      .then(response => {
        const { fullname, email } = response.data.user;
        setFullName(fullname);
        setEmail(email);
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });

    fetchMedicalRecords();
  }, [userId]);

  const handleUpdateDateOfBirthClick = () => {
    setShowUpdateDateOfBirthModal(true);
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div>
        <label>Full Name:</label>
        <span style={{ padding: '5px' }}>{fullName}</span>
      </div>
      <div>
        <label>Email:</label>
        <span style={{ padding: '5px' }}>{email}</span>
      </div>
      <label style={{ padding: '5px 0 0 0' }}>Date of Birth: </label>
      <span style={{ padding: '5px 0 0 0' }}>{newDateOfBirth ? new Date(newDateOfBirth).toISOString().split('T')[0] : ''}</span>
      <div>
        <button id="buttonBirth" onClick={handleUpdateDateOfBirthClick}>Update Date of Birth</button>
      </div>

      {showUpdateDateOfBirthModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowUpdateDateOfBirthModal(false)}>
              &times;
            </span>
            <div>
              <label>New Date of Birth:</label>
              <input
                type="date"
                value={newDateOfBirthInput}
                onChange={(e) => setNewDateOfBirthInput(e.target.value)}
              />
            </div>
            <button onClick={handleUpdateDateOfBirth}>Save</button>
          </div>
        </div>
      )}

      <div>
        <label>Allergies:</label>
        <textarea value={newAllergies || ''} onChange={handleAllergiesChange} />
      </div>
      <div>
        <label>Medical History:</label>
        <textarea value={newMedicalHistory || ''} onChange={handleMedicalHistoryChange} />
      </div>
      <div>
        <label>Critical Conditions:</label>
        <textarea value={newCriticalConditions || ''} onChange={handleCriticalConditionsChange} />
      </div>

      <div>
        <h3>Medical Records</h3>
        {medicalRecords ? (
          <ul>
            <li key={medicalRecords._id}>
              <strong>Diagnosis:</strong> {newDiagnosis || 'N/A'}<br />
              <strong>Medications:</strong> {newMedications || 'N/A'}<br />
              <strong>Lab Reports:</strong> {newLabReports || 'N/A'}<br />
              <strong>Prescriptions:</strong> {newPrescriptions || 'N/A'}<br />
              <strong>Additional Notes:</strong> {newAdditionalNotes || 'N/A'}<br />
            </li>
          </ul>
        ) : (
          <p>No medical records found.</p>
        )}
      </div>

      <button onClick={handleUpdateSurveys}>Update Surveys</button>

      <ToastContainer />
    </div>
  );
};

export default UserProfile;
