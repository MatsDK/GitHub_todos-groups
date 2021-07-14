import gql from "graphql-tag";

export const getTypeQuery = gql`
  query getTypeQuery($owner: String!, $name: String!, $expression: String!) {
    repository(owner: $owner, name: $name) {
      object(expression: $expression) {
        __typename
        # 	... on Blob {
        #         text
        #       }
      }
    }
  }
`;
