import React, { useEffect, useState, useCallback } from 'react';

const EducationQualifications = () => {
    const [academicRecords, setAcademicRecords] = useState([]);
    const [professionalQualifications, setProfessionalQualifications] = useState([]);

    const [academicInput, setAcademicInput] = useState({ institution: '', details: '' });
    const [professionalInput, setProfessionalInput] = useState({ title: '', organization: '', duration: '', description: '' });

    const [showAcademicForm, setShowAcademicForm] = useState(false);
    const [showProfessionalForm, setShowProfessionalForm] = useState(false);

    const token = localStorage.getItem('token');

    const fetchQualifications = useCallback(async () => {
        try {
            const res = await fetch('/api/employees/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setAcademicRecords(data.academicRecords || []);
            setProfessionalQualifications(data.professionalQualifications || []);
        } catch (error) {
            console.error('Error fetching qualifications:', error);
        }
    }, [token]);

    useEffect(() => {
        fetchQualifications();
    }, [fetchQualifications]);

    const handleAddAcademic = async () => {
        if (!academicInput.institution || !academicInput.details) return;

        try {
            const res = await fetch('/api/employees/me/academic-records', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(academicInput),
            });

            if (!res.ok) throw new Error('Failed to add academic record');

            const updated = await res.json();
            setAcademicRecords(updated.academicRecords || []);
            setAcademicInput({ institution: '', details: '' });
            setShowAcademicForm(false);
        } catch (error) {
            console.error('Error adding academic record:', error);
        }
    };

    const handleAddProfessional = async () => {
        if (!professionalInput.title || !professionalInput.duration) return;

        try {
            const res = await fetch('/api/employees/me/professional-qualifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(professionalInput),
            });

            if (!res.ok) throw new Error('Failed to add professional qualification');

            const updated = await res.json();
            setProfessionalQualifications(updated.professionalQualifications || []);
            setProfessionalInput({ title: '', organization: '', duration: '', description: '' });
            setShowProfessionalForm(false);
        } catch (error) {
            console.error('Error adding professional qualification:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-5 bg-gray-50 rounded-lg shadow-sm">
            {/* Academic Records Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Academic Records</h2>
                    <button 
                        onClick={() => setShowAcademicForm(!showAcademicForm)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        {showAcademicForm ? 'Cancel' : 'Add Academic Record'}
                    </button>
                </div>

                {showAcademicForm && (
                    <div className="mb-6 space-y-3">
                        <input
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Institution"
                            value={academicInput.institution}
                            onChange={(e) => setAcademicInput({ ...academicInput, institution: e.target.value })}
                        />
                        <input
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Details (e.g., Degree, Dates)"
                            value={academicInput.details}
                            onChange={(e) => setAcademicInput({ ...academicInput, details: e.target.value })}
                        />
                        <button 
                            onClick={handleAddAcademic}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Save
                        </button>
                    </div>
                )}

                {academicRecords.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No academic records added yet.</p>
                ) : (
                    <div className="space-y-4">
                        {academicRecords.map((record, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-semibold text-gray-800">{record.institution}</h3>
                                <p className="text-gray-600">{record.details}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Professional Qualifications Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Professional Qualifications</h2>
                    <button 
                        onClick={() => setShowProfessionalForm(!showProfessionalForm)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        {showProfessionalForm ? 'Cancel' : 'Add Professional Qualification'}
                    </button>
                </div>

                {showProfessionalForm && (
                    <div className="mb-6 space-y-3">
                        <input
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Title"
                            value={professionalInput.title}
                            onChange={(e) => setProfessionalInput({ ...professionalInput, title: e.target.value })}
                        />
                        <input
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Organization (optional)"
                            value={professionalInput.organization}
                            onChange={(e) => setProfessionalInput({ ...professionalInput, organization: e.target.value })}
                        />
                        <input
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Duration"
                            value={professionalInput.duration}
                            onChange={(e) => setProfessionalInput({ ...professionalInput, duration: e.target.value })}
                        />
                        <input
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Description (optional)"
                            value={professionalInput.description}
                            onChange={(e) => setProfessionalInput({ ...professionalInput, description: e.target.value })}
                        />
                        <button 
                            onClick={handleAddProfessional}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Save
                        </button>
                    </div>
                )}

                {professionalQualifications.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No professional qualifications added yet.</p>
                ) : (
                    <div className="space-y-4">
                        {professionalQualifications.map((qualification, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-semibold text-gray-800">{qualification.title}</h3>
                                {qualification.organization && <p className="text-gray-600">{qualification.organization}</p>}
                                <p className="text-gray-600">{qualification.duration}</p>
                                {qualification.description && <p className="text-gray-600">{qualification.description}</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EducationQualifications;