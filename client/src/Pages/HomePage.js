import React, { useState , useEffect  } from 'react';
import ServiceCard from '../components/ServiceCard';
import axios from 'axios';

const HomePage = () => {
  const [services, setServices] = useState([]);
  const [circlePosition, setCirclePosition] = useState(null);
  const [circleColor, setCircleColor] = useState(null);
  const [circleSize, setCircleSize] = useState(20);


  useEffect(() => {
    const fetchData = async () => {
      const apiurl = process.env.SERVICE_HUB_API_URL;
      try {
        const response = await axios.get(apiurl+'services/', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchData();
  }, []);


  const handleCardClick = (x, y, color, link) => {
    setCirclePosition({ x, y });
    setCircleColor(color);
    const intervalId = setInterval(() => {
      setCircleSize((prevSize) => prevSize + 10);

      if (circleSize > Math.max(window.innerWidth, window.innerHeight)) {
        clearInterval(intervalId);
      }
    }, 2);

    setTimeout(() => {
      clearInterval(intervalId);
      window.location.href = link
    }, 1500);
  };

  return (
    <>
      {circlePosition && (
        <div
          className="circle"
          style={{
            position: 'fixed',
            left: circlePosition.x - circleSize / 2,
            top: circlePosition.y - circleSize / 2,
            width: `${circleSize}px`,
            height: `${circleSize}px`,
            borderRadius: '50%',
            background: circleColor,
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        ></div>
      )}
      <div className="min-h-screen flex items-start justify-center pt-10">
        <div className="w-full max-w-6xl p-8">
          <h1 className="text-4xl font-bold mb-4 text-center text-gray-800 font-press-start">SERV1CE<span className='text-red-500'>HUB</span></h1>
          <div className="mb-6 flex justify-center">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border rounded-md w-1/2"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                color1={service.color1}
                color2={service.color2}
                icon={service.icon}
                iconAlt={service.iconAlt}
                onClick={(e) => handleCardClick(e.clientX, e.clientY, service.color1, service.link)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
