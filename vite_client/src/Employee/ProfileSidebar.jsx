import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileSidebar = ({ activeSection, onSectionClick }) => {
  const navigate = useNavigate();

  const sections = [
    'Personal Details',
    'Contact Details',
    'Next of kin Details',
    'Education Qualifications',
    'Guarantor Details',
    'Family Details',
    'Job Details',
    'Financial Details',
  ];

  const handleSectionClick = (section) => {
    onSectionClick(section);
    switch (section) {
      case 'Contact Details':
        navigate('/contact-details');
        break;
      case 'Personal Details':
        navigate('/profile-details');
        break;
      case 'Next of kin Details':
        navigate('/next-of-kin-details');
        break;
      case 'Education Qualifications':
        navigate('/education-qualifications');
        break;
      case 'Guarantor Details':
        navigate('/guarantor-details');
        break;
      case 'Family Details':
        navigate('/family-details');
        break;
      case 'Job Details':
        navigate('/job-details');
        break;
      case 'Financial Details':
        navigate('/financial-details');
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-blue-100 p-5 rounded-xl w-[250px]">
      <ul className="space-y-2">
        {sections.map((section, index) => (
          <li
            key={index}
            className={`text-center font-medium px-5 py-3 rounded-lg cursor-pointer transition-colors duration-300 ${
              activeSection === section
                ? 'bg-green-500 text-white font-semibold border-l-4 border-green-800'
                : 'bg-blue-50 text-gray-800 hover:bg-blue-200'
            }`}
            onClick={() => handleSectionClick(section)}
          >
            {section}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileSidebar;
