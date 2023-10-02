import { useCallback } from 'react'
import { useStickyState } from './useStickyState';
// import { useCompare } from './useDeepEffect';

type TSearchFormat = {
  original: string;
  normalized: string;
  withoutSpaces: string;
}
type THookResult = {
  state: TSearchFormat;
  reset: () => void;
  set: (val: TSearchFormat) => void;
}

const initialValue: TSearchFormat = {
  original: '',
  normalized: '',
  withoutSpaces: '',
}

export const useSearch = (key: string): THookResult => {
  const [searchFromLS, setSearchFromLS] = useStickyState<TSearchFormat>(initialValue, key)

  const set = useCallback((val: TSearchFormat) => {
    setSearchFromLS(val)
  }, [setSearchFromLS])
  const reset = useCallback(() => {
    setSearchFromLS(initialValue)
  }, [setSearchFromLS])

  return {
    state: searchFromLS,
    reset,
    set,
  };
}
