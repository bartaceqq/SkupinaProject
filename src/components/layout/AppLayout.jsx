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
  )
}

export default AppLayout
