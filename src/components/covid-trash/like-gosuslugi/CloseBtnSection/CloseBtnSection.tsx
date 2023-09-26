import React from 'react'
import { withTranslator } from '~/hocs/withTranslator'
import { useStyles } from './styles'

export const CloseBtnSectionConnected = ({ t }: any) => {
  // @ts-ignore
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <a className={classes.link} href='https://www.gosuslugi.ru/'>{t('CLOSE')}</a>
    </div>
  )
}

export const CloseBtnSection = withTranslator(CloseBtnSectionConnected)
