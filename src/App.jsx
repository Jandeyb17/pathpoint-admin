import { useEffect, useState } from "react";
import Login from "./Login.jsx";
import { getCurrentAdmin } from "./api.js";
import "./App.css";

const SESSION_KEY = "pathpoint-admin";

// Saved as { token, admin: { id, username } }. Older demo sessions have no token.
const loadSession = () => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    return saved?.token ? saved : null;
  } catch {
    return null;
  }
};

function App() {
  // ================= AUTH =================
  const [session, setSession] = useState(loadSession);
  const admin = session?.admin;

  const [activePage, setActivePage] = useState("Dashboard");

  // ================= USERS =================
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Job Seeker",
      status: "Active",
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria@example.com",
      role: "Job Seeker",
      status: "Active",
    },
    {
      id: 3,
      name: "Pedro Cruz",
      email: "pedro@example.com",
      role: "Job Seeker",
      status: "Active",
    },
    {
      id: 4,
      name: "Ana Reyes",
      email: "ana@example.com",
      role: "Job Seeker",
      status: "Inactive",
    },
    {
      id: 5,
      name: "Mark Dela Cruz",
      email: "mark@example.com",
      role: "Job Seeker",
      status: "Active",
    },
    {
      id: 6,
      name: "Sofia Garcia",
      email: "sofia@example.com",
      role: "Job Seeker",
      status: "Active",
    },
    {
      id: 7,
      name: "James Santos",
      email: "james@example.com",
      role: "Job Seeker",
      status: "Active",
    },
    {
      id: 8,
      name: "Angela Lopez",
      email: "angela@example.com",
      role: "Job Seeker",
      status: "Inactive",
    },
  ]);

  // ================= DELETE USER =================
  const handleDeleteUser = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (confirmDelete) {
      setUsers((prev) => prev.filter((user) => user.id !== id));
    }
  };

  // ================= SIDEBAR MENU =================
  const menuItems = [
    { name: "Dashboard", icon: "🏠" },
    { name: "Applications", icon: "📋" },
    { name: "Interviews", icon: "📅" },
    { name: "Reminders", icon: "🔔" },
    { name: "Resumes", icon: "📄" },
    { name: "Users", icon: "👥" },
  ];

  const clearSession = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  // Re-check a saved token with the server; drop it if it expired or was revoked.
  const token = session?.token;
  useEffect(() => {
    if (!token) return;

    getCurrentAdmin(token).catch((err) => {
      if (err.status === 401) {
        sessionStorage.removeItem(SESSION_KEY);
        setSession(null);
      }
    });
  }, [token]);

  const handleLogin = (newSession) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    setSession(newSession);
    setActivePage("Dashboard");
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      clearSession();
    }
  };

  if (!admin) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">

      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">

        <div className="logo">
          <img src="/logo.jpg" alt="PathPoint Logo" />
          <h2>PathPoint</h2>
          <p>Admin Panel</p>
        </div>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`nav-button ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p className="admin-username">{admin.username}</p>
          <button className="logout-button" onClick={handleLogout}>
            <span>🚪</span>
            Logout
          </button>
        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}
      <main className="main-content">

        {/* ================= HEADER ================= */}
        <header className="header">

          <div>
            <h1>{activePage}</h1>
            <p>PathPoint Admin Panel</p>
            
          </div>

          <button
  className="reminders"
  onClick={() => setActivePage("Reminders")}
>
  <span>Reminders</span>

  <div className="notification-icon">
    <img src="/notfi.png" alt="Reminders notification" />
  </div>
</button>

          <button className="header-logout" onClick={handleLogout}>
            Logout
          </button>

        </header>


        {/* ================= DASHBOARD ================= */}
        {activePage === "Dashboard" && (
          <>
            <section className="stats">

              <div className="stat-card">
                <div>
                  <p>Total Applications</p>
                  <h2>0</h2>
                </div>
                <span className="stat-icon">📋</span>
              </div>

              <div className="stat-card">
                <div>
                  <p>Interviews</p>
                  <h2>0</h2>
                </div>
                <span className="stat-icon">📅</span>
              </div>

              <div className="stat-card">
                <div>
                  <p>Pending</p>
                  <h2>0</h2>
                </div>
                <span className="stat-icon">⏳</span>
              </div>

              <div className="stat-card">
                <div>
                  <p>Hired</p>
                  <h2>0</h2>
                </div>
                <span className="stat-icon">✓</span>
              </div>

            </section>


            <section className="content-card">

              <h2>Recent Applications</h2>

              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Position</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  <tr>
                    <td>ABC Company</td>
                    <td>Software Developer</td>
                    <td>Applied</td>
                  </tr>

                  <tr>
                    <td>Tech Solutions</td>
                    <td>Web Developer</td>
                    <td>Interview</td>
                  </tr>

                  <tr>
                    <td>Creative Studio</td>
                    <td>UI/UX Designer</td>
                    <td>Pending</td>
                  </tr>

                </tbody>
              </table>

            </section>
          </>
        )}


        {/* ================= APPLICATIONS ================= */}
        {activePage === "Applications" && (
          <section className="content-card">

            <div className="section-header">

              <div>
                <h2>Job Applications</h2>

                <p>
                  Monitor job applications submitted by users.
                </p>
              </div>

            </div>


            <table>

              <thead>
                <tr>
                  <th>User</th>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                <tr>
                  <td>John Doe</td>
                  <td>ABC Company</td>
                  <td>Software Developer</td>
                  <td>Applied</td>
                </tr>

                <tr>
                  <td>Maria Santos</td>
                  <td>Tech Solutions</td>
                  <td>Web Developer</td>
                  <td>Interview</td>
                </tr>

                <tr>
                  <td>Pedro Cruz</td>
                  <td>Creative Studio</td>
                  <td>UI/UX Designer</td>
                  <td>Pending</td>
                </tr>

              </tbody>

            </table>

          </section>
        )}


        {/* ================= INTERVIEWS ================= */}
        {activePage === "Interviews" && (
          <section className="content-card">

            <div className="section-header">

              <div>
                <h2>Interviews</h2>

                <p>
                  Monitor interviews scheduled by job seekers.
                </p>
              </div>

            </div>


            <table>

              <thead>
                <tr>
                  <th>User</th>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                <tr>
                  <td>John Doe</td>
                  <td>ABC Company</td>
                  <td>Software Developer</td>
                  <td>September 25, 2026</td>
                  <td>Scheduled</td>
                </tr>

                <tr>
                  <td>Maria Santos</td>
                  <td>Tech Solutions</td>
                  <td>Web Developer</td>
                  <td>September 27, 2026</td>
                  <td>Scheduled</td>
                </tr>

                <tr>
                  <td>Pedro Cruz</td>
                  <td>Creative Studio</td>
                  <td>UI/UX Designer</td>
                  <td>September 30, 2026</td>
                  <td>Pending</td>
                </tr>

              </tbody>

            </table>

          </section>
        )}


        {/* ================= REMINDERS ================= */}
        {activePage === "Reminders" && (
          <section className="content-card">

            <div className="section-header">

              <div>
                <h2>Reminders</h2>

                <p>
                  Monitor reminders created by job seekers.
                </p>
              </div>

            </div>


            <table>

              <thead>
                <tr>
                  <th>User</th>
                  <th>Reminder</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                <tr>
                  <td>John Doe</td>
                  <td>Follow up with ABC Company</td>
                  <td>September 26, 2026</td>
                  <td>Pending</td>
                </tr>

                <tr>
                  <td>Maria Santos</td>
                  <td>Prepare for interview</td>
                  <td>September 27, 2026</td>
                  <td>Pending</td>
                </tr>

                <tr>
                  <td>Pedro Cruz</td>
                  <td>Update application status</td>
                  <td>September 29, 2026</td>
                  <td>Completed</td>
                </tr>

              </tbody>

            </table>

          </section>
        )}


        {/* ================= RESUMES ================= */}
        {activePage === "Resumes" && (
          <section className="content-card">

            <div className="section-header">

              <div>
                <h2>Resumes</h2>

                <p>
                  Monitor resume versions uploaded by job seekers.
                </p>
              </div>

            </div>


            <table>

              <thead>
                <tr>
                  <th>User</th>
                  <th>Resume Version</th>
                  <th>Date Uploaded</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                <tr>
                  <td>John Doe</td>
                  <td>Software Developer Resume</td>
                  <td>September 20, 2026</td>
                  <td>Active</td>
                </tr>

                <tr>
                  <td>Maria Santos</td>
                  <td>Web Developer Resume</td>
                  <td>September 21, 2026</td>
                  <td>Active</td>
                </tr>

                <tr>
                  <td>Pedro Cruz</td>
                  <td>UI/UX Designer Resume</td>
                  <td>September 22, 2026</td>
                  <td>Active</td>
                </tr>

              </tbody>

            </table>

          </section>
        )}


        {/* ================= USERS ================= */}
        {activePage === "Users" && (
          <section className="content-card">

            <div className="section-header">

              <div>
                <h2>Users</h2>

                <p>
                  Monitor registered PathPoint users and their accounts.
                </p>
              </div>

            </div>


            {/* USERS TABLE WITH SCROLLBAR */}
            <div className="users-table-container">

              <table className="users-table">

                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>


                <tbody>

                  {users.map((user) => (

                    <tr key={user.id}>

                      <td>{user.name}</td>

                      <td>{user.email}</td>

                      <td>{user.role}</td>

                      {/* ACTIVE / INACTIVE */}
                      <td>
                        <span
                          className={
                            user.status === "Active"
                              ? "status-active"
                              : "status-inactive"
                          }
                        >
                          {user.status}
                        </span>
                      </td>

                      {/* DELETE BUTTON */}
                      <td>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </button>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

export default App;
