import React from 'react';

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export default function AlertModal({ isOpen, title, message, onClose }: AlertModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        background: 'white', padding: '24px', borderRadius: '12px', minWidth: '300px', maxWidth: '80%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)', transform: 'translateY(0)', animation: 'slideIn 0.3s ease-out'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#333', fontSize: '1.25rem' }}>{title}</h3>
        <p style={{ color: '#666', lineHeight: '1.5', marginBottom: '24px' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={onClose}
            style={{ 
              padding: '8px 24px', background: '#007bff', color: 'white', border: 'none', 
              borderRadius: '6px', cursor: 'pointer', fontWeight: '500' 
            }}
          >
            Зрозуміло
          </button>
        </div>
      </div>
      <style>
        {`@keyframes slideIn { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}
      </style>
    </div>
  );
}
