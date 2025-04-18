import React from 'react';

const variants = {
  primary: 'font-semibold md:text-2xl text-lg blueCol md:py-3 py-2 px-6 md:px-10',
  secondary: 'font-medium text-lg text-gray-200 py-2 px-6'
};

const Button = ({
  children,
  variant = 'primary',
  as: Component = 'button',
  className = '',
  ...props
}) => {
  return (
    <Component className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </Component>
  );
};

export default Button;