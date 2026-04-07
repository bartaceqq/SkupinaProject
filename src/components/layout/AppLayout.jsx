<<<<<<< Updated upstream
function AppLayout({ header, children, footer, statusArea }) {
  return (
    <div className="app-shell">
      <section className="app-card" aria-label="All Unit Converter">
        <header className="app-card__header">{header}</header>
        <main className="app-card__main">{children}</main>
        <footer className="app-card__footer">{footer}</footer>
      </section>

      {statusArea ? <section className="app-shell__status">{statusArea}</section> : null}
    </div>
=======
function AppLayout({ header, children, footer }) {
  return (
    <main className="app-shell">
      <div className="app-backdrop" />
      <section className="app-card">
        {header ? <header className="app-header">{header}</header> : null}
        <div className="app-content">{children}</div>
        {footer ? <footer className="app-footer">{footer}</footer> : null}
      </section>
    </main>
>>>>>>> Stashed changes
  )
}

export default AppLayout
