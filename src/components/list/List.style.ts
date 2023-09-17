import { css } from '@emotion/react';
import { Breakpoints, mq } from '../../assets/style/mq';
import { theme } from '../../assets/style/theme';

const listStyle = {
  wrapper: css({
    marginTop: '1rem',
    height: '20rem',
    overflowY: 'scroll',
    scrollbarColor: `${theme.colors.grayLight}`,

    [mq(Breakpoints.lg)]: {
      height: '14.5rem',
    },
  }),
  elementList: css({
    display: 'grid',
    gridColumn: '1',
    listStyle: 'none',
  }),
  topSection: css({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginTop: '2rem',
  }),
  content: css({
    display: 'grid',
    gridTemplateRows: '2',
    textAlign: 'left',
  }),
  pagination: css({
    textAlign: 'center',
    bottom: '0',
    margin: '1rem auto',
  }),
};

export { listStyle };
