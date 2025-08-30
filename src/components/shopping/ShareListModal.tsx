import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks/redux';
import { shareShoppingList } from '../../store/slices/shoppingSlice';
import type { ShoppingList } from '../../types';
import { validateEmail } from '../../utils/auth';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';

interface ShareListModalProps {
  isOpen: boolean;
  onClose: () => void;
  list: ShoppingList;
}

const ShareListModal: React.FC<ShareListModalProps> = ({ isOpen, onClose, list }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (list.sharedWith.includes(email)) {
      setError('This list is already shared with this email address');
      return;
    }

    setLoading(true);
    try {
      const result = await dispatch(shareShoppingList({
        listId: list.id,
        userEmail: email.trim(),
      }));
      
      if (result.meta.requestStatus === 'fulfilled') {
        setSuccessMessage(`List shared successfully with ${email}`);
        setEmail('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error) {
      setError('Failed to share list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setSuccessMessage('');
    setLoading(false);
    onClose();
  };

  const copyShareLink = () => {
    const shareLink = `${window.location.origin}/shared/${list.id}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      setSuccessMessage('Share link copied to clipboard!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }).catch(() => {
      setError('Failed to copy link to clipboard');
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Share Shopping List"
      size="medium"
    >
      <div className="share-list-content">
        <div className="list-info">
          <h3>{list.name}</h3>
          {list.description && <p>{list.description}</p>}
        </div>

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="share-section">
          <h4>Share via Email</h4>
          <p>Enter an email address to share this list with someone:</p>
          
          <form onSubmit={handleShare} className="share-form">
            <Input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter email address"
              fullWidth
              autoFocus
            />
            <Button
              type="submit"
              loading={loading}
              fullWidth
            >
              Share List
            </Button>
          </form>
        </div>

        <div className="share-section">
          <h4>Share via Link</h4>
          <p>Copy this link to share your list:</p>
          
          <div className="share-link-container">
            <Input
              type="text"
              value={`${window.location.origin}/shared/${list.id}`}
              readOnly
              fullWidth
            />
            <Button
              type="button"
              variant="outline"
              onClick={copyShareLink}
            >
              Copy Link
            </Button>
          </div>
        </div>

        {list.sharedWith.length > 0 && (
          <div className="shared-with-section">
            <h4>Currently Shared With</h4>
            <ul className="shared-list">
              {list.sharedWith.map((email, index) => (
                <li key={index} className="shared-item">
                  {email}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="modal-actions">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareListModal;
