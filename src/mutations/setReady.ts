import { graphql } from "babel-plugin-relay/macro"
import {
  commitMutation,
} from "utils"

const mutation = graphql`
  mutation setReadyMutation(
    $ready: Boolean!
  ) {
    setReady(ready: $ready) {
      gameActive
    }
  }
`

export default (ready: boolean) => commitMutation<{
  setReady: {
    gameActive: boolean,
  } | null,
}>({ mutation, variables: { ready } })
