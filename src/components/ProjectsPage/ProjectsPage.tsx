import { ResponsiveBlock } from '~/mui/ResponsiveBlock'

import classes from './ProjectsPage.module.scss'
import { Stack, Typography } from '@mui/material'

export const ProjectsPage = () => {
  return (
    <ResponsiveBlock
      isPaddedMobile
      className={classes.tmpHighlight}

      isLimited
      // hasDesktopFrame
    >
      <Stack
        direction='column'
        alignItems='start'
        spacing={2}
        sx={{ pt: 6, pb: 2 }}
      >
        <Typography
          variant="h1"
          display="block"
          // gutterBottom
          sx={{ pb: 2 }}
          className='truncate'
        >
          Projects
        </Typography>
        <div>In progress...</div>
      </Stack>
    </ResponsiveBlock>
  )
}
