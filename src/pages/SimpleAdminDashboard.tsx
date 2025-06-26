import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";

const SimpleAdminDashboard = () => {
  const { user } = useAuth();
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    console.log("Simple Admin Dashboard loaded");
    document.title = "Admin Dashboard";
  }, []);

  const handleAction = (app: any, action: "approve" | "reject") => {
    setSelectedApplication(app);
    setActionType(action);
    setComment("");
    setActionDialogOpen(true);
  };

  const submitAction = () => {
    if (!selectedApplication || !actionType || !comment.trim()) return;
    
    const status = actionType === "approve" ? "approved" : "rejected";
    
    // In a real app, this would update the application status in the database with the comment
    alert(`Application ${selectedApplication.id} ${status} with comment: ${comment}`);
    setActionDialogOpen(false);
    setSelectedApplication(null);
    setComment("");
    setActionType(null);
  };

  // Sample data
  const applications = [
    { id: "APP001", name: "Rajesh Kumar Sharma", sport: "Cricket", status: "Under Review" },
    { id: "APP002", name: "Priya Singh", sport: "Badminton", status: "Approved" },
    { id: "APP003", name: "Amit Patel", sport: "Kabadi", status: "Pending" },
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Admin Dashboard</h1>
            <p>Welcome, {user?.name || "Administrator"}</p>
          </div>
          <nav>
            <Link to="/" style={{ marginRight: "20px", textDecoration: "none" }}>
              Home
            </Link>
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              User Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section style={{ marginBottom: "30px", padding: "20px", border: "1px solid #e5e5e5", borderRadius: "8px" }}>
          <h2 style={{ fontSize: "18px", marginBottom: "15px" }}>Applications Summary</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
            <div style={{ padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "6px" }}>
              <p style={{ margin: 0, color: "#666" }}>Total Applications</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: "5px 0" }}>247</p>
            </div>
            <div style={{ padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "6px" }}>
              <p style={{ margin: 0, color: "#666" }}>Pending Review</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: "5px 0" }}>43</p>
            </div>
            <div style={{ padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "6px" }}>
              <p style={{ margin: 0, color: "#666" }}>Approved</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: "5px 0" }}>156</p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: "30px", padding: "20px", border: "1px solid #e5e5e5", borderRadius: "8px" }}>
          <h2 style={{ fontSize: "18px", marginBottom: "15px" }}>Recent Applications</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e5e5e5" }}>
                <th style={{ textAlign: "left", padding: "10px" }}>ID</th>
                <th style={{ textAlign: "left", padding: "10px" }}>Name</th>
                <th style={{ textAlign: "left", padding: "10px" }}>Sport</th>
                <th style={{ textAlign: "left", padding: "10px" }}>Status</th>
                <th style={{ textAlign: "left", padding: "10px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} style={{ borderBottom: "1px solid #e5e5e5" }}>
                  <td style={{ padding: "10px" }}>{app.id}</td>
                  <td style={{ padding: "10px" }}>{app.name}</td>
                  <td style={{ padding: "10px" }}>{app.sport}</td>
                  <td style={{ padding: "10px" }}>{app.status}</td>
                  <td style={{ padding: "10px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button 
                        onClick={() => handleAction(app, "approve")}
                        style={{ 
                          padding: "4px 8px", 
                          backgroundColor: "#d1fae5", 
                          color: "#065f46", 
                          border: "none", 
                          borderRadius: "4px", 
                          cursor: "pointer",
                          fontSize: "12px"
                        }}
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleAction(app, "reject")}
                        style={{ 
                          padding: "4px 8px", 
                          backgroundColor: "#fee2e2", 
                          color: "#991b1b", 
                          border: "none", 
                          borderRadius: "4px", 
                          cursor: "pointer",
                          fontSize: "12px"
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <footer style={{ marginTop: "30px", borderTop: "1px solid #e5e5e5", paddingTop: "15px", textAlign: "center" }}>
        <p style={{ color: "#666" }}>EIL Scholar Admin Panel - Version 1.0</p>
      </footer>

      {/* Action Dialog Modal */}
      {actionDialogOpen && (
        <div style={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100
        }}>
          <div style={{ 
            backgroundColor: "white", 
            borderRadius: "8px", 
            padding: "20px", 
            width: "90%", 
            maxWidth: "500px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "18px", margin: 0 }}>
                {actionType === "approve" ? "Approve Application" : "Reject Application"}
              </h2>
              <button 
                onClick={() => setActionDialogOpen(false)}
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>
            
            <div style={{ marginBottom: "20px" }}>
              <p style={{ margin: "0 0 5px 0", fontWeight: "500" }}>Applicant: {selectedApplication?.name}</p>
              <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>ID: {selectedApplication?.id}</p>
            </div>
            
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                {actionType === "approve" ? "Approval Comments:" : "Rejection Reasons:"}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={actionType === "approve" 
                  ? "Add any comments or conditions for approval..." 
                  : "Provide detailed reasons for rejection..."}
                style={{ 
                  width: "100%", 
                  minHeight: "100px", 
                  padding: "8px", 
                  borderRadius: "4px", 
                  border: "1px solid #ddd",
                  fontFamily: "inherit",
                  fontSize: "14px"
                }}
              />
            </div>
            
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                onClick={() => setActionDialogOpen(false)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#f3f4f6",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={submitAction}
                disabled={!comment.trim()}
                style={{
                  padding: "8px 16px",
                  backgroundColor: actionType === "approve" ? "#10b981" : "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: comment.trim() ? "pointer" : "not-allowed",
                  opacity: comment.trim() ? 1 : 0.7
                }}
              >
                {actionType === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleAdminDashboard; 