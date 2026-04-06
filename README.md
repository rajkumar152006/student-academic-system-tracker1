# Student Academic Milestone Tracker

A comprehensive MERN stack application for tracking student academic performance, achievements, and attendance. Features a beautiful, responsive dashboard for students and a powerful admin panel for managing student data.

## Features

### 🎓 Student Dashboard
- **Profile Page**: View personal information (Name, Roll Number, Department, Year) with an interactive attendance pie chart
- **Academic Page**: 
  - Subject-wise marks and internal scores in a sortable table
  - **5-Semester SGPA Progress**: Visual bar display showing SGPA progression across all 5 semesters
  - SGPA bar chart for visual analytics
  - CGPA display with gradient styling
- **Achievements Page**: Track projects, online courses, and paper presentations
- **Responsive Sidebar Navigation**: Easy navigation with Icons (Profile 👤, Academic 📚, Achievements 🏆)

### 👨‍💼 Admin Dashboard
- **Student List**: View all students with roll numbers and names
- **Student Details**: Click any student to view complete profile including academic data and achievements
- **Management Features**: Ready for edit/delete student functionality

# student-academic-system-tracker1
- **Beautiful Detail Grid**: Organized display of student academics and achievements

### 🎨 Modern UI/UX
- **Purple Gradient Theme**: Professional color scheme (#667eea - #764ba2)
- **Smooth Animations**: Hover effects, transitions, and interactive elements
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Material Design Principles**: Clean spacing, typography, and card-based layouts
- **Interactive Charts**: Recharts for data visualization (Pie charts, Bar charts)

## Tech Stack

### Frontend
- **React 19**: Latest React version with hooks
- **React Router DOM**: Client-side routing
- **Recharts**: Beautiful, composable charts
- **Axios**: HTTP client for API calls
- **CSS3**: Modern styling with flexbox and grid

### Backend  
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **CORS**: Cross-origin support

## Project Structure

```
project-r/
├── client/                          # React frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/
│   │   │   └── Sidebar.js          # Navigation sidebar
│   │   ├── pages/
│   │   │   ├── Dashboard.js        # Main dashboard wrapper
│   │   │   ├── Profile.js          # Student profile with attendance chart
│   │   │   ├── Academic.js         # Academic data & 5-semester SGPA
│   │   │   ├── Achievements.js     # Achievements cards
│   │   │   ├── Admin.js            # Admin panel
│   │   │   └── Login.js            # Login page
│   │   ├── styles/
│   │   │   └── Dashboard.css       # Comprehensive styling
│   │   ├── App.js                  # Main app routes
│   │   ├── index.css               # Base styles
│   │   └── index.js                # Entry point
│   └── package.json
│
└── server/                          # Express backend
    ├── config/
    │   └── db.js                   # MongoDB connection
    ├── models/
    │   └── Student.js              # Student schema
    ├── routes/
    │   ├── auth.js                 # Authentication routes
    │   └── students.js             # Student CRUD routes
    ├── index.js                    # Server entry point
    ├── .env.example                # Environment variables template
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)

### Step 1: Clone/Open Project
```bash
cd project-r
```

### Step 2: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 3: Configure Backend Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env and set your MongoDB URI (optional):
# MONGO_URI=mongodb://127.0.0.1:27017/student_academic
# PORT=5000
```

### Step 4: Start Backend Server
```bash
npm run start
# Or for development with auto-reload:
npm run dev
```
Backend will run on `http://localhost:5000`

### Step 5: Install Frontend Dependencies (New Terminal)
```bash
cd client
npm install
```

### Step 6: Start Frontend Development Server
```bash
npm start
```
Frontend will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with roll number
  ```json
  { "rollNumber": "21CSE101" }
  ```

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
  ```json
  {
    "name": "John Doe",
    "rollNumber": "21CSE101",
    "department": "CSE",
    "year": 3,
    "attendance": 85,
    "subjects": [
      { "name": "Math", "marks": 78, "internal": 18 }
    ],
    "sgpa": 8.2,
    "cgpa": 7.9,
    "achievements": {
      "projects": 2,
      "courses": 3,
      "papers": 1
    }
  }
  ```
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

## Database Schema

### Student Model
```javascript
{
  name: String,
  rollNumber: String (unique),
  department: String,
  year: Number,
  attendance: Number,
  subjects: [
    {
      name: String,
      marks: Number,
      internal: Number
    }
  ],
  sgpa: Number,
  cgpa: Number,
  achievements: {
    projects: Number,
    courses: Number,
    papers: Number
  }
}
```

## Seeding Demo Data

Seed some sample students to test the admin panel:

```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Raj Kumar",
    "rollNumber": "21CSE101",
    "department": "CSE",
    "year": 3,
    "attendance": 85,
    "subjects": [
      {"name": "Data Structures", "marks": 82, "internal": 19},
      {"name": "Algorithms", "marks": 78, "internal": 18},
      {"name": "Database Systems", "marks": 74, "internal": 16}
    ],
    "sgpa": 8.2,
    "cgpa": 7.9,
    "achievements": {"projects": 2, "courses": 3, "papers": 1}
  }'
```

## Features Demo

### 1. Login Page
- Enter any roll number
- Falls back to demo data if backend unavailable
- Beautiful gradient background with form validation

### 2. Student Login →Dashboard
- Auto-redirect to dashboard on successful login
- Stores student data in localStorage

### 3. Profile Page
- Display student info (Name, Roll, Department, Year)
- **Interactive Attendance Pie Chart** showing present vs absent percentage
- Color-coded visualization

### 4. Academic Page
- **Subject Marks Table** - All subjects with marks and internal scores
- **5-Semester SGPA Bars** - Each semester displayed in attractive gradient cards
- **SGPA Bar Chart** - Trend visualization across semesters
- **CGPA Display** - Highlighted with gradient styling

### 5. Achievements Page
- **3 Achievement Cards** - Projects, Online Courses, Paper Presentations
- Emoji icons for visual appeal
- Smooth hover animations and elevation effects

### 6. Admin Panel
- **Student List** - Left sidebar with all students
- **Student Details** - Right panel showing complete student information
- **Grid Layout** - Organized display of academic data

## UI/UX Highlights

### Colors & Theme
- **Primary Gradient**: Purple (#667eea) to Violet (#764ba2)
- **Background**: Light gray (#f5f7fa)
- **Text**: Dark slate (#2c3e50)
- **Accents**: Soft pink (#f093fb)

### Interactive Elements
- Hover animations on cards (+translateY)
- Active state highlight on navigation
- Smooth transitions (0.3s ease)
- Box shadows for depth
- Rounded corners (6-12px)

### Typography
- Clear hierarchy with size variations
- Ubuntu/Segoe UI fonts for clarity
- Uppercase labels (12px, 0.5px letter-spacing)
- Font weights: 400 (regular), 600 (semibold), 700 (bold)

### Responsive Design
- Mobile-first approach
- Adapts to tablet and desktop
- Flex and grid layouts
- Breakpoint: 768px for mobile

## Future Enhancements

- [ ] JWT authentication with passwords
- [ ] Admin CRUD operations (Edit/Delete students)
- [ ] Student registration page
- [ ] Email notifications
- [ ] Export to PDF reports
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Progress tracking over time
- [ ] Performance analytics
- [ ] Mobile app (React Native)

## Troubleshooting

### Backend won't connect
- Ensure MongoDB is running
- Check `.env` MONGO_URI is correct
- Default: `mongodb://127.0.0.1:27017/student_academic`

### CORS errors
- Backend CORS is enabled
- Frontend running on http://localhost:3000
- Backend running on http://localhost:5000

### Students not showing in Admin
- Seed the database using the curl command above
- Or use the `/api/students` POST endpoint to create students

### Styling issues
- Clear browser cache: Ctrl+Shift+Delete
- Restart React dev server: Ctrl+C, npm start
- Check Dashboard.css is in `client/src/styles/`

## Development Tips

### Run Both Servers
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm start

# Terminal 3 - Optional: MongoDB shell
mongosh
```

### Add New Student via API (Windows PowerShell)
```powershell
$body = @{
    name = "Jane Doe"
    rollNumber = "21CSE102"
    department = "CSE"
    year = 3
    attendance = 90
    sgpa = 8.5
    cgpa = 8.3
    achievements = @{
        projects = 3
        courses = 4
        papers = 2
    }
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/students" -Method POST -Body $body -ContentType "application/json"
```

## Performance Optimizations

- Code splitting with React.lazy (future)
- Image optimization  
- CSS minification in production build
- MongoDB indexing on rollNumber
- Caching strategies for API calls

## Security Considerations

- Input validation on backend
- CORS configuration
- Environment variables for sensitive data
- Prepared statements (Mongoose prevents injection)
- Next: Add password hashing and JWT tokens

## License

MIT - Feel free to use for educational purposes

## Support

For issues or questions, please open an issue or contact the development team.

---

**Happy Coding! 🚀**

Built with ❤️ for students and educators
# student-academic-system-tracker1
