import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import db from './config/connection.js';
import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers.js';
import dotenv from 'dotenv';
import { verifyToken } from './services/auth.js';
import cors from 'cors';
import { ApolloServerPluginLandingPageGraphQLPlayground } from '@apollo/server-plugin-landing-page-graphql-playground';


dotenv.config();
console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? ['https://book-search-editor-1.onrender.com']
    : ['http://localhost:3000', 'https://book-search-editor-1.onrender.com'];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Access-Control-Allow-Origin'],
  })
);



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
console.log('🔧 Starting Apollo Server setup...');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // Allows introspection queries in production
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(), // Enables GraphQL Playground
  ],
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
        console.log('Authorization Header:', authHeader);
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

