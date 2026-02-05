# Application Screenshots and Testing

## Application Overview

This full-stack application consists of:
- **Backend**: Node.js/Express API server running on port 3000
- **Frontend**: Modern HTML/CSS/JavaScript single-page application

## Backend API Testing Results

### ✅ 1. Health Check Endpoint
**Endpoint**: `GET /api/health`

Response:
```json
{
  "status": "OK",
  "message": "Server is running!"
}
```

### ✅ 2. Data Retrieval Endpoint
**Endpoint**: `GET /api/data`

Response:
```json
{
  "message": "Hello from the backend!",
  "timestamp": "2026-02-05T17:15:30.187Z",
  "data": [
    {
      "id": 1,
      "name": "Item 1",
      "value": 100
    },
    {
      "id": 2,
      "name": "Item 2",
      "value": 200
    },
    {
      "id": 3,
      "name": "Item 3",
      "value": 300
    }
  ]
}
```

### ✅ 3. Echo/POST Endpoint
**Endpoint**: `POST /api/echo`

Request:
```json
{
  "message": "Test message",
  "user": "TestUser"
}
```

Response:
```json
{
  "message": "Echo received!",
  "receivedData": {
    "message": "Test message",
    "user": "TestUser"
  }
}
```

## Frontend Features

The frontend provides an interactive interface with:

1. **Server Status Check**: Button to verify backend health
2. **Data Fetching**: Retrieve and display sample data from the API
3. **Message Sending**: Interactive form to send messages to the backend

### UI Components
- Modern gradient background (purple theme)
- Responsive card-based layout
- Interactive buttons with hover effects
- Real-time API response display
- Clean, professional styling

## File Structure Verification

✅ HTML served correctly at `/`
✅ CSS styles accessible at `/styles.css`
✅ JavaScript application at `/app.js`

## How to Test Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open your browser to: `http://localhost:3000`

4. Test the features:
   - Click "Check Server Health" to verify backend connection
   - Click "Get Data from API" to fetch sample data
   - Type a message and click "Send to Backend" to test POST functionality

All tests completed successfully! ✅
