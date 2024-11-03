import Link from 'next/link'
import clsx from 'clsx'

export namespace NBreadCrumbs {
  export type TLegendItem = {
    link?: string;
    labelCode: string;
    noTranslate?: boolean;
  }
  export type TProps = {
    t: (_s: string) => string;
    // lastLabel: string;
    legend: TLegendItem[]
  }
}

export const BreadCrumbs = ({
  t,
  // lastLabel,
  legend
}: NBreadCrumbs.TProps) => {
  return (
    <div className="bx_breadcrumbs">
      <ul itemScope itemType="http://schema.org/BreadcrumbList">
        {
          legend.map(({ link, labelCode, noTranslate }, i, a) => {
            // const isFirst = i === 0
            const isLast = i === a.length - 1
            switch (true) {
              case !link:
                return (
                  <>
                    <li className={clsx('truncate', 'target')} itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem" key={link}>
                      <span style={{ fontWeight: 'bold', fontFamily: 'Montserrat' }}>{noTranslate ? labelCode : t(labelCode)}</span>
                    </li>
                    {
                      !isLast && (
                        <li className={clsx('target')} itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem" key={link}>
                          <span style={{ fontWeight: 'bold' }}>•</span>
                        </li>
                      )
                    }
                  </>
                )
              default:
                return (
                  <>
                    <li itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem" key={link}>
                      {/* @ts-ignore */}
                      <Link href={link} as={link}>
                        <a itemProp="item">
                          {noTranslate ? labelCode : t(labelCode)}
                        </a>
                      </Link>
                    </li>
                    {
                      !isLast && (
                        <li className={clsx('target')} itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem" key={link}>
                          <span style={{ fontWeight: 'bold' }}>•</span>
                        </li>
                      )
                    }
                  </>
                )
            }
          })
        }
      </ul>
    </div>
  )
}
