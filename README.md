# Server for Web Coding Platform

Welcome to the server-side component of our web coding platform. This backend is designed to support the operations of a dynamic coding environment, offering services such as code block management and user interactions through a RESTful API and WebSocket communication.

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository to your local machine.
2. Navigate to the server directory.
3. Install the necessary dependencies using:
   ```sh
   npm install
   ```
4. To run the server locally, ensure MongoDB is installed and running on your system. In `logging.js`, replace the database connection string to use your local MongoDB instance:
   ```javascript
   db: 'mongodb://localhost/webCoding',
   ```
   This step is crucial for local development and testing.
   Add /Lobby to the url. 

### Running the Server

To start the server, run:
```sh
npm start
```
This will initiate the server, making it listen for requests on the predefined port.

## Features

- **Code Block Management**: Facilitates the creation, retrieval, and storage of code blocks.
- **Real-time Communication**: Utilizes WebSocket for real-time interaction between clients.

## Configuration

The server's configuration is managed through files in the config directory:
- `default.json` for default settings.
- `prod.js` for production environment settings.
- `logging.js` for logging configurations, including database connection details.

## API Endpoints

Detailed documentation on API endpoints is provided in `routes.js`, offering insights into the supported operations such as creating, fetching, and updating code blocks.

## Deployment

For production deployment, adjust configurations in `prod.js` as needed. Ensure the MongoDB URI points to your production database instance.

## Contributing

We welcome contributions to enhance the server's functionalities or address issues. Please submit pull requests with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

---

