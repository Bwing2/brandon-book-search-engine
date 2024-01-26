import { gql } from '@apollo/client';

// Querying for fields that return object types, need to specify the subfields of object you want in response.
export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
