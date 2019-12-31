import { graphql } from "babel-plugin-relay/macro"
import {
  commitMutation,
} from "utils"

const mutation = graphql`
  mutation exitRoomMutation {
    exitRoom
  }
`

export default () => commitMutation<{
  exitRoom: boolean | null,
}>({ mutation })
