function CategoryTabs({ activeCategory, categories, onChange }) {
  return (
    <div className="category-tabs" role="tablist" aria-label="Kategorie převodu">
      {categories.map((category) => {
        const isActive = category.id === activeCategory

        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`category-tabs__button${isActive ? ' category-tabs__button--active' : ''}`}
            onClick={() => onChange(category.id)}
          >
            {category.label}
          </button>
        )
      })}
    </div>
  )
}

export default CategoryTabs
