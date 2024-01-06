import { useEffect, useState } from 'react'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'

// import classes from './ProjectsPage.module.scss'
import { Stack, Typography } from '@mui/material'
import { ProjectItem, ELinkColor, ELinkIcon } from './components/ProjectItem5'
import { BreadCrumbs } from '../BreadCrumbs'
import { withTranslator } from '~/hocs/withTranslator'

type TProject = {
  id: number;
  title: string;
  description: string;
  img: {
    src: string;
    alt: string;
  },
  links: {
    href: string;
    as: string;
    text: string;
    color: ELinkColor;
    icon: ELinkIcon;
  }[];
  uiDate: string;
  brief?: string;
  tags: string[];
}

const projects: TProject[] = [
  {
    id: 1,
    title: 'AuditList',
    description: 'AUDIT_LIST_PROJECT_DESCR',
    img: {
      src: '/static/img/projects/audit-v2.jpg',
      alt: 'loading...',
    },
    links: [
      {
        href: '/subprojects/audit-list',
        as: '/subprojects/audit-list',
        text: 'PROJECT_GO_BTN:LINK_GOTO',
        color: ELinkColor.YELLOW,
        icon: ELinkIcon.ARROW,
      },
    ],
    uiDate: '2023',
    brief: 'PROJECT_BRIEF@AUDITOR_HELPER',
    tags: [],
  },
  {
    id: 2,
    title: 'SEO exp',
    description: 'BLOG',
    img: {
      src: '/static/img/projects/blog.jpg',
      alt: 'loading...',
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
    uiDate: '2023',
    // brief: 'PROJECT_BRIEF@SEO_EXP',
    tags: ['seo'],
  },
  {
    id: 3,
    title: 'Trade-In exp',
    description: 'PROJECT_DESCR@TRADEIN',
    img: {
      src: '/static/img/projects/tradein.png',
      alt: 'loading...',
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
    id: 4,
    title: 'AutoPark',
    description: 'AUTO_PARK_PROJECT_DESCR',
    img: {
      src: '/static/img/projects/autopark.jpg',
      alt: 'loading...',
    },
    links: [
      {
        href: 'https://t.me/pravosleva_bot?start=autopark',
        as: 'https://t.me/pravosleva_bot?start=autopark',
        text: 'PROJECT_GO_BTN:LINK_TG',
        color: ELinkColor.TG,
        icon: ELinkIcon.TG,
      },
    ],
    uiDate: '2022',
    brief: 'PROJECT_BRIEF@CAR_SERVICE_BOOK',
    tags: ['telegram'],
  },
  {
    id: 5,
    title: 'TeamScoring',
    description: 'TEAM_SCORING_PROJECT_DESCR',
    img: {
      src: '/static/img/projects/scoring.jpg',
      alt: 'loading...',
    },
    links: [
      {
        href: '/team-scoring/legacy',
        as: '/team-scoring/legacy',
        text: 'PROJECT_GO_BTN:LINK_GOTO',
        color: ELinkColor.YELLOW,
        icon: ELinkIcon.ARROW,
      },
    ],
    uiDate: '2019',
    brief: 'PROJECT_BRIEF@PROBABILITY_THEORY',
    tags: [],
  },
]

export const ProjectsPage = withTranslator(({ t }) => {
  const getRandomValue = ({ items }: { items: any[] }) => {
    if (!Array.isArray(items)) return 'getRandomValue ERR: Incorrect arg'
    const randomIndex = Math.floor(Math.random() * items.length)
  
    return items[randomIndex]
  }
  
  const [headerText, setHeaderText] = useState<string>('')
  useEffect(() => {
    setHeaderText(`${getRandomValue({
      items: ['🐱', '😺', '😸', '😼', '🙀', '🐾', '🤨', '🥳', '⛄', '☃️'],
    })} ${getRandomValue({
      items: ['🥤', '🍺', '🍹', '🍸', '🥃', '🍷'],
    })}`)
  }, [])

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
            variant="h1"
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
                return (
                  <ProjectItem
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
              })
            }
          </div>
        </Stack>
      </ResponsiveBlock>
    </>
  )
})
