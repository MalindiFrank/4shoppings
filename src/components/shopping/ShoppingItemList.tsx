import React, { useState } from 'react';
import type { ShoppingItem, Category } from '../../types';
import { useAppDispatch } from '../../hooks/redux';
import { updateShoppingItem, deleteShoppingItem } from '../../store/slices/shoppingSlice';
import Button from '../common/Button';
import Modal from '../common/Modal';
import EditItemModal from './EditItemModal';
import './ShoppingItemList.css';

interface ShoppingItemListProps {
  items: ShoppingItem[];
  categories: Category[];
  loading: boolean;
}

const ShoppingItemList: React.FC<ShoppingItemListProps> = ({
  items,
  categories,
  loading,
}) => {
  const dispatch = useAppDispatch();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);

  const handleToggleComplete = async (item: ShoppingItem) => {
    await dispatch(updateShoppingItem({
      itemId: item.id,
      updates: { completed: !item.completed }
    }));
  };

  const handleDeleteItem = async (itemId: string) => {
    await dispatch(deleteShoppingItem(itemId));
    setDeleteConfirm(null);
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#666';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Group items by completion status
  const pendingItems = items.filter(item => !item.completed);
  const completedItems = items.filter(item => item.completed);

  if (items.length === 0 && !loading) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🛒</div>
        <h3>No items in this list</h3>
        <p>Add your first item to start building your shopping list.</p>
      </div>
    );
  }

  const renderItem = (item: ShoppingItem) => (
    <div key={item.id} className={`item-card ${item.completed ? 'completed' : ''}`}>
      <div className="item-checkbox">
        <input
          type="checkbox"
          checked={item.completed}
          onChange={() => handleToggleComplete(item)}
          className="checkbox"
        />
      </div>

      <div className="item-content">
        <div className="item-header">
          <h4 className="item-name">{item.name}</h4>
          <div className="item-actions">
            <button
              className="action-btn"
              onClick={() => setEditingItem(item)}
              aria-label="Edit item"
            >
              ✏️
            </button>
            <button
              className="action-btn delete-btn"
              onClick={() => setDeleteConfirm(item.id)}
              aria-label="Delete item"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="item-details">
          <div className="item-quantity">
            Qty: <span className="quantity-value">{item.quantity}</span>
          </div>
          <div
            className="item-category"
            style={{ backgroundColor: getCategoryColor(item.category) }}
          >
            {item.category}
          </div>
        </div>

        {item.notes && (
          <p className="item-notes">{item.notes}</p>
        )}

        {item.imageUrl && (
          <div className="item-image">
            <img src={item.imageUrl} alt={item.name} />
          </div>
        )}

        <div className="item-meta">
          <span className="item-date">
            Added {formatDate(item.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="shopping-item-list">
        {pendingItems.length > 0 && (
          <div className="item-section">
            <h3 className="section-title">
              Shopping List ({pendingItems.length} items)
            </h3>
            <div className="item-grid">
              {pendingItems.map(renderItem)}
            </div>
          </div>
        )}

        {completedItems.length > 0 && (
          <div className="item-section">
            <h3 className="section-title">
              Completed ({completedItems.length} items)
            </h3>
            <div className="item-grid">
              {completedItems.map(renderItem)}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Item"
        size="small"
      >
        <div className="delete-confirmation">
          <p>
            Are you sure you want to delete this item? This action cannot be undone.
          </p>
          <div className="modal-actions">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteConfirm && handleDeleteItem(deleteConfirm)}
            >
              Delete Item
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Item Modal */}
      {editingItem && (
        <EditItemModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          item={editingItem}
          categories={categories}
        />
      )}
    </>
  );
};

export default ShoppingItemList;
