import React from "react"
import environment from "environment"
import {
  QueryRenderer as RelayQueryRenderer,
  Variables,
  GraphQLTaggedNode,
} from "react-relay"

interface Props extends Variables {
  query: GraphQLTaggedNode,
  render: (props: any) => React.ReactNode,
  renderNull?: () => React.ReactNode,
  renderError?: (error: Error) => React.ReactNode,
  variables?: Variables,
}

export const QueryRenderer: React.FC<Props> = ({
  query,
  render,
  renderNull,
  renderError,
  variables,
  ...rest
}) => (
  <RelayQueryRenderer
    query={query}
    render={({ error, props }) => {
      if (error) {
        console.error(error)
        if (renderError)
          return renderError(error)
      }
      if (props) {
        return render({ ...rest, ...props as any})
      }
      if (renderNull) {
        return renderNull()
      }
      return null
    }}
    environment={environment}
    variables={variables || {}}
  />
)
