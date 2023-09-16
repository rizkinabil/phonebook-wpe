import { Container, H5 } from 'cherry-components';
import { theme } from '../../../assets/style/theme';
import Button from '../../elements/button/Button';
import { detailContactStyle } from './index.style';
// import { UserLogo } from '../../../assets/icons/UserLogo';
import { UserCircleIcon, ArrowSmallLeftIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

// graphql lib
// import { gql, useQuery } from '@apollo/client';

// check error on apollo, its so bad btw :(

// import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

// if (process.env.NODE_ENV !== "production") {
// 	loadErrorMessages();
// 	loadDevMessages();
// }

// const GET_CONTACT_DETAIL = gql`
//   query GetContactDetail($id: Int!) {
//     contact_by_pk(id: $id) {
//       last_name
//       id
//       first_name
//       created_at
//       phones {
//         number
//       }
//     }
//   }
// `;

const DetailContact = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <div css={detailContactStyle.top}>
        <ArrowSmallLeftIcon
          css={{ width: '1.5rem', height: '1.5rem' }}
          onClick={() => {
            navigate(-1);
          }}
        />
        <Button width="4.6875rem" height="20px" border="none" color={theme.colors.warning} radius="25px">
          <H5>Edit</H5>
        </Button>
      </div>
      <div css={detailContactStyle.user.header}>
        <div>
          <UserCircleIcon css={{ width: '7.25rem', height: '7.25rem' }} />
          <h1>Nama User</h1>
        </div>
      </div>

      <div>
        <ul>
          <li>
            <h3>Primary number</h3>
          </li>
          <li>
            <h3>Additional number</h3>
          </li>
        </ul>
      </div>
    </Container>
  );
};

export default DetailContact;
