import React, { useCallback, useMemo } from 'react'
// import styled from 'styled-components'
import { useStyles } from './styles'
import { withTranslator } from '~/hocs/withTranslator'

interface IProps {
  t: (a: string) => string,
  setLang: (v: string) => void,
  suppoerLocales: { label: string, name: string, value: string, svgSrc: string, guLabel: string }[],
  currentLang: string,
}
const getLangData = (currentLang: string, suppoerLocales: any) => {
  let targetItem = suppoerLocales.find(({ value }: any) => currentLang === value)

  if (!targetItem) {
    targetItem = suppoerLocales[0]
  }

  return targetItem
}
const getNextLang = (currentLang: string, suppoerLocales: any) => {
  let targetIndex = suppoerLocales.findIndex(({ value }: any) => currentLang === value)

  if (targetIndex >= suppoerLocales.length - 1) {
    targetIndex = 0
  } else {
    targetIndex += 1
  }

  return targetIndex
}

export const SiteHeaderSectionConnected = ({
  // t,
  setLang,
  suppoerLocales,
  currentLang, // SAMPLE: 'en-US'
}: IProps) => {
  // @ts-ignore
  const classes = useStyles()
  const handleChangeLang = useCallback(() => {
    setLang(suppoerLocales[getNextLang(currentLang, suppoerLocales)].value)
  }, [currentLang])
  const langData = useMemo(() => getLangData(currentLang, suppoerLocales), [currentLang])

  return (
    <div className={classes.wrapper}>
      <div className='logo' />
      <div className='translate-button' onClick={handleChangeLang}>
        <img alt='img' src={langData.svgSrc} />
        <div>{langData.guLabel}</div>
      </div>
    </div>
  )
}

export const SiteHeaderSection = withTranslator(SiteHeaderSectionConnected)