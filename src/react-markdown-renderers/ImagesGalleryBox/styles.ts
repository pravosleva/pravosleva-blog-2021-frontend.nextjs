import { makeStyles, createStyles } from '@mui/styles'

export const useStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      // border: '1px dashed red',
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
      },
      // @ts-ignore
      [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        '& div:last-child': {
          // maxWidth: '33%',
        },
      },
      gridAutoFlow: 'dense',
      WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',

      '& > img': {
        // border: '1px dashed red',
        height: '200px',
        minWidth: '100%',
        objectFit: 'cover',

        borderRadius: '16px',
        WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
        cursor: 'pointer',
      },
    },
  })
)
