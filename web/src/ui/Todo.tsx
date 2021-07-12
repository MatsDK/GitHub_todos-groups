import styled from "styled-components";

export const TodoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
`;

export const Todo = styled.div`
  background-color: ${(props) => props.theme.secondaryBgColor};
  padding: 5px 20px;
  box-shadow: 3px 4px 4px rgba(0, 0, 0, 0.35);
  border-radius: 10px;
`;
