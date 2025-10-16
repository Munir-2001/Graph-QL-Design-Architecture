# GraphQL Docker Lab

Welcome to the GraphQL Docker Lab! This comprehensive lab will guide you through setting up a GraphQL server inside a Docker container, understanding GraphQL query and mutation syntax, and completing hands-on exercises to interact with the API using Postman.

## Table of Contents
1. [Pre-requisites](#1-prerequisites)
2. [GraphQL Syntax Overview](#2-graphql-syntax-overview)
3. [Environment Setup](#3-environment-setup)
4. [Lab Activities](#4-lab-activities)

---

## 1. Prerequisites

Before starting the lab, ensure you have the following installed on your system:

### Required Software

#### Git
- **Purpose**: To clone the repository and version control
- **Download**: [Git for Windows](https://git-scm.com/download/win) | [Git for Mac](https://git-scm.com/download/mac) | [Git for Linux](https://git-scm.com/download/linux)
- **Verification**: Open terminal/command prompt and run `git --version`

#### Docker Desktop
- **Purpose**: To build and run the GraphQL server in a containerized environment
- **Download**: [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Verification**: Run `docker --version` and `docker-compose --version`
- **Note**: Ensure Docker Desktop is running before proceeding

#### Postman
- **Purpose**: To test GraphQL API endpoints and send HTTP requests
- **Download**: [Postman](https://www.postman.com/downloads/)
- **Alternative**: You can also use curl, Insomnia, or any REST client

### Optional Software

#### Node.js (v16 or higher)
- **Purpose**: If you want to run the server locally without Docker
- **Download**: [Node.js](https://nodejs.org/)
- **Verification**: Run `node --version` and `npm --version`

#### Visual Studio Code (Recommended)
- **Purpose**: For code editing and better development experience
- **Download**: [VS Code](https://code.visualstudio.com/)

### System Requirements
- **Operating System**: Windows 10/11, macOS 10.14+, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: At least 2GB free space
- **Internet Connection**: Required for initial setup and data seeding

---

## 2. GraphQL Syntax Overview

GraphQL is a query language for APIs that provides a single endpoint for all data operations. Unlike REST APIs, GraphQL allows clients to request exactly the data they need.

### Core Concepts

#### Schema Definition
GraphQL uses a type system to define the structure of your data:

```graphql
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
```

### Query Operations (GET equivalent)

#### Fetch All Books
```graphql
query {
  books {
    id
    title
    author
    publishedYear
  }
}
```

#### Fetch Single Book by ID
```graphql
query {
  book(id: "BOOK_ID") {
    id
    title
    author
    publishedYear
  }
}
```

#### Query with Variables
```graphql
query GetBook($bookId: ID!) {
  book(id: $bookId) {
    id
    title
    author
    publishedYear
  }
}
```

### Mutation Operations (POST, PUT, DELETE equivalent)

#### Create a New Book (POST equivalent)
```graphql
mutation {
  addBook(title: "The Great Gatsby", author: "F. Scott Fitzgerald", publishedYear: 1925) {
    id
    title
    author
    publishedYear
  }
}
```

#### Update an Existing Book (PUT equivalent)
```graphql
mutation {
  updateBook(id: "BOOK_ID", title: "Updated Title", author: "Updated Author") {
    id
    title
    author
    publishedYear
  }
}
```

#### Delete a Book (DELETE equivalent)
```graphql
mutation {
  deleteBook(id: "BOOK_ID")
}
```

#### Mutation with Variables
```graphql
mutation AddBook($title: String!, $author: String!, $year: Int) {
  addBook(title: $title, author: $author, publishedYear: $year) {
    id
    title
    author
    publishedYear
  }
}
```

### GraphQL vs REST Comparison

| Operation | REST | GraphQL |
|-----------|------|---------|
| GET | `GET /books` | `query { books }` |
| GET by ID | `GET /books/123` | `query { book(id: "123") }` |
| POST | `POST /books` | `mutation { addBook(...) }` |
| PUT | `PUT /books/123` | `mutation { updateBook(id: "123", ...) }` |
| DELETE | `DELETE /books/123` | `mutation { deleteBook(id: "123") }` |

---

## 3. Environment Setup

Follow these steps to set up your GraphQL development environment:

### Step 1: Clone the Repository
```bash
git clone <your-repo-url>
cd graphql-docker-lab
```

### Step 2: Verify Docker Installation
```bash
docker --version
docker-compose --version
```

### Step 3: Build the Docker Image
```bash
docker build -t graphql-docker-lab .
```

**Expected Output:**
```
[+] Building 15.2s (8/8) FINISHED
 => [internal] load build definition from Dockerfile
 => => transferring dockerfile: 32B
 => [internal] load .dockerignore
 => => transferring .dockerignore: 2B
 => [internal] load metadata for docker.io/library/node:18-alpine
 => [1/4] FROM docker.io/library/node:18-alpine
 => [internal] load build context
 => => transferring context: 2.00kB
 => [2/4] WORKDIR /app
 => [3/4] COPY package*.json ./
 => [4/4] RUN npm install
 => exporting to image
 => => exporting layers
 => => exporting manifest sha256:...
 => => writing image sha256:...
 => => naming to docker.io/library/graphql-docker-lab:latest
```

### Step 4: Run the Docker Container
```bash
docker run -p 4000:4000 graphql-docker-lab
```

**Expected Output:**
```
Fetching initial data from Open Library...
Seeded 25 books.
Your Server ready at http://localhost:4000/
```

### Step 5: Verify the Setup
Open your browser and navigate to: `http://localhost:4000/`

You should see the Apollo Server landing page with GraphQL Playground.

### Alternative: Local Development (without Docker)
If you prefer to run locally:

```bash
npm install
npm start
```

### Troubleshooting

#### Common Issues:

1. **Port 4000 already in use**
   ```bash
   # Find process using port 4000
   netstat -ano | findstr :4000  # Windows
   lsof -i :4000                 # Mac/Linux
   
   # Use different port
   docker run -p 4001:4000 graphql-docker-lab
   ```

2. **Docker not running**
   - Start Docker Desktop
   - Wait for it to fully initialize

3. **Permission issues (Linux/Mac)**
   ```bash
   sudo docker build -t graphql-docker-lab .
   sudo docker run -p 4000:4000 graphql-docker-lab
   ```

---

## 4. Lab Activities

Complete these 8 activities to master GraphQL operations. Each activity builds upon the previous ones.

### Setup for Activities

1. **Open Postman**
2. **Set up a new request:**
   - Method: `POST`
   - URL: `http://localhost:4000/`
   - Headers: `Content-Type: application/json`
   - Body: Select `raw` and `JSON`

3. **Request Format:**
   ```json
   {
     "query": "YOUR_GRAPHQL_QUERY_HERE"
   }
   ```

---

### Activity 1: Fetch All Books (GET all)

**Objective**: Retrieve all books from the GraphQL server

**GraphQL Query:**
```graphql
query {
  books {
    id
    title
    author
    publishedYear
  }
}
```

**Postman JSON Body:**
```json
{
  "query": "query { books { id title author publishedYear } }"
}
```

**Expected Result:** An array of 25 books (initially seeded from Open Library)

**Learning Points:**
- Basic query syntax
- Field selection
- Array responses

---

### Activity 2: Fetch a Book by ID (GET by ID)

**Objective**: Retrieve a specific book using its unique identifier

**Prerequisites**: Complete Activity 1 to get a valid book ID

**GraphQL Query:**
```graphql
query {
  book(id: "BOOK_ID") {
    id
    title
    author
    publishedYear
  }
}
```

**Postman JSON Body (replace BOOK_ID with actual ID):**
```json
{
  "query": "query { book(id: \"abc123def\") { id title author publishedYear } }"
}
```

**Expected Result:** A single book object or null if ID doesn't exist

**Learning Points:**
- Query with arguments
- Single object responses
- Error handling for invalid IDs

---

### Activity 3: Add a New Book (POST/Create)

**Objective**: Create a new book in the system

**GraphQL Mutation:**
```graphql
mutation {
  addBook(title: "The Art of Programming", author: "John Developer", publishedYear: 2024) {
    id
    title
    author
    publishedYear
  }
}
```

**Postman JSON Body:**
```json
{
  "query": "mutation { addBook(title: \"The Art of Programming\", author: \"John Developer\", publishedYear: 2024) { id title author publishedYear } }"
}
```

**Expected Result:** The newly created book with generated ID

**Learning Points:**
- Mutation syntax
- Creating new resources
- Return value specification

---

### Activity 4: Update an Existing Book (PUT/Update)

**Objective**: Modify an existing book's information

**Prerequisites**: Complete Activity 3 or use an existing book ID

**GraphQL Mutation:**
```graphql
mutation {
  updateBook(id: "BOOK_ID", title: "Updated Programming Guide", author: "Jane Expert") {
    id
    title
    author
    publishedYear
  }
}
```

**Postman JSON Body (replace BOOK_ID):**
```json
{
  "query": "mutation { updateBook(id: \"abc123def\", title: \"Updated Programming Guide\", author: \"Jane Expert\") { id title author publishedYear } }"
}
```

**Expected Result:** The updated book object

**Learning Points:**
- Partial updates
- Mutation with multiple parameters
- Updating existing resources

---

### Activity 5: Delete a Book (DELETE)

**Objective**: Remove a book from the system

**Prerequisites**: Use a valid book ID from previous activities

**GraphQL Mutation:**
```graphql
mutation {
  deleteBook(id: "BOOK_ID")
}
```

**Postman JSON Body (replace BOOK_ID):**
```json
{
  "query": "mutation { deleteBook(id: \"abc123def\") }"
}
```

**Expected Result:** Success message: "Book with id abc123def deleted."

**Learning Points:**
- Delete operations
- String return types
- Resource removal

---

### Activity 6: Fetch Books Published in a Specific Year (Filtered GET)

**Objective**: Find books published in a particular year (e.g., 1935)

**Note**: Since the current server doesn't support filtering via GraphQL arguments, we'll fetch all books and filter client-side.

**GraphQL Query:**
```graphql
query {
  books {
    id
    title
    author
    publishedYear
  }
}
```

**Postman JSON Body:**
```json
{
  "query": "query { books { id title author publishedYear } }"
}
```

**Manual Filtering Steps:**
1. Execute the query
2. Look through the response for books where `publishedYear` equals your target year
3. Count how many books were published in that year

**Expected Result:** List of books published in the specified year

**Learning Points:**
- Client-side filtering
- Understanding server limitations
- Data analysis

---

### Activity 7: Fetch Books by a Particular Author (Author-specific GET)

**Objective**: Find all books written by a specific author

**GraphQL Query:**
```graphql
query {
  books {
    id
    title
    author
    publishedYear
  }
}
```

**Postman JSON Body:**
```json
{
  "query": "query { books { id title author publishedYear } }"
}
```

**Manual Filtering Steps:**
1. Execute the query
2. Filter results for books where `author` field matches your target author
3. List all books by that author

**Expected Result:** Array of books by the specified author

**Learning Points:**
- Client-side data filtering
- Author-based queries
- Data organization

---

### Activity 8: Handle Error Cases (Invalid Operations)

**Objective**: Test error handling by attempting to update a non-existent book

**GraphQL Mutation:**
```graphql
mutation {
  updateBook(id: "INVALID_ID", title: "This Book Doesn't Exist") {
    id
    title
    author
    publishedYear
  }
}
```

**Postman JSON Body:**
```json
{
  "query": "mutation { updateBook(id: \"INVALID_ID\", title: \"This Book Doesn't Exist\") { id title author publishedYear } }"
}
```

**Expected Result:** 
```json
{
  "data": {
    "updateBook": null
  }
}
```

**Learning Points:**
- Error handling in GraphQL
- Null responses
- Graceful failure handling

---

## Lab Completion Checklist

- [ ] Activity 1: Successfully fetched all books
- [ ] Activity 2: Retrieved a book by ID
- [ ] Activity 3: Created a new book
- [ ] Activity 4: Updated an existing book
- [ ] Activity 5: Deleted a book
- [ ] Activity 6: Filtered books by publication year
- [ ] Activity 7: Found books by specific author
- [ ] Activity 8: Handled invalid operations

---

## Additional Challenges

### Challenge 1: Bulk Operations
Try to add multiple books in a single mutation (hint: you may need to modify the schema)

### Challenge 2: Advanced Filtering
Modify the server to support filtering by year and author in the GraphQL schema

### Challenge 3: Error Handling
Implement proper error handling for edge cases

---

## Notes & Tips

### Important Reminders:
- Always set `Content-Type: application/json` header in Postman
- Book IDs are randomly generated - save them from queries before using in mutations
- Data is stored in-memory; restarting the container resets to initial state
- GraphQL is case-sensitive
- Use double quotes for string values in JSON

### Best Practices:
- Always specify the fields you need in your queries (avoid over-fetching)
- Use meaningful variable names in your mutations
- Test error scenarios to understand system behavior
- Document your queries for future reference

---

## Helpful Resources

### Documentation:
- [GraphQL Official Documentation](https://graphql.org/learn/)
- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
- [Postman GraphQL Guide](https://learning.postman.com/docs/sending-requests/graphql/graphql-overview/)

### Tools:
- [GraphQL Playground](https://www.graphqlplayground.com/) - Interactive GraphQL IDE
- [GraphiQL](https://github.com/graphql/graphiql) - Browser-based GraphQL IDE
- [Apollo Studio](https://www.apollographql.com/studio/) - GraphQL development platform

### Learning Materials:
- [GraphQL Tutorial by GraphQL.org](https://graphql.org/learn/)
- [Apollo GraphQL Tutorial](https://www.apollographql.com/tutorials/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)

---

## Troubleshooting Guide

### Common Issues and Solutions:

#### 1. "Cannot connect to server"
- Ensure Docker container is running
- Check if port 4000 is available
- Verify the URL is correct: `http://localhost:4000/`

#### 2. "GraphQL syntax errors"
- Check for proper quotes (use double quotes in JSON)
- Ensure proper nesting of objects
- Validate GraphQL syntax

#### 3. "No data returned"
- Verify the server is seeded with initial data
- Check if the query syntax is correct
- Ensure you're using the right field names

#### 4. "Docker build fails"
- Check Docker Desktop is running
- Ensure all files are in the correct directory
- Try building with `--no-cache` flag: `docker build --no-cache -t graphql-docker-lab .`

---

**Congratulations on completing the GraphQL Docker Lab!** 🎉

You should now have a solid understanding of:
- GraphQL syntax and operations
- Docker containerization
- API testing with Postman
- CRUD operations in GraphQL
- Error handling and edge cases