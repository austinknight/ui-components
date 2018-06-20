import React from 'react';

const ChevronLeft = props => (
  <svg {...props.size || { width: '24px', height: '24px' }} {...props} viewBox="0 0 24 24">
    <path fill={props.fill || '#666666'} d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </svg>
);

export default ChevronLeft;