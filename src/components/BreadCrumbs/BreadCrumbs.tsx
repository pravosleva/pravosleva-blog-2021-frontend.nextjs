import Link from 'next/link'

export const BreadCrumbs = ({
  t,
  // lastLabel,
  legend
}: {
  t: (_s: string) => string;
  // lastLabel: string;
  legend: {
    link?: string;
    labelCode: string;
    noTranslate?: boolean;
  }[]
}) => {
  return (
    <div className="bx_breadcrumbs">
      <ul itemScope itemType="http://schema.org/BreadcrumbList">
        <li itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem">
          <Link href="/" as="/">
            <a title="Pravosleva.ru" itemProp="item">
              {t('HOME')}
            </a>
          </Link>
        </li>
        {
          legend.map(({ link, labelCode, noTranslate }) => {
            if (!link) return (
              <li className='truncate' itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem" key={link}>
                <span style={{ fontWeight: 'bold', color: 'black', fontFamily: 'Montserrat' }}>{noTranslate ? labelCode : t(labelCode)}</span>
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
