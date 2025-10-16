const { ApolloServer, gql } = require('apollo-server');
const fetch = require('node-fetch');

// GraphQL schema
const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
    publishedYear: Int
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book
  }

  type Mutation {
    addBook(title: String!, author: String!, publishedYear: Int): Book
    updateBook(id: ID!, title: String, author: String, publishedYear: Int): Book
    deleteBook(id: ID!): String
  }
`;

// In-memory data store
let books = [];

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Fetch initial data from Open Library API and seed `books`
async function seedData() {
  console.log('Fetching initial data from Open Library...');
  try {
    const res = await fetch('https://openlibrary.org/search.json?author=tolkien&limit=25');
    const data = await res.json();

    // Map to our book structure
    books = data.docs.map(doc => ({
      id: generateId(),
      title: doc.title,
      author: doc.author_name ? doc.author_name[0] : "Unknown",
      publishedYear: doc.first_publish_year || null,
    }));

    console.log(`Seeded ${books.length} books.`);
  } catch (error) {
    console.error('Failed to fetch initial data:', error);
  }
}

// Resolvers for schema
const resolvers = {
  Query: {
    books: () => books,
    book: (_, { id }) => books.find(b => b.id === id),
  },
  Mutation: {
    addBook: (_, { title, author, publishedYear }) => {
      const newBook = { id: generateId(), title, author, publishedYear };
      books.push(newBook);
      return newBook;
    },
    updateBook: (_, { id, title, author, publishedYear }) => {
      const book = books.find(b => b.id === id);
      if (!book) return null;
      if (title !== undefined) book.title = title;
      if (author !== undefined) book.author = author;
      if (publishedYear !== undefined) book.publishedYear = publishedYear;
      return book;
    },
    deleteBook: (_, { id }) => {
      const index = books.findIndex(b => b.id === id);
      if (index === -1) return `Book with id ${id} not found.`;
      books.splice(index, 1);
      return `Book with id ${id} deleted.`;
    },
  },
};

// Initialize server and seed data first
async function startServer() {
  await seedData();

  const server = new ApolloServer({ typeDefs, resolvers });

  server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`Your Server ready at ${url}`);
  });
}

startServer();
