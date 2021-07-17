import styled from "styled-components";

export const Icon = styled.div`
  margin-top: 5px;
  svg {
    width: 18px;
    height: 18px;
    cursor: pointer;
    padding: 6px;
    border-radius: 50%;
    transition: 0.15s ease;

    :hover {
      background-color: ${(props) => props.theme.secondaryBgColor};
    }
  }
`;

export const TodoTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;

  div p {
    margin-left: 10px;

    span {
      color: ${(props) => props.theme.textColors[3]};
    }
  }
`;

export const Timestamp = styled.p`
  font-size: 17px;
  color: ${(props) => props.theme.textColors[3]};
`;

export const DropDown = styled.div`
  position: absolute;
  background-color: ${(props) => props.theme.secondaryBgColor};
  padding: 10px;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  min-width: 140px;
`;

export const TodoTitle = styled.h1`
  margin: 0;
  font-size: 40px;
`;

export const TodoContent = styled.div`
  margin-top: 20px;

  pre {
    font-size: 16px;
    color: ${(props) => props.theme.textColors[1]};
  }
`;

export const AttachedFile = styled.div`
  padding: 10px 0;
  display: flex;
  align-items: baseline;
  margin: 0;

  p {
    text-decoration: none;
    margin: 0;
  }

  span {
    color: ${(props) => props.theme.textColors[3]};
    margin: 0 10px;
  }
`;

export const FileLink = styled.p`
  font-size: 20px;
  background: ${(props) => props.theme.gradient};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
  position: relative;

  ::after {
    content: "";
    left: 0;
    position: absolute;
    width: 0%;
    transition: 0.1s ease-in-out;
    height: 1px;
    bottom: 0;
    background: ${(props) => props.theme.gradient};
  }

  :hover ::after {
    width: 100%;
  }
`;
