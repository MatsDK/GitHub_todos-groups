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
