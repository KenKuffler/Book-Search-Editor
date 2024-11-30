# Book Search Editor

Welcome to the **Book Search Editor**, a full-stack web application that allows users to search for books, save favorites, and manage their saved books. This README provides a comprehensive guide on how to use the application and highlights key features.

---

## Features

- **User Registration and Login**  
  Users can register for an account or log in to manage their book collection.

- **Search for Books**  
  Search for books by title, author, or keyword using the Google Books API.

- **Save Favorite Books**  
  Save books to your personal collection for easy access later.

- **Manage Saved Books**  
  View your saved books, and remove any that are no longer needed.

---

## Functional Login Information

For a seamless experience, you can use the following pre-existing credentials to explore the site:

- **Email**: johndoe@mail.com  
- **Password**: password123  

Feel free to log in with these credentials to test the site's features.

---

## How to Use

### Step 1: Access the Application
Visit the deployed site at:  
**Client URL**: https://book-search-editor-1.onrender.com  

---

### Step 2: Create an Account (Optional)
1. Click on the "Sign Up" button in the navigation bar.  
2. Enter your desired username, email, and password.  
3. Submit the form to create your account.  

---

### Step 3: Log In
1. Click on the "Log In" button in the navigation bar.  
2. Enter your email and password.  
3. Submit the form to log in. Use the functional login credentials provided above if you'd like to explore the app without registering.

---

### Step 4: Search for Books
1. On the home page, use the search bar to look for books by title, author, or keyword.  
2. Browse the search results to find books of interest.  

---

### Step 5: Save Books
1. Click the "Save" button on any book in the search results to add it to your collection.  
2. Saved books will be stored in your user profile.  

---

### Step 6: View Saved Books
1. Navigate to the "Saved Books" page via the navigation bar.  
2. View all the books you have saved in your profile.  

---

### Step 7: Remove Books
1. On the "Saved Books" page, click the "Remove" button next to any book you wish to delete from your collection.  
2. Confirm the removal as the book is deleted from your profile.  

---

## Technical Information

### Frontend
- React with React Router  
- Apollo Client for GraphQL queries and mutations  

### Backend
- Node.js with Express  
- MongoDB Atlas for database storage  
- GraphQL with Apollo Server  

### Hosting
- Deployed using Render  
  - **Frontend**: Render Static Site  
  - **Backend**: Render Web Service  

---

## Known Issues

- **Mixed Content Warning**: Images from some book covers are served over HTTP, which can generate a warning when viewed on HTTPS. This does not affect functionality and is automatically upgraded by the browser.

---

## Feedback

If you encounter any issues or have suggestions for improvement, feel free to reach out. Enjoy exploring the **Book Search Editor**! 🌟
