import styled from "styled-components";
import { appTheme } from "../../project/brand/project";
export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
  padding-bottom: 50px;
  background-color: #f3f8fb;
  &.center {
    text-align: center;
    justify-content: center;
  }
  @media screen and (max-width: 768px) {
    flex-direction: column;
    padding-bottom: 10px;
  }
`;
export const Section = styled.div`
  width: 50%;
  display: flex;
  margin-bottom: auto;
  @media (max-width: 768px) {
    width: 80%;
  }
`;
export const Logo = styled.div`
  margin-top: 15px;
  width: 100%;
  display: flex;
  /* max-width: 1200px; */
  margin: auto;
  justify-content: space-between;
  @media (max-width: 425px) {
    img {
      width: 25px;
    }
  }
  .header-logo {
    display: flex;
    align-items: center;
    padding-left: 44px;
    width: 30%;
    @media (max-width: 425px) {
      padding-left: 20px;
    }
    @media (max-width: 320px) {
      padding-left: 10px;
    }
  }
  .header-btn {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 70%;
    @media (max-width: 320px) {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  @media (max-width: 320px) {
    display: flex;
    flex-direction: column;
  }
`;
export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40%;
  padding-bottom: 50px;
  margin-top: 20px;
  /* background-color: yellow; */
  justify-content: center;
  /* max-width: 1200px; */
  width: 100%;
  margin: auto;
  margin: 20px auto;
  margin-bottom: 0px;
  img {
    max-width: 100%;
  }
  @media screen and (max-width: 1200px) and (min-width: 768px) {
    max-width: 768px;
  }
  @media screen and (max-width: 768px) {
    flex: 1 1 100%;
    width: auto;
    padding: 10px;
    margin: 0px auto;
  }
`;

export const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    max-width: 100%;
    max-height: 64vh;
    object-fit: cover;
  }
  @media screen and (max-width: 768px) {
    width: 100%;
    &.hm {
      display: none;
    }
  }
`;

export const MainHeader = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 30px;
  flex-direction: column;
`;
export const HeaderContent = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h5 {
    font-size: 24px;
    padding: 0;
    margin: 0;
  }
  p {
    font-size: 16px;
    padding: 0;
    color: #525866;
    margin: 0;
  }
`;

export const Left = styled.div`
  display: flex;
  justify-content: center;
  /* background-color: red; */
  align-items: center;
  width: 40%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const Right = styled.div`
  display: flex;
  /* position: fixed;
right:0; */
  width: 40%;
  border-radius: 6px;
  justify-content: center;
  position: relative;
  margin-bottom: auto;
  @media (max-width: 768px) {
    width: 100%;
  }
  @media (max-width: 1024px) {
  }
`;

export const PaymentContainer = styled.div`
  width: 100%;
  max-width: 500px;
  top: 120px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid #e2e4e9;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  @media (max-width: 375px) {
  }
`;

export const Title = styled.h5`
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 5px;
`;

export const Subtitle = styled.p`
  color: #6b7280;
  font-size: 14px;
  margin: 0 0 20px;
`;
export const Coupon = styled.p`
  font-size: 14px;
  padding: 0;
  margin: 0;
  padding-bottom: 10px;
`;
export const InputGroup = styled.div`
  display: flex;
  /* flex-direction: column; */
  margin-bottom: 20px;
`;

export const CouponInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #e2e4e9;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  font-size: 14px;
`;

export const ApplyButton = styled.button`
  padding: 10px 15px;
  border: none;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: #000;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #333;
  }
`;

export const PlanDetails = styled.div`
  margin-bottom: 20px;
`;

export const PlanTitle = styled.h6`
  font-size: 16px;
  display: flex;
  flex-direction: column;
  margin: 0 0 10px;
`;

export const BenefitList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  border-bottom: 1px solid rgba(226, 228, 233, 1);

  li {
    display: flex;
    align-items: center;
    margin-bottom: 5px;

    svg {
      margin-right: 8px;
      color: #63e6be;
    }

    span {
      font-size: 14px;
      color: #374151;
    }
  }
`;

export const PriceBreakdown = styled.div`
  /* margin-bottom: 20px; */
  /* background-color: red; */
  display: flex;
  flex-direction: column;
  gap: 8px;

  div {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 5px;

    &.total {
      font-size: 16px;
      display: flex;
      /* flex-direction: column; */

      font-weight: bold;
    }

    span {
      color: #6b7280;
    }

    strong {
      color: #111827;
    }
  }
`;

export const PayNowButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #f9fafb;
  color: #d1d5db;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: not-allowed;
`;

export const SecureText = styled.div`
  margin-top: 10px;
  background-color: rgba(239, 250, 246, 1);
  display: flex;
  padding: 10px;
  border-radius: 10px;
  width: 65%;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #6b7280;

  svg {
    margin-right: 5px;
    color: #10b981;
  }
`;

// Responsive Container
export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 40px 20px;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;
export const HeadingContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 5px;
  align-items: center;
  flex-direction: column;
`;
export const MainHead = styled.div`
  font-size: 24px;
  font-weight: 600;
`;
export const Mainsub = styled.div`
  font-size: 16px;
  color: #525866;
`;
export const Plan = styled.div`
  background-color: ${({ isHighlighted }) => (isHighlighted ? "#f0f8ff" : "#fff")};
  border: 1px solid ${({ isHighlighted }) => (isHighlighted ? "#007bff" : "#ddd")};
  border-radius: 10px;
  width: 30%;
  padding: 20px;
  text-align: center;
  box-shadow: ${({ isHighlighted }) => (isHighlighted ? "0 5px 15px rgba(0, 123, 255, 0.3)" : "none")};
  transition: all 0.3s ease;
  transform: ${({ isHighlighted }) => (isHighlighted ? "scale(1.05)" : "scale(1)")};

  :hover {
    border-color: #0056b3;
    background-color: ${({ isHighlighted }) => (isHighlighted ? "#e6f7ff" : "#f9f9f9")};
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 86, 179, 0.3);
  }
  @media (max-width: 768px) {
    width: 90%;
    max-width: 400px;
    transform: scale(1);
    margin-bottom: 20px;
  }
`;

// Header Section
export const PlanHeader = styled.div`
  border-bottom: 1px solid rgba(226, 228, 233, 1);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PlanBadge = styled.div`
  padding: 6px;
  font-size: 14px;
  border-radius: 5px;
  background-color: rgba(241, 241, 241, 1);
`;

export const DiscountBadge = styled.div`
  padding: 5px;
  font-size: 12px;
  border-radius: 10px;
  background-color: #cbf5e5;
  color: #2d9f75;
`;

export const PlanDescription = styled.p`
  line-height: 25px;
  text-align: left;
  color: black;
  font-size: 14px;
`;

// Price Section
export const PriceSection = styled.div`
  border-bottom: 1px solid rgba(226, 228, 233, 1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
`;

export const Price = styled.h1`
  font-size: 30px;
  color: #333;
  margin: 0;
`;

export const PriceFrequency = styled.p`
  color: #666;
  margin: 0;
`;

// Features Section
export const Features = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;
  text-align: left;
  font-size: 14px;
`;

export const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  margin: 8px 0;

  span {
    margin-left: 8px;
  }

  .check {
    color: green;
    font-weight: bold;
  }

  .cross {
    color: red;
    text-decoration: line-through;
  }
`;

// Button
export const Button = styled.button`
  background-color: ${appTheme.primary.base};
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  width: 100%;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${appTheme.primary.base};
  }

  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 18px;
  }
`;
