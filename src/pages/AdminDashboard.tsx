import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  Eye,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  MoreVertical,
  Calendar,
  TrendingUp,
  UserCircle,
  ShieldAlert,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterField, setFilterField] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [actionComment, setActionComment] = useState("");
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is loaded and is admin
    if (user && !isAdmin) {
      navigate("/"); // Redirect non-admin users
      return;
    }
    
    try {
      // Simulate loading data
      const timer = setTimeout(() => {
        setIsLoading(false);
        console.log("Admin dashboard loaded for user:", user?.name);
      }, 1000);

      // Cleanup timer on unmount
      return () => clearTimeout(timer);
    } catch (err) {
      console.error("Error loading admin dashboard:", err);
      setError("Failed to load dashboard data");
      setIsLoading(false);
    }
  }, [user, isAdmin, navigate]);

  // Safe mock data that won't cause rendering issues
  const applications = [
    {
      id: "APP001",
      name: "Rajesh Kumar Sharma",
      email: "rajesh.sharma@email.com",
      mobile: "+91 98765 43210",
      engineeringField: "Chemical Engineering",
      SportsType: "Cricket",
      institution: "IIT Delhi",
      registrationDate: "2024-01-15",
      status: "under_review",
      nationalId: "1234 5678 9012",
      documents: 6,
    },
    {
      id: "APP002",
      name: "Priya Singh",
      email: "priya.singh@email.com",
      mobile: "+91 87654 32109",
      engineeringField: "Civil Engineering",
      SportsType: "Badminton",
      institution: "NIT Jalandhar",
      registrationDate: "2024-01-14",
      status: "approved",
      nationalId: "2345 6789 0123",
      documents: 8,
    },
    {
      id: "APP003",
      name: "Amit Patel",
      email: "amit.patel@email.com",
      mobile: "+91 76543 21098",
      engineeringField: "Mechanical Engineering",
      SportsType: "Kabadi",
      institution: "BITS Pilani",
      registrationDate: "2024-01-13",
      status: "pending",
      nationalId: "3456 7890 1234",
      documents: 5,
    },
  ];

  const stats = [
    {
      title: "Total Applications",
      value: "247",
      icon: FileText,
      change: "+12 this week",
      changeType: "positive",
    },
    {
      title: "Under Review",
      value: "43",
      icon: Clock,
      change: "+5 today",
      changeType: "neutral",
    },
    {
      title: "Approved",
      value: "156",
      icon: CheckCircle,
      change: "+8 this week",
      changeType: "positive",
    },
    {
      title: "Success Rate",
      value: "73%",
      icon: TrendingUp,
      change: "+2% this month",
      changeType: "positive",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "under_review":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-3 w-3" />;
      case "under_review":
        return <Eye className="h-3 w-3" />;
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "rejected":
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.mobile.includes(searchTerm) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesField = !filterField || app.engineeringField === filterField;
    const matchesCategory =
      !filterCategory || app.SportsType === filterCategory;

    return matchesSearch && matchesField && matchesCategory;
  });

  const downloadApplicationForm = (appId: string) => {
    // Simulate PDF download
    console.log(`Downloading application form for ${appId}`);
    try {
      alert(`Downloading application form for ${appId}`);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const downloadDocuments = (appId: string) => {
    // Simulate document download
    console.log(`Downloading documents for ${appId}`);
    try {
      alert(`Downloading documents for ${appId}`);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const exportToExcel = () => {
    // Simulate Excel export
    console.log("Exporting to Excel");
    try {
      alert("Exporting application data to Excel...");
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const handleActionClick = (app: any, action: "approve" | "reject") => {
    setSelectedApplication(app);
    setActionType(action);
    setActionComment("");
    setActionDialogOpen(true);
  };

  const submitAction = () => {
    if (!selectedApplication || !actionType) return;
    
    const status = actionType === "approve" ? "approved" : "rejected";
    
    // In a real app, this would update the application status in the database with the comment
    console.log(`Updating application ${selectedApplication.id} status to ${status} with comment: ${actionComment}`);
    try {
      alert(`Application ${selectedApplication.id} ${status} with comment: ${actionComment}`);
      // Here you would typically make an API call to update the status and save the comment
      setActionDialogOpen(false);
      setSelectedApplication(null);
      setActionComment("");
      setActionType(null);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const updateApplicationStatus = (appId: string, status: string) => {
    // In a real app, this would update the application status in the database
    console.log(`Updating application ${appId} status to ${status}`);
    try {
      alert(`Application ${appId} status updated to ${status}`);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-16 flex justify-center items-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Loading Admin Dashboard...</h2>
            <p className="text-muted-foreground">Please wait while we fetch your data.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-16 flex justify-center items-center">
          <div className="text-center">
            <ShieldAlert className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Dashboard</h2>
            <p className="text-muted-foreground mb-8">{error}</p>
            <div className="space-x-4">
              <Button onClick={() => window.location.reload()}>Try Again</Button>
              <Button variant="outline" asChild>
                <Link to="/admin/simple">Use Simple Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Welcome, {user?.name || "Administrator"} - Manage and review EIL scholarship applications
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button variant="outline" onClick={exportToExcel}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/simple">Simple View</Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Applications */}
          <div className="group rounded-2xl bg-white p-6 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -right-4 -top-10 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl"></div>
            <div className="absolute -left-10 bottom-0 w-24 h-24 bg-indigo-600/5 rounded-full blur-xl"></div>
            
            <div className="flex items-center mb-4">
              <div className="mr-4 w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-md shadow-blue-500/25">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">247</h3>
                <p className="text-sm font-medium text-slate-500">Total Applications</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center">
                <span className="flex h-6 w-6 rounded-full bg-blue-100 text-xs items-center justify-center mr-2">
                  <TrendingUp className="h-3 w-3 text-blue-600" />
                </span>
                <span className="text-sm font-semibold text-blue-600">+12 this week</span>
              </div>
              <span className="text-xs text-slate-500 font-medium border border-slate-200 rounded-full px-2 py-1 whitespace-nowrap">+5.2% growth</span>
            </div>
            
            <div className="flex items-center h-14 bg-slate-50 rounded-lg overflow-hidden p-2">
              <div className="h-full aspect-square rounded-md bg-blue-600 relative flex items-center justify-center text-white font-medium drop-shadow-md">
                M
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-400 rounded-full border-2 border-white"></span>
              </div>
              <div className="h-full aspect-square rounded-md bg-blue-500 -ml-2 relative flex items-center justify-center text-white font-medium drop-shadow-md">
                T
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-400 rounded-full border-2 border-white"></span>
              </div>
              <div className="h-full aspect-square rounded-md bg-blue-400 -ml-2 relative flex items-center justify-center text-white font-medium drop-shadow-md">
                W
              </div>
              <div className="h-full aspect-square rounded-md bg-slate-200 -ml-2 relative flex items-center justify-center text-slate-400 font-medium">
                T
              </div>
              <div className="h-full aspect-square rounded-md bg-slate-200 -ml-2 relative flex items-center justify-center text-slate-400 font-medium">
                F
              </div>
            </div>
          </div>
          
          {/* Pending Review */}
          <div className="group rounded-2xl bg-white p-6 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -right-4 -top-10 w-32 h-32 bg-amber-600/5 rounded-full blur-2xl"></div>
            <div className="absolute -left-10 bottom-0 w-24 h-24 bg-orange-600/5 rounded-full blur-xl"></div>
            
            <div className="flex items-center mb-4">
              <div className="mr-4 w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 shadow-md shadow-amber-500/25">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">43</h3>
                <p className="text-sm font-medium text-slate-500">Pending Review</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center">
                <span className="flex h-6 w-6 rounded-full bg-amber-100 text-xs items-center justify-center mr-2">
                  <TrendingUp className="h-3 w-3 text-amber-600" />
                </span>
                <span className="text-sm font-semibold text-amber-600">+5 today</span>
              </div>
              <span className="text-xs text-slate-500 font-medium border border-slate-200 rounded-full px-2 py-1">High priority</span>
            </div>
            
            <div className="flex space-x-1.5 items-center">
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-amber-100 to-amber-200 flex items-center justify-center">
                  <span className="text-amber-700 font-bold text-xs">18</span>
                </div>
                <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-semibold">!</span>
              </div>
              <div className="flex-1 pl-1">
                <div className="h-2 w-full bg-slate-100 rounded-full mb-1 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{width: "40%"}}></div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-700 font-medium">Need urgent review</span>
                  <span className="text-slate-400">18/43</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Approved */}
          <div className="group rounded-2xl bg-white p-6 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -right-4 -top-10 w-32 h-32 bg-green-600/5 rounded-full blur-2xl"></div>
            <div className="absolute -left-10 bottom-0 w-24 h-24 bg-emerald-600/5 rounded-full blur-xl"></div>
            
            <div className="flex items-center mb-4">
              <div className="mr-4 w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md shadow-emerald-500/25">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">156</h3>
                <p className="text-sm font-medium text-slate-500">Approved</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center">
                <span className="flex h-6 w-6 rounded-full bg-emerald-100 text-xs items-center justify-center mr-2">
                  <TrendingUp className="h-3 w-3 text-emerald-600" />
                </span>
                <span className="text-sm font-semibold text-emerald-600">+8 this week</span>
              </div>
              <span className="text-xs text-slate-500 font-medium border border-slate-200 rounded-full px-2 py-1">Goal: 200</span>
            </div>
            
            <div className="relative h-10">
              <div className="absolute inset-0 flex">
                {[
                  { color: 'bg-emerald-100', width: '20%' },
                  { color: 'bg-emerald-300', width: '30%' },
                  { color: 'bg-emerald-400', width: '15%' },
                  { color: 'bg-emerald-500', width: '10%' },
                  { color: 'bg-emerald-600', width: '25%' },
                ].map((segment, idx) => (
                  <div 
                    key={idx}
                    className={`${segment.color} h-2 rounded-full mx-0.5 first:ml-0 last:mr-0 drop-shadow-sm`} 
                    style={{width: segment.width}}
                  ></div>
                ))}
              </div>
              <div className="absolute bottom-0 inset-x-0 grid grid-cols-5 text-[10px] font-medium text-slate-500">
                <div>Jul</div>
                <div>Aug</div>
                <div>Sep</div>
                <div>Oct</div>
                <div className="text-right">Nov</div>
              </div>
            </div>
          </div>
          
          {/* Success Rate */}
          <div className="group rounded-2xl bg-white p-6 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -right-4 -top-10 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl"></div>
            <div className="absolute -left-10 bottom-0 w-24 h-24 bg-violet-600/5 rounded-full blur-xl"></div>
            
            <div className="flex items-center mb-4">
              <div className="mr-4 w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-md shadow-purple-500/25">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">73%</h3>
                <p className="text-sm font-medium text-slate-500">Success Rate</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center">
                <span className="flex h-6 w-6 rounded-full bg-violet-100 text-xs items-center justify-center mr-2">
                  <TrendingUp className="h-3 w-3 text-violet-600" />
                </span>
                <span className="text-sm font-semibold text-violet-600">+2% this month</span>
              </div>
              <span className="text-xs text-slate-500 font-medium border border-slate-200 rounded-full px-2 py-1">Target: 80%</span>
            </div>
            
            <div className="relative w-full h-16">
              <svg className="absolute inset-0" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle 
                  cx="50" cy="50" r="40" 
                  fill="none" 
                  stroke="#f1f5f9" 
                  strokeWidth="8"
                />
                
                {/* Progress circle with gradient */}
                <circle 
                  cx="50" cy="50" r="40"
                  fill="none" 
                  stroke="url(#success-gradient)"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset="67.82" // 251.2 * (1 - 0.73)
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="success-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                
                {/* Percentage text in middle */}
                <text 
                  x="50" y="50" 
                  textAnchor="middle" 
                  dy=".3em" 
                  className="text-lg font-bold"
                  fill="#6d28d9"
                >
                  73%
                </text>
              </svg>
              
              <div className="absolute right-0 top-1/4 text-xs">
                <div className="flex items-center space-x-1.5 mb-1">
                  <span className="h-3 w-3 rounded-full bg-violet-500"></span>
                  <span className="font-medium text-slate-700">Approved</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="h-3 w-3 rounded-full bg-slate-200"></span>
                  <span className="font-medium text-slate-400">Others</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Application Summary ({filteredApplications.length} applications)
            </CardTitle>
            <CardDescription>
              Detailed view of all scholarship applications with management
              options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application ID</TableHead>
                    <TableHead>Applicant Details</TableHead>
                    <TableHead>Engineering Field</TableHead>
                    <TableHead>Sports Type</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{app.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {app.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{app.engineeringField}</TableCell>
                      <TableCell>{app.SportsType}</TableCell>
                      <TableCell>{app.institution}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(app.status)}>
                          {getStatusIcon(app.status)}
                          <span className="ml-1 capitalize">
                            {app.status.replace("_", " ")}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => downloadApplicationForm(app.id)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Form (PDF)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => downloadDocuments(app.id)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Download Documents
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleActionClick(app, "approve")}
                              className="text-green-600"
                            >
                              <ThumbsUp className="h-4 w-4 mr-2" />
                              Approve Application
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleActionClick(app, "reject")}
                              className="text-red-600"
                            >
                              <ThumbsDown className="h-4 w-4 mr-2" />
                              Reject Application
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredApplications.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No applications found matching your search criteria.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Admin Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <UserCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{user?.name || "Admin User"}</div>
                  <div className="text-sm text-muted-foreground">{user?.email || "admin@example.com"}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Role</span>
                  <Badge>Administrator</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Last Login</span>
                  <span className="text-muted-foreground">Today</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Status</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Dialog for Approve/Reject with Comments */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve Application" : "Reject Application"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "Approve this scholarship application with comments for the candidate."
                : "Reject this scholarship application with feedback for the candidate."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Applicant</h4>
              <p className="text-sm">{selectedApplication?.name}</p>
              <p className="text-xs text-muted-foreground">{selectedApplication?.email}</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="comment">
                  {actionType === "approve" ? "Approval Comments" : "Rejection Reasons"}
                </Label>
                <Textarea
                  id="comment"
                  placeholder={
                    actionType === "approve"
                      ? "Add any comments or conditions for approval..."
                      : "Provide detailed reasons for rejection..."
                  }
                  value={actionComment}
                  onChange={(e) => setActionComment(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant={actionType === "approve" ? "default" : "destructive"}
              onClick={submitAction}
              disabled={!actionComment.trim()}
            >
              {actionType === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
