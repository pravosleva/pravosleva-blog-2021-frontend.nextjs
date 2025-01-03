import * as React from 'react'
// import ProTip from '~/components/ProTip'
// import Link from '~/components/Link'
// import Copyright from '~/components/Copyright'
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
// import { CarSelectSample } from '~/components/Autopark2022/components/CarSelectSample'
import { Layout } from '~/components/Layout'
import Head from 'next/head'
import { ProjectsPage } from '~/components/ProjectsPage'
// import { SocketLab } from '~/components/SocketLab'
import { getInitialPropsBase, IPageContext, setCommonStore } from '~/utils/next'

import { wrapper } from '~/store'

// type TLink = {
//   name: string;
//   link: string;
//   colorCode?: "primary" | "inherit" | "info" | "success" | "warning" | "error" | "secondary" | undefined;
//   variantCode?: 'text' | 'outlined' | 'contained';
//   tragetAttrValue: '_self' | '_blank';
// }
// const links: TLink[] = [
//   {
//     name: 'Todo 2023',
//     link: '/subprojects/audit-list',
//     colorCode: 'primary',
//     variantCode: 'contained',
//     tragetAttrValue: '_self',
//   },
//   // {
//   //   name: 'Viselitsa 2023',
//   //   link: 'https://pravosleva.pro/dist.viselitsa-2023',
//   //   colorCode: 'success',
//   //   variantCode: 'contained',
//   // },
//   {
//     name: 'AutoPark 2022',
//     link: 'https://t.me/pravosleva_bot?start=autopark',
//     colorCode: 'primary',
//     variantCode: 'contained',
//     tragetAttrValue: '_blank',
//   },
//   {
//     name: 'KanBan 2021',
//     link: 'https://pravosleva.pro/express-helper/chat/',
//     colorCode: 'primary',
//     variantCode: 'outlined',
//     tragetAttrValue: '_blank',
//   },
//   {
//     name: 'Code Samples 2020',
//     link: 'http://code-samples.space',
//     colorCode: 'primary',
//     variantCode: 'outlined',
//     tragetAttrValue: '_blank',
//   },
// ]

const Index = () => {
  // const goToPage = (url: string) => (e: any) => {
  //   e.preventDefault()
  //   try {
  //     window.location.href = url
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  // NOTE: Только пепел знает, что значит сгореть дотла.
  return (
    <>
      <Head>
        <meta property="og:title" content="WebExp" />

        {/* -- NOTE: Meta */}
        {/* <!-- HTML Meta Tags --> */}
        <title>Pravosleva</title>
        <link rel="manifest" href="/static/manifest.json" />
        <meta name="description" content='Заметки начинающего разраба.' />

        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://pravosleva.pro" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:locale:alternate" content="be_BY" />
        <meta property="og:locale:alternate" content="kk_KZ" />
        <meta property="og:locale:alternate" content="tt_RU" />
        <meta property="og:locale:alternate" content="uk_UA" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:description" content='Заметки начинающего разраба' />
        <meta property="og:image" content="https://pravosleva.pro/static/img/logo/logo-pravosleva.jpg" />
        <meta property="og:site_name" content="Pravosleva" />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="https://pravosleva.pro/static/img/logo/logo-pravosleva.jpg" />
        <meta property="twitter:domain" content="pravosleva.pro" />
        <meta property="twitter:url" content="https://pravosleva.pro/blog/article/bash-quaint-files-copy" />
        <meta name="twitter:title" content="WebExp" />
        <meta name="twitter:description" content='Заметки начинающего разраба' />
        <meta name="twitter:image" content="https://pravosleva.pro/static/img/logo/logo-pravosleva.jpg" />
        {/* -- Meta Tags Generated via https://www.opengraph.xyz -- */}

        <link
          href="/static/css/min/project-list.css"
          rel="preload"
          as="style"
          // @ts-ignore
          fetchpriority="high"
        />
        <link href="/static/css/min/project-list.css" rel="stylesheet" />
      </Head>
      <Layout>
        <ProjectsPage />
        {/* <Container maxWidth="sm">
          <Box
            sx={{
              py: 4,
            }}
          >
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
            <Stack spacing={2}>
            </Stack>
          </Box>
        </Container> */}
        {/* <SocketLab /> */}
      </Layout>
    </>
  );
}

const getInitialPropsWithStore = async ({
  ctx,
  store,
}: {
  ctx: IPageContext;
  store: any;
}) => {
  const baseProps = await getInitialPropsBase(ctx)

  setCommonStore({ store, baseProps })

  return {
    ...baseProps,
  }
}

Index.getInitialProps = wrapper.getInitialPageProps(
  // @ts-ignore
  (store) => (ctx: IPageContext) => getInitialPropsWithStore({ ctx, store })
)

export default Index
