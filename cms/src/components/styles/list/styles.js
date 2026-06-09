import styled from "styled-components";

export const ListContainer = styled.div`
  display: flex;
`;
export const ListItemHead = styled.div`
  font-weight: bold;
  display: flex;
  margin: 0;
  color: #1381c5;
  padding: 0.5em 1em;
  margin-bottom: 3.5em;
  border-bottom: 1px solid white;
  text-transform: uppercase;
  &:first-child {
    margin-top: 0;
  }
`;
export const ListItem = styled.div`
  display: flex;
  padding: 0.5em 1em;
  &.between {
    justify-content: space-between;
  }
  svg {
    margin-top: 3px;
    margin-right: 10px;
  }
  &.red {
    color: red;
  }
`;
export const ListItemBold = styled.div`
  display: flex;
  font-weight: 600;
  padding: 0.5em 1em;
  svg {
    margin-right: 10px;
  }
`;

export const ListItemQuarter = styled.div`
  display: flex;
  flex: 1 1 25%;
  span {
    margin-left: 10px;
    cursor: pointer;
  }
  &.paid {
    color: green;
  }
  &.canceled {
    color: red;
  }
  &.open {
    color: yellow;
  }
  @media screen and (max-width: 768px) {
    &.hm {
      display: none;
    }
  }
`;
export const More = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;

  /* Default three-dot icon styling */
  width: 32px;
  height: 32px;
  border-radius: 6px;

  svg {
    width: 18px;
    height: 18px;
    color: #64748b;
    transition: all 0.2s ease;
  }

  &:hover {
    background: #f8fafc;
    svg {
      color: #0f172a;
    }
  }

  &.active {
    background: #f1f5f9;
    svg {
      color: #0f172a;
    }
  }

  /* Callback button styling */
  &.callBack {
    width: auto;
    height: 32px;
    padding: 0 12px;
    border-radius: 6px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: #475569;

    svg {
      width: 14px;
      height: 14px;
      color: #475569;
    }

    &:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
      color: #1e293b;

      svg {
        color: #1e293b;
      }
    }

    &.active {
      background: #f1f5f9;
      border-color: #cbd5e1;
      color: #1e293b;

      svg {
        color: #1e293b;
      }
    }
  }

  @media screen and (max-width: 768px) {
    &.callBack {
      padding: 0 10px;
      font-size: 12px;
    }
  }
`;

export const ToolTipContainer = styled.span`
  position: relative;
  z-index: 50;
`;

export const ToolTip = styled.div`
  position: absolute;
  top: 0;
  left: 19px;
  background-color: #fff;
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  margin-bottom: 10px;
  cursor: initial;
  transition: all 0.2s ease-in-out;
  &.language {
    top: 27px;
    left: -80px;
    font-size: 18px;

    @media screen and (max-width: 768px) {
      font-size: 15px;
    }
  }

  &.actions {
    top: 40px;
    left: auto;
    right: 0;
    z-index: 1000;
    border-radius: 12px;
    font-size: 14px;
    padding: 8px;
    min-width: 180px;
    background: white;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    border: 1px solid #f1f1f1;

    button {
      width: 100%;
      padding: 8px 12px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
      border: none;
      background: transparent;
      cursor: pointer;

      &:hover {
        background: #f8f8f8;
      }

      &.delete {
        color: #ef4444;
        &:hover {
          background: #fef2f2;
        }
      }

      svg {
        width: 16px;
        height: 16px;
      }

      span {
        font-size: 14px;
        font-weight: 500;
      }
    }

    @media screen and (max-width: 768px) {
      font-size: 14px;
      min-width: 160px;
    }
  }

  &.hide {
    opacity: 0;
    display: none;
    transform: translateY(-4px);
  }
`;
