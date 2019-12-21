import {
  fetchQuery as relayFetchQuery,
  commitMutation as relayCommitMutation,
  requestSubscription  as relayRequestSubscription,
  Variables,
  GraphQLTaggedNode,
} from "react-relay"
import { PayloadError, Disposable } from "relay-runtime"
import environment from "environment"

export const fetchQuery = ({
  query,
  variables,
}: {
  query: GraphQLTaggedNode,
  variables?: Variables,
}) => relayFetchQuery<any>(
  environment,
  query,
  variables,
)

type onCompleted = { responce?: any, errors?: ReadonlyArray<PayloadError> | null }

export const commitMutation = ({
  mutation,
  variables,
}:{
  mutation: GraphQLTaggedNode,
  variables?: Variables,
}) => new Promise<onCompleted>((resolve, reject) => {
    relayCommitMutation(
      environment,
      {
        mutation,
        variables: variables || {},
        onCompleted: (responce, errors) => resolve({ responce, errors }),
        onError: reject,
      },
    )
  }
)

export const requestSubscription = ({
  subscription,
  variables,
  onCompleted,
  onNext,
  onError,
}: {
  subscription: GraphQLTaggedNode,
  variables?: Variables,
  onCompleted?: () => void,
  onNext?: (response: any) => void,
  onError?: (error: Error) => void,
}) => relayRequestSubscription(
  environment,
  {
    subscription,
    variables: variables || {},
    onCompleted,
    onError,
    onNext,
  }
)
