import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { getMe } from '../utils/API';
import { REMOVE_BOOK } from '../graphql/mutations';
import Auth from '../utils/auth';
import type { User } from '../models/User';

const SavedBooks = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Define the removeBook mutation
  const [removeBook] = useMutation(REMOVE_BOOK);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) {
          throw new Error('User not logged in');
        }

        console.log('Fetching user data...');

        const data = await getMe(token);
        if (!data) {
          throw new Error('No user data returned');
        }

        console.log('Fetched data:', data);
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Failed to fetch saved books.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRemoveBook = async (bookId: string) => {
    try {
      console.log(`Removing book with ID: ${bookId}`);
      const token = Auth.loggedIn() ? Auth.getToken() : null;

      if (!token) {
        throw new Error('User not logged in');
      }

      const { data } = await removeBook({
        variables: { bookId },
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      });

      console.log('Remove book response:', data);

      if (data?.removeBook) {
        // Update local user data to reflect the removed book
        setUserData((prevData) => {
          if (!prevData) return null;
          return {
            ...prevData,
            savedBooks: prevData.savedBooks.filter((book) => book.bookId !== bookId),
          };
        });
      }
    } catch (error) {
      console.error('Error removing book:', error);
      alert('Failed to remove the book.');
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!userData) {
    return <h2>No user data available. Please log in again.</h2>;
  }

  return (
    <Container>
      <h2>{userData.username}'s Saved Books</h2>
      <Row>
        {userData.savedBooks.length > 0 ? (
          userData.savedBooks.map((book) => (
            <Col key={book.bookId} md={4}>
              <Card>
                <Card.Img variant="top" src={book.image || 'placeholder.jpg'} alt="Book cover" />
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <Card.Text>{book.description}</Card.Text>
                  <Button variant="danger" onClick={() => handleRemoveBook(book.bookId)}>
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No saved books found.</p>
        )}
      </Row>
    </Container>
  );
};

export default SavedBooks;





