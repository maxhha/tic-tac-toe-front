import { execute, DocumentNode } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import {
  Environment,
  Network,
  RecordSource,
  Store,
  RequestParameters,
  Variables,
} from 'relay-runtime';

import { getAuthorizationToken } from "utils"

const subscribtionUri = process.env.REACT_APP_SUBSCRIPTIONS_URL || 'ws://localhost:4000/graphql';

const subscriptionLink = new WebSocketLink({
  uri: subscribtionUri,
  options: {
    lazy: true,
    reconnect: true,
    connectionParams: () => Promise.resolve({ authorization: getAuthorizationToken() }),
  }
})

const networkSubscriptions: any = (operation: {text: DocumentNode}, variables: Variables) =>
  execute(subscriptionLink, {
    query: operation.text,
    variables,
  })

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

const network = Network.create(fetchQuery, networkSubscriptions);
const store = new Store(new RecordSource())

const environment = new Environment({
  network,
  store,
});

export default environment;
