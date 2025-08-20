export const Input = ({ 
  label, 
  placeholder, 
  type = 'text', 
  error,
  icon,
  className = '',
  ...props 
}) => (
  <div className={`w-full ${className}`}>
    {label && (
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
    )}
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 text-sm">{icon}</span>
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`
          w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
          placeholder-gray-500 text-gray-100 transition-all duration-200
          ${icon ? 'pl-10' : ''}
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
        `}
        {...props}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
  </div>
);