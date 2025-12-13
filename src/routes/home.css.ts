import { style } from '@vanilla-extract/css';

export const container = style({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '2rem',
  fontFamily: 'system-ui, sans-serif',
});

export const hero = style({
  textAlign: 'center',
  marginBottom: '4rem',
});

export const title = style({
  fontSize: '3rem',
  fontWeight: '800',
  marginBottom: '1rem',
  background: 'linear-gradient(45deg, #3498db, #8e44ad)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

export const subtitle = style({
  fontSize: '1.25rem',
  color: '#666',
  maxWidth: '600px',
  margin: '0 auto',
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '2rem',
});

export const card = style({
  border: '1px solid #eee',
  borderRadius: '12px',
  overflow: 'hidden',
  transition: 'transform 0.2s, box-shadow 0.2s',
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'white',
  ':hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  },
});

export const cardImage = style({
  width: '100%',
  height: '200px',
  backgroundColor: '#f0f0f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  objectFit: 'cover',
});

export const cardContent = style({
  padding: '1.5rem',
});

export const cardTitle = style({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '0.5rem',
  color: '#2c3e50',
});

export const cardSubtitle = style({
  fontSize: '1rem',
  color: '#7f8c8d',
  marginBottom: '1rem',
});

export const tag = style({
  display: 'inline-block',
  padding: '0.25rem 0.75rem',
  backgroundColor: '#f8f9fa',
  border: '1px solid #e9ecef',
  borderRadius: '20px',
  fontSize: '0.8rem',
  color: '#6c757d',
  marginRight: '0.5rem',
  marginBottom: '0.5rem',
});
