import styled from "styled-components";

export const TodoGrid = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  > div {
    width: 49%;

    display: flex;
    flex-direction: column;
  }

  margin-bottom: 200px;
`;

export const Todo = styled.div`
  background-color: ${(props) => props.theme.secondaryBgColor};
  padding: 5px 10px 5px 20px;
  margin-bottom: 20px;

  box-shadow: 3px 4px 4px rgba(0, 0, 0, 0.35);
  border-radius: 10px;
  height: fit-content;
`;

export const TodoTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 7px;

  p {
    margin: 0;
    color: ${(props) => props.theme.textColors[3]};
  }

  div {
    display: flex;
    align-items: center;

    p {
      color: ${(props) => props.theme.textColors[1]};
      margin-left: 10px;
    }

    span {
      color: ${(props) => props.theme.textColors[3]};
    }
  }
`;

export const RightTodo = styled.div`
  display: flex;
  align-self: center;

  p {
    margin: 0;
    color: ${(props) => props.theme.textColors[2]} !important;
  }

  svg {
    margin-top: 4px;
    margin-left: 4px;
    cursor: pointer;
    transform: scale(1);
    padding: 7px;
    width: 15px;
    height: 15px;
    border-radius: 50%;

    :hover {
      background-color: ${(props) => props.theme.mainBgColor};
    }
  }
`;

export const TodoBody = styled.div`
  max-height: 100px;
  overflow: hidden;

  span {
    font-size: 16px;
    color: ${(props) => props.theme.textColors[2]};
  }

  h1 {
    font-size: 24px;
    color: ${(props) => props.theme.textColors[1]};
    margin: 0;
    margin-bottom: 4px;

    span {
      font-size: 18px;
      background: ${(props) => props.theme.gradient};
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
`;

export const ProgressSpan = styled.span`
  font-size: 18px;
  margin-left: 15px;
  color: ${(props) => props.theme.textColors[2]};
`;
