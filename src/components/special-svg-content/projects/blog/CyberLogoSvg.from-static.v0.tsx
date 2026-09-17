import React from 'react'

/**
 * Новый логотип
 * 
 * Минус этого варианта: вы не сможете динамически менять цвет контуров лица через Redux-тему сайта (`isDark`), так как файл захардкожен в статике.
 *
 * @returns {*} 
 */
export const CyberLogoSvg = () => {
  return (
    <img 
      src="/static/img/blog/cyber-head-logo.svg" 
      alt="Cyberpunk Logo" 
      style={{ width: '48px', height: '48px', display: 'inline-block' }} 
    />
  )
}
