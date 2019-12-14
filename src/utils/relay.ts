import {
  commitMutation as relayCommitMutation,
  Variables,
  GraphQLTaggedNode,
} from "react-relay"
import { PayloadError } from "relay-runtime"
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
