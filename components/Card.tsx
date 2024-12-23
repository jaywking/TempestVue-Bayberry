interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'metric';
  highlight?: boolean;
}

export function Card({ 
  children, 
  className = '', 
  variant = 'default',
  highlight = false
}: CardProps) {
  const variants = {
    default: `
      bg-indigo-950/40 backdrop-blur-xl 
      border border-white/10
      hover:bg-indigo-950/50 hover:border-white/20
      flex flex-col
    `,
    glass: `
      bg-gradient-to-br from-indigo-950/40 to-indigo-950/30 
      backdrop-blur-xl border border-white/10
      shadow-xl shadow-indigo-950/20
      flex flex-col
    `,
    metric: `
      bg-indigo-950/40 backdrop-blur-lg 
      border border-white/10
      shadow-lg shadow-indigo-950/20
      h-full w-full
      flex flex-col
    `
  };

  const highlightClass = highlight 
    ? 'ring-4 ring-white/30 ring-offset-4 ring-offset-transparent' 
    : '';

  return (
    <div className={`
      rounded-2xl p-2 md:p-3 
      shadow-2xl shadow-black/20
      transition-all duration-300 ease-in-out
      ${variants[variant]}
      ${highlightClass}
      ${className}
    `}>
      {children}
    </div>
  );
} 