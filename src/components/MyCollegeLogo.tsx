import React from 'react';

interface MyCollegeLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showText?: boolean;
  textVariant?: 'dark' | 'light' | 'auto';
  layout?: 'stacked' | 'horizontal';
  animated?: boolean;
}

export const MyCollegeLogo: React.FC<MyCollegeLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textVariant = 'auto',
  layout = 'horizontal',
  animated = false,
}) => {
  const dimensions = {
    xs: { width: 28, height: 32, fontSize: 'text-lg', fullWidth: 70 },
    sm: { width: 38, height: 44, fontSize: 'text-xl', fullWidth: 95 },
    md: { width: 50, height: 58, fontSize: 'text-2xl', fullWidth: 130 },
    lg: { width: 75, height: 86, fontSize: 'text-3xl', fullWidth: 175 },
    xl: { width: 110, height: 126, fontSize: 'text-4xl', fullWidth: 240 },
    hero: { width: 160, height: 184, fontSize: 'text-5xl', fullWidth: 340 },
  }[size];

  const isLightText = textVariant === 'light';

  // Only the shield emblem
  if (!showText) {
    return (
      <div className={`inline-flex items-center justify-center select-none ${className}`}>
        <img
          src="/my-college-emblem.svg"
          alt="My College Escudo"
          style={{ width: dimensions.width, height: dimensions.height }}
          className={`object-contain drop-shadow-md shrink-0 ${
            animated ? 'transition-transform duration-300 hover:scale-105' : ''
          }`}
          loading="eager"
        />
      </div>
    );
  }

  // Stacked layout: Shield emblem + thinner "my college" (solo "my college")
  if (layout === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
        <img
          src="/my-college-emblem.svg"
          alt="My College Escudo"
          style={{ width: dimensions.width, height: dimensions.height }}
          className={`object-contain drop-shadow-md shrink-0 ${
            animated ? 'transition-transform duration-300 hover:scale-105' : ''
          }`}
          loading="eager"
        />
        <div className={`font-sans tracking-wide leading-none flex items-baseline mt-2 ${dimensions.fontSize}`}>
          <span className="text-[#E5A932] font-light">my</span>
          <span className={`ml-1 font-normal ${isLightText ? 'text-white' : 'text-[#0A3B7B]'}`}>college</span>
        </div>
      </div>
    );
  }

  // Horizontal layout: Shield emblem + thinner "my college" (solo "my college")
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <img
        src="/my-college-emblem.svg"
        alt="My College Escudo"
        style={{ width: dimensions.width, height: dimensions.height }}
        className={`object-contain shrink-0 drop-shadow-md ${
          animated ? 'transition-transform duration-300 hover:scale-105' : ''
        }`}
        loading="eager"
      />

      <div className={`font-sans tracking-wide leading-none flex items-baseline ${dimensions.fontSize}`}>
        <span className="text-[#E5A932] font-light">my</span>
        <span className={`ml-1 font-normal ${isLightText ? 'text-white' : 'text-[#0A3B7B]'}`}>college</span>
      </div>
    </div>
  );
};
