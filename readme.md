# Identity Reconciliation Service

## Overview
This Identity Reconciliation Service is designed to manage and reconcile contact information for users, ensuring accurate linkage between primary and secondary contacts based on shared identifiers like email and phone number. The service handles creating new primary and secondary contacts, updating existing contacts, and transitioning primary contacts to secondary when necessary.

## Features
- **Create New Primary Contacts**: Automatically creates a new primary contact when no existing contact matches the provided identifiers.
- **Update Existing Contacts**: Updates contact details when partial matches are found with existing primary contacts.
- **Automatic Secondary Creation**: Creates secondary contacts when identifiers match an existing primary but are not already listed as secondaries.
- **Primary to Secondary Transition**: Transitions a primary contact to a secondary role when new information supersedes the existing primary.

## Technologies Used
- **Node.js**: Runtime environment for running the JavaScript server.
- **Sequelize**: ORM used for database operations, ensuring smooth interactions with the MySQL database.
- **Express**: Framework for handling HTTP requests and structuring the web service.

## Setup and Installation
1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/identity-reconciliation-service.git
```
2. **Navigate to the project directory**
```bash
cd identity-reconciliation-service
```
3. **Install Dependencies**
```bash
npm install
```
4. **Set Up Environment Variables**
Create a `.env` file in the root directory and update it with your database credentials and other configurations.
```bash
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
```
5. **Run the Application**
```bash
npm start
```


## API Endpoints
### POST /identify
- **Description**: Receives contact identifiers and processes them to link to existing contacts or create new contacts as necessary.
- **Request Body**:
```json
{
 "email": "example@example.com",
 "phoneNumber": "1234567890"
}
```
- **Request Body**:
```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["example@example.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": [2]
  }
}
```

## Deployment and API Usage
### Deployed Service
The Identity Reconciliation Service is deployed and accessible at the following URL: https://bitespeed-assignment-f8i0.onrender.com

- **API Endpoint**: POST /identify
This endpoint is designed to manage and reconcile contact information, ensuring accurate linkage between primary and secondary contacts based on shared identifiers.

### **Usage Example**:

-1. **Using Postman or similar tools**:
To use this endpoint, send a POST request with the contact details you wish to process:

URL: https://bitespeed-assignment-f8i0.onrender.com/identify
Method: POST
Content-Type: application/json
Request Body:
```json
{
  "email": "example@example.com",
  "phoneNumber": "1234567890"
}
```
-**Expected Response**:
The service will return a JSON object detailing the identified or created contact linkage:

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["example@example.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": [2]
  }
}
```
-2. **Using CURL**: To test the endpoint with a client like curl, use the following command:

```curl
curl -X POST https://bitespeed-assignment-f8i0.onrender.com/identify \
     -H "Content-Type: application/json" \
     -d '{"email": "example@example.com", "phoneNumber": "1234567890"}'
```
-3. **Using Swagger**: Navigate to https://bitespeed-assignment-f8i0.onrender.com/api-docs/#/Contact%20Identification/identifyContact and test out the production API endpoint

Use this endpoint to ensure accurate management of contact data across various identifiers.

## NOTE IMPORTANT ##
It might take sometime to load the first request as it is deployed on Render and they pause services if unused for sometime. It should load up in about a minute and subsequent requests shall be faster.
