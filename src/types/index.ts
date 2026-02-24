export type Subject = {
  id: number;
  name: string;
  code: string;
  description: string;
  department: string;
  createdAt?: string;
};

export type ListResponse<T = unknown> = {
  data?: T[];
  subjects?: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateResponse<T = unknown> = {
  data?: T;
};

export type GetOneResponse<T = unknown> = {
  data?: T;
};

declare global {
  interface CloudinaryUploadWidgetResults {
    event: string;
    info: {
      secure_url: string;
      public_id: string;
      delete_token?: string;
      resource_type: string;
      original_filename: string;
      format?: string;
      bytes?: number;
      type?: string;
    };
  }

  interface CloudinaryWidget {
    open: () => void;
  }

  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (
          error: unknown,
          result: CloudinaryUploadWidgetResults,
        ) => void,
      ) => CloudinaryWidget;
    };
  }
}

export interface UploadWidgetValue {
  url: string;
  publicId: string;
  sizeBytes?: number;
  mimeType?: string;
}

export interface UploadWidgetProps {
  value?: UploadWidgetValue | null;
  onChange?: (value: UploadWidgetValue | null) => void;
  disabled?: boolean;
}

export enum UserRole {
  STUDENT = "student",
  TEACHER = "teacher",
  ADMIN = "admin",
}

export type User = {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
  imageCldPubId?: string;
  department?: string;
};

export type Schedule = {
  day: string;
  startTime: string;
  endTime: string;
};

export type Department = {
  id: number;
  name: string;
  description: string;
};

export type ClassDetails = {
  id: number;
  name: string;
  description: string;
  status: "active" | "inactive";
  capacity: number;
  courseCode: string;
  courseName: string;
  bannerUrl?: string;
  bannerCldPubId?: string;
  subject?: Subject;
  teacher?: User;
  department?: Department;
  schedules: Schedule[];
  inviteCode?: string;
  isEnrolled?: boolean;
  totalEnrollments?: number;
  totalLectures?: number;
};

export type SignUpPayload = {
  email: string;
  name: string;
  password: string;
  image?: string;
  imageCldPubId?: string;
  role: UserRole;
};

export interface EnrollmentRow {
  id: number;
  studentId: string;
  classId: number;
  student: {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
  };
  class: {
    id: number;
    subjectId: number;
    teacherId: string;
    inviteCode: string;
    name: string;
    bannerCldPubId?: string | null;
    bannerUrl?: string | null;
    description: string;
    capacity: number;
    status: string;
    schedules: any[];
    createdAt: string;
    updatedAt: string;
  };
  subject: {
    id: number;
    departmentId: number;
    name: string;
    code: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  department: {
    id: number;
    code: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  teacher: {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
  };
}

export interface LectureContent {
  id: number;
  lectureId: number;
  type: "video" | "image" | "document";
  title: string;
  url: string;
  cldPubId: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lecture {
  id: number;
  title: string;
  description: string | null;
  order: number;
  isPublished: boolean;
  classId: number;
  createdAt: string;
  updatedAt: string;
  totalContents: number;
  videoCount: number;
  imageCount: number;
  documentCount: number;
  contents: LectureContent[];
}
