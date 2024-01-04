// ServiceCard.js
import React from 'react';

const ServiceCard = ({ title, description, color1, color2, icon, iconAlt, onClick }) => {
  return (
    <div
      className={`p-4 cursor-pointer rounded-md flex flex-col items-center ${color2}`}
      onClick={onClick}
    >
      <h2 className="text-xl font-bold mb-2 text-white">{title}</h2>
      <div className='flex content-center justify-center max-w-28 p-4'>
        <img src={icon} alt={iconAlt} />
      </div>
      <p className="text-white">{description}</p>
    </div>
  );
};

export default ServiceCard;
