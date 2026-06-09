import styled from 'styled-components';

export const StyledCustomForm = styled.div`
    display: flex;
    flex-direction: row;
    margin: 20px;
    padding: 10px;
    justify-content:space-between;
`;
export const Main = styled.div`
    display:flex;
    flex-direction:column;
    width:95%;
    `;
export const ButtonMenu = styled.div`
    display:flex;
    flex-direction:column;
    width:20px;
    height:200px;
    align-items:center;
    justify-content:space-evenly;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
    padding-left:5px;
    padding-right:5px;
    border-radius:10px;
    `;
    
    export const NewDiv = styled.div`
    position: relative;
    display: flex;
    flex-direction:column;
    width: 95%;
    height: auto;
    margin-bottom: 10px;
    border-radius: 10px;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
    padding:20px;
    cursor:move;
    &:before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 5px;
        background-color: darkblue;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }
`;
export const RowWise = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:space-evenly;
    width:100%;
    align-items:center;
    padding:5px;
    `;
    export const RowWiseSingle = styled.div`
    display:flex;
    flex-direction:row;
    width:55%;
    align-items:center;
    padding:5px;
    justify-content:space-evenly;
    `;
    export const TextBoxContainer = styled.div`
    margin-right:2px; /* Add margin between textboxes */
    width:300px;
`;
export const HorizontalLine = styled.hr`
color:grey;
width:90%;
`;
export const CheckBoxes = styled.div`
display:flex;
flex-direction:row;
align-items:center;
justify-content:space-evenly;
width:100%;
`;
export const ButtonDiv = styled.div`
color:grey;
`;
export const IconContainer = styled.div`
display:flex;
position:absolute;
color:grey;
border-radius: 7px;
background-color: #f2f2f2;
padding:3px;
`;
export const LeftIconContainer = styled.div`
display:flex;
flex-direction:column;
align-items:center;
justify-content:space-evenly;
height:100px;
color:grey;
background-color:red;
`;
