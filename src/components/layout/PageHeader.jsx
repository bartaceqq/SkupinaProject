<<<<<<< Updated upstream
function PageHeader({ title, subtitle }) {
  return (
    <div className="page-header">
      <h1 className="page-header__title">{title}</h1>
      {subtitle ? <p className="page-header__subtitle">{subtitle}</p> : null}
=======
import StatusMessage from '../feedback/StatusMessage'

function PageHeader({ title, subtitle, statusMessage }) {
  return (
    <div className="page-header">
      <p className="page-header__eyebrow">Role A Frontend</p>
      <h1>{title}</h1>
      {subtitle ? <p className="page-header__subtitle">{subtitle}</p> : null}
      <StatusMessage message={statusMessage} />
>>>>>>> Stashed changes
    </div>
  )
}

export default PageHeader
