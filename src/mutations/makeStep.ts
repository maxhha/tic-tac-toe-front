import { graphql } from "babel-plugin-relay/macro"
import {
  commitMutation,
} from "utils"

const mutation = graphql`
  mutation makeStepMutation(
    $input: makeStepInput!
  ) {
    makeStep(input: $input) {
      currentPlayer {
        id
      }
    }
  }
`

export default (position: {
  x: number,
  y: number,
}) => commitMutation<{
  makeStep: {
    currentPlayer: {
      id: string,
    } | null,
  } | null,
}>({ mutation, variables: position })
