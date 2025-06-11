import React, { useState, useEffect } from 'react';

const FinancialDetails = () => {
  const [formData, setFormData] = useState({
    bankName: '',
    ifsc: '',
    accountNo: '',
    accountName: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchFinancialDetails = async () => {
    try {
      const response = await fetch('/api/employees/me/financial-details', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch financial details');

      const data = await response.json();

      setFormData({
        bankName: data.financialDetails?.bankName || '',
        ifsc: data.financialDetails?.ifsc || '',
        accountNo: data.financialDetails?.accountNo || '',
        accountName: data.financialDetails?.accountName || '',
      });
    } catch (error) {
      console.error('Error:', error.message);
      alert('Could not load financial details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { bankName, ifsc, accountNo, accountName } = formData;
    if (!bankName || !ifsc || !accountNo || !accountName) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const response = await fetch('/api/employees/me/financial-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save financial details');
      }

      alert('Financial details updated successfully!');
      setIsEditing(false);
      fetchFinancialDetails();
    } catch (error) {
      console.error('Error:', error.message);
      alert(error.message);
    }
  };

  const toggleEditMode = () => {
    if (!isEditing) fetchFinancialDetails();
    setIsEditing(!isEditing);
  };

  if (loading) return <div className="text-center mt-6 text-gray-600">Loading financial details...</div>;

  return (
    <div className="bg-blue-50 p-8 rounded-2xl max-w-2xl mx-auto mt-10 shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Financial Details</h2>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: 'Bank Name', name: 'bankName' },
            { label: 'IFSC Code', name: 'ifsc' },
            { label: 'Account Number', name: 'accountNo' },
            { label: 'Account Holder Name', name: 'accountName' },
          ].map(({ label, name }) => (
            <div key={name} className="flex flex-col gap-1">
              <label htmlFor={name} className="text-sm text-gray-700 font-medium">
                {label}
              </label>
              <input
                type="text"
                name={name}
                id={name}
                value={formData[name]}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-blue-100 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder={label}
              />
            </div>
          ))}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={toggleEditMode}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4">Bank Information</h3>
          <p className="mb-2">
            <strong>Bank Name:</strong> {formData.bankName || 'N/A'}
          </p>
          <p className="mb-2">
            <strong>IFSC:</strong> {formData.ifsc || 'N/A'}
          </p>
          <p className="mb-2">
            <strong>Account No:</strong>{' '}
            {formData.accountNo ? '********' + formData.accountNo.slice(-4) : 'N/A'}
          </p>
          <p className="mb-4">
            <strong>Account Name:</strong> {formData.accountName || 'N/A'}
          </p>
          <button
            onClick={toggleEditMode}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default FinancialDetails;
