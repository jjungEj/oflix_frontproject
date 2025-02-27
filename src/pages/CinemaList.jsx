import React, { useState, useEffect } from "react";


const CinemaList = ({ selectedRegion }) => {
  const [cinemas, setCinemas] = useState([]);

  useEffect(() => {
    if (!selectedRegion) return;

    const fetchCinemas = async () => {
      try {
        const data = await getCinemasByRegion(selectedRegion);
        setCinemas(data);
      } catch (error) {
        console.error("영화관 목록을 불러오는 중 오류 발생", error);
      }
    };

    fetchCinemas();
  }, [selectedRegion]);

  return (
    <div>
      <h2>영화관 목록</h2>
      {cinemas.length === 0 ? (
        <p>해당 지역에 등록된 영화관이 없습니다.</p>
      ) : (
        <ul>
          {cinemas.map((cinema) => (
            <li key={cinema.id}>
              {cinema.name} ({cinema.location})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CinemaList;
