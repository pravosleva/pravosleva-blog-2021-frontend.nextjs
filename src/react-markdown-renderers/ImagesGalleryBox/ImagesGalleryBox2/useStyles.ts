import { makeStyles, createStyles } from '@mui/styles'

export const useStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      '& > .ReactGridGallery > div': {
        gap: '16px',
      },
      '& > .ReactGridGallery img': {
        maxWidth: '100%',
      },
    },

    srLWrapperLayout: {
      // border: '1px solid red',
      // display: 'flex',
      // flexWrap: 'wrap',

      // GRID:
      display: 'grid',
      columnGap: '16px',
      rowGap: '16px',
      
      // @ts-ignore
      [theme.breakpoints.down('sm')]: {
        // border: '1px dashed red',
        width: 'calc(100% + 32px)',
        transform: 'translateX(-16px)',

        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        columnGap: '0px',
        rowGap: '0px',
      },
      // @ts-ignore
      [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        '& div:last-child': {
          // maxWidth: '33%',
        },
      },
      // gridAutoFlow: 'dense',
      WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',

      // // @ts-ignore
      // [theme.breakpoints.down('sm')]: {
      //   '& > img': {
      //     height: '200px',
      //     width: '100%',
      //     objectFit: 'cover',

      //     borderRadius: '0px',
      //     WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
      //     cursor: 'pointer',
      //   },
      // },
      // // @ts-ignore
      // [theme.breakpoints.up('md')]: {},
      '& > img': {
        // @ts-ignore
        [theme.breakpoints.down('md')]: {
          height: '180px',
          width: '100%',
          objectFit: 'cover',

          borderRadius: '0px',
          WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
          cursor: 'pointer',
        },
        
        // @ts-ignore
        [theme.breakpoints.up('md')]: {
          // border: '1px dashed red',
          height: '200px',
          width: '100%',
          objectFit: 'cover',

          borderRadius: '16px',
          WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
          cursor: 'pointer',
        },
      },
    },
  })
)
