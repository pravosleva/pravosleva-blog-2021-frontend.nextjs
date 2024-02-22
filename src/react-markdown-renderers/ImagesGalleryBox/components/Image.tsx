import { useInView } from 'react-intersection-observer'

type TProps = {
  src: string;
  alt: string;
  onClickHandler: () => void;
}

export const Image = ({ src, alt, onClickHandler }: TProps) => {
  const {
    ref,
    inView,
    // entry,
  } = useInView({
    /* Optional options */
    threshold: 0,
  })

  return (
    <img
      ref={ref}
      src={inView ? src : '/static/img/loaders/3-dots-scale.svg'}
      alt={alt}
      onClick={onClickHandler}
    />
  )
}
