import { style } from '@vanilla-extract/css';
import { vars } from '../../theme.css';

export const button = style({
  background: 'none',
  border: `1px solid ${vars.color.border}`,
  borderRadius: '4px',
  cursor: 'pointer',
  padding: '0.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.text,
  fontSize: '1.2rem',
  transition: 'background 0.2s',
  ':hover': {
    backgroundColor: vars.color.background,
  },
});
