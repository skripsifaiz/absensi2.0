# System Requirements - Teacher Attendance System

## Overview

Teacher Attendance System is a web-based application designed to digitize teacher attendance management. The system allows teachers to record attendance, while administrators can monitor, manage, verify, and generate attendance reports.

The system includes GPS-based attendance validation and an Attendance Correction Request workflow for teachers who forget to perform attendance actions.

---

# User Roles

## Administrator

Administrators have full access to the system.

### Permissions

* Login and logout
* Manage teacher accounts
* View attendance records
* View attendance details per teacher
* Approve or reject leave requests
* Approve or reject attendance correction requests
* Manage attendance settings
* Configure GPS validation settings
* View attendance statistics and reports
* Export attendance reports

---

## Teacher

Teachers can manage their own attendance activities.

### Permissions

* Login and logout
* Check in attendance
* Check out attendance
* View personal attendance history
* Submit leave requests
* Submit attendance correction requests
* Act as witness for attendance correction requests
* View approval requests requiring witness action
* Update personal profile

---

# Functional Requirements

## Authentication

### Login

* Users must authenticate using email/NIP and password.
* System must support secure session management.
* System must provide forgot password functionality.

### Authorization

* System must implement role-based access control (RBAC).
* Users may only access features permitted by their assigned role.

---

## Dashboard

### Admin Dashboard

The system must display:

* Total registered teachers
* Total attendance today
* Total late arrivals today
* Total approved leave requests
* Total sick leaves
* Total absences
* Total pending attendance correction requests
* Attendance statistics and charts

### Teacher Dashboard

The system must display:

* Today's attendance status
* Check-in time
* Check-out time
* Monthly attendance summary
* Recent attendance history
* Pending witness approval requests
* Personal attendance correction request status

---

## Teacher Management

Administrators must be able to:

* Create teacher accounts
* Update teacher information
* Deactivate teacher accounts
* Delete teacher accounts

Teacher data includes:

* Full name
* Employee ID (NIP)
* Email
* Phone number
* Position
* Employment status

---

## Attendance Management

### Check-In

Teachers must be able to record attendance by pressing the Check In button.

The system must automatically record:

* Date
* Time
* GPS coordinates
* Attendance status

### Check-Out

Teachers must be able to record attendance by pressing the Check Out button.

The system must automatically record:

* Date
* Time
* GPS coordinates

### Attendance Validation

The system must:

* Prevent multiple check-ins on the same day.
* Prevent check-out before check-in.
* Prevent multiple check-outs on the same day.

---

# GPS Location Validation

The system must validate teacher attendance based on geographic location.

### Requirements

* System must request user location through browser geolocation API.
* System must compare teacher location with the school's registered coordinates.
* System must define a configurable attendance radius.
* Attendance can only be submitted when the teacher is within the allowed radius.
* System must display a warning when attendance is attempted outside the allowed area.
* System must store attendance coordinates for audit purposes.

### Configuration

Administrators must be able to:

* Set school latitude and longitude.
* Configure allowed attendance radius.
* Enable or disable GPS validation.

---

# Leave Management

Teachers must be able to:

* Submit leave requests
* Select leave type
* Enter reason
* Upload supporting documents

Administrators must be able to:

* Approve requests
* Reject requests
* Add review notes

---

# Attendance Correction Request

## Overview

Attendance Correction Request allows teachers to request attendance corrections when they forget to perform attendance actions.

Supported correction types:

* Missing Check-In
* Missing Check-Out

---

## Create Attendance Correction Request

Teachers can submit attendance correction requests only if attendance data is missing for the selected date.

Required fields:

* Attendance Date
* Correction Type
* Notes/Reason (Required)
* Verification Method

---

## Verification Method 1: Photo Evidence

Teachers may submit supporting photo evidence.

Required fields:

* Notes/Reason
* Photo Evidence

Workflow:

1. Teacher submits request.
2. Request status becomes Pending Admin Approval.
3. Admin reviews evidence.
4. Admin approves or rejects request.

---

## Verification Method 2: Witness Approval

Used when no photo evidence is available.

Required fields:

* Notes/Reason
* Witness Teacher

Workflow:

1. Teacher submits request.
2. Teacher selects another teacher as witness.
3. Request status becomes Pending Witness Approval.
4. Witness teacher reviews request.
5. Witness approves or rejects request.
6. If approved, request proceeds to admin review.
7. Admin approves or rejects request.
8. Final status is recorded.

---

## Attendance Correction Status

The system must support the following statuses:

* Draft
* Pending Witness Approval
* Witness Approved
* Witness Rejected
* Pending Admin Approval
* Approved
* Rejected

---

## Teacher Witness Approval Module

The system must provide a dedicated menu for witness approvals.

### My Approval Requests

Teachers must be able to:

* View pending witness requests
* View request details
* Approve requests
* Reject requests
* Add optional comments

---

## Attendance Correction History

Teachers must be able to:

* View submitted requests
* View request status
* View approval history
* View admin decisions

---

## Admin Attendance Correction Management

Administrators must be able to:

* View all correction requests
* View supporting photo evidence
* View witness information
* View approval history
* Approve requests
* Reject requests
* Add decision notes

---

## Business Rules

* Teachers cannot create correction requests if attendance already exists for the selected action.
* Teachers cannot select themselves as witness.
* Only one verification method can be selected per request.
* Witness approval is mandatory for witness-based requests.
* Witness rejection automatically closes the request.
* Admin approval is required before attendance data is modified.
* All correction activities must be logged.

---

## Audit Trail

The system must store:

* Request creator
* Request date and time
* Correction type
* Verification method
* Uploaded evidence
* Witness teacher
* Witness decision
* Witness approval timestamp
* Admin reviewer
* Admin decision
* Admin decision timestamp
* Notes and comments

---

# Attendance History

Teachers must be able to:

* View attendance history
* Filter records by date
* View attendance details

---

# Attendance Reports

Administrators must be able to:

* View attendance summaries
* Filter reports by teacher
* Filter reports by date range
* View attendance statistics

---

# Export Reports

Administrators must be able to export reports in:

* PDF format
* Excel format

---

# Non-Functional Requirements

## Performance

* Average page response time should be less than 3 seconds.
* System should support at least 100 active teachers.

## Security

* Passwords must be stored using secure hashing algorithms.
* JWT-based authentication must be implemented.
* HTTPS should be enabled in production environments.
* Role-based authorization must be enforced.

## Reliability

* Attendance data must be stored reliably.
* Attendance transactions must be logged.
* System should prevent duplicate attendance records.

## Usability

* Interface should be simple and user-friendly.
* System should be responsive across devices.

## Compatibility

Supported browsers:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Mobile browsers

---

# Technology Stack

## Frontend

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui

## Backend

* NestJS
* TypeScript

## Database

* PostgreSQL

## Authentication

* JWT Access Token
* Refresh Token

## Deployment

* Docker
* Nginx Reverse Proxy

---

# Future Enhancements

* QR Code Attendance
* Face Recognition
* WhatsApp Notifications
* Mobile Application
* Multi-School Support
* Attendance Analytics Dashboard
