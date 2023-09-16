import { css } from '@emotion/react';
import { Breakpoints, mq } from '../../../assets/style/mq';

const formContactStyle = {
  parent: css({
    width: '15rem',

    [mq(Breakpoints.sm)]: {
      width: '17rem',
    },
  }),
  user: {
    header: css({
      textAlign: 'center',
      border: 'solid black 1px',
    }),
    form: css({
      display: 'grid',
      gridColumn: '1',
      margin: '1rem auto',
    }),
  },
};

export { formContactStyle };
