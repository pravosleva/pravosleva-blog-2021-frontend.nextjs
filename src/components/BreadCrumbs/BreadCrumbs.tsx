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
          legend.map(({ link, labelCode, noTranslate }) => {
            if (!link) return (
              <li className={clsx('truncate', 'target')} itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem" key={link}>
                <span style={{ fontWeight: 'bold', fontFamily: 'Montserrat' }}>{noTranslate ? labelCode : t(labelCode)}</span>
              </li>
            )

            return (
              <li itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem" key={link}>
                <Link href={link} as={link}>
                  <a itemProp="item">
                    {noTranslate ? labelCode : t(labelCode)}
                  </a>
                </Link>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}
