import {
  fetchQuery as relayFetchQuery,
  commitMutation as relayCommitMutation,
  requestSubscription  as relayRequestSubscription,
  Variables,
  GraphQLTaggedNode,
} from "react-relay"
import { PayloadError } from "relay-runtime"
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

type onCompleted<R = any> = { response?: R, errors?: ReadonlyArray<PayloadError> | null }

export const commitMutation = <R = any>({
  mutation,
  variables,
}:{
  mutation: GraphQLTaggedNode,
  variables?: Variables,
}) => new Promise<onCompleted<R>>((resolve, reject) => {
    relayCommitMutation(
      environment,
      {
        mutation,
        variables: variables || {},
        onCompleted: (response, errors) => resolve({ response: response as R, errors }),
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
