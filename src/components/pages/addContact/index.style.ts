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
    }),
    form: css({
      display: 'grid',
      gridColumn: '1',
    }),
  },
};

export { formContactStyle };
