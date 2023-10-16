import Link from 'next/link'

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
    <div
      // className='card-v3'
      style={{
        
        backgroundColor: '#0162c8',
        // background: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7))',
        // background: 'linear-gradient(90deg, rgba(1,98,200,1) 0%, rgba(0,0,0,0.5) 50%, rgba(255,120,30,1) 100%)',
        color: '#fff',
        
        // backgroundImage: `url(${img.src})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',

        borderRadius: '16px',
        cursor: 'pointer',
      }}
    >
      <Link href={link.href} as={link.as}>
        <div
          style={{
            padding: '3em 2em',
            
            borderRadius: 'inherit',
          }}
        >
          <h3>{title}</h3>
          {!!description && <div>{description}</div>}
        </div>
      </Link>
    </div>
  )
}
