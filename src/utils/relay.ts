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

export const commitMutation = <R = any>({
  mutation,
  variables,
}:{
  mutation: GraphQLTaggedNode,
  variables?: Variables,
}) => new Promise<R>((resolve, reject) => {
    relayCommitMutation(
      environment,
      {
        mutation,
        variables: variables || {},
        onCompleted: (response, errors) => {
          if (errors)
            reject(errors)
          resolve(response as R)
        },
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
