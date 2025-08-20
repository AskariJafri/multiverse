export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-800 ${className}`}>
    {children}
  </div>
);
