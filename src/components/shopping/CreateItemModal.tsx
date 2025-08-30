import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks/redux';
import { createShoppingItem } from '../../store/slices/shoppingSlice';
import type { Category } from '../../types';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId: string;
  categories: Category[];
}

const CreateItemModal: React.FC<CreateItemModalProps> = ({
  isOpen,
  onClose,
  listId,
  categories,
}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    category: categories[0]?.name || '',
    notes: '',
    imageUrl: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 1 : value,
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Item name must be at least 2 characters long';
    }
    
    if (formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }
    
    return newErrors;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const result = await dispatch(createShoppingItem({
        listId,
        itemData: {
          name: formData.name.trim(),
          quantity: formData.quantity,
          category: formData.category,
          notes: formData.notes.trim(),
          imageUrl: formData.imageUrl.trim(),
        },
      }));
      
      if (result.meta.requestStatus === 'fulfilled') {
        handleClose();
      }
    } catch (error) {
      // Error handling is done by Redux
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      quantity: 1,
      category: categories[0]?.name || '',
      notes: '',
      imageUrl: '',
    });
    setErrors({});
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Item"
      size="medium"
    >
      <form onSubmit={handleSubmit} className="create-item-form">
        <Input
          type="text"
          name="name"
          label="Item Name"
          value={formData.name}
          onChange={handleInputChange}
          error={errors.name}
          placeholder="Enter item name (e.g., Milk, Bread)"
          fullWidth
          required
          autoFocus
        />

        <div className="form-row">
          <Input
            type="number"
            name="quantity"
            label="Quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            error={errors.quantity}
            min="1"
            fullWidth
            required
          />

          <div className="select-container">
            <label htmlFor="category" className="input-label">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`select-field ${errors.category ? 'select-error' : ''}`}
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <div className="input-helper input-helper-error">
                {errors.category}
              </div>
            )}
          </div>
        </div>

        <Input
          type="url"
          name="imageUrl"
          label="Image URL (Optional)"
          value={formData.imageUrl}
          onChange={handleInputChange}
          error={errors.imageUrl}
          placeholder="https://example.com/image.jpg"
          fullWidth
        />

        <div className="textarea-container">
          <label htmlFor="notes" className="input-label">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Add any notes about this item..."
            className="textarea-field"
            rows={3}
          />
        </div>

        <div className="modal-actions">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            Add Item
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateItemModal;
