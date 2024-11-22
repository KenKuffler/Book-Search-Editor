import express from 'express';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import db from './config/connection.js';
import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers.js';
import dotenv from 'dotenv';
import { verifyToken } from './services/auth.js';
import cors from 'cors';

dotenv.config();
console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY);


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from the client

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
console.log('🔧 Starting Apollo Server setup...');

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

console.log('🚀 Apollo Server started successfully.');

app.use(
  '/graphql',
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
          const user = verifyToken(token); // Verify the token
          return { user }; // Attach user data to context
        } catch (err) {
          console.error('Invalid token:', err);
        }
      }
      return {}; // Return an empty object if no valid token
    },
  })
);

console.log('📋 GraphQL middleware added.');

/* app.listen(PORT, () => {
  console.log(`🌍 Server is running at http://localhost:${PORT}`);
}); */


console.log('🔌 Connecting to MongoDB...');
db.once('open', () => {
  console.log('✅ Database connection established.');
});

app.listen(PORT, () => {
  console.log(`🌍 Now listening on http://localhost:${PORT}`);
  console.log(`📋 GraphQL Playground available at http://localhost:${PORT}/graphql`);
});

