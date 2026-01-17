# EDC Backend API Documentation

## Base URL

```
http://localhost:8080/api
```

## Authentication

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All responses follow this structure:

```json
{
  "success": true/false,
  "message": "Response message",
  "data": { ... }
}
```

<br />
<br />

# 1. Authentication APIs

## 1.1 Login

**POST** `/api/auth/login`

**Access:** Public

**Description:** Login with email and password to get JWT token

**Request Body:**

```json
{
    "email": "admin@club.com",
    "password": "securepassword"
}
```

**Response:**

```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": "507f1f77bcf86cd799439011",
            "email": "admin@club.com",
            "name": "John Doe",
            "role": "ADMIN"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

## 1.2 Get Current User

**GET** `/api/auth/me`

**Access:** Authenticated users

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
    "success": true,
    "data": {
        "id": "507f1f77bcf86cd799439011",
        "email": "admin@club.com",
        "name": "John Doe",
        "role": "ADMIN",
    }
}
```

## 1.3 Logout

**POST** `/api/auth/logout`

**Access:** Authenticated users

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

<br />
<br />

# 2. User Management APIs

**Access:** ADMIN only (except where noted)

## 2.1 Get All Users

**GET** `/api/users`

**Access:** ADMIN, LEADER

**Query Parameters:**

- `role` (optional): Filter by role (ADMIN, LEADER)

**Example:**

```
GET /api/users?role=LEADER
```

**Response:**

```json
{
    "success": true,
    "data": {
        "users": [
            {
                "id": "507f1f77bcf86cd799439012",
                "email": "member@club.com",
                "name": "Jane Smith",
                "role": "LEADER",
                "createdAt": "2024-01-17T10:30:00.000Z"
            }
        ],
        "total": 1
    }
}
```

## 2.2 Get User by ID

**GET** `/api/users/:id`

**Access:** ADMIN, LEADER

**Response:**

```json
{
    "success": true,
    "data": {
        "id": "507f1f77bcf86cd799439012",
        "email": "member@club.com",
        "name": "Jane Smith",
        "role": "LEADER",
        "createdAt": "2024-01-17T10:30:00.000Z",
        "updatedAt": "2024-01-17T10:30:00.000Z"
    }
}
```

## 2.3 Update User

**PUT** `/api/users/:id`

**Request Body:**

```json
{
    "name": "Jane Doe",
    "role": "ADMIN",
}
```

**Response:**

```json
{
    "success": true,
    "message": "User updated successfully",
    "data": {
        "id": "507f1f77bcf86cd799439012",
        "email": "member@club.com",
        "name": "Jane Doe",
        "role": "ADMIN",
        "updatedAt": "2024-01-17T11:00:00.000Z"
    }
}
```

## 2.4 Delete User

**DELETE** `/api/users/:id`

**Response:**

```json
{
    "success": true,
    "message": "User deleted successfully"
}
```

<br />
<br />

# 3. Opening Management APIs

## 3.1 Create Opening

**POST** `/api/openings`

**Access:** ADMIN, LEADER

**Request Body:**

```json
{
    "title": "Full Stack Developer",
    "domain": "Technical",
    "workType": "HYBRID",
    "numberOfSlots": 5,
    "preText": "Join our technical team as a full stack developer",
    "aboutRole": "We are looking for passionate developers who can work on both frontend and backend...",
    "skillsRequired": "React, Node.js, MongoDB, Express",
    "extraInfo": "Prior project experience is a plus"
}
```

**Work Types:** `HYBRID`, `REMOTE`, `ONSITE`

**Response:**

```json
{
    "success": true,
    "message": "Opening created successfully",
    "data": {
        "id": "507f1f77bcf86cd799439013",
        "title": "Full Stack Developer",
        "domain": "Technical",
        "workType": "HYBRID",
        "numberOfSlots": 5,
        "preText": "Join our technical team as a full stack developer",
        "aboutRole": "We are looking for passionate developers...",
        "skillsRequired": "React, Node.js, MongoDB, Express",
        "extraInfo": "Prior project experience is a plus",
        "isActive": true,
        "views": 0,
        "createdById": "507f1f77bcf86cd799439011",
        "createdAt": "2024-01-17T12:00:00.000Z"
    }
}
```

## 3.2 Get All Openings (Public)

**GET** `/api/openings`

**Access:** Public

**Query Parameters:**

- `isActive` (optional): Filter by active status (true, false)
- `domain` (optional): Filter by domain
- `workType` (optional): Filter by work type (HYBRID, REMOTE, ONSITE)

**Example:**

```
GET /api/openings?isActive=true&domain=Technical
```

**Response:**

```json
{
    "success": true,
    "data": {
        "openings": [
            {
                "id": "507f1f77bcf86cd799439013",
                "title": "Full Stack Developer",
                "domain": "Technical",
                "workType": "HYBRID",
                "numberOfSlots": 5,
                "preText": "Join our technical team...",
                "aboutRole": "We are looking for...",
                "skillsRequired": "React, Node.js, MongoDB, Express",
                "extraInfo": "Prior project experience is a plus",
                "isActive": true,
                "views": 45,
                "createdAt": "2024-01-17T12:00:00.000Z"
            }
        ],
        "total": 1
    }
}
```

## 3.3 Get Opening by ID (Public)

**GET** `/api/openings/:id`

**Access:** Public

**Note:** This endpoint automatically increments the view count

**Response:**

```json
{
    "success": true,
    "data": {
        "id": "507f1f77bcf86cd799439013",
        "title": "Full Stack Developer",
        "domain": "Technical",
        "workType": "HYBRID",
        "numberOfSlots": 5,
        "preText": "Join our technical team...",
        "aboutRole": "We are looking for...",
        "skillsRequired": "React, Node.js, MongoDB, Express",
        "extraInfo": "Prior project experience is a plus",
        "isActive": true,
        "views": 46,
        "createdAt": "2024-01-17T12:00:00.000Z",
        "updatedAt": "2024-01-17T12:00:00.000Z"
    }
}
```

## 3.4 Get Opening Details

**GET** `/api/openings/:id/details`

**Access:** ADMIN, LEADER

**Description:** Get detailed information including application count

**Response:**

```json
{
    "success": true,
    "data": {
        "opening": {
            /* opening object */
        },
        "form": {
            /* form object with custom fields */
        },
        "totalApplications": 23,
        "totalViews": 156
    }
}
```

## 3.5 Get Opening Statistics

**GET** `/api/openings/:id/stats`

**Access:** ADMIN, LEADER

**Response:**

```json
{
    "success": true,
    "data": {
        "views": 156,
        "totalApplications": 23,
        "applicationsByBranch": {
            "CS": 10,
            "IT": 8,
            "ENTC": 5
        },
        "applicationsByYear": {
            "FIRST": 2,
            "SECOND": 8,
            "THIRD": 10,
            "FOURTH": 3
        }
    }
}
```

## 3.6 Update Opening

**PUT** `/api/openings/:id`

**Access:** ADMIN, LEADER (only creator or admin)

**Request Body:** (All fields optional)

```json
{
    "title": "Senior Full Stack Developer",
    "domain": "Technical",
    "workType": "REMOTE",
    "numberOfSlots": 3,
    "preText": "Updated description",
    "aboutRole": "Updated role details",
    "skillsRequired": "React, Node.js, TypeScript",
    "extraInfo": "3+ years experience required",
    "isActive": true
}
```

**Response:**

```json
{
    "success": true,
    "message": "Opening updated successfully",
    "data": {
        /* updated opening object */
    }
}
```

## 3.7 Toggle Opening Status

**PATCH** `/api/openings/:id/toggle-status`

**Access:** ADMIN, LEADER (only creator or admin)

**Description:** Toggle between active and inactive

**Response:**

```json
{
    "success": true,
    "message": "Opening status updated",
    "data": {
        "id": "507f1f77bcf86cd799439013",
        "isActive": false
    }
}
```

## 3.8 Delete Opening

**DELETE** `/api/openings/:id`

**Access:** ADMIN, LEADER (only creator or admin)

**Note:** This will also delete associated form, applications, and responses

**Response:**

```json
{
    "success": true,
    "message": "Opening deleted successfully"
}
```

<br />
<br />

# 4. Form Management APIs

## 4.1 Create Form

**POST** `/api/forms`

**Access:** ADMIN, LEADER

**Description:** Create application form for an opening with custom fields

**Request Body:**

```json
{
    "openingId": "507f1f77bcf86cd799439013",
    "hasPriorExp": true,
    "customFields": [
        {
            "fieldTitle": "Why do you want to join?",
            "inputType": "LONG_ANSWER",
            "isRequired": true,
            "order": 1
        },
        {
            "fieldTitle": "Select your preferred domain",
            "inputType": "MULTIPLE_CHOICE",
            "isRequired": true,
            "options": "['Frontend', 'Backend', 'Full Stack']",
            "order": 2
        },
        {
            "fieldTitle": "Upload your resume",
            "inputType": "UPLOAD_DOC",
            "isRequired": false,
            "order": 3
        }
    ]
}
```

**Input Types:**

- `SHORT_ANSWER` - Single line text
- `LONG_ANSWER` - Multi-line text
- `MULTIPLE_CHOICE` - Single selection
- `MULTIPLE_CORRECT` - Multiple selections
- `UPLOAD_DOC` - File upload

**Response:**

```json
{
    "success": true,
    "message": "Form created successfully",
    "data": {
        "id": "507f1f77bcf86cd799439014",
        "openingId": "507f1f77bcf86cd799439013",
        "hasPriorExp": true,
        "createdById": "507f1f77bcf86cd799439011",
        "customFields": [
            {
                "id": "507f1f77bcf86cd799439015",
                "fieldTitle": "Why do you want to join?",
                "inputType": "LONG_ANSWER",
                "isRequired": true,
                "order": 1
            }
        ],
        "createdAt": "2024-01-17T12:30:00.000Z"
    }
}
```

## 4.2 Get Form by Opening ID (Public)

**GET** `/api/forms/opening/:openingId`

**Access:** Public

**Description:** Students use this to view the application form

**Response:**

```json
{
    "success": true,
    "data": {
        "id": "507f1f77bcf86cd799439014",
        "openingId": "507f1f77bcf86cd799439013",
        "hasPriorExp": true,
        "customFields": [
            {
                "id": "507f1f77bcf86cd799439015",
                "fieldTitle": "Why do you want to join?",
                "inputType": "LONG_ANSWER",
                "isRequired": true,
                "options": null,
                "order": 1
            },
            {
                "id": "507f1f77bcf86cd799439016",
                "fieldTitle": "Select your preferred domain",
                "inputType": "MULTIPLE_CHOICE",
                "isRequired": true,
                "options": "['Frontend', 'Backend', 'Full Stack']",
                "order": 2
            }
        ]
    }
}
```

## 4.3 Get Form by ID

**GET** `/api/forms/:id`

**Access:** ADMIN, LEADER

**Response:**

```json
{
    "success": true,
    "data": {
        "id": "507f1f77bcf86cd799439014",
        "openingId": "507f1f77bcf86cd799439013",
        "hasPriorExp": true,
        "customFields": [
            /* array of custom fields */
        ],
        "createdAt": "2024-01-17T12:30:00.000Z",
        "updatedAt": "2024-01-17T12:30:00.000Z"
    }
}
```

## 4.4 Update Form

**PUT** `/api/forms/:id`

**Access:** ADMIN, LEADER (only creator or admin)

**Request Body:**

```json
{
    "hasPriorExp": false
}
```

**Response:**

```json
{
    "success": true,
    "message": "Form updated successfully",
    "data": {
        /* updated form object */
    }
}
```

## 4.5 Delete Form

**DELETE** `/api/forms/:id`

**Access:** ADMIN, LEADER (only creator or admin)

**Note:** This will also delete all custom fields and applications

**Response:**

```json
{
    "success": true,
    "message": "Form deleted successfully"
}
```

<br />
<br />

# 5. Form Field Management APIs

**Access:** ADMIN, LEADER (for all endpoints)

## 5.1 Add Form Field

**POST** `/api/form-fields`

**Request Body:**

```json
{
    "formId": "507f1f77bcf86cd799439014",
    "fieldTitle": "What are your technical skills?",
    "inputType": "SHORT_ANSWER",
    "isRequired": true,
    "order": 4
}
```

**Response:**

```json
{
    "success": true,
    "message": "Form field added successfully",
    "data": {
        "id": "507f1f77bcf86cd799439017",
        "formId": "507f1f77bcf86cd799439014",
        "fieldTitle": "What are your technical skills?",
        "inputType": "SHORT_ANSWER",
        "isRequired": true,
        "options": null,
        "order": 4,
        "createdAt": "2024-01-17T13:00:00.000Z"
    }
}
```

## 5.2 Update Form Field

**PUT** `/api/form-fields/:id`

**Request Body:**

```json
{
    "fieldTitle": "Updated field title",
    "inputType": "LONG_ANSWER",
    "isRequired": false,
    "order": 3
}
```

**Response:**

```json
{
    "success": true,
    "message": "Form field updated successfully",
    "data": {
        /* updated field object */
    }
}
```

## 5.3 Delete Form Field

**DELETE** `/api/form-fields/:id`

**Response:**

```json
{
    "success": true,
    "message": "Form field deleted successfully"
}
```

## 5.4 Reorder Form Fields

**PATCH** `/api/form-fields/reorder`

**Request Body:**

```json
{
    "formId": "507f1f77bcf86cd799439014",
    "fieldOrders": [
        { "fieldId": "507f1f77bcf86cd799439015", "order": 1 },
        { "fieldId": "507f1f77bcf86cd799439016", "order": 2 },
        { "fieldId": "507f1f77bcf86cd799439017", "order": 3 }
    ]
}
```

**Response:**

```json
{
    "success": true,
    "message": "Form fields reordered successfully"
}
```

<br />
<br />

# 6. Application APIs

## 6.1 Submit Application (Public)

**POST** `/api/applications`

**Access:** Public

**Description:** Students submit their application for a position

**Request Body:**

```json
{
    "openingId": "507f1f77bcf86cd799439013",
    "formId": "507f1f77bcf86cd799439014",
    "name": "Rahul Sharma",
    "yearOfStudy": "THIRD",
    "phoneNumber": "+919876543210",
    "email": "rahul.sharma@example.com",
    "branch": "CS",
    "priorExperience": "Worked on 3 MERN stack projects...",
    "fieldResponses": [
        {
            "fieldId": "507f1f77bcf86cd799439015",
            "responseValue": "I am passionate about web development and want to contribute to the club's projects..."
        },
        {
            "fieldId": "507f1f77bcf86cd799439016",
            "responseValue": "Full Stack"
        },
        {
            "fieldId": "507f1f77bcf86cd799439017",
            "responseValue": "",
            "fileUrl": "https://cloudinary.com/resume/rahul-sharma.pdf"
        }
    ]
}
```

**Year of Study:** `FIRST`, `SECOND`, `THIRD`, `FOURTH`

**Response:**

```json
{
    "success": true,
    "message": "Application submitted successfully",
    "data": {
        "id": "507f1f77bcf86cd799439018",
        "openingId": "507f1f77bcf86cd799439013",
        "formId": "507f1f77bcf86cd799439014",
        "name": "Rahul Sharma",
        "yearOfStudy": "THIRD",
        "phoneNumber": "+919876543210",
        "email": "rahul.sharma@example.com",
        "branch": "CS",
        "priorExperience": "Worked on 3 MERN stack projects...",
        "submittedAt": "2024-01-17T14:00:00.000Z"
    }
}
```

## 6.2 Get All Applications

**GET** `/api/applications`

**Access:** ADMIN, LEADER

**Query Parameters:**

- `openingId` (optional): Filter by opening
- `yearOfStudy` (optional): Filter by year (FIRST, SECOND, THIRD, FOURTH)
- `branch` (optional): Filter by branch

**Example:**

```
GET /api/applications?openingId=507f1f77bcf86cd799439013&yearOfStudy=THIRD
```

**Response:**

```json
{
    "success": true,
    "data": {
        "applications": [
            {
                "id": "507f1f77bcf86cd799439018",
                "name": "Rahul Sharma",
                "yearOfStudy": "THIRD",
                "phoneNumber": "+919876543210",
                "email": "rahul.sharma@example.com",
                "branch": "CS",
                "submittedAt": "2024-01-17T14:00:00.000Z"
            }
        ],
        "total": 1
    }
}
```

## 6.3 Get Application by ID

**GET** `/api/applications/:id`

**Access:** ADMIN, LEADER

**Description:** Get complete application with all field responses

**Response:**

```json
{
    "success": true,
    "data": {
        "id": "507f1f77bcf86cd799439018",
        "name": "Rahul Sharma",
        "yearOfStudy": "THIRD",
        "phoneNumber": "+919876543210",
        "email": "rahul.sharma@example.com",
        "branch": "CS",
        "priorExperience": "Worked on 3 MERN stack projects...",
        "submittedAt": "2024-01-17T14:00:00.000Z",
        "fieldResponses": [
            {
                "id": "507f1f77bcf86cd799439019",
                "field": {
                    "fieldTitle": "Why do you want to join?",
                    "inputType": "LONG_ANSWER"
                },
                "responseValue": "I am passionate about web development...",
                "fileUrl": null
            }
        ]
    }
}
```

## 6.4 Get Applications by Opening

**GET** `/api/applications/opening/:openingId`

**Access:** ADMIN, LEADER

**Query Parameters:**

- `yearOfStudy` (optional)
- `branch` (optional)

**Response:**

```json
{
    "success": true,
    "data": {
        "applications": [
            /* array of applications */
        ],
        "total": 23
    }
}
```

## 6.5 Delete Application

**DELETE** `/api/applications/:id`

**Access:** ADMIN only

**Response:**

```json
{
    "success": true,
    "message": "Application deleted successfully"
}
```

<br />
<br />

# 7. Application Analysis APIs (Three Tabs)

**Access:** ADMIN, LEADER (for all endpoints)

## 7.1 Summary View

**GET** `/api/applications/analysis/:openingId/summary`

**Description:** Get aggregated data for all fields (Summary Tab)

**Response:**

```json
{
    "success": true,
    "data": {
        "totalApplications": 23,
        "fieldSummaries": [
            {
                "fieldTitle": "Name",
                "fieldType": "fixed",
                "responses": [
                    { "value": "Rahul Sharma", "count": 1 },
                    { "value": "Priya Patel", "count": 1 }
                ]
            },
            {
                "fieldTitle": "Year of Study",
                "fieldType": "fixed",
                "responses": [
                    { "value": "FIRST", "count": 2 },
                    { "value": "SECOND", "count": 8 },
                    { "value": "THIRD", "count": 10 },
                    { "value": "FOURTH", "count": 3 }
                ]
            },
            {
                "fieldTitle": "Branch",
                "fieldType": "fixed",
                "responses": [
                    { "value": "CS", "count": 10 },
                    { "value": "IT", "count": 8 },
                    { "value": "ENTC", "count": 5 }
                ]
            },
            {
                "fieldTitle": "Why do you want to join?",
                "fieldType": "LONG_ANSWER",
                "totalResponses": 23
            },
            {
                "fieldTitle": "Select your preferred domain",
                "fieldType": "MULTIPLE_CHOICE",
                "responses": [
                    { "value": "Frontend", "count": 8 },
                    { "value": "Backend", "count": 6 },
                    { "value": "Full Stack", "count": 9 }
                ]
            }
        ],
        "branchDistribution": {
            "CS": 10,
            "IT": 8,
            "ENTC": 5
        },
        "yearDistribution": {
            "FIRST": 2,
            "SECOND": 8,
            "THIRD": 10,
            "FOURTH": 3
        }
    }
}
```

## 7.2 Questions View

**GET** `/api/applications/analysis/:openingId/questions`

**Description:** Filter and view responses by specific question (Questions Tab)

**Query Parameters:**

- `fieldId` (required): ID of the form field to view responses for

**Example:**

```
GET /api/applications/analysis/:openingId/questions?fieldId=507f1f77bcf86cd799439015
```

**Response:**

```json
{
    "success": true,
    "data": {
        "field": {
            "id": "507f1f77bcf86cd799439015",
            "fieldTitle": "Why do you want to join?",
            "inputType": "LONG_ANSWER"
        },
        "responses": [
            {
                "applicationId": "507f1f77bcf86cd799439018",
                "applicantName": "Rahul Sharma",
                "responseValue": "I am passionate about web development and want to contribute...",
                "submittedAt": "2024-01-17T14:00:00.000Z"
            },
            {
                "applicationId": "507f1f77bcf86cd799439020",
                "applicantName": "Priya Patel",
                "responseValue": "I have always been interested in learning new technologies...",
                "submittedAt": "2024-01-17T15:00:00.000Z"
            }
        ]
    }
}
```

## 7.3 Individual View

**GET** `/api/applications/analysis/:openingId/individual/:applicationId`

**Description:** View complete details of a specific applicant (Individual Tab)

**Response:**

```json
{
    "success": true,
    "data": {
        "application": {
            "id": "507f1f77bcf86cd799439018",
            "name": "Rahul Sharma",
            "yearOfStudy": "THIRD",
            "phoneNumber": "+919876543210",
            "email": "rahul.sharma@example.com",
            "branch": "CS",
            "priorExperience": "Worked on 3 MERN stack projects...",
            "submittedAt": "2024-01-17T14:00:00.000Z"
        },
        "responses": [
            {
                "fieldTitle": "Why do you want to join?",
                "inputType": "LONG_ANSWER",
                "responseValue": "I am passionate about web development...",
                "fileUrl": null
            },
            {
                "fieldTitle": "Select your preferred domain",
                "inputType": "MULTIPLE_CHOICE",
                "responseValue": "Full Stack",
                "fileUrl": null
            },
            {
                "fieldTitle": "Upload your resume",
                "inputType": "UPLOAD_DOC",
                "responseValue": "",
                "fileUrl": "https://cloudinary.com/resume/rahul-sharma.pdf"
            }
        ]
    }
}
```

## 7.4 Export Applications to CSV

**GET** `/api/applications/analysis/:openingId/export`

**Description:** Download all applications as CSV file

**Response:**
CSV file download with all application data

<br />
<br />

## 7.5 Get Dashboard Statistics

**Access:** ADMIN, LEADER (for all endpoints)

**GET** `/api/applications/analysis/stats`

**Description:** Overview statistics for the dashboard

**Response:**

```json
{
    "success": true,
    "data": {
        "totalOpenings": 15,
        "activeOpenings": 8,
        "totalApplications": 234,
        "recentApplications": [
            {
                "id": "507f1f77bcf86cd799439018",
                "name": "Rahul Sharma",
                "opening": "Full Stack Developer",
                "submittedAt": "2024-01-17T14:00:00.000Z"
            }
        ],
        "topOpenings": [
            {
                "opening": {
                    "id": "507f1f77bcf86cd799439013",
                    "title": "Full Stack Developer",
                    "domain": "Technical"
                },
                "applicationCount": 45
            }
        ]
    }
}
```

## 7.6 Get My Openings

**GET** `/api/applications/analysis/my-openings`

**Description:** Get openings created by the logged-in user

**Response:**

```json
{
    "success": true,
    "data": {
        "openings": [
            {
                "id": "507f1f77bcf86cd799439013",
                "title": "Full Stack Developer",
                "domain": "Technical",
                "workType": "HYBRID",
                "numberOfSlots": 5,
                "isActive": true,
                "views": 156,
                "applicationCount": 23,
                "createdAt": "2024-01-17T12:00:00.000Z"
            }
        ],
        "total": 1
    }
}
```

<br />
<br />

# 8. File Upload APIs

## 8.1 Upload File

**POST** `/api/upload`

**Access:** Public

**Description:** Upload files (documents, PDFs, images) for applications

**Request:**

- Content-Type: `multipart/form-data`
- Field name: `file`

**Example using FormData:**

```javascript
const formData = new FormData();
formData.append('file', fileObject);

fetch('http://localhost:8080/api/upload', {
    method: 'POST',
    body: formData,
});
```

**Response:**

```json
{
    "success": true,
    "message": "File uploaded successfully",
    "data": {
        "fileUrl": "https://your-storage.com/files/resume-1234567890.pdf",
        "fileName": "resume.pdf",
        "fileSize": 245678,
        "uploadedAt": "2024-01-17T14:30:00.000Z"
    }
}
```

## 8.2 Delete File

**DELETE** `/api/upload/:fileId`

**Access:** ADMIN only

**Response:**

```json
{
    "success": true,
    "message": "File deleted successfully"
}
```

<br />
<br />

# 9. Error Responses

All API endpoints return consistent error responses:

## 400 Bad Request

```json
{
    "success": false,
    "message": "Validation error: Email is required"
}
```

## 401 Unauthorized

```json
{
    "success": false,
    "message": "No token provided"
}
```

or

```json
{
    "success": false,
    "message": "Invalid token"
}
```

or

```json
{
    "success": false,
    "message": "Token expired"
}
```

## 403 Forbidden

```json
{
    "success": false,
    "message": "You do not have permission to perform this action"
}
```

## 404 Not Found

```json
{
    "success": false,
    "message": "Route not found"
}
```

or

```json
{
    "success": false,
    "message": "Opening not found"
}
```

## 500 Internal Server Error

```json
{
    "success": false,
    "message": "Internal Server Error"
}
```

<br />
<br />

# 10. Common Enums

## UserRole

```
ADMIN
LEADER
```

## WorkType

```
HYBRID
REMOTE
ONSITE
```

## YearOfStudy

```
FIRST
SECOND
THIRD
FOURTH
```

## InputType

```
SHORT_ANSWER
LONG_ANSWER
MULTIPLE_CHOICE
MULTIPLE_CORRECT
UPLOAD_DOC
```

<br />
<br />

# 11. Rate Limiting

The API has rate limiting enabled:

- **Window:** 15 minutes
- **Max Requests:** 100 requests per IP per window

When rate limit is exceeded:

```json
{
    "success": false,
    "message": "Too many requests, please try again later"
}
```

<br />
<br />

# 12. Frontend Integration Examples

## Login Flow

```javascript
// Login
const login = async (email, password) => {
    const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
        // Store token in localStorage or cookie
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
    }

    return data;
};
```

## Authenticated Request

```javascript
// Get current user
const getCurrentUser = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:8080/api/auth/me', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    return await response.json();
};
```

## Fetch Public Openings

```javascript
// Get all active openings
const getOpenings = async (filters = {}) => {
    const queryParams = new URLSearchParams();

    if (filters.isActive !== undefined) {
        queryParams.append('isActive', filters.isActive);
    }
    if (filters.domain) {
        queryParams.append('domain', filters.domain);
    }
    if (filters.workType) {
        queryParams.append('workType', filters.workType);
    }

    const response = await fetch(`http://localhost:8080/api/openings?${queryParams.toString()}`);

    return await response.json();
};

// Usage
const openings = await getOpenings({ isActive: true, domain: 'Technical' });
```

## Create Opening (Protected)

```javascript
const createOpening = async openingData => {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:8080/api/openings', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(openingData),
    });

    return await response.json();
};

// Usage
const newOpening = await createOpening({
    title: 'Frontend Developer',
    domain: 'Technical',
    workType: 'REMOTE',
    numberOfSlots: 3,
    preText: 'Join our frontend team',
    aboutRole: 'We are looking for React developers...',
    skillsRequired: 'React, TypeScript, Tailwind CSS',
    extraInfo: 'Portfolio required',
});
```

## Submit Application (Public)

```javascript
const submitApplication = async applicationData => {
    const response = await fetch('http://localhost:8080/api/applications', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
    });

    return await response.json();
};

// Usage
const application = await submitApplication({
    openingId: '507f1f77bcf86cd799439013',
    formId: '507f1f77bcf86cd799439014',
    name: 'John Doe',
    yearOfStudy: 'SECOND',
    phoneNumber: '+919876543210',
    email: 'john@example.com',
    branch: 'CS',
    priorExperience: 'Worked on multiple projects...',
    fieldResponses: [
        {
            fieldId: '507f1f77bcf86cd799439015',
            responseValue: 'I am passionate about coding...',
        },
    ],
});
```

## File Upload

```javascript
const uploadFile = async file => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:8080/api/upload', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, browser will set it with boundary
    });

    return await response.json();
};

// Usage in file input change handler
const handleFileChange = async event => {
    const file = event.target.files[0];
    const result = await uploadFile(file);

    if (result.success) {
        console.log('File uploaded:', result.data.fileUrl);
        // Use result.data.fileUrl in your application
    }
};
```

## Fetch Form for Opening

```javascript
const getFormForOpening = async openingId => {
    const response = await fetch(`http://localhost:8080/api/forms/opening/${openingId}`);

    return await response.json();
};

// Usage
const form = await getFormForOpening('507f1f77bcf86cd799439013');
console.log(form.data.customFields); // Array of form fields
```

## Get Application Analysis (Summary Tab)

```javascript
const getSummaryAnalysis = async openingId => {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `http://localhost:8080/api/applications/analysis/${openingId}/summary`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return await response.json();
};

// Usage
const summary = await getSummaryAnalysis('507f1f77bcf86cd799439013');
console.log(summary.data.totalApplications);
console.log(summary.data.branchDistribution);
```

## Error Handling Example

```javascript
const apiCall = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (!data.success) {
            // Handle API error
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        // Handle network error or API error
        console.error('API Error:', error.message);
        throw error;
    }
};

// Usage
try {
    const openings = await apiCall('http://localhost:8080/api/openings');
    console.log(openings.data);
} catch (error) {
    alert('Failed to fetch openings: ' + error.message);
}
```

<br />
<br />

# 13. Common Workflows

## Admin/Leader Creating Position Opening

1. **Login**

    ```
    POST /api/auth/login
    ```

2. **Create Opening**

    ```
    POST /api/openings
    ```

3. **Create Form for Opening**

    ```
    POST /api/forms
    ```

4. **Add Custom Fields** (if not done in step 3)

    ```
    POST /api/form-fields (multiple times)
    ```

5. **View Applications**

    ```
    GET /api/applications/opening/:openingId
    ```

6. **Analyze Applications**
    ```
    GET /api/applications/analysis/:openingId/summary
    GET /api/applications/analysis/:openingId/questions?fieldId=xxx
    GET /api/applications/analysis/:openingId/individual/:applicationId
    ```

## Student Applying for Position

1. **View Available Openings**

    ```
    GET /api/openings?isActive=true
    ```

2. **View Opening Details**

    ```
    GET /api/openings/:id
    ```

3. **Get Application Form**

    ```
    GET /api/forms/opening/:openingId
    ```

4. **Upload Documents** (if needed)

    ```
    POST /api/upload
    ```

5. **Submit Application**
    ```
    POST /api/applications
    ```

<br />
<br />

# 14. Environment Variables

Required environment variables for the backend:

```env
# Server
PORT=8080
NODE_ENV=development

# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/college-club"

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d

# CORS (if needed)
FRONTEND_URL=http://localhost:3000
```
