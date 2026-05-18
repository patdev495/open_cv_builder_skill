import type { CVSchema } from './types';

// 1. Initial Mock / Default CV Data
// ==========================================
export const DEFAULT_CV: CVSchema = {
  personalInfo: {
    fullName: "Nguyễn Văn A",
    title: "Senior Full Stack Engineer",
    email: "nguyenvana@gmail.com",
    phone: "0987.654.321",
    location: "Hà Nội, Việt Nam",
    website: "https://vana.dev",
    github: "https://github.com/nguyenvana",
    linkedin: "https://linkedin.com/in/nguyenvana"
  },
  summary: "Tôi là một kỹ sư phần mềm Full Stack với hơn 5 năm kinh nghiệm thiết kế và phát triển các hệ thống web quy mô lớn. Đam mê xây dựng các sản phẩm chất lượng cao, tối ưu hiệu năng và mang lại trải nghiệm người dùng tuyệt vời.",
  experience: [
    {
      id: "exp-1",
      company: "Công ty Cổ phần Công nghệ ABC",
      position: "Technical Lead",
      startDate: "2023-01",
      endDate: "Hiện tại",
      description: "Dẫn dắt đội ngũ 8 kỹ sư phát triển hệ thống quản lý nhân sự quy mô 10,000 nhân viên.\nTối ưu hóa truy vấn cơ sở dữ liệu giúp tăng 40% tốc độ tải trang.\nThiết kế kiến trúc microservices sử dụng Python (FastAPI) và Node.js."
    },
    {
      id: "exp-2",
      company: "Tập đoàn Giải pháp phần mềm XYZ",
      position: "Senior Full Stack Developer",
      startDate: "2021-03",
      endDate: "2022-12",
      description: "Phát triển giao diện người dùng sử dụng React và TypeScript.\nXây dựng hệ thống thanh toán tích hợp với cổng thanh toán Stripe và Paypal.\nViết unit tests và integration tests đạt mức độ bao phủ (coverage) 90%."
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "Đại học Bách Khoa Hà Nội",
      degree: "Kỹ sư Công nghệ thông tin",
      startDate: "2016-09",
      endDate: "2021-06",
      description: "Tốt nghiệp loại Giỏi. Điểm trung bình tích lũy: 3.6/4.0."
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "Hệ thống AI Tự động Tối ưu CV",
      role: "Người sáng lập & Kỹ sư chính",
      startDate: "2024-02",
      endDate: "2024-04",
      description: "Ứng dụng web phân tích nội dung CV của lập trình viên và đưa ra gợi ý tối ưu chuẩn ATS sử dụng GPT-4.",
      technologies: ["React", "TypeScript", "TailwindCSS", "FastAPI", "OpenAI"],
      url: "https://ai-cv-optimizer.dev"
    }
  ],
  skills: [
    {
      id: "skill-1",
      category: "Frontend",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"]
    },
    {
      id: "skill-2",
      category: "Backend & DB",
      skills: ["Python", "FastAPI", "Node.js", "PostgreSQL", "SQLite"]
    },
    {
      id: "skill-3",
      category: "DevOps & Tools",
      skills: ["Docker", "AWS", "Git/GitHub", "CI/CD"]
    }
  ],
  certificates: [
    {
      id: "cert-1",
      issuer: "Amazon Web Services (AWS)",
      name: "AWS Certified Solutions Architect – Associate",
      date: "2023-11"
    }
  ],
  languages: [
    {
      id: "lang-1",
      name: "Tiếng Việt",
      level: "Bản xứ"
    },
    {
      id: "lang-2",
      name: "Tiếng Anh",
      level: "Chuyên nghiệp (IELTS 7.5)"
    }
  ],
  themeColor: "indigo",
  fontFamily: "sans",
  layoutDensity: "normal",
  pageLayout: "multi"
};


// ==========================================
// 1.8. Design Mappings (Color & Font)
// ==========================================
export const COLOR_MAP = {
  indigo: {
    primary: "text-indigo-600 print:text-indigo-850",
    bg: "bg-indigo-600 print:bg-indigo-600",
    border: "border-indigo-600 print:border-indigo-850",
    lightBg: "bg-indigo-50/50 print:bg-indigo-50/50",
    pill: "bg-indigo-50 text-indigo-700 border-indigo-100 print:bg-indigo-50 print:text-indigo-700 print:border-indigo-100"
  },
  emerald: {
    primary: "text-emerald-600 print:text-emerald-850",
    bg: "bg-emerald-600 print:bg-emerald-600",
    border: "border-emerald-600 print:border-emerald-850",
    lightBg: "bg-emerald-50/50 print:bg-emerald-50/50",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-100 print:bg-emerald-50 print:text-emerald-700 print:border-emerald-100"
  },
  rose: {
    primary: "text-rose-600 print:text-rose-850",
    bg: "bg-rose-600 print:bg-rose-600",
    border: "border-rose-600 print:border-rose-850",
    lightBg: "bg-rose-50/50 print:bg-rose-50/50",
    pill: "bg-rose-50 text-rose-700 border-rose-100 print:bg-rose-50 print:text-rose-700 print:border-rose-100"
  },
  amber: {
    primary: "text-amber-600 print:text-amber-850",
    bg: "bg-amber-600 print:bg-amber-600",
    border: "border-amber-600 print:border-amber-850",
    lightBg: "bg-amber-50/50 print:bg-amber-50/50",
    pill: "bg-amber-50 text-amber-700 border-amber-100 print:bg-amber-50 print:text-amber-700 print:border-amber-100"
  },
  bronze: {
    primary: "text-amber-900 print:text-amber-950",
    bg: "bg-amber-800 print:bg-amber-850",
    border: "border-amber-800 print:border-amber-950",
    lightBg: "bg-amber-50/30 print:bg-amber-50/30",
    pill: "bg-amber-50 text-amber-900 border-amber-200 print:bg-amber-50 print:text-amber-900 print:border-amber-200"
  },
  slate: {
    primary: "text-slate-650 print:text-slate-800",
    bg: "bg-slate-650 print:bg-slate-750",
    border: "border-slate-650 print:border-slate-800",
    lightBg: "bg-slate-50 print:bg-slate-50",
    pill: "bg-slate-100 text-slate-700 border-slate-200 print:bg-slate-100 print:text-slate-700 print:border-slate-200"
  }
};

export const DENSITY_MAP = {
  compact: { paperPadding: "p-[10mm]", printMargin: "10mm" },
  normal: { paperPadding: "p-[15mm]", printMargin: "15mm" },
  comfortable: { paperPadding: "p-[20mm]", printMargin: "20mm" }
};

export const FONT_MAP = {
  inter: "font-inter",
  outfit: "font-outfit",
  lora: "font-lora",
  playfair: "font-playfair",
  jetbrains: "font-jetbrains",
  fira: "font-fira",
  // Fallbacks for older data
  sans: "font-inter",
  serif: "font-lora",
  mono: "font-fira"
};

// ==========================================
