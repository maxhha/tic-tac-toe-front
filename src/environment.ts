import {
  Environment,
  Network,
  RecordSource,
  Store,
  RequestParameters,
  Variables,
} from 'relay-runtime';

import { getAuthorizationToken } from "utils"

const fetchQuery = async (
  operation: RequestParameters,
  variables: Variables,
) => {
  return fetch(process.env.REACT_APP_GRAPHQL_URL || "", {
    method: 'POST',
    headers: {
      "authorization": getAuthorizationToken(),
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text, // GraphQL text from input
      variables,
    }),
  }).then(response => {
    return response.json();
  })
}

const network = Network.create(fetchQuery);
const store = new Store(new RecordSource())

const environment = new Environment({
  network,
  store,
});

export default environment;
