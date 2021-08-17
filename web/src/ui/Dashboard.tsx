import styled from "styled-components";

export const Title = styled.h1`
  font-family: "Rubik", sans-serif;
  font-size: 40px;
  width: fit-content;
`;

export const GroupCard = styled.div`
  background-color: ${(props) => props.theme.secondaryBgColor};
  width: 100%;
  border-radius: 5px;
  min-height: 4.5rem;

  > div {
    padding: 5px 20px;

    span {
      cursor: pointer;
      background: ${(props) => props.theme.gradient};
      background-clip: text;
      font-weight: 500;
      font-size: 1.25rem;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    div {
      margin-right: 0.75rem;
      display: flex;
      align-items: center;
      margin-top: 5px;

      p {
        margin: 0;
        color: ${(props) => props.theme.textColors[0]};
      }

      label {
        color: ${(props) => props.theme.textColors[3]};
        margin-left: 0.25rem;
      }
    }
  }
`;

export const GroupsGrid = styled.div`
  box-sizing: content-box;
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
`;

export const TodosWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  grid-gap: 0.5rem;
`;

export const TodoCard = styled.div`
  background-color: ${(props) => props.theme.secondaryBgColor};
  padding: 10px;
  border-radius: 5px;
`;

export const TodoTitle = styled.span`
  color: ${(props) => props.theme.textColors[0]};
  font-weight: 500;
  font-size: 24px;
  margin-top: -0.5rem;
  cursor: pointer;
`;

export const TodoInfo = styled.span`
  color: ${(props) => props.theme.textColors[3]};
  cursor: pointer;
`;
