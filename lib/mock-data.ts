// Simulation of a database

export const USERS = [
    {
        id: "u1",
        name: "Shelly",
        email: "shelly@student.sti.edu",
        role: "student",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shelly&backgroundColor=ffdfbf",
        program: "BS Tourism Management",
        year: 1
    },
    {
        id: "admin1",
        name: "Admin User",
        email: "admin@sti.edu",
        role: "admin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
        program: "N/A",
        year: 0
    }
];

export const COURSES = [
    {
        id: "c1",
        code: "TPC 101",
        title: "Macro Perspective of Tourism",
        instructor: "Ms. Reyes",
        schedule: "Mon/Wed 10:00 AM",
        progress: 65,
        modules: [
            { id: "m1", title: "Introduction to Tourism", type: "video", duration: "15 min" },
            { id: "m2", title: "History of Hospitality", type: "pdf", duration: "20 pages" },
            { id: "m3", title: "Quiz 1: Basics", type: "quiz", duration: "30 min", status: "completed", score: "18/20" }
        ]
    },
    {
        id: "c2",
        code: "TPC 102",
        title: "Risk Management as Applied to Safety",
        instructor: "Mr. Santos",
        schedule: "Tue/Thu 1:00 PM",
        progress: 30,
        modules: [
            { id: "m1", title: "Safety Protocols", type: "video", duration: "25 min" },
            { id: "m2", title: "Risk Assessment", type: "assignment", duration: "Due Friday", status: "pending" }
        ]
    },
    {
        id: "c3",
        code: "TPC 103",
        title: "Multicultural Diversity in Workplace",
        instructor: "Dr. Lim",
        schedule: "Fri 9:00 AM",
        progress: 10,
        modules: []
    },
    {
        id: "c4",
        code: "TPC 104",
        title: "Tourism & Hospitality Marketing",
        instructor: "Ms. Garcia",
        schedule: "Wed 3:00 PM",
        progress: 0,
        modules: []
    }
];

export const NOTIFICATIONS = [
    { id: 1, text: "Assignment due in Risk Management", time: "2 hours ago" },
    { id: 2, text: "New module posted in TPC 101", time: "5 hours ago" },
    { id: 3, text: "Welcome to the new semester!", time: "1 day ago" }
];
