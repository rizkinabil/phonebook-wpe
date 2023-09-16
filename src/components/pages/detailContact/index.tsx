import { Container, H5 } from 'cherry-components';
import { theme } from '../../../assets/style/theme';
import Button from '../../elements/button/Button';
import { detailContactStyle } from './index.style';
import { UserCircleIcon, ArrowSmallLeftIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useNavigate, useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

// graphql lib
import { useQuery } from '@apollo/client';
import { GET_CONTACT_DETAIL } from '../../../graphql/query';

const DetailContact = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { data, loading } = useQuery(GET_CONTACT_DETAIL, {
    variables: {
      id: params.id,
    },
  });

  const userData = data ? data.contact_by_pk : [];

  return (
    <Container css={{ position: 'relative', height: '93vh' }}>
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
        {loading ? (
          <Skeleton count={2} />
        ) : (
          <div>
            <UserCircleIcon css={{ width: '7.25rem', height: '7.25rem' }} />
            <h1>
              {userData.first_name} {userData.last_name}
            </h1>
          </div>
        )}
      </div>

      <div>
        {loading ? (
          <Skeleton count={2} />
        ) : (
          <div>
            {userData.phones.map((item: any, index: number) => {
              return (
                <div key={index} css={{ display: 'flex', flexDirection: 'column' }}>
                  <label htmlFor={`phoneNumber${index}`}>Phone Number {index + 1}</label>
                  <input type="text" id={`phoneNumber${index}`} value={item.number} />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div css={detailContactStyle.bottom.wrapper}>
        <Button border="none" width="100%" height="3rem" color={theme.colors.error} radius="15px">
          <div css={detailContactStyle.bottom.child}>
            <h2>Delete</h2>
            <TrashIcon css={{ height: '2rem', width: '2rem' }} />
          </div>
        </Button>
      </div>
    </Container>
  );
};

export default DetailContact;
