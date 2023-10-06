import Link from 'next/link'
import styles from './ProjectItem.module.scss'

type TProps = {
  title: string;
  description?: string;
  img?: {
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
    <div
      className={styles['projects-grid--item-v2']}
    >
      <Link href={link.href} as={link.as}>
        <div
          className={styles['card']}
          // style={{
          //   backgroundImage: `url(${img.src})`,
          //   backgroundPosition: 'center',
          //   backgroundSize: 'cover',
          //   borderRadius: '1em',
          // }}
        >

          <h3>{title}</h3><br />
          {
            !!description && (
              <p>{description}</p>
            )
          }

          <div
            className={styles['layers']}
          >
            <div className={styles['layer']}></div>
            <div className={styles['layer']}></div>
            <div className={styles['layer']}></div>
            <div className={styles['layer']}></div>
            <div className={styles['layer']}></div>
            <div className={styles['layer']}></div>
            <div className={styles['layer']}></div>
            <div className={styles['layer']}></div>
            <div className={styles['layer']}></div>
            <div className={styles['layer']}></div>   
          </div>
        </div>
      </Link>
    </div>
  )
}
