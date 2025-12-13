import { globalStyle } from '@vanilla-extract/css';
import { vars } from './theme.css';

globalStyle('body', {
  margin: 0,
  padding: 0,
  fontFamily: vars.font.body,
  backgroundColor: vars.color.background,
  color: vars.color.text,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
});

globalStyle('main', {
  flex: 1,
});

globalStyle('a', {
  color: vars.color.primary,
  textDecoration: 'none',
});

globalStyle('a:hover', {
  textDecoration: 'underline',
});

globalStyle('h1, h2, h3', {
  lineHeight: "1em",
  fontFamily: vars.font.heading,
  color: vars.color.text,
});
