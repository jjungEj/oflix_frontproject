import React, { useState, useEffect } from "react";
import styled from "styled-components";
import MovieScheduleList from "./MovieScheduleList";
import axios from "axios";
import Header from "../components/Header/Header";

// ✅ 모든 극장 정보 가져오기
const getCinemas = async () => {
  try {
    const response = await fetch("/api/cinemas", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
    });
    if (!response.ok) throw new Error("Failed to fetch theaters");
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return { cinemas: [] };
  }
};

const MovieTicketApp = () => {
  const [allCinemas, setAllCinemas] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [cinemas, setCinemas] = useState([]);
  const [selectedTheaterHallId, setSelectedTheaterHallId] = useState(null);

  useEffect(() => {
    getCinemas()
      .then((response) => {
        if (!response || !response.cinemas) {
          console.error("Invalid response format:", response);
          return;
        }

        const data = response.cinemas;
        setAllCinemas(data);

        const uniqueRegions = [...new Set(data.map((cinema) => cinema.region))];
        setRegions(uniqueRegions);

        if (uniqueRegions.length > 0) {
          setSelectedRegion(uniqueRegions[0]);
          updateCinemasByRegion(uniqueRegions[0], data);
        }
      })
      .catch((err) => console.error("❌ Error fetching cinemas:", err));
  }, []);

  const updateCinemasByRegion = (region, data) => {
    const filteredCinemas = data.filter((cinema) => cinema.region === region);
    setCinemas(filteredCinemas);
  };

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    updateCinemasByRegion(region, allCinemas);
  };

  return (
    <Container>
      <Header />
      <MainContent>
        <Title>전체 극장</Title>

        <RegionTab>
          {regions.map((region) => (
            <RegionButton
              key={region}
              active={selectedRegion === region ? "true" : "false"}
              onClick={() => handleRegionClick(region)}
            >
              {region}
            </RegionButton>
          ))}
        </RegionTab>

        {selectedRegion && (
          <TheaterListContainer>
            <TheaterGrid>
              {cinemas.length > 0 ? (
                cinemas.map((theater) => (
                  <TheaterColumn
                    key={theater.id}
                    onClick={() => setSelectedTheaterHallId(theater.id)}
                  >
                    {theater.name}
                  </TheaterColumn>
                ))
              ) : (
                <NoData>해당 지역에 극장이 없습니다.</NoData>
              )}
            </TheaterGrid>
          </TheaterListContainer>
        )}

        {selectedTheaterHallId && (
          <MovieScheduleList theaterHallId={selectedTheaterHallId} />
        )}
      </MainContent>
    </Container>
  );
};

export default MovieTicketApp;

// ✅ Styled Components
const Container = styled.div`
  width: 100%;
`;

const MainContent = styled.div`
  width: 80%;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
  color: black;
`;

const RegionTab = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  background: #f1f1f1;
  padding: 10px;
  border-radius: 8px;
  border-bottom: 3px solid #ccc;
`;

const RegionButton = styled.button`
  background: ${({ active }) =>
    active === "true" ? "#5a5a5a" : "transparent"};
  color: ${({ active }) => (active === "true" ? "white" : "#333")};
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #5a5a5a;
    color: white;
  }
`;

const TheaterListContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
`;

const TheaterGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  border-top: 2px solid #ddd;
  padding-top: 15px;
`;

const TheaterColumn = styled.div`
  flex: 1;
  min-width: 150px;
  font-size: 16px;
  color: #333;
  font-weight: bold;
  cursor: pointer;
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
  border-radius: 5px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #f1f1f1;
  }
`;

const NoData = styled.p`
  color: gray;
  font-size: 14px;
  margin-top: 10px;
`;