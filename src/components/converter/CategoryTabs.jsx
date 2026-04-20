function CategoryTabs({ categories, activeCategoryId, onChange, panelId }) {
  return (
    <div className="category-tabs" role="group" aria-label="Kategorie převodu">
      {categories.map((category) => {
        const isActive = category.id === activeCategoryId

        return (
          <button
            key={category.id}
            type="button"
            aria-pressed={isActive}
            aria-controls={panelId}
            className={`category-tab${isActive ? ' is-active' : ''}`}
            onClick={() => onChange(category.id)}
          >
            <span>{category.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default CategoryTabs
