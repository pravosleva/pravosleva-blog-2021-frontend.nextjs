import { useEffect, useState } from 'react'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'

// import classes from './ProjectsPage.module.scss'
import { Stack, Typography } from '@mui/material'
import { ProjectItem } from './components'
import { BreadCrumbs } from '../BreadCrumbs'
import { withTranslator } from '~/hocs/withTranslator'

const projects = [
  {
    id: 1,
    title: 'AuditList 2023',
    img: {
      src: '/static/img/projects/audit-v2.jpg',
      alt: 'loading...',
    },
    link: {
      href: '/subprojects/todo',
      as: '/subprojects/todo',
    },
  },
  {
    id: 2,
    title: 'SEO exp',
    img: {
      src: '/static/img/projects/blog.jpg',
      alt: 'loading...',
    },
    link: {
      href: '/blog',
      as: '/blog',
    },
  },
]

export const ProjectsPage = withTranslator(({ t }: { t: (_s: string) => string }) => {
  const getRandomValue = ({ items }: { items: any[] }) => {
    if (!Array.isArray(items)) return 'getRandomValue ERR: Incorrect arg'
    const randomIndex = Math.floor(Math.random() * items.length)
  
    return items[randomIndex]
  }
  
  const [headerText, setHeaderText] = useState<string>('')
  useEffect(() => {
    setHeaderText(`${getRandomValue({ items: ['🐱', '😸', '😼', '🐾'] })} ${getRandomValue({ items: ['🥤', '🍺', '🍹', '🍸', '🥃', '🍷'] })}`)
  }, [])

  return (
    <>
    <ResponsiveBlock
        isPaddedMobile
        isLimited
      >
        <BreadCrumbs
          t={t}
          legend={[]}
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
            }}
            className='projects-grid'
          >
            {
              projects.map(({ id, title, img, link }) => {
                return (
                  <ProjectItem key={id} title={title} img={img} link={link} />
                )
              })
            }
          </div>
        </Stack>
      </ResponsiveBlock>
    </>
  )
})
