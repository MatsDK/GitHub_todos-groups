import { ApolloQueryResult } from 'apollo-boost';
import { GroupQuery } from '../generated/apolloComponents';
import { GetRepoObjectQuery } from '../generated/github-apollo-components';

export const responseIsInvalid = <T extends GroupQuery | GetRepoObjectQuery>(
      response: ApolloQueryResult<T>,
      key: string
) => !response || !response.data || !(response.data as any)[key];
