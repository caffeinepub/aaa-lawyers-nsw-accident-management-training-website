import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Course {
    id: string;
    status: ContentStatus;
    title: string;
    description: string;
}
export interface Lesson {
    id: string;
    status: ContentStatus;
    title: string;
    content: string;
    pdfSource: Uint8Array;
    courseId: string;
}
export interface TraineeProgress {
    completedLessons: Array<string>;
    enrolledCourses: Array<string>;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum ContentStatus {
    published = "published",
    draft = "draft",
    archived = "archived"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    enrollInCourse(courseId: string): Promise<void>;
    /**
     * / * Content Retrieval (User Access Required)
     */
    getAllCourses(): Promise<Array<Course>>;
    /**
     * / * User Profile Management
     */
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCourse(id: string): Promise<Course>;
    getLesson(id: string): Promise<Lesson>;
    getLessonsByCourse(courseId: string): Promise<Array<Lesson>>;
    getTraineeProgress(): Promise<TraineeProgress>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    /**
     * / * PDF Import (Admin Only)
     */
    importPdf(pdfContent: Uint8Array): Promise<string>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / * Progress Tracking (User Only)
     */
    markLessonCompleted(lessonId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    /**
     * / * Course and Lesson Management (Admin Only)
     */
    saveCourse(course: Course): Promise<void>;
    saveLesson(lesson: Lesson): Promise<void>;
    /**
     * / * Content Status Management (Admin Only)
     */
    setContentStatus(contentId: string, status: ContentStatus, isCourse: boolean): Promise<void>;
    updateCourse(course: Course): Promise<void>;
    updateLesson(lesson: Lesson): Promise<void>;
}
