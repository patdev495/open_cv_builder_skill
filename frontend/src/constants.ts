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
  pageLayout: "single"
};


// ==========================================
// 1.5. Localization Dictionary (Bilingual support)
// ==========================================
export const TRANSLATIONS = {
  vi: {
    title: "CV BUILDER PRO",
    subtitle: "AI-READY SKILL",
    editCV: "Chỉnh sửa CV này",
    viewPublic: "Xem chế độ công khai",
    exportPDF: "Xuất file PDF",
    newCV: "Tạo CV mới",
    configPublish: "ĐỊNH CẤU HÌNH & XUẤT BẢN",
    slug: "Đường dẫn (Slug)",
    passcode: "Mật mã (Passcode)",
    template: "Mẫu thiết kế (Template)",
    saveAndPublish: "Đăng ký & Xuất bản CV",
    updateCV: "Cập nhật thay đổi CV",
    modern: "Thanh lịch",
    classic: "Cổ điển",
    creative: "Công nghệ",
    executive: "Doanh nhân Elite",
    minimal: "Tối giản Serif",
    personalInfo: "Liên hệ",
    summary: "Giới thiệu",
    experience: "Kinh nghiệm",
    education: "Học vấn",
    projects: "Dự án",
    skills: "Kỹ năng",
    languages: "Ngoại ngữ & Khác",
    fullName: "Họ và Tên",
    jobTitle: "Vị trí ứng tuyển / Chức danh",
    email: "Email",
    phone: "Số điện thoại",
    location: "Địa chỉ",
    website: "Website cá nhân",
    github: "GitHub URL",
    linkedin: "LinkedIn URL",
    summaryTitle: "Tóm tắt tiểu sử bản thân",
    summaryDesc: "Viết 2-3 câu giới thiệu súc tích về kỹ năng, kinh nghiệm nổi bật nhất của bạn.",
    summaryPlaceholder: "Tôi là một kỹ sư phần mềm...",
    experienceTitle: "Kinh nghiệm làm việc",
    addExperience: "Thêm công việc",
    emptyExperience: "Chưa có thông tin kinh nghiệm làm việc.",
    companyLabel: "Tên Công ty",
    positionLabel: "Vị trí / Chức danh",
    startDateLabel: "Thời gian Bắt đầu",
    endDateLabel: "Thời gian Kết thúc",
    descLabel: "Mô tả công việc (gạch đầu dòng)",
    companyPlaceholder: "Tập đoàn ABC",
    positionPlaceholder: "Technical Lead",
    datePlaceholder: "2022-01 hoặc Hiện tại",
    educationTitle: "Học vấn",
    addEducation: "Thêm học vấn",
    emptyEducation: "Chưa có thông tin học vấn.",
    schoolLabel: "Tên trường học / Tổ chức",
    degreeLabel: "Bằng cấp / Ngành học",
    schoolPlaceholder: "Đại học Bách Khoa",
    degreePlaceholder: "Kỹ sư Công nghệ thông tin",
    projectsTitle: "Dự án tiêu biểu",
    addProject: "Thêm dự án",
    emptyProjects: "Chưa có thông tin dự án.",
    projectNameLabel: "Tên Dự án",
    roleLabel: "Vai trò / Vị trí",
    techLabel: "Công nghệ sử dụng (Phân tách bằng dấu phẩy)",
    urlLabel: "Đường dẫn Dự án (URL)",
    skillsTitle: "Kỹ năng chuyên môn",
    addSkillGroup: "Thêm nhóm kỹ năng",
    emptySkills: "Chưa có thông tin kỹ năng.",
    skillCatLabel: "Tên Nhóm kỹ năng",
    skillListLabel: "Danh sách kỹ năng (Phân tách bằng dấu phẩy)",
    extraTitle: "Chứng chỉ & Ngoại ngữ",
    certTitle: "Chứng chỉ & Giải thưởng",
    addCert: "Thêm chứng chỉ",
    emptyCert: "Chưa có thông tin chứng chỉ.",
    certNameLabel: "Tên Chứng chỉ",
    issuerLabel: "Tổ chức cấp",
    dateLabel: "Thời gian cấp / Năm",
    langTitle: "Ngoại ngữ",
    addLang: "Thêm ngoại ngữ",
    emptyLang: "Chưa có thông tin ngoại ngữ.",
    langNameLabel: "Tên Ngoại ngữ",
    langLevelLabel: "Trình độ (Level)",
    langPlaceholder: "Tiếng Anh, Tiếng Nhật...",
    langLevelPlaceholder: "Bản xứ, IELTS 7.5...",
    unlockTitle: "Nhập mật mã để chỉnh sửa CV",
    verify: "Xác thực",
    cancel: "Hủy bỏ",
    loading: "Đang xử lý...",
    modeEdit: "Biên tập",
    modeView: "Chỉ xem",
    placeholderSlug: "vi-du-pat",
    errorNoSlug: "Vui lòng cung cấp đường dẫn (Slug) mong muốn.",
    errorNoPasscode: "Vui lòng nhập Mật mã để bảo vệ quyền chỉnh sửa CV này.",
    successUpdate: "Cập nhật CV thành công!",
    successPublish: "Đã xuất bản CV thành công tại địa chỉ: /",
    errorPasscodeRequired: "Vui lòng cung cấp mật mã.",
    successAuth: "Xác thực thành công. Bạn đã vào chế độ chỉnh sửa!",
    errorAuthIncorrect: "Mật mã chỉnh sửa không chính xác.",
    errorAuthFailed: "Lỗi xác thực.",
    notExistYet: "chưa có dữ liệu. Bạn có thể thiết kế CV dưới đây và lưu để đăng ký đường dẫn này!",
    present: "Hiện tại",
    native: "Bản xứ",
    experienceUpper: "KINH NGHIỆM LÀM VIỆC",
    educationUpper: "HỌC VẤN",
    projectsUpper: "DỰ ÁN TIÊU BIỂU",
    skillsUpper: "KỸ NĂNG CHUYÊN MÔN",
    certificatesUpper: "CHỨNG CHỈ",
    languagesUpper: "NGOẠI NGỮ",
    summaryUpper: "GIỚI THIỆU BẢN THÂN",
    pubViewMode: "Bạn đang ở Chế độ Xem Công khai",
    pubViewDesc: "CV này được xác thực và bảo vệ an toàn.",
    unlockBtn: "Mở khóa biên tập",
    uploadPhoto: "Tải ảnh đại diện",
    avatarPhoto: "Ảnh chân dung",
    deletePhoto: "Xóa ảnh đại diện",
    clearCV: "Làm trống CV",
    confirmClear: "Bạn có chắc chắn muốn xóa toàn bộ nội dung CV để bắt đầu viết mới từ đầu không?",
    printTipTitle: "💡 Mẹo in PDF hoàn hảo:",
    printTipStep1: "1. Chọn \"Cài đặt khác\" (More settings)",
    printTipStep2: "2. Tích chọn \"Đồ họa nền\" (Background graphics)",
    printTipStep3: "3. Bỏ chọn \"Tiêu đề và chân trang\""
  },
  en: {
    title: "CV BUILDER PRO",
    subtitle: "AI-READY SKILL",
    editCV: "Edit this CV",
    viewPublic: "View Public Mode",
    exportPDF: "Export PDF",
    newCV: "Create New CV",
    configPublish: "CONFIGURATION & PUBLISH",
    slug: "Custom Path (Slug)",
    passcode: "Passcode",
    template: "Template Style",
    saveAndPublish: "Register & Publish CV",
    updateCV: "Update CV Content",
    modern: "Modern Minimalist",
    classic: "Classic Executive",
    creative: "Creative Tech",
    personalInfo: "Contact",
    summary: "Summary",
    experience: "Experience",
    education: "Education",
    projects: "Projects",
    skills: "Skills",
    languages: "Languages & Extra",
    fullName: "Full Name",
    jobTitle: "Job Title / Position",
    email: "Email",
    phone: "Phone Number",
    location: "Location",
    website: "Personal Website",
    github: "GitHub URL",
    linkedin: "LinkedIn URL",
    summaryTitle: "Professional Summary",
    summaryDesc: "Write 2-3 concise sentences detailing your key professional skills and experiences.",
    summaryPlaceholder: "I am a software engineer...",
    experienceTitle: "Work Experience",
    addExperience: "Add Job",
    emptyExperience: "No work experience added yet.",
    companyLabel: "Company Name",
    positionLabel: "Job Position / Title",
    startDateLabel: "Start Date",
    endDateLabel: "End Date",
    descLabel: "Job Description (bullet points)",
    companyPlaceholder: "ABC Corporation",
    positionPlaceholder: "Technical Lead",
    datePlaceholder: "2022-01 or Present",
    educationTitle: "Education History",
    addEducation: "Add Education",
    emptyEducation: "No education history added yet.",
    schoolLabel: "Institution / School Name",
    degreeLabel: "Degree / Field of Study",
    schoolPlaceholder: "MIT University",
    degreePlaceholder: "Bachelor of Science in CS",
    projectsTitle: "Key Projects",
    addProject: "Add Project",
    emptyProjects: "No projects added yet.",
    projectNameLabel: "Project Name",
    roleLabel: "Role / Position",
    techLabel: "Technologies Used (separated by commas)",
    urlLabel: "Project Link / URL",
    skillsTitle: "Technical Skills",
    addSkillGroup: "Add Skill Group",
    emptySkills: "No technical skills added yet.",
    skillCatLabel: "Skill Category Name",
    skillListLabel: "List of Skills (separated by commas)",
    extraTitle: "Certifications & Languages",
    certTitle: "Certifications & Awards",
    addCert: "Add Certificate",
    emptyCert: "No certifications added yet.",
    certNameLabel: "Certificate Title",
    issuerLabel: "Issued By",
    dateLabel: "Issue Date / Year",
    langTitle: "Languages",
    addLang: "Add Language",
    emptyLang: "No languages added yet.",
    langNameLabel: "Language Name",
    langLevelLabel: "Proficiency Level",
    langPlaceholder: "English, Japanese...",
    langLevelPlaceholder: "Native, Professional...",
    unlockTitle: "Enter passcode to unlock editing",
    verify: "Verify",
    cancel: "Cancel",
    loading: "Processing...",
    modeEdit: "Editing",
    modeView: "Read-only",
    placeholderSlug: "example-slug",
    errorNoSlug: "Please provide your desired custom path (Slug).",
    errorNoPasscode: "Please enter a Passcode to protect editing rights.",
    successUpdate: "CV updated successfully!",
    successPublish: "CV published successfully at: /",
    errorPasscodeRequired: "Passcode is required.",
    successAuth: "Authentication successful. Editing mode unlocked!",
    errorAuthIncorrect: "Incorrect passcode.",
    errorAuthFailed: "Authentication error.",
    notExistYet: "does not exist yet. Design your CV below and save to register this path!",
    present: "Present",
    native: "Native",
    experienceUpper: "WORK EXPERIENCE",
    educationUpper: "EDUCATION HISTORY",
    projectsUpper: "KEY PROJECTS",
    skillsUpper: "TECHNICAL SKILLS",
    certificatesUpper: "CERTIFICATIONS",
    languagesUpper: "LANGUAGES",
    summaryUpper: "PROFESSIONAL SUMMARY",
    pubViewMode: "You are currently in Public View Mode",
    pubViewDesc: "This CV is securely protected.",
    unlockBtn: "Unlock Editor",
    executive: "Executive Elite",
    minimal: "Minimal Serif",
    uploadPhoto: "Upload Avatar",
    avatarPhoto: "Avatar Photo",
    deletePhoto: "Delete Photo",
    clearCV: "Clear CV",
    confirmClear: "Are you sure you want to clear all CV content to start writing from scratch?",
    printTipTitle: "💡 Perfect PDF Print Tip:",
    printTipStep1: "1. Click \"More settings\" in print dialog",
    printTipStep2: "2. Check \"Background graphics\" checkbox",
    printTipStep3: "3. Uncheck \"Headers and footers\" checkbox"
  }
};

// ==========================================
// 1.8. Design Mappings (Color & Font)
// ==========================================
export const COLOR_MAP = {
  indigo: {
    primary: "text-indigo-600 print:text-indigo-800",
    bg: "bg-indigo-600 print:bg-indigo-600",
    border: "border-indigo-600 print:border-indigo-800",
    lightBg: "bg-indigo-50/50 print:bg-slate-50",
    pill: "bg-indigo-50 text-indigo-700 border-indigo-100 print:bg-slate-50 print:text-black print:border-slate-350"
  },
  emerald: {
    primary: "text-emerald-600 print:text-emerald-800",
    bg: "bg-emerald-600 print:bg-emerald-600",
    border: "border-emerald-600 print:border-emerald-800",
    lightBg: "bg-emerald-50/50 print:bg-slate-50",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-100 print:bg-slate-50 print:text-black print:border-slate-350"
  },
  rose: {
    primary: "text-rose-600 print:text-rose-800",
    bg: "bg-rose-600 print:bg-rose-600",
    border: "border-rose-600 print:border-rose-800",
    lightBg: "bg-rose-50/50 print:bg-slate-50",
    pill: "bg-rose-50 text-rose-700 border-rose-100 print:bg-slate-50 print:text-black print:border-slate-350"
  },
  amber: {
    primary: "text-amber-600 print:text-amber-800",
    bg: "bg-amber-600 print:bg-amber-600",
    border: "border-amber-600 print:border-amber-800",
    lightBg: "bg-amber-50/50 print:bg-slate-50",
    pill: "bg-amber-50 text-amber-700 border-amber-100 print:bg-slate-50 print:text-black print:border-slate-350"
  },
  bronze: {
    primary: "text-amber-900 print:text-amber-950",
    bg: "bg-amber-800 print:bg-amber-850",
    border: "border-amber-800 print:border-amber-950",
    lightBg: "bg-amber-50/30 print:bg-slate-50",
    pill: "bg-amber-50 text-amber-900 border-amber-200 print:bg-slate-50 print:text-black print:border-slate-350"
  },
  slate: {
    primary: "text-slate-650 print:text-slate-800",
    bg: "bg-slate-650 print:bg-slate-750",
    border: "border-slate-650 print:border-slate-800",
    lightBg: "bg-slate-50 print:bg-slate-100",
    pill: "bg-slate-100 text-slate-700 border-slate-200 print:bg-slate-50 print:text-black print:border-slate-350"
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
