# CloudDrive – Cloud-Based File Storage and Management System

##  Project Overview

CloudDrive is a secure, web-based cloud storage and file management application that enables users to authenticate, upload, download, view, and delete files efficiently. The application leverages Amazon Web Services (AWS) to provide scalable cloud storage, secure user authentication, and controlled resource access.

It integrates Amazon S3, AWS Cognito, and AWS IAM to deliver a reliable cloud-based file management solution.

##  Objectives

- Develop a secure cloud-based file storage application.
- Implement user registration and authentication.
- Enable file uploading, downloading, viewing, and deletion.
- Integrate AWS services for cloud storage and management.
- Implement access control using AWS IAM permissions.

##  Key Features

- **User Registration:** Create accounts using email and password.
- **User Authentication:** Secure login using Amazon Cognito.
- **File Upload:** Upload files to Amazon S3.
- **File Management:** View and manage stored files.
- **File Download:** Download files from cloud storage.
- **File Deletion:** Delete unwanted files.
- **User Logout:** Securely end the user session.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | User interface design |
| JavaScript | Application functionality |
| Amazon S3 | Cloud file storage |
| AWS Cognito | User authentication |
| AWS IAM | Access management |
| AWS SDK for JavaScript | AWS service integration |

##  System Architecture

1. The user accesses the CloudDrive web application.
2. Amazon Cognito manages user registration and authentication.
3. Cognito Identity Pool provides temporary AWS credentials.
4. AWS IAM permissions control access to cloud resources.
5. Amazon S3 stores and manages uploaded files.
6. The application enables users to view, download, and delete files.

##  Project Structure

```text
CloudDrive/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

##  Getting Started

### Prerequisites

- AWS Account
- Amazon S3 Bucket
- Amazon Cognito User Pool
- Cognito Identity Pool
- Appropriate AWS IAM permissions
- Visual Studio Code
- Live Server extension (recommended)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/srikanthreddy4067/CloudDrive.git
```

**2. Open the project folder**

Open the downloaded project in Visual Studio Code.

**3. Configure AWS services**

Configure the required AWS resource identifiers and authentication settings in `script.js`.

**4. Verify permissions**

Ensure the Cognito Identity Pool and IAM permissions allow the required S3 operations.

**5. Run the application**

Open `index.html` using the Live Server extension.

**6. Start using CloudDrive**

Register an account, log in, and access the file management features.

## Security Considerations

- Use temporary AWS credentials through Cognito.
- Apply least-privilege IAM permissions.
- Never expose AWS secret access keys.
- Configure appropriate S3 bucket access restrictions.
- Never upload passwords or private credentials to GitHub.

##  Future Enhancements

- File sharing through secure links.
- File versioning.
- Search and filter functionality.
- File preview support.
- Storage usage dashboard.
- Enhanced access control.

##  Author

Srikanth Reddy

B.Tech – Computer Science and Engineering

##  GitHub Repository

https://github.com/srikanthreddy4067/CloudDrive
