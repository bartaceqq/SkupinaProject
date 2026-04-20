function PageHeader({ kicker, title, subtitle }) {
  return (
    <section className="page-header">
      {kicker ? <p className="page-header__kicker">{kicker}</p> : null}
      <h1>{title}</h1>
      {subtitle ? <p className="page-header__subtitle">{subtitle}</p> : null}
    </section>
  )
}

export default PageHeader
