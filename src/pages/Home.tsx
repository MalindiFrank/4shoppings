import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import {
  fetchShoppingLists,
  fetchShoppingItems,
  fetchCategories,
  setCurrentList,
} from '../store/slices/shoppingSlice';
import ShoppingListGrid from '../components/shopping/ShoppingListGrid';
import ShoppingItemList from '../components/shopping/ShoppingItemList';
import SearchAndFilter from '../components/shopping/SearchAndFilter';
import CreateListModal from '../components/shopping/CreateListModal';
import CreateItemModal from '../components/shopping/CreateItemModal';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import './Home.css';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { lists, items, categories, currentList, loading, error } = useAppSelector(
    (state) => state.shopping
  );
  
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [showCreateItemModal, setShowCreateItemModal] = useState(false);
  const [view, setView] = useState<'lists' | 'items'>('lists');

  // Get search and filter parameters from URL
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || 'name-asc';
  const categoryFilter = searchParams.get('category') || '';

  useEffect(() => {
    // Load initial data
    dispatch(fetchShoppingLists());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    // Load items when a list is selected
    if (currentList) {
      dispatch(fetchShoppingItems(currentList.id));
      setView('items');
    }
  }, [dispatch, currentList]);

  const handleListSelect = (listId: string) => {
    const selectedList = lists.find(list => list.id === listId);
    if (selectedList) {
      dispatch(setCurrentList(selectedList));
    }
  };

  const handleBackToLists = () => {
    dispatch(setCurrentList(null));
    setView('lists');
  };

  const handleCreateList = () => {
    setShowCreateListModal(true);
  };

  const handleCreateItem = () => {
    setShowCreateItemModal(true);
  };

  const filteredAndSortedLists = React.useMemo(() => {
    let filtered = lists;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(list =>
        list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        list.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return sorted;
  }, [lists, searchQuery, sortBy]);

  const filteredAndSortedItems = React.useMemo(() => {
    let filtered = items;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.notes.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return sorted;
  }, [items, searchQuery, sortBy, categoryFilter]);

  if (loading && lists.length === 0) {
    return <Loading text="Loading your shopping lists..." />;
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <div className="header-content">
          {view === 'lists' ? (
            <>
              <h1>My Shopping Lists</h1>
              <p>Organize your shopping with smart lists</p>
            </>
          ) : (
            <>
              <div className="breadcrumb">
                <button onClick={handleBackToLists} className="breadcrumb-link">
                  My Lists
                </button>
                <span className="breadcrumb-separator">›</span>
                <span className="breadcrumb-current">{currentList?.name}</span>
              </div>
              <h1>{currentList?.name}</h1>
              {currentList?.description && (
                <p>{currentList.description}</p>
              )}
            </>
          )}
        </div>
        
        <div className="header-actions">
          {view === 'lists' ? (
            <Button onClick={handleCreateList}>
              Create New List
            </Button>
          ) : (
            <Button onClick={handleCreateItem}>
              Add Item
            </Button>
          )}
        </div>
      </div>

      <SearchAndFilter
        searchQuery={searchQuery}
        sortBy={sortBy}
        categoryFilter={categoryFilter}
        categories={categories}
        showCategoryFilter={view === 'items'}
      />

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="home-content">
        {view === 'lists' ? (
          <ShoppingListGrid
            lists={filteredAndSortedLists}
            onListSelect={handleListSelect}
            loading={loading}
          />
        ) : (
          <ShoppingItemList
            items={filteredAndSortedItems}
            categories={categories}
            loading={loading}
          />
        )}
      </div>

      <CreateListModal
        isOpen={showCreateListModal}
        onClose={() => setShowCreateListModal(false)}
      />

      {currentList && (
        <CreateItemModal
          isOpen={showCreateItemModal}
          onClose={() => setShowCreateItemModal(false)}
          listId={currentList.id}
          categories={categories}
        />
      )}
    </div>
  );
};

export default Home;
