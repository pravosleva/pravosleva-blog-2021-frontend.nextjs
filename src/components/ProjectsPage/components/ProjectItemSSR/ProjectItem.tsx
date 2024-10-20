import clsx from 'clsx';
// import classes from './ProjectItem.module.scss'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
// import Link from 'next/link'
import Link from '~/components/Link'
import { Button } from '@mui/material'
import { ELinkColor, ELinkIcon } from '../ProjectItem/types'
import TelegramIcon from '@mui/icons-material/Telegram'
import LinkIcon from '@mui/icons-material/Link'
import { useStyles } from '../ProjectItemSSR/useStyles'

type TProps = {
  title: string;
  brief?: string;
  descr?: string;
  tags: string[];
  author: string;
  uiDate: string;
  links: {
    href: string;
    as: string;
    text: string;
    color: ELinkColor;
    icon: ELinkIcon;
    isExternal?: boolean;
  }[];
  img: {
    src: string;
    alt: string;
    color: {
      average: string;
    };
  };
  isLast?: boolean;
};

const linkColorMap: {
  [key in ELinkColor]: {
    text: string;
    bg: string;
    hover: string;
    focus: string;
  };
} = {
  [ELinkColor.TG]: {
    text: '#fff',
    bg: '#0088cc',
    hover: '#63bdff',
    focus: '#63bdff',
  },
  [ELinkColor.TG_OUTLINE]: {
    text: '#0088cc',
    bg: '#fff',
    hover: '#fff',
    focus: '#fff',
  },
  [ELinkColor.YELLOW]: {
    text: '#000',
    bg: '#FFC800',
    hover: '#FF8E53',
    focus: '#FF8E53',
  },
}
const linkIconMap: {
  [key in ELinkIcon]: React.ReactNode;
} = {
  [ELinkIcon.ARROW]: <ArrowForwardIcon />,
  [ELinkIcon.LINK]: <LinkIcon />,
  [ELinkIcon.TG]: <TelegramIcon />,
}

export const ProjectItem = ({ uiDate, title, brief, descr, tags, author, img, links,
  // isLast,
}: TProps) => {
  const muiStyles = useStyles()
  return (
    <div className={clsx(
      muiStyles.blogCard,
      // { [classes.alt]: isLast }
    )}>
      <div className={muiStyles.meta}>
        <div
          className={muiStyles.photo}
          style={{
            backgroundImage: `radial-gradient(circle, ${img.color.average} 10%, ${img.color.average} 100%), url(${img.src})`,
          }}
        ></div>
        <ul className={clsx(muiStyles.details, 'details')}>
          {!!author && <li className={'author'}>{author}</li>}
          <li className={clsx('date')}>{uiDate}</li>
          {
            tags.length > 0 && (
              <li className={'tags'}>
                <ul>
                  {tags.map((t) => (
                    <li key={t}>
                      <Link href='/blog/q/[search_query_title]' as={`/blog/q/${t}`}>
                        #{t}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            )
          }
        </ul>
      </div>
      <div className={muiStyles.description}>
        <h1>{title}</h1>
        <h2>{brief || ''}</h2>
        {!!descr && <p className={muiStyles.par}>{descr}</p>}
        <div className={muiStyles.readMore}>

          {/* <Link href={link.href} as={link.as}>
            {link.text}
          </Link>
          <ArrowForwardIcon style={{ fontSize: '16px', color: '#5ad67d' }} /> */}
          {/* <a href={link.href}></a> */}

          {
            links.map(({ text, as, color, icon }, i) => {
              return (
                <Button
                  key={`${i}-${as}`}
                  // fullWidth
                  variant='contained'
                  color='primary'
                  component={Link}
                  noLinkStyle
                  // href={`/blog/article/${slugMap.get(_id)?.slug}`}
                  href={as}
                  target='_self'
                  endIcon={linkIconMap[icon]}
                  sx={{
                    backgroundColor: linkColorMap[color].bg,
                    color: linkColorMap[color].text,
                    '&:hover': {
                      backgroundColor: linkColorMap[color].hover,
                    },
                    '&:focus': {
                      backgroundColor: linkColorMap[color].focus,
                    }
                  }}
                >
                  {text}
                </Button>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
