function CategoryTabs({ categories, activeCategoryId, onChange }) {
  return (
    <div className="category-tabs" role="tablist" aria-label="Conversion categories">
      {categories.map((category) => {
        const isActive = category.id === activeCategoryId

        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`category-tab${isActive ? ' is-active' : ''}`}
            onClick={() => onChange(category.id)}
          >
            <span className="category-tab__icon" aria-hidden="true">
              {category.icon}
            </span>
            <span>{category.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default CategoryTabs
