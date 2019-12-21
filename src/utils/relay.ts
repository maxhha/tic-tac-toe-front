import {
  commitMutation as relayCommitMutation,
  requestSubscription  as relayRequestSubscription,
  Variables,
  GraphQLTaggedNode,
} from "react-relay"
import { PayloadError, Disposable } from "relay-runtime"
import environment from "environment"

type onCompleted = { responce?: any, errors?: ReadonlyArray<PayloadError> | null }

export const commitMutation = (
  mutation: GraphQLTaggedNode,
  variables: Variables,
) => new Promise<onCompleted>((resolve, reject) => {
    relayCommitMutation(
      environment,
      {
        mutation,
        variables,
        onCompleted: (responce, errors) => resolve({ responce, errors }),
        onError: reject,
      },
    )
  }
)

export const requestSubscription = (
  subscription: GraphQLTaggedNode,
  variables: Variables,
  onNext?: (props: {responce: any, dispose: () => void }) => void,
) => new Promise<any>((resolve, reject) => {
    const sub: Disposable = relayRequestSubscription(
      environment,
      {
        subscription,
        variables,
        onCompleted: resolve,
        onError: reject,
        onNext: (responce: any) => onNext && onNext({responce, dispose: sub.dispose}),
      }
    )
  }
)
