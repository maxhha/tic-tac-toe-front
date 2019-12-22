import { graphql } from "babel-plugin-relay/macro"
import {
  commitMutation,
} from "utils"

const mutation = graphql`
  mutation createUserMutation(
    $input: createUserInput!
  ) {
    createUser(input: $input)
  }
`

export default (input: {
  name: string,
}) => commitMutation<{ createUser: string | null }>({ mutation, variables: { input } })
