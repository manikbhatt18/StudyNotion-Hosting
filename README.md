# 📘 StudyNotion – Full-Stack EdTech Platform  

StudyNotion is a fully responsive **EdTech platform** built with the **MERN stack**.  
It provides a seamless learning experience with dedicated dashboards for **Students** and **Instructors**, featuring secure authentication, course management, and integrated payment processing.  

---

## ✨ Features  

- **Authentication & Authorization** – Role-based login/signup with JWT & bcrypt security  
- **Course Management** – Instructors can create, update, and delete courses  
- **Learning Dashboard** – Students can browse, purchase, and access enrolled courses  
- **Secure Payments** – Integrated with Razorpay for payments  
- **Cloud Media Handling** – Course thumbnails and video uploads managed via Cloudinary  
- **Email Notifications** – OTP, password resets, and purchase confirmations  

---

## 🛠 Tech Stack  

- **Frontend:** React.js, Redux, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose ORM)  
- **Authentication:** JWT & bcrypt  
- **Payments:** Razorpay  
- **Cloud Storage:** Cloudinary  
- **Mail Service:** Nodemailer  

---

## 📂 Project Structure  

```STUDYNOTION-EDTECH-PLATFORM/
│── build/                  # Production build files
│── node_modules/           # Dependencies
│
│── public/                 # Static assets (public)
│
│── server/                 # Backend (Node.js + Express)
│   ├── config/             # DB, JWT, and server configurations
│   ├── controllers/        # Request handlers (business logic)
│   ├── mail/               # Email service (mail templates, nodemailer)
│   ├── middleware/         # Auth middleware, role checks
│   ├── models/             # Mongoose models (User, Course, etc.)
│   ├── routes/             # API route definitions
│   ├── utils/              # Helper utilities
│   ├── index.js            # Backend entry point
│   └── .env                # Environment variables (backend)
│
│── src/                    # Frontend (React + Redux + Tailwind)
│   ├── assets/             # Images, icons, fonts
│   ├── components/         # Reusable UI components
│   ├── data/               # Static data (menus, dummy data)
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components (Home, Dashboard, etc.)
│   ├── reducer/            # Redux reducers
│   ├── services/           # API service calls (endpoints defined here)
│   ├── slices/             # Redux slices
│   ├── utils/              # Utility functions
│   ├── App.css             # Global styles
│   ├── App.jsx             # Main React App component
│   ├── index.js            # Frontend entry point
│   └── .env                # Environment variables (frontend)
│
│── .gitignore              # Ignored files and folders
│── package.json            # Project metadata and dependencies
│── package-lock.json       # Locked versions of dependencies
│── tailwind.config.js      # Tailwind CSS configuration
│── README.md               # Documentation
```



---

## 🔗 API Endpoints  

### **Auth Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/sendotp` | Send OTP for verification |
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Log in a user |
| POST | `/auth/reset-password-token` | Generate reset password token |
| POST | `/auth/reset-password` | Reset user password |
| POST | `/auth/changepassword` | Change user password |

---

### **Profile Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile/getUserDetails` | Get user profile details |
| GET | `/profile/getEnrolledCourses` | Fetch enrolled courses for a student |
| GET | `/profile/instructorDashboard` | Get instructor dashboard data |
| POST | `/profile/updateDisplayPicture` | Update profile picture |
| PUT | `/profile/updateProfile` | Update user profile info |
| DELETE | `/profile/deleteProfile` | Delete user profile |

---

### **Student Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payment/capturePayment` | Capture course payment |
| POST | `/payment/verifyPayment` | Verify course payment |
| POST | `/payment/sendPaymentSuccessEmail` | Send success email after payment |

---

### **Course Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/course/getAllCourses` | Get all available courses |
| GET | `/course/getCourseDetails` | Get course details |
| GET | `/course/showAllCategories` | Get all course categories |
| GET | `/course/getInstructorCourses` | Get courses by instructor |
| GET | `/course/getFullCourseDetails` | Get full course details (authenticated) |
| GET | `/course/getReviews` | Get course reviews |
| GET | `/course/getCategoryPageDetails` | Get catalog page data by category |
| POST | `/course/createCourse` | Create a new course |
| POST | `/course/addSection` | Add a section to a course |
| POST | `/course/addSubSection` | Add a sub-section to a course |
| POST | `/course/createRating` | Add a course rating |
| PUT | `/course/editCourse` | Edit course |
| PUT | `/course/updateSection` | Update course section |
| PUT | `/course/updateSubSection` | Update course sub-section |
| PUT | `/course/updateCourseProgress` | Update lecture completion / progress |
| DELETE | `/course/deleteSection` | Delete a course section |
| DELETE | `/course/deleteSubSection` | Delete a course sub-section |
| DELETE | `/course/deleteCourse` | Delete a course |

---

### **Other Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/reach/contact` | Submit contact form |

---

## 🚀 Installation & Setup  

1. **Clone the repository**  
   
   ```
   git clone https://github.com/manikbhatt18/StudyNotion-Hosting.git
   
   ```
2. **Install Dependencies**
   ```
   cd server && npm install
    cd ../src && npm install
   ```
3. **Setup environment variables**
     # Server (backend)
      ```
      MONGO_URI=your_mongo_connection_string
      JWT_SECRET=your_jwt_secret
      RAZORPAY_KEY_ID=your_razorpay_key
      RAZORPAY_KEY_SECRET=your_razorpay_secret
      CLOUDINARY_NAME=your_cloud_name
      CLOUDINARY_API_KEY=your_api_key
      CLOUDINARY_API_SECRET=your_api_secret
      ```
      # Client (frontend)
      ```REACT_APP_BASE_URL=http://localhost:5000```
4. Run the backend
   ```
   cd server
   npm run dev
   ```

5. Run the frontend
   ```
   cd src
   npm run dev
   ```
   



