import { metrics } from '~/constants/metrics'

// log the pageview with their URL
export const pageview = (url: string): void => {
  // @ts-ignore
  if (!!window) window.gtag('config', metrics.GA_TRACKING_ID, {
    page_path: url,
  })
}

// log specific events happening.
export const event = ({ action, params }: any): void => {
  // @ts-ignore
  if (!!window) window.gtag('event', action, params)
}

/* USAGE:
ga.event({
  action: "search",
  params : {
    search_term: query
  }
})
*/