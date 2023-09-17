import { gql } from '@apollo/client';

export const GET_CONTACT_QUERY = gql`
  query GetContactList($order_by: [contact_order_by!]) {
    contact(order_by: $order_by) {
      created_at
      first_name
      id
      last_name
      phones {
        number
      }
    }
  }
`;

export const READ_CONTACT_ = gql`
  query GetContactList {
    contact {
      created_at
      first_name
      id
      last_name
      phones {
        number
      }
    }
  }
`;

export const GET_CONTACT_DETAIL = gql`
  query GetContactDetail($id: Int!) {
    contact_by_pk(id: $id) {
      last_name
      id
      first_name
      created_at
      phones {
        number
      }
    }
  }
`;
