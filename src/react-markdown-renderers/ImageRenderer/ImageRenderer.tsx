import { useState } from 'react'
// import { useNotifsContext } from '~/common/hooks'

interface IProps {
  alt: string
  src: string
}

export const ImageRenderer = ({ alt, src }: IProps) => {
  const [fullSize, setFullSize] = useState<boolean>(false)
  // const { addDangerNotif } = useNotifsContext()
  const handleClick = () => {
    setFullSize(!fullSize)
  }

  return <img className={fullSize ? 'large' : 'small'} alt={alt} src={src} onClick={handleClick} />
}
