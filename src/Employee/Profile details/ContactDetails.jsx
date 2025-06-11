import React, { useState, useEffect } from 'react';

const ContactDetails = () => {
    const [formData, setFormData] = useState({
        phone1: '',
        phone2: '',
        personalEmail: '',
        city: '',
        address: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch existing contact details when component mounts
    useEffect(() => {
        const fetchContactDetails = async () => {
            try {
                const response = await fetch('/api/employees/me/contact-details', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch contact details');
                }

                const data = await response.json();
                setFormData({
                    phone1: data.phone1 || '',
                    phone2: data.phone2 || '',
                    personalEmail: data.personalEmail || '',
                    city: data.city || '',
                    address: data.address || '',
                });
            } catch (error) {
                console.error(error.message);
                alert('Could not load contact details');
            } finally {
                setLoading(false);
            }
        };

        fetchContactDetails();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { phone1, personalEmail, city, address } = formData;
        if (!phone1 || !personalEmail || !city || !address) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            const response = await fetch('/api/employees/me/contact-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save contact details');
            }

            alert('Contact details updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error:', error.message);
            alert(error.message);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center p-8">
            Loading contact details...
        </div>
    );

    return (
        <div className="max-w-xl mx-auto my-5 p-5 bg-gray-50 rounded-lg shadow-md font-sans">
            <h2 className="text-2xl mb-5 text-gray-700 font-bold">Contact Details</h2>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-wrap -mx-2">
                        <div className="w-1/2 px-2">
                            <label className="block font-semibold mb-2 text-sm text-gray-700">
                                Phone Number 1
                            </label>
                            <input
                                type="text"
                                name="phone1"
                                value={formData.phone1}
                                onChange={handleChange}
                                placeholder="Phone Number 1"
                                className="w-full p-2.5 border border-gray-300 rounded bg-blue-50 outline-none text-gray-700 text-sm"
                            />
                        </div>
                        <div className="w-1/2 px-2">
                            <label className="block font-semibold mb-2 text-sm text-gray-700">
                                Phone Number 2
                            </label>
                            <input
                                type="text"
                                name="phone2"
                                value={formData.phone2}
                                onChange={handleChange}
                                placeholder="Phone Number 2"
                                className="w-full p-2.5 border border-gray-300 rounded bg-blue-50 outline-none text-gray-700 text-sm"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block font-semibold mb-2 text-sm text-gray-700">
                            Personal E-mail Address
                        </label>
                        <input
                            type="email"
                            name="personalEmail"
                            value={formData.personalEmail}
                            onChange={handleChange}
                            placeholder="Personal Email Address"
                            className="w-full p-2.5 border border-gray-300 rounded bg-blue-50 outline-none text-gray-700 text-sm"
                        />
                    </div>
                    
                    <div>
                        <label className="block font-semibold mb-2 text-sm text-gray-700">
                            City of Residence
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="City of Residence"
                            className="w-full p-2.5 border border-gray-300 rounded bg-blue-50 outline-none text-gray-700 text-sm"
                        />
                    </div>
                    
                    <div>
                        <label className="block font-semibold mb-2 text-sm text-gray-700">
                            Residential Address
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Residential Address"
                            className="w-full p-2.5 border border-gray-300 rounded bg-blue-50 outline-none text-gray-700 text-sm resize-none"
                        ></textarea>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="mt-5 bg-green-400 hover:bg-green-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors duration-300 self-start"
                    >
                        Save
                    </button>
                </form>
            ) : (
                <>
                    <div className="space-y-2.5 text-gray-600">
                        <p><span className="font-bold">Phone Number 1:</span> {formData.phone1}</p>
                        <p><span className="font-bold">Phone Number 2:</span> {formData.phone2}</p>
                        <p><span className="font-bold">Personal Email:</span> {formData.personalEmail}</p>
                        <p><span className="font-bold">City:</span> {formData.city}</p>
                        <p><span className="font-bold">Address:</span> {formData.address}</p>
                    </div>
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="mt-5 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-4 rounded transition-colors duration-300"
                    >
                        Edit
                    </button>
                </>
            )}
        </div>
    );
};

export default ContactDetails;