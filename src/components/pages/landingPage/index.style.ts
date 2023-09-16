import { css } from '@emotion/react';
import { theme } from '../../../assets/style/theme';

const homePageStyle = {
  hero: css({
    padding: '32px',
    backgroundColor: `${theme.colors.primary}`,
    color: `${theme.colors.light}`,
    minHeight: '15rem',
    fontSize: `${theme.sizes.h1.size.mobile}`,
    borderRadius: '12px',
    boxShadow: `0 4px 8px 0 ${theme.colors.primaryDark}, 0 6px 20px 0 rgba(0, 0, 0, 0.30)`,
  }),
  addButtonBottom: css({
    position: 'fixed',
    float: 'right',
    bottom: '1rem',
    right: '1rem',
    boxShadow: '0 4px 8px 0 ${theme.colors.primaryDark}},',
  }),
};

export { homePageStyle };
