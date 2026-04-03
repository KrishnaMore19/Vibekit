// VibeKit Studio — Theme System
// Each theme defines CSS custom properties applied to the published/preview page

export const THEMES = {
  minimal: {
    id: 'minimal',
    name: 'Minimal / Editorial',
    emoji: '🤍',
    description: 'Clean white space with bold typography',
    preview: {
      bg: '#FAFAFA',
      accent: '#E53E3E',
      text: '#0D0D0D',
    },
    vars: {
      '--vk-bg': '#FAFAFA',
      '--vk-surface': '#FFFFFF',
      '--vk-text': '#0D0D0D',
      '--vk-text-muted': '#6B6B6B',
      '--vk-accent': '#E53E3E',
      '--vk-accent-hover': '#C53030',
      '--vk-border': '#E8E8E8',
      '--vk-radius': '2px',
      '--vk-font-display': '"Playfair Display", Georgia, serif',
      '--vk-font-body': '"DM Sans", sans-serif',
      '--vk-shadow': '0 1px 3px rgba(0,0,0,0.08)',
      '--vk-btn-style': 'solid',
      '--vk-btn-radius': '2px',
      '--vk-hero-gradient': 'none',
      '--vk-section-spacing': '5rem',
    },
  },

  neobrutalist: {
    id: 'neobrutalist',
    name: 'Neo-Brutal',
    emoji: '⚡',
    description: 'Bold borders, raw energy, zero compromise',
    preview: {
      bg: '#F5F500',
      accent: '#000000',
      text: '#000000',
    },
    vars: {
      '--vk-bg': '#F5F500',
      '--vk-surface': '#FFFFFF',
      '--vk-text': '#000000',
      '--vk-text-muted': '#333333',
      '--vk-accent': '#000000',
      '--vk-accent-hover': '#222222',
      '--vk-border': '#000000',
      '--vk-radius': '0px',
      '--vk-font-display': '"Bebas Neue", "Impact", sans-serif',
      '--vk-font-body': '"Space Grotesk", sans-serif',
      '--vk-shadow': '4px 4px 0px #000000',
      '--vk-btn-style': 'brutal',
      '--vk-btn-radius': '0px',
      '--vk-hero-gradient': 'none',
      '--vk-section-spacing': '4rem',
    },
  },

  darkneon: {
    id: 'darkneon',
    name: 'Dark / Neon',
    emoji: '🌃',
    description: 'Cyberpunk glow on deep dark canvas',
    preview: {
      bg: '#080818',
      accent: '#00FFD1',
      text: '#E8E8FF',
    },
    vars: {
      '--vk-bg': '#080818',
      '--vk-surface': '#0F0F2A',
      '--vk-text': '#E8E8FF',
      '--vk-text-muted': '#8888BB',
      '--vk-accent': '#00FFD1',
      '--vk-accent-hover': '#00CCAA',
      '--vk-border': '#2A2A4A',
      '--vk-radius': '8px',
      '--vk-font-display': '"Orbitron", "Courier New", monospace',
      '--vk-font-body': '"Rajdhani", sans-serif',
      '--vk-shadow': '0 0 20px rgba(0,255,209,0.3)',
      '--vk-btn-style': 'glow',
      '--vk-btn-radius': '4px',
      '--vk-hero-gradient': 'radial-gradient(ellipse at 50% 0%, rgba(0,255,209,0.15) 0%, transparent 60%)',
      '--vk-section-spacing': '5rem',
    },
  },

  pastel: {
    id: 'pastel',
    name: 'Pastel / Soft',
    emoji: '🌸',
    description: 'Dreamy soft tones and gentle curves',
    preview: {
      bg: '#FDF0F8',
      accent: '#D06FBF',
      text: '#2D1B32',
    },
    vars: {
      '--vk-bg': '#FDF0F8',
      '--vk-surface': '#FFF5FC',
      '--vk-text': '#2D1B32',
      '--vk-text-muted': '#8B6A8B',
      '--vk-accent': '#D06FBF',
      '--vk-accent-hover': '#B55CA0',
      '--vk-border': '#F0C8E8',
      '--vk-radius': '20px',
      '--vk-font-display': '"Cormorant Garamond", Georgia, serif',
      '--vk-font-body': '"Nunito", sans-serif',
      '--vk-shadow': '0 4px 24px rgba(208,111,191,0.15)',
      '--vk-btn-style': 'pill',
      '--vk-btn-radius': '999px',
      '--vk-hero-gradient': 'linear-gradient(135deg, #FDF0F8 0%, #F0E0FF 100%)',
      '--vk-section-spacing': '5rem',
    },
  },

  luxury: {
    id: 'luxury',
    name: 'Luxury / Serif',
    emoji: '👑',
    description: 'Gold on dark, refined and opulent',
    preview: {
      bg: '#0A0A0A',
      accent: '#C9A84C',
      text: '#F5F0E8',
    },
    vars: {
      '--vk-bg': '#0A0A0A',
      '--vk-surface': '#141414',
      '--vk-text': '#F5F0E8',
      '--vk-text-muted': '#9A9080',
      '--vk-accent': '#C9A84C',
      '--vk-accent-hover': '#A8893A',
      '--vk-border': '#2A2520',
      '--vk-radius': '4px',
      '--vk-font-display': '"Cormorant Garamond", "Garamond", serif',
      '--vk-font-body': '"Libre Baskerville", Georgia, serif',
      '--vk-shadow': '0 8px 40px rgba(0,0,0,0.6)',
      '--vk-btn-style': 'outline-gold',
      '--vk-btn-radius': '0px',
      '--vk-hero-gradient': 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.1) 0%, transparent 70%)',
      '--vk-section-spacing': '6rem',
    },
  },

  retro: {
    id: 'retro',
    name: 'Retro / Pixel',
    emoji: '👾',
    description: 'CRT nostalgia with pixel-perfect charm',
    preview: {
      bg: '#001100',
      accent: '#00FF41',
      text: '#00FF41',
    },
    vars: {
      '--vk-bg': '#001100',
      '--vk-surface': '#002200',
      '--vk-text': '#00FF41',
      '--vk-text-muted': '#007722',
      '--vk-accent': '#00FF41',
      '--vk-accent-hover': '#00CC33',
      '--vk-border': '#004400',
      '--vk-radius': '0px',
      '--vk-font-display': '"Press Start 2P", "Courier New", monospace',
      '--vk-font-body': '"VT323", "Courier New", monospace',
      '--vk-shadow': '0 0 8px rgba(0,255,65,0.5)',
      '--vk-btn-style': 'pixel',
      '--vk-btn-radius': '0px',
      '--vk-hero-gradient': 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.03) 2px, rgba(0,255,65,0.03) 4px)',
      '--vk-section-spacing': '4rem',
    },
  },
};

export const THEME_IDS = Object.keys(THEMES);

// Apply theme vars to a DOM element
export function applyTheme(themeId, element = document.documentElement) {
  const theme = THEMES[themeId];
  if (!theme) return;
  Object.entries(theme.vars).forEach(([prop, val]) => {
    element.style.setProperty(prop, val);
  });
}

// Get CSS string for inline styles
export function getThemeStyle(themeId) {
  const theme = THEMES[themeId];
  if (!theme) return '';
  return Object.entries(theme.vars)
    .map(([prop, val]) => `${prop}: ${val}`)
    .join('; ');
}

// Get extra font imports for themes that need them
export const THEME_FONTS = {
  minimal: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap',
  neobrutalist: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@400;500;700&display=swap',
  darkneon: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;700&display=swap',
  pastel: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Nunito:wght@400;600;700&display=swap',
  luxury: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Libre+Baskerville:wght@400;700&display=swap',
  retro: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap',
};
