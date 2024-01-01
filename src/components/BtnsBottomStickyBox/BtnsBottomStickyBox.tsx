import { styled } from '@mui/material/styles'
// import Container from '@mui/material/Container'

const CustomBox = styled('div')<any>(({ theme }) => {
  // console.log(theme.breakpoints.values)
  return ({
    width: '100%',
    // color: theme.palette.success.main,
    padding: theme.spacing(2),
    // border: '1px dashed red',
    maxWidth: theme.breakpoints.values.xs,
    margin: '0 auto',
  })
});

export const BtnsBottomStickyBox = ({ children }: any) => {
  return (
    <div
      style={{
        position: 'sticky',
        bottom: '0px',
        backgroundColor: '#FFF',
        boxShadow: '0px 0px 5px 5px rgba(0, 0, 0, 0.3)',
        // padding: '20px',
        // border: '1px dashed red',
      }}
    >
      <CustomBox maxWidth='xs'>
        {children}
      </CustomBox>
    </div>
  )
}
