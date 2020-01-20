type QueryRendererProps<V> = {
  variables: V,
  renderNull?: () => React.ReactNode,
  renderError?: (error: Error) => React.ReactNode,
}
type QueryContainerType<Q,V> = <P>(render: (props: Q & P) => JSX.Element) => React.FC<P & QueryRendererProps<V>>
