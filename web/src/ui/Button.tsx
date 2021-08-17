import styled from "styled-components";

export const Button = styled.button`
  cursor: pointer;
  margin-top: 10px;
  padding: 2px 10px;
  font-size: 20px;
  color: ${(props) => props.theme.textColors[0]};
  background: ${(props) => props.theme.gradient};
  border: 0;
  border-radius: 5px;
  transition: 0.1s ease;

  :hover {
    color: ${(props) => props.theme.textColors[1]};
  }
`;

export const DarkButton = styled.button`
  padding: 5px 15px;
  color: ${(props) => props.theme.textColors[3]};
  background: ${(props) => props.theme.secondaryBgColor};
  border: 0;
  outline: none;
  cursor: pointer;
  font-size: 20px;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.25);
  border-radius: 3px;
  transition: 0.1s ease;

  :hover {
    color: ${(props) => props.theme.textColors[1]};
  }
`;
