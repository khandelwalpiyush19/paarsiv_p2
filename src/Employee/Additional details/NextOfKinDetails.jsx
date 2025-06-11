import React, { useEffect, useState } from 'react';

function NextOfKinDetails() {
    const [formData, setFormData] = useState({
        name: '',
        occupation: '',
        phone: '',
        relationship: 'Relative',
        address: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/employees/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (data?.nextOfKin) {
                    setFormData(data.nextOfKin);
                }
            } catch (error) {
                setError('Failed to fetch next of kin data.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/employees/me/next-of-kin-details', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to save next of kin details');
            }

            alert('Next of kin details updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving next of kin details:', error);
            setError('Error saving next of kin details.');
        }
    };

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md mt-8">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Next of Kin Details</h2>

                {error && (
                    <div className="mb-4 text-red-600 font-medium">
                        {error}
                    </div>
                )}

                {!isEditing ? (
                    <div className="space-y-3">
                        <p><strong>Name:</strong> {formData.name || 'N/A'}</p>
                        <p><strong>Occupation:</strong> {formData.occupation || 'N/A'}</p>
                        <p><strong>Phone:</strong> {formData.phone || 'N/A'}</p>
                        <p><strong>Relationship:</strong> {formData.relationship || 'N/A'}</p>
                        <p><strong>Address:</strong> {formData.address || 'N/A'}</p>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            Edit
                        </button>
                    </div>
                ) : (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Occupation</label>
                            <input
                                type="text"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Relationship</label>
                            <select
                                name="relationship"
                                value={formData.relationship}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            >
                                <option value="Relative">Relative</option>
                                <option value="Friend">Friend</option>
                                <option value="Colleague">Colleague</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 h-24 resize-none"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default NextOfKinDetails;
