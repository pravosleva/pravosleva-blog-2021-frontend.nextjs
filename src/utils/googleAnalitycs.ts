import { metrics } from '~/constants/metrics'

// log the pageview with their URL
export const pageview = (url: string): void => {
  try {
    // @ts-ignore
    if (!!window) window.gtag('config', metrics.GA_TRACKING_ID, {
      page_path: url,
    })
  } catch (err) {
    console.log(err)
  }
}

// log specific events happening.
export const event = ({ action, params }: any): void => {
  try {
    // @ts-ignore
    if (!!window) window.gtag('event', action, params)
  } catch (err) {
    console.log(err)
  }
}

/* USAGE:
ga.event({
  action: "search",
  params : {
    search_term: query
  }
})
*/