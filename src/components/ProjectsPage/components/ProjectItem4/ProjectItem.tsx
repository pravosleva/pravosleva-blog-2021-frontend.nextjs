import Link from 'next/link'
import classes from './ProjectItem.module.scss'
import clsx from 'clsx';

type TProps = {
  title: string;
  description?: string;
  img: {
    src: string;
    alt: string;
  };
  link: {
    href: string;
    as: string;
  };
}


export const ProjectItem = ({ title, link, description }: TProps) => {
  return (
    <Link
      href={link.href}
      as={link.as}
    >
      <div
        className={clsx(classes.wrapper)}
        style={{
          padding: '3em 2em',
          cursor: 'pointer',
          
          borderRadius: '16px',
          // background: '#e0e0e0',
          // boxShadow: '15px 15px 30px rgba(0,0,0,0.2), -15px -15px 30px #ffffff',
          transition: 'all linear 0.2s',
        }}
      >
        <h3 className='big-text'>{title}</h3>
        {!!description && <div className={classes.descr}>{description}</div>}
      </div>
    </Link>
  )
}
