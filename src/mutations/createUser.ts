import { graphql } from "babel-plugin-relay/macro"
import {
  commitMutation,
} from "utils"

const mutation = graphql`
  mutation createUserMutation(
    $input: createUserInput!
  ) {
    token: createUser(input: $input)
  }
`

export default (input: {
  name: string,
}) => commitMutation<{ token: string }>({ mutation, variables: { input } })
