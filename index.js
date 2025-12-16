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

// In case of internet connection issues
const back_up = [
  { id: "a3f9c1e84b2d7f10", title: "The Hobbit", author: "J.R.R. Tolkien", publishedYear: 1937 },
  { id: "1f4e9a7c2b8d0e6a", title: "The Fellowship of the Ring", author: "J.R.R. Tolkien", publishedYear: 1954 },
  { id: "9b0e2d7a4c1f8e6d", title: "The Two Towers", author: "J.R.R. Tolkien", publishedYear: 1954 },
  { id: "e7a1c4d9f0b2683e", title: "The Return of the King", author: "J.R.R. Tolkien", publishedYear: 1955 },
  { id: "4c9f7a2e1b8d6a0f", title: "The Silmarillion", author: "J.R.R. Tolkien", publishedYear: 1977 },
  { id: "d8b2a7e4c1f0693a", title: "Unfinished Tales", author: "J.R.R. Tolkien", publishedYear: 1980 },
  { id: "0a9c7f1e4b6d82e3", title: "The Children of Húrin", author: "J.R.R. Tolkien", publishedYear: 2007 },
  { id: "f1d3c8b0e7a6249e", title: "Beren and Lúthien", author: "J.R.R. Tolkien", publishedYear: 2017 },
  { id: "6b8e1c9a4f20d7e3", title: "The Fall of Gondolin", author: "J.R.R. Tolkien", publishedYear: 2018 },
  { id: "c0f8e6b1a7d2934e", title: "The History of Middle-earth I", author: "J.R.R. Tolkien", publishedYear: 1983 },
  { id: "2d9e7f4b6c1a0e38", title: "The History of Middle-earth II", author: "J.R.R. Tolkien", publishedYear: 1984 },
  { id: "8a6c4b9d1e2f7e03", title: "The History of Middle-earth III", author: "J.R.R. Tolkien", publishedYear: 1985 },
  { id: "7e1b9a8f2c4d603e", title: "The History of Middle-earth IV", author: "J.R.R. Tolkien", publishedYear: 1986 },
  { id: "b6f0a1e4c9d7823e", title: "The History of Middle-earth V", author: "J.R.R. Tolkien", publishedYear: 1987 },
  { id: "1c8b7a9f4d0e623e", title: "The History of Middle-earth VI", author: "J.R.R. Tolkien", publishedYear: 1988 },
  { id: "e2c6b1d9a4f7083e", title: "The History of Middle-earth VII", author: "J.R.R. Tolkien", publishedYear: 1989 },
  { id: "4a7e6c8f1b0d923e", title: "The History of Middle-earth VIII", author: "J.R.R. Tolkien", publishedYear: 1990 },
  { id: "9f2a6b1e7c4d803e", title: "The History of Middle-earth IX", author: "J.R.R. Tolkien", publishedYear: 1992 },
  { id: "0e4b9c7a1f2d683e", title: "The History of Middle-earth X", author: "J.R.R. Tolkien", publishedYear: 1993 },
  { id: "c9b7d1e2a8f4063e", title: "The History of Middle-earth XI", author: "J.R.R. Tolkien", publishedYear: 1994 },
  { id: "6d1c8a7b9e2f403e", title: "The History of Middle-earth XII", author: "J.R.R. Tolkien", publishedYear: 1996 },
  { id: "a8f1c6e9d7b2403e", title: "The Adventures of Tom Bombadil", author: "J.R.R. Tolkien", publishedYear: 1962 },
  { id: "7b0e4f1c9d8a263e", title: "Smith of Wootton Major", author: "J.R.R. Tolkien", publishedYear: 1967 },
  { id: "f9a6b1c0e7d8243e", title: "Leaf by Niggle", author: "J.R.R. Tolkien", publishedYear: 1945 },
  { id: "3e8d6b1f0a9c724e", title: "The Letters of J.R.R. Tolkien", author: "J.R.R. Tolkien", publishedYear: 1981 },
];


// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Fetch initial data from Open Library API and seed `books`
async function seedData() {
  console.log('Fetching initial data from Open Library...');
  try {
    const res = await fetch('https://openlibrary.org/search.json?author=tolkien&limit=25');
    const data = await res.json();

    // Map to our book structure
    if(data.docs.length != 0) {
      books = data.docs.map(doc => ({
        id: generateId(),
        title: doc.title,
        author: doc.author_name ? doc.author_name[0] : "Unknown",
        publishedYear: doc.first_publish_year || null,
      }));
    } else {
      books = back_up;

    }

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
