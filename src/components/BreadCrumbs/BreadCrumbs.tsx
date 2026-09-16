import React from 'react'
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
    legend: TLegendItem[]
  }
}

export const BreadCrumbs = ({
  t,
  legend
}: NBreadCrumbs.TProps) => {
  return (
    <div className="bx_breadcrumbs">
      {/* Объявляем корневой контейнер списка строк навигации */}
      <ul itemScope itemType="http://schema.org/BreadcrumbList">
        {
          legend.map(({ link, labelCode, noTranslate }, i, a) => {
            const isLast = i === a.length - 1
            const itemTitle = noTranslate ? labelCode : t(labelCode)
            
            // Валидная позиция в Schema.org начинается строго с 1
            const positionIndex = i + 1 

            return (
              <React.Fragment key={link ? `${link}-${i}` : `no-link-${i}`}>
                
                {/* 🧭 ОСНОВНОЙ ЭЛЕМЕНТ НАВИГАЦИИ (СТРОГО ОДИН НА ШАГ ЦИКЛА) */}
                <li 
                  itemProp="itemListElement" 
                  itemScope 
                  itemType="http://schema.org/ListItem"
                  className={clsx({ 'truncate target': !link })}
                >
                  {
                    link ? (
                      // КЕЙС А: Элемент является кликабельной ссылкой
                      link === '/' ? (
                        <a itemProp="item" href={link} target="_self">
                          {/* 🔥 ФИКС 2: Обязательный тег с именем для Google */}
                          <span itemProp="name">{itemTitle}</span>
                        </a>
                      ) : (
                        <Link href={link} as={link} passHref>
                          <a itemProp="item">
                            {/* 🔥 ФИКС 2: Обязательный тег с именем для Google */}
                            <span itemProp="name">{itemTitle}</span>
                          </a>
                        </Link>
                      )
                    ) : (
                      // КЕЙС Б: Последний тупиковый элемент (текущая страница без ссылки)
                      // По спецификации Google, даже страница без ссылки должна быть размечена как item
                      <div itemProp="item" style={{ display: 'inline' }}>
                        <span itemProp="name" style={{ fontWeight: 'bold', fontFamily: 'Montserrat' }}>
                          {itemTitle}
                        </span>
                      </div>
                    )
                  }

                  {/* 🔥 ФИКС 1: Обязательный мета-тег позиции элемента в иерархии */}
                  <meta itemProp="position" content={String(positionIndex)} />
                </li>

                {/* 🛠️ ФИКС 3: ЧИСТЫЙ РАЗДЕЛИТЕЛЬ БЕЗ МИКРОРАЗМЕТКИ SCHEMA.ORG */}
                {
                  !isLast && (
                    <li className={clsx('target')} aria-hidden="true">
                      <span style={{ fontWeight: 'bold', padding: '0 8px' }}>•</span>
                    </li>
                  )
                }

              </React.Fragment>
            )
          })
        }
      </ul>
    </div>
  )
}
