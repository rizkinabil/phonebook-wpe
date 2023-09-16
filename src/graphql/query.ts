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
