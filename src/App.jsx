import './App.css'

function App() {
  return (
    <main className="submission-page">
      <section className="submission-card">
        <p className="submission-eyebrow">Role A + Role B</p>
        <h1>Konvertor jednotek</h1>
        <p className="submission-text">
          Tento repozitar obsahuje pouze podklady k odevzdani podle zadani.
        </p>

        <div className="submission-block">
          <h2>Obsah</h2>
          <ul>
            <li>`docs/wireframe.png`</li>
            <li>`docs/component-tree.md`</li>
            <li>`src/theme.ts`</li>
            <li>`src/types.ts`</li>
            <li>`src/data/`</li>
            <li>`src/components/`</li>
          </ul>
        </div>

        <div className="submission-block">
          <h2>Poznamka</h2>
          <p className="submission-text">
            Komponenty v `src/components/` jsou ponechane jako prazdne scaffold soubory.
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
