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
// In-memory data store (pre-populated)
let books = [
  {
    id: "1",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    publishedYear: 1937,
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    publishedYear: 1949,
  },
  {
    id: "3",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    publishedYear: 1960,
  },
  {
    id: "4",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    publishedYear: 1925,
  },
  {
    id: "5",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    publishedYear: 1813,
  },
];

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Fetch initial data from Open Library API and seed `books`
async function seedData() {
  console.log('Fetching initial data from Open Library...');
  try {
    // // const res = await fetch('https://openlibrary.org/search.json?author=tolkien&limit=5');
    // const data = await res.json();

    console.log(`Seeded ${books.length} books.`);
    // Print full seeded books for debugging / verification
    try {
      console.log('Seeded books (JSON):', JSON.stringify(books, null, 2));
      console.table(books);
    } catch (e) {
      console.error('Failed to print seeded books:', e);
    }
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
  //if the port is in use, change it to 4001
  server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`Your Server ready at ${url}`);
  });
}

startServer();
