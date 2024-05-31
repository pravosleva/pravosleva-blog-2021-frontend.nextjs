export const LinkRenderer = (props: any) => (
  // eslint-disable-next-line react/jsx-no-target-blank
  <a href={props.href} target="_blank">
    {props.children}
  </a>
)

export const SelfLinkRenderer = (props: any) => (
  // eslint-disable-next-line react/jsx-no-target-blank
  <a href={props.href} target="_self" className='truncate'>
    {props.children}
  </a>
)
