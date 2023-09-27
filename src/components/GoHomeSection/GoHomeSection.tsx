import Link from 'next/link'

export const GoHomeSection = ({
  t,
}: {
  t: (_s: string) => void;
}) => {
  return (
    <div className="special-link-wrapper fade-in-effect unselectable">
      <Link href="/" as="/">
        <a className="link-as-rippled-btn">
          <i className="fas fa-arrow-left"></i>
          <span style={{ marginLeft: '10px' }}>{t('GO_BACK_TO_THE_HOMEPAGE')}</span>
        </a>
      </Link>
    </div>
  )
}
