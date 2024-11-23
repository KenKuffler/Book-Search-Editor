import { gql, ApolloClient, InMemoryCache } from '@apollo/client';

// Use the environment variable for the GraphQL endpoint
const client = new ApolloClient({
  uri: import.meta.env.VITE_API_BASE_URL + '/graphql', // Use the correct environment variable
  cache: new InMemoryCache(),
});

// Define the query for fetching the logged-in user data
const ME_QUERY = gql`
  query Me {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;

// Fetch user data function
export const getMe = async (token: string) => {
  try {
    const response = await client.query({
      query: ME_QUERY,
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
      fetchPolicy: 'no-cache', // Avoid cached responses to ensure fresh data
    });

    return response.data.me;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error('Failed to fetch user data'); // Throwing a user-friendly error
  }
};



