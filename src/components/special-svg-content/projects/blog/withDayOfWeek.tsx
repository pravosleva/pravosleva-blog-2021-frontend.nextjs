// src/hocs/withDayOfWeek.tsx
import React, { useState, useEffect } from 'react'

export function withDayOfWeek<T>(Component: React.ComponentType<T>) {
  return function DayOfWeekComponent(props: T) {
    const [isMonday, setIsMonday] = useState(false)

    useEffect(() => {
      // 🎯 ЧИСТЫЙ JAVASCRIPT: Нативный метод .getDay() возвращает день недели
      // 0 — Воскресенье, 1 — Понедельник, 2 — Вторник и т.д.
      const currentDayIndex = new Date().getDay() 
      
      // Если сегодня первый день недели (Понедельник) — включаем деловой режим
      if (currentDayIndex === 1) {
        setIsMonday(true)
      }
    }, [])

    // Передаем вычисленный статус в логотип, защитив Next.js от багов гидратации HTML
    return <Component {...props} isMondayMode={isMonday} />
  }
}
