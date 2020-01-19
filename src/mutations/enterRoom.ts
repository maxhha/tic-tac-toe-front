import { graphql } from "babel-plugin-relay/macro"
import {
  commitMutation,
} from "utils"

const mutation = graphql`
  mutation enterRoomMutation(
    $id: ID!
  ) {
    enterRoom(id: $id) {
      gameActive
    }
  }
`

export default (variables: {
  id: string,
}) => commitMutation<{
  enterRoom: {
    gameActive: boolean,
  },
}>({ mutation, variables })
