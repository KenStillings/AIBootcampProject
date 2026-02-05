# AIBootcampProject

A full-stack application with a Node.js/Express backend and a modern JavaScript frontend.

## Features

- **Backend API** (Node.js + Express)
  - Health check endpoint
  - Data retrieval endpoint
  - Echo/POST endpoint for testing
  - CORS enabled for cross-origin requests

- **Frontend** (HTML/CSS/JavaScript)
  - Modern, responsive UI design
  - Interactive API demonstrations
  - Real-time server communication
  - Clean, professional styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/KenStillings/AIBootcampProject.git
cd AIBootcampProject
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

Start the server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### API Endpoints

- `GET /api/health` - Check server status
- `GET /api/data` - Retrieve sample data
- `POST /api/echo` - Echo back the sent data

## Project Structure

```
AIBootcampProject/
├── server.js           # Backend Express server
├── public/             # Frontend files
│   ├── index.html     # Main HTML page
│   ├── styles.css     # Styling
│   └── app.js         # Frontend JavaScript
├── package.json       # Node.js dependencies and scripts
└── README.md          # This file
```

## Technologies Used

- **Backend**: Node.js, Express, CORS
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Package Manager**: npm

## Security Considerations

This is a demonstration application. For production use, consider:
- Adding rate limiting to prevent abuse
- Implementing authentication and authorization
- Using environment variables for configuration
- Adding input validation and sanitization
- Implementing HTTPS

## License

ISC
