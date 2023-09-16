import { css } from '@emotion/react';
import { Breakpoints, mq } from '../../assets/style/mq';

const listStyle = {
  wrapper: css({
    marginTop: '1rem',
    maxHeight: '17rem',
    overflowY: 'scroll',

    [mq(Breakpoints.md)]: {
      maxHeight: '10rem',
    },

    [mq(Breakpoints.lg)]: {
      maxHeight: '14.5rem',
    },
  }),
  elementList: css({
    display: 'grid',
    gridColumn: '1',
    marginBottom: '0.75rem',
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
    marginTop: '1rem',
  }),
};

export { listStyle };
