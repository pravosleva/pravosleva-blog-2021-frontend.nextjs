/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState, memo } from 'react'
import clsx from 'clsx'
import baseClasses from '~/ui-kit.sp-tradein2024-devtools/Base.module.scss'
// import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
// import { FaPlus, FaMinus } from 'react-icons/fa6'
import FaPlus from '@mui/icons-material/Add'
import FaMinus from '@mui/icons-material/Remove'
import classes from './CollapsibleBox.module.scss'

type TProps = {
  children: React.ReactNode;
  title: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  StartIcon?: React.ReactNode;
};

export const CollapsibleBox = memo(({ title, children, level, StartIcon }: TProps) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const toggler = useCallback(() => {
    setIsOpened((s) => !s);
  }, [setIsOpened])

  return (
    <>
      <div
        className={clsx(
          classes.toggler,
          {
            [classes[`toggler_level_${level}`]]: !!level,
          },
          baseClasses.truncate,
        )}
        onClick={toggler}
      >
        {isOpened ? <FaMinus fontSize='small' /> : <FaPlus fontSize='small' />}
        {!!StartIcon && StartIcon}
        <span className={baseClasses.truncate}>{title}</span>
      </div>
      {isOpened && <div>{children}</div>}
    </>
  )
})
