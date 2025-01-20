import { useEffect, useState, useMemo } from 'react'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'

// import classes from './ProjectsPage.module.scss'
import { Stack, Typography } from '@mui/material'
import { ProjectItem, ELinkColor, ELinkIcon } from './components/ProjectItem'
import { ProjectItem as ProjectItemSSR } from './components/ProjectItemSSR'
import { BreadCrumbs } from '../BreadCrumbs'
import { withTranslator } from '~/hocs/withTranslator'

type TProject = {
  id: number;
  title: string;
  description: string;
  img: {
    src: string;
    alt: string;
    color: {
      average: string;
    };
  },
  links: {
    href: string;
    as: string;
    text: string;
    color: ELinkColor;
    icon: ELinkIcon;
    isExternal?: boolean;
  }[];
  uiDate: string;
  brief?: string;
  tags: string[];
}

const projects: TProject[] = [
  // {
  //   id: 1,
  //   title: 'AuditList 2023',
  //   description: 'AUDIT_LIST_PROJECT_DESCR',
  //   img: {
  //     // NOTE: Converter online https://cloudconvert.com/
  //     src: '/static/img/projects/audit-v2.webp',
  //     alt: 'loading...',
  //     color: {
  //       // NOTE: Get average color online https://matkl.github.io/average-color/
  //       average: '#d79695',
  //     },
  //   },
  //   links: [
  //     {
  //       href: '/subprojects/audit-list',
  //       as: '/subprojects/audit-list',
  //       text: 'PROJECT_GO_BTN:LINK_GOTO',
  //       color: ELinkColor.YELLOW,
  //       icon: ELinkIcon.ARROW,
  //     },
  //   ],
  //   uiDate: '2023',
  //   brief: 'PROJECT_BRIEF@AUDITOR_HELPER',
  //   tags: [],
  // },
  {
    id: 2,
    title: 'Log exp',
    description: 'PROJECT_DESCR@TRADEIN',
    img: {
      src: '/static/img/projects/tradein.webp',
      alt: 'loading...',
      color: {
        average: '#54586e',
      },
    },
    links: [
      // {
      //   href: 'https://pravosleva.pro/dist.sp-tradein-2023',
      //   as: 'https://pravosleva.pro/dist.sp-tradein-2023',
      //   text: 'DEMO',
      //   color: ELinkColor.TG_OUTLINE,
      //   icon: ELinkIcon.LINK,
      // },
      {
        href: '/subprojects/sp/tradein',
        as: '/subprojects/sp/tradein',
        text: 'DEMO',
        color: ELinkColor.YELLOW,
        icon: ELinkIcon.ARROW,
      },
    ],
    uiDate: '2023',
    // brief: 'PROJECT_BRIEF@SP_TRADEIN',
    tags: [],
  },
  {
    id: 3,
    title: 'FamilyTree exp',
    description: 'PROJECT_DESCR@FAMILY_TREE',
    img: {
      // src: '/static/img/projects/family-tree-2.webp',
      src: '/static/img/projects/family-tree-abstract.webp',
      alt: 'loading...',
      color: {
        average: '#e3e0e9',
      },
    },
    links: [
      {
        href: 'https://pravosleva.pro/dist.family-tree-2023/#/?debug=1&rd=1',
        as: 'https://pravosleva.pro/dist.family-tree-2023/#/?debug=1&rd=1',
        text: 'DEMO',
        color: ELinkColor.YELLOW,
        icon: ELinkIcon.ARROW,
      },
    ],
    uiDate: '2023',
    // brief: 'PROJECT_BRIEF@SP_TRADEIN',
    tags: [],
  },
  {
    id: 4,
    title: 'AutoPark 2022',
    description: 'AUTO_PARK_PROJECT_DESCR',
    img: {
      // src: '/static/img/projects/autopark.webp',
      src: '/static/img/projects/autopark-logo.big.png',
      alt: 'loading...',
      color: {
        average: '#7c8084',
      },
    },
    links: [
      {
        href: '/blog/q/[search_query_title]',
        as: '/blog/q/autoPark',
        text: 'PROJECT_GO_BTN:LINK_GOTO',
        color: ELinkColor.YELLOW,
        icon: ELinkIcon.ARROW,
      },
      // {
      //   href: 'https://t.me/pravosleva_bot?start=autopark',
      //   as: 'https://t.me/pravosleva_bot?start=autopark',
      //   text: 'PROJECT_GO_BTN:LINK_TG',
      //   color: ELinkColor.TG,
      //   icon: ELinkIcon.TG,
      // },
    ],
    uiDate: '2022',
    brief: 'PROJECT_BRIEF@CAR_SERVICE_BOOK',
    tags: ['autoPark', 'telegram'],
  },
  {
    id: 5,
    title: 'RedShark 2022',
    description: 'RED_SHARK_PROJECT_DESCR',
    img: {
      src: '/static/img/blog/red-shark.jpg',
      alt: 'loading...',
      color: {
        average: '#7a665e',
      },
    },
    links: [
      {
        href: '/blog/q/[search_query_title]',
        as: '/blog/q/краснаяАкула',
        text: 'PROJECT_GO_BTN:LINK_GOTO',
        color: ELinkColor.YELLOW,
        icon: ELinkIcon.ARROW,
      },
    ],
    uiDate: '2022',
    brief: 'PROJECT_BRIEF@RED_SHARK',
    tags: ['краснаяАкула'],
  },
  {
    id: 6,
    title: 'Estimate Corrector app',
    description: 'TEAM_SCORING_PROJECT_DESCR',
    // img: {
    //   src: '/static/img/projects/scoring.webp',
    //   alt: 'loading...',
    //   color: {
    //     average: '#bcc3a5',
    //   },
    // },
    img: {
      src: '/static/img/projects/math-preview.gif',
      alt: 'loading...',
      color: {
        average: 'dimgray',
      },
    },
    links: [
      {
        // href: '/team-scoring/legacy',
        // as: '/team-scoring/legacy',
        href: '/dist.estimate-corrector-2024',
        as: '/dist.estimate-corrector-2024',
        text: 'PROJECT_GO_BTN:LINK_GOTO',
        color: ELinkColor.YELLOW,
        icon: ELinkIcon.ARROW,
        isExternal: true,
      },
    ],
    uiDate: '2019 — 2025',
    brief: 'PROJECT_BRIEF@PROBABILITY_THEORY',
    tags: [],
  },
  {
    id: 7,
    title: 'BLOG',
    description: 'PROJECT_DESCR@SEO_EXP',
    // brief: 'PROJECT_BRIEF@SEO_EXP',
    img: {
      src: '/static/img/projects/blog.webp',
      alt: 'loading...',
      color: {
        average: '#5b6567',
      },
    },
    links: [
      {
        href: '/blog',
        as: '/blog',
        text: 'PROJECT_GO_BTN:LINK_GOTO',
        color: ELinkColor.YELLOW,
        icon: ELinkIcon.ARROW,
      },
    ],
    uiDate: '2018',
    // brief: 'PROJECT_BRIEF@SEO_EXP',
    tags: [],
  },
  {
    id: 8,
    title: 'Cargo 2016',
    brief: 'PROJECT_BRIEF@CARGO_2016',
    description: 'PROJECT_DESCR@CARGO_2016',
    img: {
      src: '/static/img/projects/cargo-2016.2.webp',
      alt: 'loading...',
      color: {
        average: '#e1ebef',
      },
    },
    links: [
      {
        href: 'https://selection4test.ru',
        as: 'https://selection4test.ru',
        text: 'DEMO',
        color: ELinkColor.YELLOW,
        icon: ELinkIcon.ARROW,
      },
    ],
    uiDate: '2016',
    tags: ['threejs', 's4t'],
  },
]
// const pack1 = ['🐱', '😺', '😸', '😼', '🙀', '🐾', '🤨', '🥳']
const pack2 = ['🃏', '♠️', '♥️', '♦️', '♣️']
// const pack3 = ['🥤', '🍺', '🍹', '🍸', '🥃', '🍷', '🃏']

export const ProjectsPage = withTranslator(({ t }) => {
  const getRandomValue = ({ items }: { items: any[] }) => {
    if (!Array.isArray(items)) return 'getRandomValue ERR: Incorrect arg'
    const randomIndex = Math.floor(Math.random() * items.length)
  
    return items[randomIndex]
  }
  
  const [headerText, setHeaderText] = useState<string>('🎲 🎲 🎲 🎲')
  useEffect(() => {
    const randomEmojies = [
      getRandomValue({ items: pack2 }),
      getRandomValue({ items: pack2 }),
      getRandomValue({ items: pack2 }),
      getRandomValue({ items: pack2 })
    ].join(' ')
    setHeaderText(randomEmojies)
  }, [])

  const isSSR = useMemo(() => typeof window === 'undefined', [typeof window])
  
  return (
    <>
      <ResponsiveBlock
        isPaddedMobile
        isLimited
        // style={{
        //   paddingBottom: '30px',
        // }}
      >
        <BreadCrumbs
          t={t}
          legend={[
            {
              labelCode: 'HOME',
              noTranslate: false
            }
          ]}
        />
      </ResponsiveBlock>
    
      <ResponsiveBlock
        isPaddedMobile
        // className={classes.tmpHighlight}

        isLimited
        // hasDesktopFrame
      >
        <Stack
          direction='column'
          alignItems='start'
          spacing={2}
          sx={{ pt: 0, pb: 0 }}
        >
          <Typography
            variant="h2"
            display="block"
            // gutterBottom
            sx={{ pb: 2 }}
            className='truncate'
          >
            {headerText}
          </Typography>
          {/* <div>check it out...</div> */}
          <div
            style={{
              width: '100%',
              paddingBottom: '50px',
            }}
            className='projects-grid'
          >
            {
              projects.map(({
                id,
                title,
                description,
                img,
                links,
                uiDate,
                brief,
                tags,
              }, i, a) => {
                const isLast = i === a.length - 1

                if (isSSR) return (
                  <ProjectItemSSR
                    key={id}
                    uiDate={uiDate}
                    img={img}
                    title={title}
                    // descr={description}
                    author='Den Pol'
                    links={links.map(({ text, ...rest }) => ({ ...rest, text: t(text) }))}
                    brief={!!brief ? t(brief) : brief}
                    tags={tags}
                    // title={title}
                    // img={img}
                    // link={link}
                    descr={!!description ? t(description) : undefined}
                    isLast={isLast}
                  />
                )
                return (
                  <ProjectItem
                    key={id}
                    uiDate={uiDate}
                    img={img}
                    title={t(title)}
                    // descr={description}
                    author='Den Pol'
                    links={links.map(({ text, ...rest }) => ({ ...rest, text: t(text) }))}
                    brief={!!brief ? t(brief) : brief}
                    tags={tags}
                    // title={title}
                    // img={img}
                    // link={link}
                    descr={!!description ? t(description) : undefined}
                    isLast={isLast}
                  />
                )
              })
            }
          </div>
        </Stack>
      </ResponsiveBlock>
    </>
  )
})
