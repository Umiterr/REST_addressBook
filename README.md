# Address Book API

## Project Description

The Address Book API is a backend application developed in TypeScript and Node.js, providing a RESTful interface for managing a contact address book. It also offers JWT authentication for user security.

### Key Features

- **Contact Management:**
  - Endpoint to fetch a list of contacts.
  - Endpoint to retrieve contact details by ID.
  - Endpoint to delete a contact by ID.

- **Book Management:**
  - Endpoint to fetch a list of books from a JSON file.
  - Endpoint to retrieve book details by ID.
  - Endpoint to search books by price and by author's name phrase.
  - Endpoint to calculate the average cost of books.

- **JWT Authentication:**
  - Endpoint to generate a JWT token valid for 1 hour based on provided credentials.

### Technologies Used

- **Programming Language:** TypeScript
- **Runtime Environment:** Node.js
- **Framework:** Express
- **Librerías y Herramientas:**
  - JWT for secure authentication.
  - Docker for containerizing the application.
  - Prettier and typescript-eslint for code formatting and linting.
