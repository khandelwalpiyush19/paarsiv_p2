import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EmployeeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await fetch(`/api/admin/employees/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch employee details');
                }
                const data = await response.json();
                setEmployee(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');
        if (keys.length > 1) {
            setEmployee((prev) => ({
                ...prev,
                [keys[0]]: {
                    ...prev[keys[0]],
                    [keys[1]]: value,
                },
            }));
        } else {
            setEmployee((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/employees/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employee),
            });

            if (!response.ok) {
                throw new Error('Failed to update employee details');
            }

            navigate('/dashboard-admin');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!employee) {
        return <p className="text-center mt-10 text-gray-700">Loading...</p>;
    }

    return (
        <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
            <h1 className="mb-4 text-2xl font-semibold text-gray-800">Edit Employee Details</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md bg-white p-6 rounded shadow">
                <input
                    name="name"
                    value={employee.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                    className="p-3 border border-gray-300 rounded"
                />
                <input
                    name="lastName"
                    value={employee.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                    className="p-3 border border-gray-300 rounded"
                />
                <input
                    name="email"
                    value={employee.email}
                    onChange={handleChange}
                    placeholder="Email"
                    type="email"
                    required
                    className="p-3 border border-gray-300 rounded"
                />
                <input
                    name="position"
                    value={employee.position}
                    onChange={handleChange}
                    placeholder="Position"
                    required
                    className="p-3 border border-gray-300 rounded"
                />
                <input
                    name="department"
                    value={employee.department}
                    onChange={handleChange}
                    placeholder="Department"
                    required
                    className="p-3 border border-gray-300 rounded"
                />
                <input
                    name="salary"
                    value={employee.salary}
                    onChange={handleChange}
                    placeholder="Salary"
                    type="number"
                    required
                    className="p-3 border border-gray-300 rounded"
                />

                <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="active"
                            value="true"
                            checked={employee.active === true}
                            onChange={() => setEmployee((prev) => ({ ...prev, active: true }))}
                        />
                        Active
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="active"
                            value="false"
                            checked={employee.active === false}
                            onChange={() => setEmployee((prev) => ({ ...prev, active: false }))}
                        />
                        Inactive
                    </label>
                </div>

                <h2 className="text-lg font-semibold text-gray-700 mt-6">Financial Details</h2>
                <input
                    name="financialDetails.bankName"
                    value={employee.financialDetails?.bankName || ''}
                    onChange={handleChange}
                    placeholder="Bank Name"
                    className="p-3 border border-gray-300 rounded"
                />
                <input
                    name="financialDetails.accountNo"
                    value={employee.financialDetails?.accountNo || ''}
                    onChange={handleChange}
                    placeholder="Account Number"
                    className="p-3 border border-gray-300 rounded"
                />
                <input
                    name="financialDetails.ifsc"
                    value={employee.financialDetails?.ifsc || ''}
                    onChange={handleChange}
                    placeholder="IFSC Code"
                    className="p-3 border border-gray-300 rounded"
                />

                <h2 className="text-lg font-semibold text-gray-700 mt-6">Next of Kin</h2>
                <input
                    name="nextOfKin.name"
                    value={employee.nextOfKin?.name || ''}
                    onChange={handleChange}
                    placeholder="Name"
                    className="p-3 border border-gray-300 rounded"
                />
                <input
                    name="nextOfKin.relationship"
                    value={employee.nextOfKin?.relationship || ''}
                    onChange={handleChange}
                    placeholder="Relationship"
                    className="p-3 border border-gray-300 rounded"
                />
                <input
                    name="nextOfKin.phone"
                    value={employee.nextOfKin?.phone || ''}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="p-3 border border-gray-300 rounded"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="p-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                    {loading ? 'Updating...' : 'Update Employee'}
                </button>
            </form>
        </div>
    );
}

export default EmployeeDetails;
