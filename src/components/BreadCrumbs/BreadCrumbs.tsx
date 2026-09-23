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
      {/* Корневой контейнер списка строк навигации */}
      <ul itemScope itemType="https://schema.org/BreadcrumbList">
        {
          legend.map(({ link, labelCode, noTranslate }, i, a) => {
            const isLast = i === a.length - 1
            const itemTitle = noTranslate ? labelCode : t(labelCode)
            
            // Валидная позиция в Schema.org начинается строго с 1
            const positionIndex = i + 1 

            return (
              <React.Fragment key={link ? `${link}-${i}` : `no-link-${i}`}>
                
                {/* ОСНОВНОЙ ЭЛЕМЕНТ НАВИГАЦИИ */}
                <li 
                  itemProp="itemListElement" 
                  itemScope 
                  itemType="https://schema.org/ListItem"
                  className={clsx({ 'truncate target': !link })}
                >
                  {
                    link ? (
                      // КЕЙС А: Элемент является кликабельной ссылкой
                      link === '/' ? (
                        <a itemProp="item" href={link} target="_self">
                          <span itemProp="name">{itemTitle}</span>
                        </a>
                      ) : (
                        <Link href={link} as={link} passHref>
                          {/* Добавлен явный href для корректного считывания парсером Google */}
                          <a itemProp="item" href={link}>
                            <span itemProp="name">{itemTitle}</span>
                          </a>
                        </Link>
                      )
                    ) : (
                      // 🔥 КЕЙС Б: Исправленный тупиковый элемент (текущая страница)
                      // Чтобы избежать ошибки "Недопустимый URL в поле id", передаем пустой href="#" 
                      // или хэш, но лучше всего — сделать элемент некликабельной ссылкой через стили.
                      <a 
                        itemProp="item" 
                        href="#" 
                        onClick={(e) => e.preventDefault()} 
                        style={{ 
                          cursor: 'default', 
                          textDecoration: 'none', 
                          color: 'inherit',
                          pointerEvents: 'none' // Отключает кликабельность
                        }}
                      >
                        <span itemProp="name" style={{ fontWeight: 'bold', fontFamily: 'Montserrat' }}>
                          {itemTitle}
                        </span>
                      </a>
                    )
                  }

                  {/* Мета-тег позиции элемента в иерархии */}
                  <meta itemProp="position" content={String(positionIndex)} />
                </li>

                {/* РАЗДЕЛИТЕЛЬ БЕЗ МИКРОРАЗМЕТКИ SCHEMA.ORG */}
                {
                  // Альтернативный и самый надежный вариант рендеринга внутри li:
                  isLast ? (
                    /* Последний элемент: имеет правильный URL для Google, но не кликабелен для пользователя */
                    <a 
                      itemProp="item" 
                      href={link || '#'} 
                      onClick={(e) => e.preventDefault()} 
                      style={{ cursor: 'default', textDecoration: 'none', color: 'inherit', pointerEvents: 'none' }}
                    >
                      <span itemProp="name" style={{ fontWeight: 'bold', fontFamily: 'Montserrat' }}>{itemTitle}</span>
                    </a>
                  ) : (
                    /* Обычные родительские ссылки */
                    link === '/' ? (
                      <a itemProp="item" href={link} target="_self">
                        <span itemProp="name">{itemTitle}</span>
                      </a>
                    ) : (
                      <Link href={link!} as={link} passHref>
                        <a itemProp="item" href={link}>
                          <span itemProp="name">{itemTitle}</span>
                        </a>
                      </Link>
                    )
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
