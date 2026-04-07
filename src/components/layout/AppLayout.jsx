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
  )
}

export default AppLayout
