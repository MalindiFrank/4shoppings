import React from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Category } from '../../types';
import Input from '../common/Input';
import './SearchAndFilter.css';

interface SearchAndFilterProps {
  searchQuery: string;
  sortBy: string;
  categoryFilter: string;
  categories: Category[];
  showCategoryFilter?: boolean;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  sortBy,
  categoryFilter,
  categories,
  showCategoryFilter = false,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateSearchParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchParams('search', e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSearchParams('sort', e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSearchParams('category', e.target.value);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || sortBy !== 'name-asc' || categoryFilter;

  return (
    <div className="search-filter-container">
      <div className="search-filter-row">
        <div className="search-input">
          <Input
            type="text"
            placeholder={showCategoryFilter ? "Search items..." : "Search lists..."}
            value={searchQuery}
            onChange={handleSearchChange}
            startIcon="🔍"
            fullWidth
          />
        </div>

        <div className="filter-controls">
          <div className="sort-control">
            <label htmlFor="sort-select" className="control-label">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={handleSortChange}
              className="filter-select"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              {showCategoryFilter && (
                <option value="category">Category</option>
              )}
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
            </select>
          </div>

          {showCategoryFilter && (
            <div className="category-control">
              <label htmlFor="category-select" className="control-label">
                Category:
              </label>
              <select
                id="category-select"
                value={categoryFilter}
                onChange={handleCategoryChange}
                className="filter-select"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="clear-filters-btn"
              aria-label="Clear all filters"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="active-filters">
          <span className="filters-label">Active filters:</span>
          <div className="filter-tags">
            {searchQuery && (
              <span className="filter-tag">
                Search: "{searchQuery}"
                <button
                  onClick={() => updateSearchParams('search', '')}
                  className="remove-filter"
                  aria-label="Remove search filter"
                >
                  ×
                </button>
              </span>
            )}
            {sortBy !== 'name-asc' && (
              <span className="filter-tag">
                Sort: {sortBy.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                <button
                  onClick={() => updateSearchParams('sort', 'name-asc')}
                  className="remove-filter"
                  aria-label="Remove sort filter"
                >
                  ×
                </button>
              </span>
            )}
            {categoryFilter && (
              <span className="filter-tag">
                Category: {categoryFilter}
                <button
                  onClick={() => updateSearchParams('category', '')}
                  className="remove-filter"
                  aria-label="Remove category filter"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
