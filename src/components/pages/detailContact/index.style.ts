import { css } from '@emotion/react';

const detailContactStyle = {
  top: css({
    margin: '2rem 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  user: {
    header: css({
      textAlign: 'center',
      border: 'solid black 1px',
    }),
  },
  bottom: {
    wrapper: css({
      position: 'absolute',
      left: '0',
      bottom: '0',
      width: '100%',
      padding: '0 1rem',
    }),
    child: css({
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      textAlign: 'center',
      color: 'white',
      margin: '-5px 2rem',
    }),
  },
};

export { detailContactStyle };
