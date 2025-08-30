import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validateName, validatePhoneNumber, validatePassword } from '../utils/auth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import './Profile.css';

const Profile: React.FC = () => {
  const { user, updateProfile, loading, error, clearError } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    cellPhone: user?.cellPhone || '',
    email: user?.email || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [profileErrors, setProfileErrors] = useState<{ [key: string]: string }>({});
  const [passwordErrors, setPasswordErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName,
        lastName: user.lastName,
        cellPhone: user.cellPhone,
        email: user.email,
      });
    }
  }, [user]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear field error when user starts typing
    if (profileErrors[name]) {
      setProfileErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear field error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateProfileForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!validateName(profileData.firstName)) {
      errors.firstName = 'First name must be at least 2 characters long';
    }
    
    if (!validateName(profileData.lastName)) {
      errors.lastName = 'Last name must be at least 2 characters long';
    }
    
    if (!validateEmail(profileData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!validatePhoneNumber(profileData.cellPhone)) {
      errors.cellPhone = 'Please enter a valid phone number';
    }
    
    return errors;
  };

  const validatePasswordForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else {
      const passwordValidation = validatePassword(passwordData.newPassword);
      if (!passwordValidation.isValid) {
        errors.newPassword = passwordValidation.errors[0];
      }
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateProfileForm();
    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }

    try {
      const result = await updateProfile(profileData);
      if (result.meta.requestStatus === 'fulfilled') {
        setIsEditing(false);
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      // Error is handled by Redux
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validatePasswordForm();
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    try {
      const result = await updateProfile({ password: passwordData.newPassword });
      if (result.meta.requestStatus === 'fulfilled') {
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setSuccessMessage('Password updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      // Error is handled by Redux
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      cellPhone: user?.cellPhone || '',
      email: user?.email || '',
    });
    setProfileErrors({});
  };

  const handleCancelPasswordChange = () => {
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordErrors({});
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your account information and preferences</p>
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

      <div className="profile-card">
        <div className="profile-section">
          <div className="section-header">
            <h2>Personal Information</h2>
            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>

          <form onSubmit={handleProfileSubmit} className="profile-form">
            <div className="form-row">
              <Input
                type="text"
                name="firstName"
                label="First Name"
                value={profileData.firstName}
                onChange={handleProfileInputChange}
                error={profileErrors.firstName}
                disabled={!isEditing}
                fullWidth
                required
              />

              <Input
                type="text"
                name="lastName"
                label="Last Name"
                value={profileData.lastName}
                onChange={handleProfileInputChange}
                error={profileErrors.lastName}
                disabled={!isEditing}
                fullWidth
                required
              />
            </div>

            <Input
              type="email"
              name="email"
              label="Email Address"
              value={profileData.email}
              onChange={handleProfileInputChange}
              error={profileErrors.email}
              disabled={!isEditing}
              fullWidth
              required
            />

            <Input
              type="tel"
              name="cellPhone"
              label="Cell Phone Number"
              value={profileData.cellPhone}
              onChange={handleProfileInputChange}
              error={profileErrors.cellPhone}
              disabled={!isEditing}
              fullWidth
              required
            />

            {isEditing && (
              <div className="form-actions">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </div>

        <div className="profile-section">
          <div className="section-header">
            <h2>Security</h2>
            <Button
              variant="outline"
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </Button>
          </div>
          <p className="section-description">
            Keep your account secure by using a strong password and updating it regularly.
          </p>
        </div>
      </div>

      <Modal
        isOpen={showPasswordModal}
        onClose={handleCancelPasswordChange}
        title="Change Password"
        size="medium"
      >
        <form onSubmit={handlePasswordSubmit} className="password-form">
          <Input
            type="password"
            name="currentPassword"
            label="Current Password"
            value={passwordData.currentPassword}
            onChange={handlePasswordInputChange}
            error={passwordErrors.currentPassword}
            placeholder="Enter your current password"
            fullWidth
            required
          />

          <Input
            type="password"
            name="newPassword"
            label="New Password"
            value={passwordData.newPassword}
            onChange={handlePasswordInputChange}
            error={passwordErrors.newPassword}
            placeholder="Enter your new password"
            fullWidth
            required
          />

          <Input
            type="password"
            name="confirmPassword"
            label="Confirm New Password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordInputChange}
            error={passwordErrors.confirmPassword}
            placeholder="Confirm your new password"
            fullWidth
            required
          />

          <div className="modal-actions">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelPasswordChange}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
            >
              Update Password
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
