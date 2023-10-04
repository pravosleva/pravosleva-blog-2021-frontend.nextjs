import { useEffect, useMemo, useState } from 'react'

export const useIsInViewport = ({ elm }: { elm: any}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const observer = useMemo<any>(
    () => {
      try {
        return new IntersectionObserver(([entry]) =>
          setIsIntersecting(entry.isIntersecting),
        )
      } catch (err) {
        return null
      }
    },
    [],
  );

  useEffect(() => {
    try {
      observer.observe(elm);

      return () => {
        observer.disconnect();
      };
    } catch (err) {
      console.log(err)
    }
  }, [elm, observer, typeof window]);

  return isIntersecting;
}
