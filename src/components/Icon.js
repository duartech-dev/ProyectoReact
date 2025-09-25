import React from 'react';

const Icon = ({ name, size = 24, className = '', ...props }) => {
  const iconPath = `/assets/icons/${name}.svg`;
  
  return (
    <img 
      src={iconPath} 
      alt={name} 
      className={className}
      style={{ width: size, height: size }}
      {...props}
    />
  );
};

export default Icon;



