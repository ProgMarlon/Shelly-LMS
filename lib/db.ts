import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const USER_FILE = path.join(DATA_DIR, "user.json");
const COURSES_FILE = path.join(DATA_DIR, "courses.json");

// Ensure data dir exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Data
const INITIAL_USER = {
    id: "02000464692",
    name: "LEGNES, ROCHELLE KIM CUARTES",
    email: "rochelle.legnes@student.sti.edu", // Generated email based on name
    role: "student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rochelle&backgroundColor=ffdfbf",
    program: "BSTM",
    year: 1,
    section: "BSTM1.1A-2501"
};

const INITIAL_COURSES = [
    {
        id: "c1",
        code: "TPC 102",
        title: "Risk Management as Applied to Safety, Security, and Sanitation",
        instructor: "TBA",
        schedule: "MW 7:00AM - 8:30AM",
        room: "401",
        units: 3.0,
        progress: 0,
        materials: []
    },
    {
        id: "c2",
        code: "GE 101", // Assuming code based on standard curriculum or leaving generic
        title: "Readings in Philippine History",
        instructor: "TBA",
        schedule: "MW 8:30AM - 10:00AM",
        room: "401",
        units: 3.0,
        progress: 0,
        materials: []
    },
    {
        id: "c3",
        code: "MATH 101",
        title: "Mathematics in the Modern World",
        instructor: "TBA",
        schedule: "MW 10:00AM - 11:30AM",
        room: "401",
        units: 3.0,
        progress: 0,
        materials: []
    },
    {
        id: "c4",
        code: "TPC 101",
        title: "Macro Perspective of Tourism and Hospitality",
        instructor: "TBA",
        schedule: "MW 12:00PM - 1:30PM",
        room: "401",
        units: 3.0,
        progress: 0,
        materials: []
    },
    {
        id: "c5",
        code: "GE 102",
        title: "Understanding the Self",
        instructor: "TBA",
        schedule: "MW 1:30PM - 3:00PM",
        room: "401",
        units: 3.0,
        progress: 0,
        materials: []
    },
    {
        id: "c6",
        code: "NSTP 1",
        title: "National Service Training Program 1",
        instructor: "TBA",
        schedule: "Th 12:00PM - 3:00PM",
        room: "Mezz 101",
        units: 3.0,
        progress: 0,
        materials: []
    },
    {
        id: "c7",
        code: "PE 1",
        title: "P.E./PATHFIT 1: Movement Competency Training",
        instructor: "TBA",
        schedule: "Th 3:00PM - 5:00PM",
        room: "Mezz 101",
        units: 2.0,
        progress: 0,
        materials: []
    },
    {
        id: "c8",
        code: "AUTH 1",
        title: "Authenics 1",
        instructor: "TBA",
        schedule: "Th 5:00PM - 6:00PM",
        room: "Mezz 101",
        units: 1.0,
        progress: 0,
        materials: []
    }
];

export const db = {
    getUser: () => {
        if (!fs.existsSync(USER_FILE)) {
            fs.writeFileSync(USER_FILE, JSON.stringify(INITIAL_USER, null, 2));
        }
        return JSON.parse(fs.readFileSync(USER_FILE, "utf-8"));
    },
    updateUser: (data: any) => {
        const current = db.getUser();
        const updated = { ...current, ...data };
        fs.writeFileSync(USER_FILE, JSON.stringify(updated, null, 2));
        return updated;
    },
    getCourses: () => {
        if (!fs.existsSync(COURSES_FILE)) {
            fs.writeFileSync(COURSES_FILE, JSON.stringify(INITIAL_COURSES, null, 2));
        }
        return JSON.parse(fs.readFileSync(COURSES_FILE, "utf-8"));
    },
    updateCourse: (courseId: string, data: any) => {
        const courses = db.getCourses();
        const index = courses.findIndex((c: any) => c.id === courseId);
        if (index !== -1) {
            courses[index] = { ...courses[index], ...data };
            fs.writeFileSync(COURSES_FILE, JSON.stringify(courses, null, 2));
            return courses[index];
        }
        return null;
    },
    addMaterial: (courseId: string, material: any) => {
        const courses = db.getCourses();
        const course = courses.find((c: any) => c.id === courseId);
        if (course) {
            if (!course.materials) course.materials = [];
            course.materials.push(material);
            fs.writeFileSync(COURSES_FILE, JSON.stringify(courses, null, 2));
            return course;
        }
        return null;
    },
    addQuiz: (courseId: string, quiz: any) => {
        const courses = db.getCourses();
        const course = courses.find((c: any) => c.id === courseId);
        if (course) {
            if (!course.quizzes) course.quizzes = [];
            course.quizzes.push(quiz);
            fs.writeFileSync(COURSES_FILE, JSON.stringify(courses, null, 2));
            return course;
        }
        return null;
    },
    saveQuizResult: (courseId: string, quizId: string, score: number) => {
        const courses = db.getCourses();
        const course = courses.find((c: any) => c.id === courseId);
        if (course && course.quizzes) {
            const quiz = course.quizzes.find((q: any) => q.id === quizId);
            if (quiz) {
                quiz.lastScore = score;
                quiz.takenDate = new Date().toISOString();
                fs.writeFileSync(COURSES_FILE, JSON.stringify(courses, null, 2));
                return quiz;
            }
        }
        return null;
    }
};
