export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  disabled = false,
  icon,
  onClick,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-cyan-500 hover:bg-cyan-400 text-gray-900 focus:ring-cyan-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40',
    secondary: 'bg-purple-500 hover:bg-purple-400 text-white focus:ring-purple-500 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40',
    tertiary: 'bg-emerald-500 hover:bg-emerald-400 text-gray-900 focus:ring-emerald-500 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40',
    outline: 'border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 focus:ring-cyan-500',
    ghost: 'text-gray-300 hover:bg-gray-800 hover:text-cyan-400 focus:ring-gray-700',
    danger: 'bg-red-500 hover:bg-red-400 text-white focus:ring-red-500 shadow-lg shadow-red-500/25 hover:shadow-red-500/40'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};


