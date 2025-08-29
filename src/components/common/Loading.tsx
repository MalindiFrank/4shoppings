import React from 'react';
import './Loading.css';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  text = 'Loading...',
  fullScreen = false,
}) => {
  const containerClasses = [
    'loading-container',
    fullScreen ? 'loading-fullscreen' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      <div className="loading-content">
        <div className={`loading-spinner loading-${size}`}>
          <div className="spinner"></div>
        </div>
        {text && <p className="loading-text">{text}</p>}
      </div>
    </div>
  );
};

export default Loading;
