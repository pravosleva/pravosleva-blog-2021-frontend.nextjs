// src/components/Svg/AuthorizationRequired401Svg.tsx
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'
import { Button } from '@mui/material'
import FingerprintIcon from '@mui/icons-material/Fingerprint'
import Link from '~/components/Link'
import { getTextColor } from '~/react-markdown-renderers/HeadingsQuickNav/utils'

interface IAuthorizationRequiredProps {
  message?: string
}

export const AuthorizationRequired401Svg: React.FC<IAuthorizationRequiredProps> = ({ 
  message = 'Доступ к этой приватной секции ограничен настройками безопасности.' 
}) => {
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  const isDark = currentTheme === 'dark' || currentTheme === 'hard-gray' || currentTheme === 'gray'
  const primaryColor = isDark ? '#FF8E53' : '#0162c8'
  const subColor = getTextColor({ currentTheme })
  const textColor = getTextColor({ currentTheme })
  const titleColor = getTextColor({ currentTheme })

  // Вычисляем текущий путь для Return URL (работает на клиенте)
  const loginUrlWithFrom = useMemo(() => {
    if (typeof window === 'undefined') return '/auth/login'
    return `/auth/login?from=${encodeURIComponent(window.location.pathname + window.location.search)}`
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '550px', margin: '0 auto', textAlign: 'center' }}>
      <svg viewBox="0 0 800 340" width="100%" height="auto" style={{ display: 'block', margin: '0 auto' }} xmlns="http://w3.org">
        <defs>
          <filter id="auth-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.15" />
          </filter>
          <style>
            {`
              @keyframes card-insert { 0% { transform: translateY(15px); } 100% { transform: translateY(-5px); } }
              @keyframes beam-glow { 0% { opacity: 0.3; } 50% { opacity: 0.8; } 100% { opacity: 0.3; } }
              .animated-badge { animation: card-insert 2s ease-in-out infinite alternate; }
              .scanning-beam { animation: beam-glow 1.5s ease-in-out infinite; }
            `}
          </style>
        </defs>

        <rect x="230" y="40" width="340" height="280" rx="28" fill={subColor} filter="url(#auth-shadow)" />
        <rect x="270" y="270" width="260" height="12" rx="6" fill={isDark ? '#222' : '#d5d5d5'} />
        
        <g className="animated-badge" filter="url(#auth-shadow)">
          <rect x="310" y="60" width="180" height="210" rx="16" fill={isDark ? '#2e2e34' : '#ffffff'} stroke={isDark ? '#444' : '#e0e0e0'} strokeWidth="2" />
          <rect x="375" y="75" width="50" height="10" rx="5" fill={isDark ? '#222' : '#d5d5d5'} />
          <circle cx="400" cy="135" r="30" fill={isDark ? '#444' : '#f0f0f0'} />
          <path d="M370 185 C370 170 383 165 400 165 C417 165 430 170 430 185 V190 H370 Z" fill={isDark ? '#444' : '#f0f0f0'} />
          <rect x="340" y="210" width="120" height="8" rx="4" fill={primaryColor} opacity="0.8" />
          <rect x="355" y="230" width="90" height="6" rx="3" fill={isDark ? '#555' : '#ccc'} />
        </g>
        <line x1="280" y1="250" x2="520" y2="250" stroke={primaryColor} strokeWidth="4" strokeLinecap="round" className="scanning-beam" />
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.45rem', padding: '0 16px', marginTop: '1rem', width: '100%', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontFamily: 'Montserrat, system-ui, sans-serif', fontWeight: 'bold', fontSize: '1.5rem', lineHeight: 1.3, color: titleColor }}>
          Необходима авторизация
        </h2>
        <p style={{ margin: 0, fontFamily: 'Montserrat, system-ui, -apple-system, sans-serif', fontWeight: 500, lineHeight: 1.5, color: textColor }}>
          {message}
        </p>

        {/* КНОПКА ПЕРЕХОДА НА СТРАНИЦУ ВХОДА С ПАРАМЕТРОМ FROM */}
        <Button 
          endIcon={<FingerprintIcon />} 
          variant="contained" 
          color="primary" 
          component={Link}
          noLinkStyle
          href={loginUrlWithFrom}
          shallow
          style={{ fontFamily: 'Montserrat', fontWeight: 'bold', borderRadius: '12px', padding: '10px 24px', maxWidth: '280px' }}
          fullWidth
        >
          Войти в профиль
        </Button>
      </div>
    </div>
  )
}
