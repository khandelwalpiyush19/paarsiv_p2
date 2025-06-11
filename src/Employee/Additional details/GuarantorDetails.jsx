import React, { useState, useEffect, useCallback } from 'react';

const GuarantorDetails = () => {
  const [guarantor, setGuarantor] = useState({
    name: '',
    occupation: '',
    phone: ''
  });

  const [editMode, setEditMode] = useState(false);
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGuarantor({ ...guarantor, [name]: value });
  };

  const fetchGuarantorDetails = useCallback(async () => {
    try {
      const response = await fetch('/api/employees/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      const guar = data.guarantorDetails || data.guarantor;
      if (guar) {
        setGuarantor(guar);
      }
    } catch (error) {
      console.error('Failed to load guarantor details:', error);
    }
  }, [token]);

  const handleUpdate = async () => {
    try {
      const response = await fetch('/api/employees/me/guarantor-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(guarantor)
      });

      if (!response.ok) {
        throw new Error('Failed to save guarantor details');
      }

      await response.json();
      alert('Guarantor details updated successfully!');
      setEditMode(false);
    } catch (error) {
      console.error('Error saving guarantor details:', error);
      alert('Error saving guarantor details');
    }
  };

  useEffect(() => {
    fetchGuarantorDetails();
  }, [fetchGuarantorDetails]);

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Guarantor Details</h2>

      {!editMode ? (
        <div className="space-y-3">
          <p><strong>Name:</strong> {guarantor.name || '-'}</p>
          <p><strong>Occupation:</strong> {guarantor.occupation || '-'}</p>
          <p><strong>Phone:</strong> {guarantor.phone || '-'}</p>
          <button
            className="bg-blue-600 text-white px-5 py-2 mt-4 rounded hover:bg-blue-700 transition"
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
        </div>
      ) : (
        <>
          {[
            { label: 'Name', name: 'name' },
            { label: 'Occupation', name: 'occupation' },
            { label: 'Phone', name: 'phone' }
          ].map(({ label, name }) => (
            <div key={name} className="mb-4">
              <label className="block font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="text"
                name={name}
                value={guarantor[name]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder={label}
              />
            </div>
          ))}

          <div className="flex gap-4 mt-4">
            <button
              className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
              onClick={handleUpdate}
            >
              Save
            </button>
            <button
              className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GuarantorDetails;
