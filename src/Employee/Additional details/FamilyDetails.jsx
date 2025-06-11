import React, { useState, useEffect } from 'react';

const FamilyDetails = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    relationship: '',
    phoneNo: '',
    address: '',
    occupation: '',
  });

  const [familyDetails, setFamilyDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to submit this form.');
      return;
    }

    try {
      const response = await fetch('/api/employees/me/family-details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const contentType = response.headers.get('Content-Type');
        if (contentType?.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update family details');
        } else {
          throw new Error(`Unexpected response: ${response.statusText}`);
        }
      }

      alert('Family details updated successfully!');
      setIsEditing(false);
      fetchFamilyDetails();
    } catch (error) {
      console.error('Error updating family details:', error.message);
      alert('Failed to update family details. Please try again.');
    }
  };

  const fetchFamilyDetails = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to view family details.');
      return;
    }

    try {
      const response = await fetch('/api/employees/me/family-details', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setFamilyDetails(data.familyDetails || []);
    } catch (error) {
      console.error('Error fetching family details:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilyDetails();
  }, []);

  if (loading) return <div className="text-center text-lg text-gray-600 mt-6">Loading family details...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-200 mt-8">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Family Details</h2>

      {!isEditing && familyDetails.length > 0 ? (
        <div className="bg-gray-100 p-5 rounded-lg shadow-sm">
          <p className="mb-2"><strong>Name:</strong> {familyDetails[0].fullName || 'N/A'}</p>
          <p className="mb-2"><strong>Occupation:</strong> {familyDetails[0].occupation || 'N/A'}</p>
          <p className="mb-2"><strong>Phone:</strong> {familyDetails[0].phoneNo || 'N/A'}</p>
          <p className="mb-2"><strong>Relationship:</strong> {familyDetails[0].relationship || 'N/A'}</p>
          <p className="mb-4"><strong>Address:</strong> {familyDetails[0].address || 'N/A'}</p>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            onClick={() => {
              setIsEditing(true);
              setFormData({
                fullName: familyDetails[0].fullName || '',
                relationship: familyDetails[0].relationship || '',
                phoneNo: familyDetails[0].phoneNo || '',
                address: familyDetails[0].address || '',
                occupation: familyDetails[0].occupation || '',
              });
            }}
          >
            Edit
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {['fullName', 'occupation', 'relationship', 'phoneNo', 'address'].map((field) => (
            <div key={field} className="flex flex-col">
              <label htmlFor={field} className="font-medium text-gray-700 capitalize">
                {field === 'phoneNo' ? 'Phone Number' : field.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type="text"
                name={field}
                id={field}
                value={formData[field]}
                onChange={handleChange}
                required={['fullName', 'relationship', 'phoneNo', 'address'].includes(field)}
                className="mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Save Family Details
            </button>
            <button
              type="button"
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FamilyDetails;
