import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks/redux';
import { createShoppingList } from '../../store/slices/shoppingSlice';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateListModal: React.FC<CreateListModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
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
      newErrors.name = 'List name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'List name must be at least 2 characters long';
    }
    
    return newErrors;
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
      const result = await dispatch(createShoppingList({
        name: formData.name.trim(),
        description: formData.description.trim(),
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
    setFormData({ name: '', description: '' });
    setErrors({});
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Shopping List"
      size="medium"
    >
      <form onSubmit={handleSubmit} className="create-list-form">
        <Input
          type="text"
          name="name"
          label="List Name"
          value={formData.name}
          onChange={handleInputChange}
          error={errors.name}
          placeholder="Enter list name (e.g., Weekly Groceries)"
          fullWidth
          required
          autoFocus
        />

        <div className="textarea-container">
          <label htmlFor="description" className="input-label">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Add a description for your list..."
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
            Create List
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateListModal;
