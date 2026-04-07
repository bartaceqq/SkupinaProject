<<<<<<< Updated upstream
function CategoryTabs({ activeCategory, categories, onChange }) {
  return (
    <div className="category-tabs" role="tablist" aria-label="Kategorie převodu">
      {categories.map((category) => {
        const isActive = category.id === activeCategory
=======
function CategoryTabs({ categories, activeCategoryId, onChange }) {
  return (
    <div className="category-tabs" role="tablist" aria-label="Conversion categories">
      {categories.map((category) => {
        const isActive = category.id === activeCategoryId
>>>>>>> Stashed changes

        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={isActive}
<<<<<<< Updated upstream
            className={`category-tabs__button${isActive ? ' category-tabs__button--active' : ''}`}
            onClick={() => onChange(category.id)}
          >
            {category.label}
=======
            className={`category-tab${isActive ? ' is-active' : ''}`}
            onClick={() => onChange(category.id)}
          >
            <span className="category-tab__icon" aria-hidden="true">
              {category.icon}
            </span>
            <span>{category.label}</span>
>>>>>>> Stashed changes
          </button>
        )
      })}
    </div>
  )
}

export default CategoryTabs
