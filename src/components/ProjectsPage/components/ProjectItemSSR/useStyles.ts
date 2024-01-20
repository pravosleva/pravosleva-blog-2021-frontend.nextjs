import { makeStyles } from '@mui/styles'

const $color_white = '#fff'
const $color_prime = '#5ad67d'
// const $color_grey = '#e2e2e2'
const $color_grey_dark = '#a2a2a2'

export const useStyles = makeStyles((theme) => ({
  blogCard: {
    minWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 3px 7px -1px rgba(0,0,0,.1)',
    background: '#fff',
    lineHeight: 1.4,
    fontFamily: 'Montserrat, system-ui',
    borderRadius: '16px',
    overflow: 'hidden',
    zIndex: 0,
    // @ts-ignore
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      maxWidth: '700px',
    },
    // @ts-ignore
    [theme.breakpoints.down('sm')]: {},
  },

  meta: {
    position: 'relative',
    zIndex: 0,
    height: '200px',
    // @ts-ignore
    [theme.breakpoints.up('sm')]: {
      flexBasis: '40%',
      height: 'auto',
    },
    // @ts-ignore
    [theme.breakpoints.down('sm')]: {},
  },
  photo: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'all 1s',
  },
  details: {
    margin: 'auto',
    // padding: 0,
    // listStyle: 'none',
    // listStyleType: 'none',
    '& ul': {
      margin: 'auto',
      padding: 0,
      listStyle: 'none',
      listStyleType: 'none',
    },

    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '-100%',
    transition: 'left .2s',
    background: 'rgba(#000, .6)',
    color: '#fff',
    padding: '10px 16px',
    width: '100%',
    fontSize: '.9rem',
    '& a': {
      textDecoration: 'underline',
      color: '#FFC800',
      fontWeight: 'bold',
      '&:hover': {
        // color: $color_prime;
      },
    },
    '& > ul li': {
      display: 'inline-block',
    },
    '& > .author::before': {
      // font-family: FontAwesome;
      marginRight: '16px',
      // content: "\f007";
    },

    '& > .date::before': {
      // font-family: FontAwesome;
      // font-family: "Font Awesome 5 Free";
      // font-family: Font Awesome 5 Free;
      marginRight: '16px',
      // content: "\f133" !important;
      listStyleType: 'none',
      fontWeight: 900,
    },

    '& > .tags': {
      '& > ul::before': {
        // font-family: "Font Awesome 5 Free" !important;
        // content: "\f02b";
        listStyleType: 'none',
        marginRight: '16px',
        // font-weight: 400;
      },
      '& > li': {
        marginRight: '4px',
        '&:first-child': {
          marginLeft: '0px',
        }
      }
    }
  },
  description: {
    // max-width: 300px;
    padding: '1rem',
    background: '#fff',
    position: 'relative',
    zIndex: 1,
    
    // & > * {
    //   border: 1px solid red;
    // }
    
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    '& h1, h2': {
      fontFamily: 'Montserrat, sans-serif',
    },
    '& h1': {
      lineHeight: 1,
      margin: 0,
      fontSize: '1.7rem',
    },
    '& h2': {
      fontSize: '0.8rem',
      fontWeight: 300,
      textTransform: 'uppercase',
      color: $color_grey_dark,
      marginTop: '5px',
    },
    readMore: {
      marginTop: 'auto',
      // border: 1px solid red;
      textAlign: 'right',
      
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: '16px',
      alignItems: 'center',

      '& a': {
        // color: $color_prime;
        // display: inline-block;
        position: 'relative',
        textDecoration: 'none',
        // &:after {
        //   content: "\f061";
        //   font-family: FontAwesome;
        //   margin-left: -10px;
        //   opacity: 0;
        //   vertical-align: middle;
        //   transition: margin .3s, opacity .3s;
        // }

        // &:hover:after {
        //   margin-left: 5px;
        //   opacity: 1;
        // }
      }
    },
    // @ts-ignore
    [theme.breakpoints.up('sm')]: {
      flexBasis: '60%',
      '&:before': {
        transform: 'skewX(-3deg)',
        content: "",
        background: $color_white,
        width: '30px',
        position: 'absolute',
        left: '-10px',
        top: 0,
        bottom: 0,
        zIndex: -1,
      },
    },
    // @ts-ignore
    [theme.breakpoints.down('sm')]: {},
  },
  par: {
    fontSize: '13px',
    position: 'relative',
    // margin: 1rem 0 0;
    // '&:first-of-type': {
      // margin-top: 1.25rem;
      '&:before': {
        content: '',
        position: 'absolute',
        height: '5px',
        background: $color_prime,
        width: '35px',
        top: '-0.75rem',
        borderRadius: '3px',
      },
    // },
  },
  '&:hover': {
    '& > .details': {
      left: '0% !important',
    },
  },

  readMore: {
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'flex-end',
  },
}))
