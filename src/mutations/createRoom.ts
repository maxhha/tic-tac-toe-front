import { graphql } from "babel-plugin-relay/macro"
import {
  commitMutation,
} from "utils"

const mutation = graphql`
  mutation createRoomMutation(
    $name: String!
  ) {
    createRoom(name: $name){
      id
    }
  }
`

export default (variables: {
  name: string,
}) => commitMutation<{
  createRoom: {
    id: string,
  } | null,
}>({ mutation, variables })
