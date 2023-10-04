import Link from 'next/link'

type TProps = {
  title: string;
  img: {
    src: string;
    alt: string;
  };
  link: {
    href: string;
    as: string;
  };
}

export const ProjectItem = ({ title, img, link }: TProps) => {
  return (
    <div className='projects-grid--item'>
      <Link href={link.href} as={link.as}>
        <figure style={{ boxSizing: 'content-box' }}>
          <span
            className='v2'
            style={{
              backgroundImage: `url(${img.src})`,
              backgroundPosition: 'center',
              borderRadius: 'inherit',
            }}
          >
          </span>
          {/* <img src={img.src} alt={img.alt} />  */}
          <figcaption>
            <span className='truncate'>
              {title}
            </span>
          </figcaption>
        </figure>
      </Link>
    </div>
  )
}
