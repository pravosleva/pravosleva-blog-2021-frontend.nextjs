```ts
const searchInSlugMapping = (slugMapping: TLocalSlugMap, qText: string): {
  original: NCodeSamplesSpace.TNote;
  slug: string;
  bg?: { src: string; size: { w: number; h: number }; type: string }
  brief?: string;
}[] => {
  const matchedNotes: { original: NCodeSamplesSpace.TNote; slug: string; bg?: { src: string; size: { w: number; h: number }; type: string }; brief?: string; }[] = []
  const normalizedQuery = qText.toLowerCase().trim().replace(/\s/g, '')

  Object.entries(slugMapping).forEach(([slugKey, tools]) => {
    const humanReadableTitle = slugKey.replace(/-/g, ' ')
    const briefText = tools.brief ? tools.brief.toLowerCase() : ''
    const titleText = tools.title ? tools.title.toLowerCase() : ''
    
    const tags: string[] = Array.isArray(tools.tags) ? tools.tags : []
    const isTagMatched = tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
    const isPrivate = typeof tools.isPrivate === 'boolean' ? tools.isPrivate : false

    const isMatched = !isPrivate && (
      testTextByAllWords({ words: normalizedQuery.split(','), text: tools.title }) ||
      !normalizedQuery || 
      slugKey.toLowerCase().includes(normalizedQuery) || 
      humanReadableTitle.toLowerCase().includes(normalizedQuery) || 
      titleText.includes(normalizedQuery) ||
      briefText.includes(normalizedQuery) ||
      isTagMatched
    )

    if (isMatched) {
      console.log(`-- MATCHED: ${tools.title}`)
      console.log(tools)
      console.log('--')
    }

    if (isMatched) {
      matchedNotes.push({
        original: {
          // Берем id из JSON, если его нет — подставляем сам slugKey в качестве уникального ID
          _id: String(tools._id || slugKey), 
          // Если в файле был красивый title, выводим его с иконкой папки, иначе — slugKey
          title: tools.title ? `📁 ${tools.title}` : slugKey,
          description: tools.brief || 'Локальное описание отсутствует',
          isPrivate,
          // Берем оригинальные даты создания и обновления из JSON-файла!
          createdAt: tools.createdAt || new Date().toISOString(), 
          updatedAt: tools.updatedAt || new Date().toISOString(),
          // Подставляем приоритет из файла, либо 0 по умолчанию
          priority: typeof tools.priority === 'number' ? tools.priority : 0,
        },
        bg: tools.bg || defaultBg,
        slug: String(slugKey || tools._id),
        brief: tools.brief,
      })
    }
  })

  return matchedNotes
}
```