import StatusMessage from '../feedback/StatusMessage'

function PageHeader({ title, subtitle, statusMessage }) {
  return (
    <div className="page-header">
      <p className="page-header__eyebrow">Role A Frontend</p>
      <h1>{title}</h1>
      {subtitle ? <p className="page-header__subtitle">{subtitle}</p> : null}
      <StatusMessage message={statusMessage} />
    </div>
  )
}

export default PageHeader
