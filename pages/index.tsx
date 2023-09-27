import * as React from 'react'
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Stack,
  // Typography
}from '@mui/material'
import ProTip from '~/components/ProTip'
import Link from '~/components/Link'
import Copyright from '~/components/Copyright'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
// import { CarSelectSample } from '~/components/Autopark2022/components/CarSelectSample'
import { Layout } from '~/components/Layout'

type TLink = {
  name: string;
  link: string;
  colorCode?: "primary" | "inherit" | "info" | "success" | "warning" | "error" | "secondary" | undefined;
  variantCode?: 'text' | 'outlined' | 'contained';
  tragetAttrValue: '_self' | '_blank';
}
const links: TLink[] = [
  {
    name: 'Todo 2023',
    link: '/subprojects/todo',
    colorCode: 'primary',
    variantCode: 'contained',
    tragetAttrValue: '_self',
  },
  // {
  //   name: 'Viselitsa 2023',
  //   link: 'https://pravosleva.ru/dist.viselitsa-2023',
  //   colorCode: 'success',
  //   variantCode: 'contained',
  // },
  {
    name: 'AutoPark 2022',
    link: 'https://t.me/pravosleva_bot?start=autopark',
    colorCode: 'primary',
    variantCode: 'contained',
    tragetAttrValue: '_blank',
  },
  {
    name: 'KanBan 2021',
    link: 'https://pravosleva.ru/express-helper/chat/',
    colorCode: 'primary',
    variantCode: 'outlined',
    tragetAttrValue: '_blank',
  },
  {
    name: 'Code Samples 2020',
    link: 'http://code-samples.space',
    colorCode: 'primary',
    variantCode: 'outlined',
    tragetAttrValue: '_blank',
  },
]

export default function Index() {
  // const goToPage = (url: string) => (e: any) => {
  //   e.preventDefault()
  //   try {
  //     window.location.href = url
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }
  return (
    <Layout>
      <Container maxWidth="sm">
        <Box
          sx={{
            py: 4,
          }}
        >
          {/* <Typography variant="h4" component="h1" gutterBottom>
            In progress...
          </Typography> */}

          <Grid
            container
            rowSpacing={2}
            // columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            columnSpacing={2}
            sx={{ mb: 2 }}
          >
            {
              links.map(({ name, link, colorCode, variantCode, tragetAttrValue }, i) => (
                <Grid item xs={12} sm={12} md={6} lg={6} key={i}>
                  <Button fullWidth endIcon={<ArrowForwardIcon />} variant={variantCode || "contained"} color={colorCode || 'primary'} component={Link} noLinkStyle href={link} target={tragetAttrValue}>
                    {name}
                  </Button>
                </Grid>
              ))
            }
          </Grid>

          <Alert sx={{ mb: 2 }} severity="info" variant='filled'>
            Work in progress...
            <br />
            Stack: Next.js / MUI v5-beta / TypeScript
          </Alert>

          <Stack spacing={2}>
            {/* <Link href="/about" color="secondary">
              Go to the about page
            </Link> */}
            {/* <Button endIcon={<ArrowForwardIcon />} variant="contained" color='primary' component={Link} noLinkStyle href='http://pravosleva.ru/cra/' target='_blank'>
              Go to CRA version (mui@4.x)
            </Button> */}

            {/*
              links.map(({ name, link, colorCode }, i) => (
                <Button key={i} endIcon={<ArrowForwardIcon />} variant="contained" color={colorCode} component={Link} noLinkStyle href={link} target='_self'>
                  {name}
                </Button>
              ))
            */}

            {/* <CarSelectSample /> */}

            <Link href='/about' color="primary" shallow>
              Go to about page
            </Link>
            <Link href='https://selection4test.ru' color="primary" target='_blank'>
              Old trash
            </Link>
            <ProTip />
            <Copyright />
          </Stack>
        </Box>
      </Container>
    </Layout>
  );
}
