type TProps = {
  name: string;
  onRemoveNamespace: ({ name }: { name: string }) => void;
}

export const NamespaceListItem = ({
  name,
  onRemoveNamespace,
}: TProps) => {
  return (
    <div
      style={{
        // border: '1px solid red',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {name}
      <button onClick={() => onRemoveNamespace({ name, })}>Del ns</button>
    </div>
  )
}
