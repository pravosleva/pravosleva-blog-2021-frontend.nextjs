import styled from 'styled-components'


export const StickyH2Wrapper = styled('h2').attrs({
  className: 'backdrop-blur--lite'
})`
  position: sticky;
  top: 0;
  margin: 0px 0px 16px 0px;
  padding: 16px 16px 16px 16px;
  border-bottom: 1px solid lightgray;
  z-index: 1;

  display: flex;
  flex-direction: column;
  gap: 8px;
`

type TStickyH2Props = {
  label: string;
  description?: string;
  Icon: React.ReactNode;
}
export const StickyH2 = ({
  label,
  Icon,
  description,
}: TStickyH2Props) => {
  return (
    <StickyH2Wrapper>
      <h2 style={{ margin: 0, display: 'inline-flex', flexDirection: 'row', gap: '16px' }} className='truncate'><span>{Icon}</span><span>{label}</span></h2>
      {!!description && (
        <div style={{ fontSize: '13px' }}>{description}</div>
      )}
    </StickyH2Wrapper>
  )
}


export const StickyTopBox = styled('div').attrs({
  className: 'backdrop-blur--lite truncate'
})`
  position: sticky;
  top: 0;
  margin: 0px 0px 0px 0px;
  padding: 16px 16px 16px 16px;
  // border-bottom: 1px solid lightgray;
  z-index: 1;

  display: flex;
  flex-direction: column;
  gap: 8px;
`
