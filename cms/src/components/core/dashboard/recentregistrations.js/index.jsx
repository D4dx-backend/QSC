import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getData } from "../../../../backend/api"; // Assuming you're using a similar API function

// Styled components for layout
const Container = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
`;

const SeeAllButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 0.9rem;
  color: #346bff;
  cursor: pointer;
`;

const RegistrationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const RegistrationItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const Name = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #333;
`;

const Time = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const RecentRegistrations = ({ eventId }) => {
  console.log(eventId, "eventId"); // Check if eventId is correct

  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const fetchRecentRegistrations = async () => {
      try {
        const response = await getData({}, `ticket-registration/recent-registration/${eventId}`);
        console.log(response, "response recent");
        setRegistrations(response.data.recentRegistrations);
        // const filteredRegistrations = response.data.recentRegistrations.filter(registration => registration.type === 'stage A');
        // setRegistrations(filteredRegistrations);
      } catch (error) {
        console.error("Error fetching recent registrations:", error);
      }
    };

    fetchRecentRegistrations();
  }, [eventId]);

  // Ensure that registrations is an array before calling map
  return (
    <Container>
      <Header>
        <Title>Recent Registrations</Title>
        <SeeAllButton>See All</SeeAllButton>
      </Header>
      {registrations.length > 0 ? (
        <RegistrationList>
          {registrations.map((registration, index) => (
            <RegistrationItem key={index}>
              <Avatar src={registration.avatar || "default-avatar.png"} />
              <div>
                <Name>{registration.name}</Name>
                <Time>
                  {registration.time}, {registration.date}
                </Time>
              </div>
            </RegistrationItem>
          ))}
        </RegistrationList>
      ) : (
        <p>No recent registrations found</p>
      )}
    </Container>
  );
};
export default RecentRegistrations;
