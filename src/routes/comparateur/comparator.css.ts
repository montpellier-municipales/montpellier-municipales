import { style } from '@vanilla-extract/css';
import { vars } from '~/theme.css';

export const container = style({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '2rem',
  fontFamily: vars.font.body,
});

export const title = style({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: vars.color.text,
  textAlign: 'center',
  marginBottom: '2rem',
});

export const selectorContainer = style({
  marginBottom: '3rem',
  padding: '1.5rem',
  backgroundColor: vars.color.surface,
  borderRadius: '8px',
  boxShadow: vars.shadow.sm,
});

export const selectorLabel = style({
  display: 'block',
  fontSize: '1.1rem',
  fontWeight: 500,
  marginBottom: '0.8rem',
  color: vars.color.text,
});

export const select = style({
  width: '100%',
  padding: '0.75rem',
  border: `1px solid ${vars.color.border}`,
  borderRadius: '4px',
  backgroundColor: vars.color.background,
  color: vars.color.text,
  fontSize: '1rem',
  ':focus': {
    borderColor: vars.color.primary,
    outline: 'none',
  },
});

export const comparatorGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr repeat(auto-fit, minmax(250px, 1fr))', // Colonne thème + colonnes listes
  gap: '1rem',
  marginTop: '2rem',
});

export const themeColumn = style({
  position: 'sticky',
  top: 'calc(var(--header-height) + 1rem)', // Ajuster si header est sticky
  alignSelf: 'start',
  padding: '1rem',
  backgroundColor: vars.color.surface,
  borderRadius: '8px',
  boxShadow: vars.shadow.sm,
  zIndex: 10,
  fontSize: '1.1rem',
  fontWeight: 600,
  color: vars.color.primary,
});

export const listColumnHeader = style({
  padding: '1rem',
  backgroundColor: vars.color.primary,
  color: vars.color.primaryText,
  borderRadius: '8px',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '1.2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

export const listLogo = style({
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  objectFit: 'contain',
  marginBottom: '0.5rem',
  backgroundColor: 'white',
});

export const programItem = style({
  padding: '1rem',
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: '4px',
  minHeight: '100px', // Pour aligner les boîtes
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  color: vars.color.text,
});
