export const Card = ({ children, className = '', hover = false, glow = false }) => (
  <div className={`
    bg-gray-900 rounded-xl border border-gray-800
    ${hover ? 'hover:border-gray-700 transition-all duration-300' : ''}
    ${glow ? 'shadow-lg shadow-cyan-500/10' : ''}
    ${className}
  `}>
    {children}
  </div>
);