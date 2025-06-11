import React, { useRef } from 'react';

const JobDetails = () => {
    const employeeId = localStorage.getItem('employeeId');

    const offerLetterRef = useRef(null);
    const birthCertificateRef = useRef(null);
    const guarantorFormRef = useRef(null);
    const degreeCertificateRef = useRef(null);

    const handleUpload = async (file, documentType) => {
        if (!file) {
            alert(`Please select a file for ${documentType}`);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('document', file);
            formData.append('documentType', documentType);

            const response = await fetch(`/api/employees/${employeeId}/upload-document`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                console.error(`Server response: ${errorDetails}`);
                throw new Error(`Failed to upload ${documentType}`);
            }

            alert(`${documentType} uploaded successfully and saved in the database!`);
        } catch (error) {
            console.error(`Error uploading ${documentType}:`, error);
            alert(`Error uploading ${documentType}: ${error.message}`);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Job Details / Upload Documents</h2>
            <div className="space-y-5">

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <label className="w-full sm:w-1/3 font-medium text-gray-700">Upload Offer Letter</label>
                    <input type="file" ref={offerLetterRef} className="flex-grow border p-2 rounded" />
                    <button
                        onClick={() => handleUpload(offerLetterRef.current.files[0], 'offerLetter')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Upload
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <label className="w-full sm:w-1/3 font-medium text-gray-700">Upload Birth Certificate</label>
                    <input type="file" ref={birthCertificateRef} className="flex-grow border p-2 rounded" />
                    <button
                        onClick={() => handleUpload(birthCertificateRef.current.files[0], 'birthCertificate')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Upload
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <label className="w-full sm:w-1/3 font-medium text-gray-700">Upload Guarantor's Form</label>
                    <input type="file" ref={guarantorFormRef} className="flex-grow border p-2 rounded" />
                    <button
                        onClick={() => handleUpload(guarantorFormRef.current.files[0], 'guarantorForm')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Upload
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <label className="w-full sm:w-1/3 font-medium text-gray-700">Upload Degree Certificate</label>
                    <input type="file" ref={degreeCertificateRef} className="flex-grow border p-2 rounded" />
                    <button
                        onClick={() => handleUpload(degreeCertificateRef.current.files[0], 'degreeCertificate')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Upload
                    </button>
                </div>

            </div>
        </div>
    );
};

export default JobDetails;
