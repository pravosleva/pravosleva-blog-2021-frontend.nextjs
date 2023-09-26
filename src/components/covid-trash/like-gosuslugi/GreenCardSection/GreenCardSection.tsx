import React from 'react'
// import styled from 'styled-components'
import { withTranslator } from '~/hocs/withTranslator'
import { useStyles } from './styles'

export const GreenCardSectionConnected = ({
  t,
  // setLang,
  // suppoerLocales,
  // currentLang, // SAMPLE: 'en-US'
}: any) => {
  // @ts-ignore
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <h4 className={classes.h4}>{t('COVID-TRASH_GREEN-CARD-TEXT')}</h4>
      <div className={classes.activated}>
        <span className='target-text'>{t('COVID-TRASH_TARGET-TEXT')}</span>
      </div>
      <h4 className={classes.h4} style={{ marginTop: '12px' }}>№ 9500000011745973</h4>
    </div>
  )
}

export const GreenCardSection = withTranslator(GreenCardSectionConnected)
