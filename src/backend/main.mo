import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Blob "mo:core/Blob";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  /**
   * Type declarations
   */
  public type UserProfile = {
    name : Text;
    email : Text;
  };

  public type ContentStatus = { #draft; #published; #archived };

  public type Lesson = {
    id : Text;
    title : Text;
    content : Text;
    pdfSource : Blob;
    status : ContentStatus;
    courseId : Text;
  };

  public type Course = {
    id : Text;
    title : Text;
    description : Text;
    status : ContentStatus;
  };

  public type TraineeProgress = {
    completedLessons : [Text];
    enrolledCourses : [Text];
  };

  /**
   * Persistent state
   */
  let userProfiles = Map.empty<Principal, UserProfile>();
  let lessons = Map.empty<Text, Lesson>();
  let courses = Map.empty<Text, Course>();
  let traineeProgress = Map.empty<Principal, TraineeProgress>();

  /**
   * User Profile Management
   */
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  /**
   * Course and Lesson Management (Admin Only)
   */
  public shared ({ caller }) func saveCourse(course : Course) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can save courses");
    };
    if (courses.containsKey(course.id)) {
      Runtime.trap("Course with this ID already exists");
    };
    courses.add(course.id, course);
  };

  public shared ({ caller }) func updateCourse(course : Course) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update courses");
    };
    if (not courses.containsKey(course.id)) {
      Runtime.trap("Course not found");
    };
    courses.add(course.id, course);
  };

  public shared ({ caller }) func saveLesson(lesson : Lesson) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can save lessons");
    };
    if (lessons.containsKey(lesson.id)) {
      Runtime.trap("Lesson with this ID already exists");
    };
    lessons.add(lesson.id, lesson);
  };

  public shared ({ caller }) func updateLesson(lesson : Lesson) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update lessons");
    };
    if (not lessons.containsKey(lesson.id)) {
      Runtime.trap("Lesson not found");
    };
    lessons.add(lesson.id, lesson);
  };

  /**
   * Content Retrieval (User Access Required)
   */
  public query ({ caller }) func getAllCourses() : async [Course] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view courses");
    };
    let coursesArray = courses.values().toArray();
    coursesArray.sort(func(a, b) { Text.compare(a.title, b.title) });
  };

  public query ({ caller }) func getCourse(id : Text) : async Course {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view courses");
    };
    switch (courses.get(id)) {
      case (null) { Runtime.trap("Course not found") };
      case (?course) { course };
    };
  };

  public query ({ caller }) func getLesson(id : Text) : async Lesson {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view lessons");
    };
    switch (lessons.get(id)) {
      case (null) { Runtime.trap("Lesson not found") };
      case (?lesson) { lesson };
    };
  };

  public query ({ caller }) func getLessonsByCourse(courseId : Text) : async [Lesson] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view lessons");
    };
    lessons.values().toArray().filter(func(lesson) { lesson.courseId == courseId });
  };

  /**
   * Progress Tracking (User Only)
   */
  public shared ({ caller }) func markLessonCompleted(lessonId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can complete lessons");
    };
    switch (lessons.get(lessonId)) {
      case (null) { Runtime.trap("Lesson does not exist") };
      case (?_) {
        let progress = switch (traineeProgress.get(caller)) {
          case (null) {
            {
              completedLessons = [];
              enrolledCourses = [];
            };
          };
          case (?existing) { existing };
        };
        let alreadyCompleted = progress.completedLessons.find(func(id) { id == lessonId });
        if (alreadyCompleted == null) {
          let updatedProgress = {
            completedLessons = [lessonId].concat(progress.completedLessons);
            enrolledCourses = progress.enrolledCourses;
          };
          traineeProgress.add(caller, updatedProgress);
        };
      };
    };
  };

  public shared ({ caller }) func enrollInCourse(courseId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can enroll in courses");
    };
    switch (courses.get(courseId)) {
      case (null) { Runtime.trap("Course does not exist") };
      case (?_) {
        let progress = switch (traineeProgress.get(caller)) {
          case (null) {
            {
              completedLessons = [];
              enrolledCourses = [];
            };
          };
          case (?existing) { existing };
        };
        let alreadyEnrolled = progress.enrolledCourses.find(func(id) { id == courseId });
        if (alreadyEnrolled == null) {
          let updatedProgress = {
            completedLessons = progress.completedLessons;
            enrolledCourses = [courseId].concat(progress.enrolledCourses);
          };
          traineeProgress.add(caller, updatedProgress);
        };
      };
    };
  };

  public query ({ caller }) func getTraineeProgress() : async TraineeProgress {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view progress");
    };
    switch (traineeProgress.get(caller)) {
      case (null) {
        {
          completedLessons = [];
          enrolledCourses = [];
        };
      };
      case (?progress) { progress };
    };
  };

  /**
   * PDF Import (Admin Only)
   */
  public shared ({ caller }) func importPdf(pdfContent : Blob) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can import PDF");
    };
    let courseId = "PDF_IMPORT";
    let course : Course = {
      id = courseId;
      title = "PDF Import";
      description = "Imported PDF content";
      status = #draft;
    };
    courses.add(courseId, course);
    let lessonId = "PDF_LESSON";
    let lesson : Lesson = {
      id = lessonId;
      title = "PDF Lesson";
      content = "Content derived from PDF";
      pdfSource = pdfContent;
      status = #draft;
      courseId;
    };
    lessons.add(lessonId, lesson);
    courseId;
  };

  /**
   * Content Status Management (Admin Only)
   */
  public shared ({ caller }) func setContentStatus(contentId : Text, status : ContentStatus, isCourse : Bool) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can set content status");
    };
    if (isCourse) {
      switch (courses.get(contentId)) {
        case (null) { Runtime.trap("Course not found") };
        case (?course) {
          let updatedCourse = {
            id = course.id;
            title = course.title;
            description = course.description;
            status = status;
          };
          courses.add(contentId, updatedCourse);
        };
      };
    } else {
      switch (lessons.get(contentId)) {
        case (null) { Runtime.trap("Lesson not found") };
        case (?lesson) {
          let updatedLesson = {
            id = lesson.id;
            title = lesson.title;
            content = lesson.content;
            pdfSource = lesson.pdfSource;
            status = status;
            courseId = lesson.courseId;
          };
          lessons.add(contentId, updatedLesson);
        };
      };
    };
  };
};
