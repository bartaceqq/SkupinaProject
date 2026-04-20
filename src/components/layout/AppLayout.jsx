function AppLayout({ header, children, footer }) {
  return (
    <div className="app-layout">
      {header ? <header className="app-layout__header">{header}</header> : null}
      <main className="app-layout__main">{children}</main>
      {footer ? <footer className="app-layout__footer">{footer}</footer> : null}
    </div>
  )
}

export default AppLayout
