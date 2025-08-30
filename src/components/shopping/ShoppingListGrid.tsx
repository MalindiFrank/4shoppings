import React, { useState } from 'react';
import type { ShoppingList } from '../../types';
import { useAppDispatch } from '../../hooks/redux';
import { deleteShoppingList, updateShoppingList } from '../../store/slices/shoppingSlice';
import Button from '../common/Button';
import Modal from '../common/Modal';
import EditListModal from './EditListModal';
import ShareListModal from './ShareListModal';
import './ShoppingListGrid.css';

interface ShoppingListGridProps {
  lists: ShoppingList[];
  onListSelect: (listId: string) => void;
  loading: boolean;
}

const ShoppingListGrid: React.FC<ShoppingListGridProps> = ({
  lists,
  onListSelect,
  loading,
}) => {
  const dispatch = useAppDispatch();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingList, setEditingList] = useState<ShoppingList | null>(null);
  const [sharingList, setSharingList] = useState<ShoppingList | null>(null);

  const handleDeleteList = async (listId: string) => {
    await dispatch(deleteShoppingList(listId));
    setDeleteConfirm(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getItemCount = (list: ShoppingList) => {
    // This would typically come from the items state
    // For now, we'll show a placeholder
    return 0;
  };

  if (lists.length === 0 && !loading) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>No shopping lists yet</h3>
        <p>Create your first shopping list to get started organizing your shopping.</p>
      </div>
    );
  }

  return (
    <>
      <div className="shopping-list-grid">
        {lists.map((list) => (
          <div key={list.id} className="list-card">
            <div className="list-card-header">
              <h3 className="list-title" onClick={() => onListSelect(list.id)}>
                {list.name}
              </h3>
              <div className="list-actions">
                <button
                  className="action-btn"
                  onClick={() => setEditingList(list)}
                  aria-label="Edit list"
                >
                  ✏️
                </button>
                <button
                  className="action-btn"
                  onClick={() => setSharingList(list)}
                  aria-label="Share list"
                >
                  📤
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => setDeleteConfirm(list.id)}
                  aria-label="Delete list"
                >
                  🗑️
                </button>
              </div>
            </div>

            {list.description && (
              <p className="list-description">{list.description}</p>
            )}

            <div className="list-meta">
              <div className="list-stats">
                <span className="stat">
                  <span className="stat-value">{getItemCount(list)}</span>
                  <span className="stat-label">items</span>
                </span>
                {list.sharedWith.length > 0 && (
                  <span className="stat">
                    <span className="stat-value">{list.sharedWith.length}</span>
                    <span className="stat-label">shared</span>
                  </span>
                )}
              </div>
              <div className="list-date">
                Created {formatDate(list.createdAt)}
              </div>
            </div>

            <div className="list-card-footer">
              <Button
                variant="outline"
                size="small"
                onClick={() => onListSelect(list.id)}
                fullWidth
              >
                View Items
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Shopping List"
        size="small"
      >
        <div className="delete-confirmation">
          <p>
            Are you sure you want to delete this shopping list? This action cannot be undone
            and will also delete all items in the list.
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
              onClick={() => deleteConfirm && handleDeleteList(deleteConfirm)}
            >
              Delete List
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit List Modal */}
      {editingList && (
        <EditListModal
          isOpen={!!editingList}
          onClose={() => setEditingList(null)}
          list={editingList}
        />
      )}

      {/* Share List Modal */}
      {sharingList && (
        <ShareListModal
          isOpen={!!sharingList}
          onClose={() => setSharingList(null)}
          list={sharingList}
        />
      )}
    </>
  );
};

export default ShoppingListGrid;
