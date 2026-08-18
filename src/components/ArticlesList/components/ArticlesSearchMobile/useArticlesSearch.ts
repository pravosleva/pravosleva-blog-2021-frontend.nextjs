import { NCodeSamplesSpace } from '~/types'
import { searchEngine, SearchArticlesService } from './service.SearchArticles'
import { useRef } from 'react'
import { useReactiveValue0 } from '~/utils/reactive-engine'

export const useArticlesSearch = () => {
  const searchArticlesService = searchEngine.inject(SearchArticlesService)
  const query = useReactiveValue0(searchArticlesService.searchQuery)
  const currentPage = useReactiveValue0(searchArticlesService.currentPage)
  const totalPages = useReactiveValue0(searchArticlesService.totalPages)
  const totalNotes = useReactiveValue0(searchArticlesService.totalNotes)

  const { loading, data, error } = useReactiveValue0(searchArticlesService.searchResource)

  // (WTF?) Используем useRef, чтобы сохранять предыдущие результаты во время загрузки следующей страницы
  const __resultsRef = useRef<NCodeSamplesSpace.TNote[]>([])
  
  if (data && data.length > 0) {
    __resultsRef.current = data
  } else if (!query) {
    // Если поисковый запрос полностью стерт — очищаем кэш
    __resultsRef.current = []
  }

  return {
    query,
    results: data, // Отдаем закешированные данные, чтобы экран не "мигал" белизной при загрузке
    data,
    error,
    isLoading: loading,
    currentPage,
    totalPages,
    totalNotes,
    setQuery: (q: string) => { searchArticlesService.changeQuery(q) },
    setCurrentPage: (page: number) => { searchArticlesService.currentPage.value = page },
    reset: () => searchArticlesService.reset()
  }
}
