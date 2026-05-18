import React, { useState, useEffect } from 'react';
import { 
  FileText, Save, Edit3, Eye, Printer, Lock, Globe, Plus, Trash2, 
  Sparkles, User, Briefcase, GraduationCap, FolderGit2, 
  Wrench, Award, Languages, Loader2, AlertCircle, CheckCircle2,
  Camera
} from 'lucide-react';
import type { CVSchema, ExperienceItem, EducationItem, ProjectItem, SkillGroup, CertificateItem, LanguageItem } from './types';
import * as api from './services/api';

// ==========================================
// 1. Initial Mock / Default CV Data
// ==========================================
const DEFAULT_CV: CVSchema = {
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
  fontFamily: "sans"
};


// ==========================================
// 1.5. Localization Dictionary (Bilingual support)
// ==========================================
const TRANSLATIONS = {
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
const COLOR_MAP = {
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

const FONT_MAP = {
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
// 2. React main App component
// ==========================================
function App() {
  // Routing state parsed from URL path (e.g. /pat -> slug is "pat")
  const [slug, setSlug] = useState<string>("");
  
  const [language, setLanguageState] = useState<'vi' | 'en'>(() => {
    const saved = localStorage.getItem('cv_builder_lang');
    return (saved === 'en' || saved === 'vi') ? saved : 'vi';
  });

  const setLanguage = (lang: 'vi' | 'en') => {
    localStorage.setItem('cv_builder_lang', lang);
    setLanguageState(lang);
  };

  const t = (key: keyof typeof TRANSLATIONS.vi) => {
    return TRANSLATIONS[language][key] || TRANSLATIONS.vi[key];
  };
  const [isEditMode, setIsEditMode] = useState<boolean>(true);
  const [isViewOnly, setIsViewOnly] = useState<boolean>(false); // When viewing someone else's public CV

  // CV data & settings state
  const [cvData, setCvData] = useState<CVSchema>(DEFAULT_CV);
  const [template, setTemplate] = useState<string>("modern");
  
  const handleTemplateChange = (tempId: string) => {
    setTemplate(tempId);
    
    // Smart default typography mapped to template
    let defaultFont = 'inter';
    if (tempId === 'modern') defaultFont = 'inter';
    else if (tempId === 'classic') defaultFont = 'lora';
    else if (tempId === 'creative') defaultFont = 'fira';
    else if (tempId === 'executive') defaultFont = 'outfit';
    else if (tempId === 'minimal') defaultFont = 'playfair';
    
    setCvData(prev => ({
      ...prev,
      fontFamily: defaultFont
    }));
  };

  const [passcode, setPasscode] = useState<string>("");
  const [inputSlug, setInputSlug] = useState<string>(""); // Used when creating a new CV

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<string>("personal");
  
  // Passcode verification modal state
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [verifyPasscodeVal, setVerifyPasscodeVal] = useState<string>("");
  const [verifyError, setVerifyError] = useState<string>("");

  // Parse path on component mount (Custom Client-side Routing)
  useEffect(() => {
    const path = window.location.pathname.substring(1).trim().toLowerCase();
    if (path) {
      setSlug(path);
      setInputSlug(path);
      loadCVFromServer(path);
    } else {
      // Creator Mode at root URL (/)
      setIsEditMode(true);
      setIsViewOnly(false);
    }
  }, []);

  // Fetch CV from backend
  const loadCVFromServer = async (targetSlug: string) => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const data = await api.fetchCV(targetSlug);
      // Re-hydrate array items with temporary client-side IDs
      const hydratedData: CVSchema = {
        ...data.cv_data,
        experience: data.cv_data.experience?.map((x, i) => ({ ...x, id: x.id || `exp-${i}-${Date.now()}` })) || [],
        education: data.cv_data.education?.map((x, i) => ({ ...x, id: x.id || `edu-${i}-${Date.now()}` })) || [],
        projects: data.cv_data.projects?.map((x, i) => ({ ...x, id: x.id || `proj-${i}-${Date.now()}` })) || [],
        skills: data.cv_data.skills?.map((x, i) => ({ ...x, id: x.id || `skill-${i}-${Date.now()}` })) || [],
        certificates: data.cv_data.certificates?.map((x, i) => ({ ...x, id: x.id || `cert-${i}-${Date.now()}` })) || [],
        languages: data.cv_data.languages?.map((x, i) => ({ ...x, id: x.id || `lang-${i}-${Date.now()}` })) || [],
      };
      setCvData(hydratedData);
      setTemplate(data.template || "modern");
      setIsEditMode(false); // Default to read-only View Mode when landing on a custom slug URL
      setIsViewOnly(true);
    } catch (err: any) {
      // Slug does not exist yet (available for creation)
      setIsEditMode(true);
      setIsViewOnly(false);
      setCvData(DEFAULT_CV); // Load default sample data to let them play with it
      setStatusMessage({ 
        type: 'success', 
        text: `/${targetSlug} ${t('notExistYet')}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create or Update CV
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSlug.trim()) {
      setStatusMessage({ type: 'error', text: t('errorNoSlug') });
      return;
    }
    if (!passcode.trim()) {
      setStatusMessage({ type: 'error', text: t('errorNoPasscode') });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);
    const targetSlug = inputSlug.trim().toLowerCase();

    try {
      if (isViewOnly) {
        // Updating an existing CV that we unlocked
        await api.updateCV(targetSlug, passcode, template, cvData);
        setStatusMessage({ type: 'success', text: t('successUpdate') });
      } else {
        // Creating a new CV
        await api.createCV(targetSlug, passcode, template, cvData);
        setSlug(targetSlug);
        setIsViewOnly(true);
        setIsEditMode(false);
        // Update browser URL path without page refresh
        window.history.pushState({}, '', `/${targetSlug}`);
        setStatusMessage({ type: 'success', text: `${t('successPublish')}${targetSlug}` });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Lỗi khi lưu trữ CV.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Verify Passcode to unlock editing
  const handleUnlockVerify = async () => {
    if (!verifyPasscodeVal.trim()) {
      setVerifyError(t('errorPasscodeRequired'));
      return;
    }

    setIsLoading(true);
    setVerifyError("");
    try {
      const isValid = await api.verifyPasscode(slug, verifyPasscodeVal);
      if (isValid) {
        setPasscode(verifyPasscodeVal);
        setIsEditMode(true);
        setShowVerifyModal(false);
        setVerifyPasscodeVal("");
        setStatusMessage({ type: 'success', text: t('successAuth') });
      } else {
        setVerifyError(t('errorAuthIncorrect'));
      }
    } catch (err: any) {
      setVerifyError(err.message || t('errorAuthFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set dimensions to 300x300 (square 1:1)
        const size = 300;
        canvas.width = size;
        canvas.height = size;

        // Square cropping logic (center crop)
        let sx = 0;
        let sy = 0;
        let sWidth = img.width;
        let sHeight = img.height;

        if (img.width > img.height) {
          sWidth = img.height;
          sx = (img.width - img.height) / 2;
        } else if (img.height > img.width) {
          sHeight = img.width;
          sy = (img.height - img.width) / 2;
        }

        // Draw image cropped in square and resized to 300x300
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, size, size);

        // Compress image to JPEG quality 70%
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

        setCvData((prev) => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            avatar: compressedBase64
          }
        }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarDelete = () => {
    setCvData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        avatar: undefined
      }
    }));
  };

  const handleClearAll = () => {
    if (!window.confirm(t('confirmClear'))) return;

    setCvData({
      personalInfo: {
        fullName: "",
        title: "",
        email: "",
        phone: "",
        location: "",
        website: "",
        github: "",
        linkedin: "",
        avatar: undefined
      },
      summary: "",
      experience: [],
      education: [],
      projects: [],
      skills: [],
      certificates: [],
      languages: [],
      themeColor: cvData.themeColor || "indigo",
      fontFamily: cvData.fontFamily || "sans"
    });
  };

  // Dynamic lists append handlers
  const addExperience = () => {
    const item: ExperienceItem = { id: `exp-${Date.now()}`, company: "", position: "", startDate: "", description: "" };
    setCvData({ ...cvData, experience: [...cvData.experience, item] });
  };
  const removeExperience = (id: string) => {
    setCvData({ ...cvData, experience: cvData.experience.filter(x => x.id !== id) });
  };

  const addEducation = () => {
    const item: EducationItem = { id: `edu-${Date.now()}`, institution: "", degree: "", startDate: "" };
    setCvData({ ...cvData, education: [...cvData.education, item] });
  };
  const removeEducation = (id: string) => {
    setCvData({ ...cvData, education: cvData.education.filter(x => x.id !== id) });
  };

  const addProject = () => {
    const item: ProjectItem = { id: `proj-${Date.now()}`, name: "", role: "", startDate: "", description: "", technologies: [] };
    setCvData({ ...cvData, projects: [...cvData.projects, item] });
  };
  const removeProject = (id: string) => {
    setCvData({ ...cvData, projects: cvData.projects.filter(x => x.id !== id) });
  };

  const addSkill = () => {
    const item: SkillGroup = { id: `skill-${Date.now()}`, category: "", skills: [] };
    setCvData({ ...cvData, skills: [...cvData.skills, item] });
  };
  const removeSkill = (id: string) => {
    setCvData({ ...cvData, skills: cvData.skills.filter(x => x.id !== id) });
  };

  const addCertificate = () => {
    const item: CertificateItem = { id: `cert-${Date.now()}`, name: "", issuer: "", date: "" };
    setCvData({ ...cvData, certificates: [...cvData.certificates, item] });
  };
  const removeCertificate = (id: string) => {
    setCvData({ ...cvData, certificates: cvData.certificates.filter(x => x.id !== id) });
  };

  const addLanguage = () => {
    const item: LanguageItem = { id: `lang-${Date.now()}`, name: "", level: "" };
    setCvData({ ...cvData, languages: [...cvData.languages, item] });
  };
  const removeLanguage = (id: string) => {
    setCvData({ ...cvData, languages: cvData.languages.filter(x => x.id !== id) });
  };

  // Trigger browser print dialog (perfect client-side vector A4 export)
  const triggerPrint = () => {
    window.print();
  };

  const activeColor = COLOR_MAP[(cvData.themeColor || 'indigo') as keyof typeof COLOR_MAP] || COLOR_MAP.indigo;
  const activeFont = FONT_MAP[(cvData.fontFamily || 'sans') as keyof typeof FONT_MAP] || FONT_MAP.sans;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-purple-600 selection:text-white">
      
      {/* ==========================================
          HEADER (Hidden when printing)
         ========================================== */}
      <header className="print:hidden border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-purple-500/20">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-purple-400 via-indigo-200 to-white bg-clip-text text-transparent">
                CV BUILDER PRO
              </span>
              <span className="text-[10px] block font-mono text-purple-400 tracking-widest font-semibold uppercase">AI-READY SKILL</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick URL and Mode Information */}
            {slug && (
              <div className="hidden md:flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/50 text-xs">
                <Globe className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-slate-400 font-mono">localhost:5173/{slug}</span>
                {isEditMode ? (
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full text-[10px] font-bold border border-purple-500/30">{t('modeEdit')}</span>
                ) : (
                  <span className="bg-slate-700/80 text-slate-300 px-2 py-0.5 rounded-full text-[10px] font-bold">{t('modeView')}</span>
                )}
              </div>
            )}

            {/* Global Actions */}
            <div className="flex items-center gap-2">
              {!isEditMode && isViewOnly && (
                <button
                  onClick={() => setShowVerifyModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-sm font-semibold rounded-xl transition-all shadow-md shadow-purple-600/10 cursor-pointer"
                >
                  <Edit3 className="h-4 w-4" />
                  {t('editCV')}
                </button>
              )}

              {isEditMode && isViewOnly && (
                <button
                  onClick={() => setIsEditMode(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-sm font-semibold rounded-xl transition-all cursor-pointer border border-slate-700"
                >
                  <Eye className="h-4 w-4" />
                  {t('viewPublic')}
                </button>
              )}


              {/* Language Toggle Selector */}
              <div className="flex bg-slate-800/80 p-0.5 rounded-xl border border-slate-700 select-none mr-1 print:hidden">
                <button
                  type="button"
                  onClick={() => setLanguage('vi')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                    language === 'vi' 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  VI
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                    language === 'en' 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  EN
                </button>
              </div>
              <div className="relative group print:hidden">
                <button
                  onClick={triggerPrint}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-sm font-semibold rounded-xl transition-all shadow-md shadow-emerald-600/10 cursor-pointer text-white"
                >
                  <Printer className="h-4 w-4" />
                  {t('exportPDF')}
                </button>
                {/* Floating Micro-Instruction Tooltip */}
                <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900/95 backdrop-blur-md border border-slate-800 text-[10px] text-slate-400 p-3 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none leading-normal">
                  <span className="font-bold text-slate-200 block mb-1">{t('printTipTitle')}</span>
                  <div className="flex flex-col gap-0.5">
                    <span>{t('printTipStep1')}</span>
                    <span>{t('printTipStep2')}</span>
                    <span>{t('printTipStep3')}</span>
                  </div>
                </div>
              </div>
              
              {isViewOnly && (
                <a
                  href="/"
                  className="flex items-center justify-center p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700/80"
                  title="title={t('newCV')}"
                >
                  <Plus className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ==========================================
          MAIN LAYOUT
         ========================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 overflow-hidden print:overflow-visible print:p-0 print:m-0 print:max-w-none print:w-auto">
        
        {/* ==========================================
            LEFT PANEL: EDITOR (Hidden when printing)
           ========================================== */}
        {isEditMode && (
          <section className="w-full lg:w-[48%] flex flex-col gap-6 print:hidden">
            
            {/* Status Messages */}
            {statusMessage && (
              <div className={`p-4 rounded-xl flex items-start gap-3 border ${
                statusMessage.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                )}
                <span className="text-sm font-medium">{statusMessage.text}</span>
              </div>
            )}

            {/* CV Meta Box (Slug, Passcode and Template) */}
            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800/80 shadow-xl shadow-slate-950/20">
              <h2 className="text-base font-bold flex items-center gap-2 mb-4 bg-gradient-to-r from-purple-400 to-indigo-200 bg-clip-text text-transparent">
                <Sparkles className="h-4 w-4 text-purple-400" />
                {t('configPublish')}
              </h2>
              
              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Slug Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      {t('slug')}
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-500 text-sm font-mono font-medium">/</span>
                      <input
                        type="text"
                        value={inputSlug}
                        disabled={isViewOnly}
                        onChange={(e) => setInputSlug(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                        placeholder="vi-du-pat"
                        className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl pl-6 pr-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-purple-500/30 text-slate-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        required
                      />
                    </div>
                  </div>

                  {/* Passcode Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      {t('passcode')}
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <input
                        type="password"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/30 text-slate-200 transition-colors"
                        required
                      />
                    </div>
                  </div>

                </div>

                {/* Template Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {t('template')}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'modern', name: t('modern') },
                      { id: 'classic', name: t('classic') },
                      { id: 'creative', name: t('creative') },
                      { id: 'executive', name: t('executive') },
                      { id: 'minimal', name: t('minimal') }
                    ].map((temp) => (
                      <button
                        key={temp.id}
                        type="button"
                        onClick={() => handleTemplateChange(temp.id)}
                        className={`py-2 px-1 text-[11px] font-bold rounded-xl border text-center transition-all cursor-pointer truncate ${
                          template === temp.id
                            ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                            : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                        title={temp.name}
                      >
                        {temp.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style Customization (Color & Font Selection) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1 border-t border-slate-800/80 pt-4">
                  
                  {/* Theme Color Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      {language === 'vi' ? 'Tông màu chủ đạo' : 'Primary Theme Color'}
                    </label>
                    <div className="flex flex-wrap gap-2 items-center">
                      {[
                        { id: 'indigo', name: 'Indigo', color: 'bg-indigo-600' },
                        { id: 'emerald', name: 'Emerald', color: 'bg-emerald-600' },
                        { id: 'rose', name: 'Rose', color: 'bg-rose-600' },
                        { id: 'amber', name: 'Amber', color: 'bg-amber-600' },
                        { id: 'bronze', name: 'Bronze', color: 'bg-amber-800' },
                        { id: 'slate', name: 'Slate', color: 'bg-slate-650' },
                      ].map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setCvData({ ...cvData, themeColor: c.id })}
                          className={`w-6 h-6 rounded-full cursor-pointer transition-all border-2 flex items-center justify-center hover:scale-110 active:scale-95 ${
                            (cvData.themeColor || 'indigo') === c.id
                              ? 'border-white ring-2 ring-purple-500/50'
                              : 'border-slate-800'
                          } ${c.color}`}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Font Family Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      {language === 'vi' ? 'Phông chữ' : 'Typography'}
                    </label>
                    <select
                      value={cvData.fontFamily || 'inter'}
                      onChange={(e) => setCvData({ ...cvData, fontFamily: e.target.value })}
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none transition-colors"
                    >
                      <optgroup label="Modern Sans">
                        <option value="inter">Inter (Clean & Professional)</option>
                        <option value="outfit">Outfit (Premium Geometric)</option>
                      </optgroup>
                      <optgroup label="Elegant Serif">
                        <option value="lora">Lora (Contemporary Academic)</option>
                        <option value="playfair">Playfair Display (Luxurious Editorial)</option>
                      </optgroup>
                      <optgroup label="Tech Monospace">
                        <option value="jetbrains">JetBrains Mono (Developer Standard)</option>
                        <option value="fira">Fira Code (Creative Tech)</option>
                      </optgroup>
                    </select>
                  </div>

                </div>

                {/* Actions Grid */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="flex-1 py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-900 active:scale-[0.98] font-bold text-xs text-rose-400 hover:text-rose-300 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t('clearCV')}
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-[2] py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-[0.98] font-bold text-xs text-white rounded-xl shadow-lg shadow-purple-600/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isViewOnly ? t('updateCV') : t('saveAndPublish')}
                  </button>
                </div>
              </form>
            </div>

            {/* Form Editor Accordions */}
            <div className="flex-1 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/80 shadow-xl overflow-hidden flex flex-col">
              
              {/* Tab Selector Header */}
              <div className="flex border-b border-slate-800/80 bg-slate-900/60 overflow-x-auto no-scrollbar scroll-smooth">
                {[
                  { id: 'personal', name: t('personalInfo'), icon: User },
                  { id: 'summary', name: t('summary'), icon: FileText },
                  { id: 'experience', name: t('experience'), icon: Briefcase },
                  { id: 'education', name: t('education'), icon: GraduationCap },
                  { id: 'projects', name: t('projects'), icon: FolderGit2 },
                  { id: 'skills', name: t('skills'), icon: Wrench },
                  { id: 'extra', name: t('languages'), icon: Award }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-4 py-3.5 border-b-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        activeTab === tab.id
                          ? 'border-purple-500 text-purple-400 bg-purple-500/5'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {tab.name}
                    </button>
                  );
                })}
              </div>

              {/* Tab Editor Contents */}
              <div className="flex-1 p-6 overflow-y-auto max-h-[500px]">
                
                {/* 1. PERSONAL INFO TAB */}
                {activeTab === 'personal' && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-slate-300 mb-2">{t('personalInfo')}</h3>
                    
                    {/* Premium Avatar Uploader */}
                    <div className="flex items-center gap-4 mb-2 pb-4 border-b border-slate-800/80">
                      <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-slate-700 hover:border-purple-500 transition-all cursor-pointer bg-slate-950 flex items-center justify-center">
                        {cvData.personalInfo.avatar ? (
                          <img src={cvData.personalInfo.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-8 w-8 text-slate-500 group-hover:text-slate-300 transition-colors" />
                        )}
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 text-[10px] text-white font-semibold transition-opacity cursor-pointer">
                          <Camera className="h-4 w-4" />
                          <span>{t('uploadPhoto')}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-300">{t('avatarPhoto')}</span>
                        <span className="text-[10px] text-slate-500">JPG, PNG, WEBP. Tối đa 150KB (tự động nén)</span>
                        {cvData.personalInfo.avatar && (
                          <button
                            type="button"
                            onClick={handleAvatarDelete}
                            className="mt-1 self-start text-xs text-rose-400 hover:text-rose-300 font-bold transition-colors cursor-pointer"
                          >
                            {t('deletePhoto')}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">{t('fullName')}</label>
                        <input
                          type="text"
                          value={cvData.personalInfo.fullName}
                          onChange={(e) => setCvData({
                            ...cvData,
                            personalInfo: { ...cvData.personalInfo, fullName: e.target.value }
                          })}
                          placeholder="Nguyễn Văn A"
                          className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">{t('jobTitle')}</label>
                        <input
                          type="text"
                          value={cvData.personalInfo.title || ""}
                          onChange={(e) => setCvData({
                            ...cvData,
                            personalInfo: { ...cvData.personalInfo, title: e.target.value }
                          })}
                          placeholder="Senior Full Stack Engineer"
                          className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
                        <input
                          type="email"
                          value={cvData.personalInfo.email}
                          onChange={(e) => setCvData({
                            ...cvData,
                            personalInfo: { ...cvData.personalInfo, email: e.target.value }
                          })}
                          placeholder="a@gmail.com"
                          className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">{t('phone')}</label>
                        <input
                          type="text"
                          value={cvData.personalInfo.phone || ""}
                          onChange={(e) => setCvData({
                            ...cvData,
                            personalInfo: { ...cvData.personalInfo, phone: e.target.value }
                          })}
                          placeholder="0987654321"
                          className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">{t('location')}</label>
                        <input
                          type="text"
                          value={cvData.personalInfo.location || ""}
                          onChange={(e) => setCvData({
                            ...cvData,
                            personalInfo: { ...cvData.personalInfo, location: e.target.value }
                          })}
                          placeholder="Hà Nội, Việt Nam"
                          className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">{t('website')}</label>
                        <input
                          type="text"
                          value={cvData.personalInfo.website || ""}
                          onChange={(e) => setCvData({
                            ...cvData,
                            personalInfo: { ...cvData.personalInfo, website: e.target.value }
                          })}
                          placeholder="https://vana.dev"
                          className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">GitHub URL</label>
                        <input
                          type="text"
                          value={cvData.personalInfo.github || ""}
                          onChange={(e) => setCvData({
                            ...cvData,
                            personalInfo: { ...cvData.personalInfo, github: e.target.value }
                          })}
                          placeholder="https://github.com/Nguyenvana"
                          className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">LinkedIn URL</label>
                        <input
                          type="text"
                          value={cvData.personalInfo.linkedin || ""}
                          onChange={(e) => setCvData({
                            ...cvData,
                            personalInfo: { ...cvData.personalInfo, linkedin: e.target.value }
                          })}
                          placeholder="https://linkedin.com/in/Nguyenvana"
                          className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SUMMARY TAB */}
                {activeTab === 'summary' && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-slate-300 mb-1">{t('summaryTitle')}</h3>
                    <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                      {t('summaryDesc')}
                    </p>
                    <textarea
                      value={cvData.summary || ""}
                      onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
                      placeholder={t('summaryPlaceholder')}
                      rows={6}
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none font-sans leading-relaxed resize-y"
                    />
                  </div>
                )}

                {/* 3. EXPERIENCE TAB */}
                {activeTab === 'experience' && (
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-slate-300">{t('experienceTitle')}</h3>
                      <button
                        type="button"
                        onClick={addExperience}
                        className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1.5 rounded-xl border border-slate-700/50"
                      >
                        <Plus className="h-3.5 w-3.5" /> {t('addExperience')}
                      </button>
                    </div>

                    {cvData.experience.length === 0 ? (
                      <p className="text-xs text-slate-500 italic text-center py-6">{t('emptyExperience')}</p>
                    ) : (
                      cvData.experience.map((exp, index) => (
                        <div key={exp.id} className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3 relative">
                          <button
                            type="button"
                            onClick={() => removeExperience(exp.id)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 p-1.5 hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
                            title="Xóa công việc"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <span className="absolute top-4 left-4 bg-slate-800 text-slate-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded">#{index + 1}</span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">{t('companyLabel')}</label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => {
                                  const list = [...cvData.experience];
                                  list[index].company = e.target.value;
                                  setCvData({ ...cvData, experience: list });
                                }}
                                placeholder={t('companyPlaceholder')}
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">{t('positionLabel')}</label>
                              <input
                                type="text"
                                value={exp.position}
                                onChange={(e) => {
                                  const list = [...cvData.experience];
                                  list[index].position = e.target.value;
                                  setCvData({ ...cvData, experience: list });
                                }}
                                placeholder={t('positionPlaceholder')}
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">{t('startDateLabel')}</label>
                              <input
                                type="text"
                                value={exp.startDate}
                                onChange={(e) => {
                                  const list = [...cvData.experience];
                                  list[index].startDate = e.target.value;
                                  setCvData({ ...cvData, experience: list });
                                }}
                                placeholder={t('datePlaceholder')}
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">{t('endDateLabel')}</label>
                              <input
                                type="text"
                                value={exp.endDate || ""}
                                onChange={(e) => {
                                  const list = [...cvData.experience];
                                  list[index].endDate = e.target.value;
                                  setCvData({ ...cvData, experience: list });
                                }}
                                placeholder={t('datePlaceholder')}
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">{t('descLabel')}</label>
                            <textarea
                              value={exp.description}
                              onChange={(e) => {
                                const list = [...cvData.experience];
                                list[index].description = e.target.value;
                                setCvData({ ...cvData, experience: list });
                              }}
                              placeholder="- Quản lý dự án...\n- Tối ưu hóa API..."
                              rows={3}
                              className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none font-sans leading-relaxed resize-y"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 4. EDUCATION TAB */}
                {activeTab === 'education' && (
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-slate-300">Quá trình {t('educationTitle')}</h3>
                      <button
                        type="button"
                        onClick={addEducation}
                        className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1.5 rounded-xl border border-slate-700/50"
                      >
                        <Plus className="h-3.5 w-3.5" /> Thêm học vị
                      </button>
                    </div>

                    {cvData.education.length === 0 ? (
                      <p className="text-xs text-slate-500 italic text-center py-6">{t('emptyEducation')}</p>
                    ) : (
                      cvData.education.map((edu, index) => (
                        <div key={edu.id} className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3 relative">
                          <button
                            type="button"
                            onClick={() => removeEducation(edu.id)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 p-1.5 hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <span className="absolute top-4 left-4 bg-slate-800 text-slate-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded">#{index + 1}</span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">Tên Trường / Viện</label>
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => {
                                  const list = [...cvData.education];
                                  list[index].institution = e.target.value;
                                  setCvData({ ...cvData, education: list });
                                }}
                                placeholder={t('schoolPlaceholder')}
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">{t('degreeLabel')}</label>
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => {
                                  const list = [...cvData.education];
                                  list[index].degree = e.target.value;
                                  setCvData({ ...cvData, education: list });
                                }}
                                placeholder="Cử nhân Công nghệ thông tin"
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">{t('startDateLabel')}</label>
                              <input
                                type="text"
                                value={edu.startDate}
                                onChange={(e) => {
                                  const list = [...cvData.education];
                                  list[index].startDate = e.target.value;
                                  setCvData({ ...cvData, education: list });
                                }}
                                placeholder="2016-09"
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">{t('endDateLabel')}</label>
                              <input
                                type="text"
                                value={edu.endDate || ""}
                                onChange={(e) => {
                                  const list = [...cvData.education];
                                  list[index].endDate = e.target.value;
                                  setCvData({ ...cvData, education: list });
                                }}
                                placeholder="2021-06"
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">Mô tả thành tựu / Điểm số (Tùy chọn)</label>
                            <input
                              type="text"
                              value={edu.description || ""}
                              onChange={(e) => {
                                const list = [...cvData.education];
                                list[index].description = e.target.value;
                                setCvData({ ...cvData, education: list });
                              }}
                              placeholder="Tốt nghiệp loại Giỏi, GPA 3.6"
                              className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 5. PROJECTS TAB */}
                {activeTab === 'projects' && (
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-slate-300">Dự án Thực tế</h3>
                      <button
                        type="button"
                        onClick={addProject}
                        className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1.5 rounded-xl border border-slate-700/50"
                      >
                        <Plus className="h-3.5 w-3.5" /> {t('addProject')}
                      </button>
                    </div>

                    {cvData.projects.length === 0 ? (
                      <p className="text-xs text-slate-500 italic text-center py-6">Chưa có thông tin dự án cá nhân.</p>
                    ) : (
                      cvData.projects.map((proj, index) => (
                        <div key={proj.id} className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3 relative">
                          <button
                            type="button"
                            onClick={() => removeProject(proj.id)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 p-1.5 hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <span className="absolute top-4 left-4 bg-slate-800 text-slate-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded">#{index + 1}</span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">{t('projectNameLabel')}</label>
                              <input
                                type="text"
                                value={proj.name}
                                onChange={(e) => {
                                  const list = [...cvData.projects];
                                  list[index].name = e.target.value;
                                  setCvData({ ...cvData, projects: list });
                                }}
                                placeholder="Hệ thống AI CV"
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">Vai trò của bạn</label>
                              <input
                                type="text"
                                value={proj.role}
                                onChange={(e) => {
                                  const list = [...cvData.projects];
                                  list[index].role = e.target.value;
                                  setCvData({ ...cvData, projects: list });
                                }}
                                placeholder="Kỹ sư chính / Leader"
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">Thời gian / Năm</label>
                              <input
                                type="text"
                                value={proj.startDate}
                                onChange={(e) => {
                                  const list = [...cvData.projects];
                                  list[index].startDate = e.target.value;
                                  setCvData({ ...cvData, projects: list });
                                }}
                                placeholder="2024"
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">URL Dự án (GitHub / Live Link)</label>
                              <input
                                type="text"
                                value={proj.url || ""}
                                onChange={(e) => {
                                  const list = [...cvData.projects];
                                  list[index].url = e.target.value;
                                  setCvData({ ...cvData, projects: list });
                                }}
                                placeholder="https://github.com/project"
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">Công nghệ sử dụng (Cách nhau bằng dấu phẩy)</label>
                            <input
                              type="text"
                              value={proj.technologies.join(", ")}
                              onChange={(e) => {
                                const list = [...cvData.projects];
                                list[index].technologies = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                                setCvData({ ...cvData, projects: list });
                              }}
                              placeholder="React, TypeScript, Tailwind, FastAPI"
                              className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">Mô tả chi tiết dự án</label>
                            <textarea
                              value={proj.description}
                              onChange={(e) => {
                                const list = [...cvData.projects];
                                list[index].description = e.target.value;
                                setCvData({ ...cvData, projects: list });
                              }}
                              placeholder="Mô tả các tính năng cốt lõi và kết quả dự án..."
                              rows={2}
                              className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none font-sans leading-relaxed resize-y"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 6. SKILLS TAB */}
                {activeTab === 'skills' && (
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-slate-300">Phân nhóm Kỹ năng</h3>
                      <button
                        type="button"
                        onClick={addSkill}
                        className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1.5 rounded-xl border border-slate-700/50"
                      >
                        <Plus className="h-3.5 w-3.5" /> Thêm nhóm
                      </button>
                    </div>

                    {cvData.skills.length === 0 ? (
                      <p className="text-xs text-slate-500 italic text-center py-6">{t('emptySkills')}</p>
                    ) : (
                      cvData.skills.map((grp, index) => (
                        <div key={grp.id} className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3 relative">
                          <button
                            type="button"
                            onClick={() => removeSkill(grp.id)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 p-1.5 hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <span className="absolute top-4 left-4 bg-slate-800 text-slate-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded">#{index + 1}</span>

                          <div className="grid grid-cols-1 gap-3 mt-4">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">Tên Nhóm (Category)</label>
                              <input
                                type="text"
                                value={grp.category}
                                onChange={(e) => {
                                  const list = [...cvData.skills];
                                  list[index].category = e.target.value;
                                  setCvData({ ...cvData, skills: list });
                                }}
                                placeholder="Ví dụ: Frontend, Backend, Cloud..."
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">Các kỹ năng (Phân tách bằng dấu phẩy)</label>
                              <input
                                type="text"
                                value={grp.skills.join(", ")}
                                onChange={(e) => {
                                  const list = [...cvData.skills];
                                  list[index].skills = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                                  setCvData({ ...cvData, skills: list });
                                }}
                                placeholder="React, Next.js, HTML, CSS"
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 7. EXTRA (LANGUAGES, CERTIFICATES) TAB */}
                {activeTab === 'extra' && (
                  <div className="flex flex-col gap-8">
                    
                    {/* A. Certificates */}
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                          <Award className="h-4 w-4 text-purple-400" />
                          {t('certTitle')}
                        </h3>
                        <button
                          type="button"
                          onClick={addCertificate}
                          className="text-[10px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-0.5 cursor-pointer bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700/50"
                        >
                          <Plus className="h-3 w-3" /> {t('addCert')}
                        </button>
                      </div>

                      {cvData.certificates.length === 0 ? (
                        <p className="text-xs text-slate-550 italic text-center py-2">{t('emptyCert')}</p>
                      ) : (
                        cvData.certificates.map((cert, index) => (
                          <div key={cert.id} className="bg-slate-950/40 p-3 rounded-lg border border-slate-850 flex flex-col gap-2 relative">
                            <button
                              type="button"
                              onClick={() => removeCertificate(cert.id)}
                              className="absolute top-3 right-3 text-slate-500 hover:text-rose-450 p-1 hover:bg-slate-900 rounded cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                              <div>
                                <label className="block text-[9px] font-bold uppercase text-slate-500 mb-0.5">{t('certNameLabel')}</label>
                                <input
                                  type="text"
                                  value={cert.name}
                                  onChange={(e) => {
                                    const list = [...cvData.certificates];
                                    list[index].name = e.target.value;
                                    setCvData({ ...cvData, certificates: list });
                                  }}
                                  placeholder="AWS Solutions Architect"
                                  className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold uppercase text-slate-500 mb-0.5">{t('issuerLabel')}</label>
                                <input
                                  type="text"
                                  value={cert.issuer}
                                  onChange={(e) => {
                                    const list = [...cvData.certificates];
                                    list[index].issuer = e.target.value;
                                    setCvData({ ...cvData, certificates: list });
                                  }}
                                  placeholder="Amazon Web Services"
                                  className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold uppercase text-slate-500 mb-0.5">{t('dateLabel')}</label>
                                <input
                                  type="text"
                                  value={cert.date}
                                  onChange={(e) => {
                                    const list = [...cvData.certificates];
                                    list[index].date = e.target.value;
                                    setCvData({ ...cvData, certificates: list });
                                  }}
                                  placeholder="2023"
                                  className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* B. Languages */}
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                          <Languages className="h-4 w-4 text-purple-400" />
                          {t('langTitle')}
                        </h3>
                        <button
                          type="button"
                          onClick={addLanguage}
                          className="text-[10px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-0.5 cursor-pointer bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700/50"
                        >
                          <Plus className="h-3 w-3" /> {t('addLang')}
                        </button>
                      </div>

                      {cvData.languages.length === 0 ? (
                        <p className="text-xs text-slate-550 italic text-center py-2">{t('emptyLang')}</p>
                      ) : (
                        cvData.languages.map((lang, index) => (
                          <div key={lang.id} className="bg-slate-950/40 p-3 rounded-lg border border-slate-850 flex flex-col gap-2 relative">
                            <button
                              type="button"
                              onClick={() => removeLanguage(lang.id)}
                              className="absolute top-3 right-3 text-slate-500 hover:text-rose-450 p-1 hover:bg-slate-900 rounded cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                              <div>
                                <label className="block text-[9px] font-bold uppercase text-slate-500 mb-0.5">Tên {t('langTitle')}</label>
                                <input
                                  type="text"
                                  value={lang.name}
                                  onChange={(e) => {
                                    const list = [...cvData.languages];
                                    list[index].name = e.target.value;
                                    setCvData({ ...cvData, languages: list });
                                  }}
                                  placeholder={t('langPlaceholder')}
                                  className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold uppercase text-slate-500 mb-0.5">{t('langLevelLabel')}</label>
                                <input
                                  type="text"
                                  value={lang.level}
                                  onChange={(e) => {
                                    const list = [...cvData.languages];
                                    list[index].level = e.target.value;
                                    setCvData({ ...cvData, languages: list });
                                  }}
                                  placeholder={t('langLevelPlaceholder')}
                                  className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                  </div>
                )}

              </div>
            </div>

          </section>
        )}

        {/* ==========================================
            RIGHT PANEL: LIVE PREVIEW & VIEW MODE
           ========================================== */}
        <section className={`flex-1 flex flex-col items-center justify-start overflow-y-auto ${isEditMode ? 'lg:w-[48%]' : 'w-full'} print:p-0 print:m-0`}>
          
          {/* View Only Mode Info Panel (Hidden when printing) */}
          {!isEditMode && isViewOnly && (
            <div className="w-[210mm] max-w-full print:hidden bg-slate-900/40 border border-slate-800/80 p-4 rounded-2xl mb-6 flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-2.5">
                <div className="bg-purple-500/10 p-2 rounded-lg border border-purple-500/20">
                  <Globe className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{t('pubViewMode')}</h4>
                  <p className="text-xs text-slate-400">{t('pubViewDesc')}</p>
                </div>
              </div>
              <button
                onClick={() => setShowVerifyModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold cursor-pointer border border-slate-700/60 text-slate-300 transition-all hover:text-white"
              >
                <Lock className="h-3.5 w-3.5" />
                {t('unlockBtn')}
              </button>
            </div>
          )}

          {/* Dotted Grid Layout wrapper for the simulated A4 Sheet */}
          <div className="w-full flex justify-center py-2 bg-slate-950 rounded-2xl border border-slate-900/60 shadow-inner relative overflow-x-auto print:overflow-visible print:bg-white print:border-none print:shadow-none print:p-0">
            
            {/* 
                ==========================================================
                A4 SIMULATION SHEET (Standard Dimension: 210mm x 297mm)
                Using deep Tailwind vector printer styles.
                ==========================================================
            */}
            <div className={`w-[210mm] min-h-[297mm] bg-white text-slate-800 p-[15mm] shadow-2xl flex flex-col relative overflow-hidden print:overflow-visible transition-all duration-300 print:shadow-none print:p-0 print:w-full print:min-h-0 print:bg-white print:text-black ${activeFont} ${
              template === 'modern' ? `border-t-[6px] ${activeColor.border}` : ''
            }`}>
              
              {/* ========================================================
                  TEMPLATE 1: MODERN MINIMALIST (Default Modern)
                 ======================================================== */}
              {template === 'modern' && (
                <div className="flex flex-col flex-1 gap-6 text-sm">
                  {/* Top section / Contact block */}
                  <div className="border-b pb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex items-center gap-4">
                      {cvData.personalInfo.avatar && (
                        <img 
                          src={cvData.personalInfo.avatar} 
                          alt="Avatar" 
                          className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 print:border-slate-800" 
                        />
                      )}
                      <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-tight m-0 print:text-black">
                          {cvData.personalInfo.fullName || "HỌ VÀ TÊN"}
                        </h1>
                        <p className={`${activeColor.primary} font-bold text-sm tracking-wider uppercase mt-1 print:text-slate-800`}>
                          {cvData.personalInfo.title || "VỊ TRÍ ỨNG TUYỂN"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 text-slate-550 text-xs text-right sm:items-end font-medium print:text-slate-700">
                      <div>{cvData.personalInfo.email}</div>
                      {cvData.personalInfo.phone && <div>{cvData.personalInfo.phone}</div>}
                      {cvData.personalInfo.location && <div>{cvData.personalInfo.location}</div>}
                      <div className="flex flex-wrap gap-2 mt-1 sm:justify-end">
                        {cvData.personalInfo.website && <span className="font-mono">{cvData.personalInfo.website.replace(/^https?:\/\//, '')}</span>}
                        {cvData.personalInfo.github && <span className="font-mono">github.com/{cvData.personalInfo.github.split('/').pop()}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Body Content splits into two columns if needed, but linear modern is beautiful */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Left narrow sidebar with Glassmorphism */}
                    <div className="md:col-span-1 flex flex-col gap-6 glass-sidebar">
                      
                      {/* Skills group */}
                      {cvData.skills.length > 0 && (
                        <div className="flex flex-col gap-3">
                          <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-1 font-mono flex items-center gap-1.5 print:text-black`}>
                            <Wrench className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('skillsUpper')}
                          </h3>
                          {cvData.skills.map((grp) => (
                            <div key={grp.id} className="flex flex-col gap-1">
                              <span className="text-xs font-bold text-slate-800">{grp.category}</span>
                              <div className="flex flex-wrap gap-1.5">
                                {grp.skills.map((s, i) => (
                                  <span key={i} className={`${activeColor.pill} px-2 py-0.5 rounded text-[11px] font-medium`}>
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Languages */}
                      {cvData.languages.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-1 font-mono flex items-center gap-1.5 print:text-black`}>
                            <Languages className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('languagesUpper')}
                          </h3>
                          <div className="flex flex-col gap-1">
                            {cvData.languages.map((l) => (
                              <div key={l.id} className="flex justify-between text-xs font-medium text-slate-750">
                                <span className="font-semibold text-slate-800">{l.name}</span>
                                <span className="text-slate-500 font-mono text-[10px] print:text-slate-800">{l.level}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certificates */}
                      {cvData.certificates.length > 0 && (
                        <div className="flex flex-col gap-3">
                          <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-1 font-mono flex items-center gap-1.5 print:text-black`}>
                            <Award className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('certificatesUpper')}
                          </h3>
                          {cvData.certificates.map((c) => (
                            <div key={c.id} className="text-xs flex flex-col gap-0.5">
                              <span className="font-bold text-slate-850 leading-snug">{c.name}</span>
                              <span className="text-[10px] text-slate-500 font-medium">{c.issuer} ({c.date})</span>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>

                    {/* Right wide main column */}
                    <div className="md:col-span-2 flex flex-col gap-6">
                      
                      {/* Professional summary */}
                      {cvData.summary && (
                        <div className="flex flex-col gap-2">
                          <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-1 font-mono flex items-center gap-1.5 print:text-black`}>
                            <User className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('summaryUpper')}
                          </h3>
                          <p className="text-xs leading-relaxed text-slate-700 font-medium text-justify">{cvData.summary}</p>
                        </div>
                      )}

                      {/* Experience */}
                      {cvData.experience.length > 0 && (
                        <div className="flex flex-col gap-4">
                          <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-1 font-mono flex items-center gap-1.5 print:text-black`}>
                            <Briefcase className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('experienceUpper')}
                          </h3>
                          {cvData.experience.map((exp) => (
                            <div key={exp.id} className="flex flex-col gap-1">
                              <div className="flex justify-between items-start text-xs">
                                <div>
                                  <span className="font-extrabold text-slate-900">{exp.company}</span>
                                  <span className="text-slate-400 mx-1.5">•</span>
                                  <span className={`font-semibold ${activeColor.primary} print:text-black`}>{exp.position}</span>
                                </div>
                                <span className="text-[10px] font-mono font-bold text-slate-400 print:text-slate-850">{exp.startDate} - {exp.endDate || 'Hiện tại'}</span>
                              </div>
                              <p className="text-xs leading-relaxed text-slate-650 font-medium whitespace-pre-line mt-1 print:text-slate-950">
                                {exp.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Projects */}
                      {cvData.projects.length > 0 && (
                        <div className="flex flex-col gap-4">
                          <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-1 font-mono flex items-center gap-1.5 print:text-black`}>
                            <FolderGit2 className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('projectsUpper')}
                          </h3>
                          {cvData.projects.map((proj) => (
                            <div key={proj.id} className="flex flex-col gap-1">
                              <div className="flex justify-between items-center text-xs">
                                <div>
                                  <span className="font-extrabold text-slate-900">{proj.name}</span>
                                  <span className="text-slate-400 mx-1.5">•</span>
                                  <span className="text-[10px] text-slate-500 font-semibold italic">{proj.role}</span>
                                </div>
                                <span className="text-[10px] font-mono font-bold text-slate-400 print:text-slate-850">{proj.startDate}</span>
                              </div>
                              {proj.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-0.5">
                                  {proj.technologies.map((tech, idx) => (
                                    <span key={idx} className={`${activeColor.pill} rounded px-1.5 py-0.2 text-[9px] font-bold font-mono`}>
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <p className="text-xs leading-relaxed text-slate-650 font-medium whitespace-pre-line mt-1 print:text-slate-950">
                                {proj.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Education */}
                      {cvData.education.length > 0 && (
                        <div className="flex flex-col gap-3">
                          <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-1 font-mono flex items-center gap-1.5 print:text-black`}>
                            <GraduationCap className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('educationUpper')}
                          </h3>
                          {cvData.education.map((edu) => (
                            <div key={edu.id} className="flex flex-col gap-0.5 text-xs">
                              <div className="flex justify-between items-start">
                                <span className="font-extrabold text-slate-900">{edu.institution}</span>
                                <span className="text-[10px] font-mono font-bold text-slate-400 print:text-slate-850">{edu.startDate} - {edu.endDate || 'Hiện tại'}</span>
                              </div>
                              <div className="text-slate-600 font-semibold print:text-slate-900">{edu.degree}</div>
                              {edu.description && <p className="text-[11px] text-slate-500 italic mt-0.5">{edu.description}</p>}
                            </div>
                          ))}
                        </div>
                      )}

                    </div>

                  </div>
                </div>
              )}

              {/* ========================================================
                  TEMPLATE 2: CLASSIC EXECUTIVE (Traditional Layout)
                 ======================================================== */}
              {template === 'classic' && (
                <div className="flex flex-col flex-1 gap-5 text-sm">
                  
                  {/* Căn giữa Header */}
                  <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 border-b-[3px] ${activeColor.border} pb-4`}>
                    {cvData.personalInfo.avatar && (
                      <img 
                        src={cvData.personalInfo.avatar} 
                        alt="Avatar" 
                        className="w-16 h-16 rounded-full object-cover border border-slate-300" 
                      />
                    )}
                    <div className="text-center sm:text-left flex flex-col gap-1">
                      <h1 className="text-3xl font-extrabold tracking-wide text-slate-950 uppercase m-0 print:text-black">
                        {cvData.personalInfo.fullName || "HỌ VÀ TÊN"}
                      </h1>
                      <p className={`font-bold text-xs tracking-widest uppercase ${activeColor.primary}`}>
                        {cvData.personalInfo.title || "VỊ TRÍ ỨNG TUYỂN"}
                      </p>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 text-slate-600 text-xs font-mono mt-2 print:text-black">
                        <span>{cvData.personalInfo.email}</span>
                        {cvData.personalInfo.phone && <span>• {cvData.personalInfo.phone}</span>}
                        {cvData.personalInfo.location && <span>• {cvData.personalInfo.location}</span>}
                        {cvData.personalInfo.website && <span>• {cvData.personalInfo.website.replace(/^https?:\/\//, '')}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  {cvData.summary && (
                    <div className="flex flex-col gap-1.5">
                      <h3 className={`text-xs font-extrabold uppercase tracking-wider ${activeColor.primary} pb-0.5 flex items-center gap-1.5`}>
                        <User className="h-3.5 w-3.5 stroke-[2.5]" />
                        {t('summaryUpper')}
                      </h3>
                      <p className="text-xs leading-relaxed text-slate-700 italic text-justify">{cvData.summary}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {cvData.experience.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <h3 className={`text-xs font-extrabold uppercase tracking-wider ${activeColor.primary} pb-0.5 flex items-center gap-1.5`}>
                        <Briefcase className="h-3.5 w-3.5 stroke-[2.5]" />
                        {t('experienceUpper')}
                      </h3>
                      {cvData.experience.map((exp) => (
                        <div key={exp.id} className="flex flex-col gap-0.5">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-slate-900 font-extrabold">{exp.company} — <span className={`italic font-normal ${activeColor.primary}`}>{exp.position}</span></span>
                            <span className="text-[10px] font-mono text-slate-500 print:text-black">{exp.startDate} – {exp.endDate || 'Hiện tại'}</span>
                          </div>
                          <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line mt-1 print:text-black">
                            {exp.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Projects */}
                  {cvData.projects.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <h3 className={`text-xs font-extrabold uppercase tracking-wider ${activeColor.primary} pb-0.5 flex items-center gap-1.5`}>
                        <FolderGit2 className="h-3.5 w-3.5 stroke-[2.5]" />
                        {t('projectsUpper')}
                      </h3>
                      {cvData.projects.map((proj) => (
                        <div key={proj.id} className="flex flex-col gap-0.5">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-slate-900 font-extrabold">{proj.name} — <span className="font-normal italic text-[11px]">{proj.role}</span></span>
                            <span className="text-[10px] font-mono text-slate-500 print:text-black">{proj.startDate}</span>
                          </div>
                          {proj.technologies.length > 0 && (
                            <span className="text-[10px] text-slate-500 font-semibold">Công nghệ: {proj.technologies.join(", ")}</span>
                          )}
                          <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line mt-0.5 print:text-black">
                            {proj.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Education */}
                  {cvData.education.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <h3 className={`text-xs font-extrabold uppercase tracking-wider ${activeColor.primary} pb-0.5 flex items-center gap-1.5`}>
                        <GraduationCap className="h-3.5 w-3.5 stroke-[2.5]" />
                        {t('educationUpper')}
                      </h3>
                      {cvData.education.map((edu) => (
                        <div key={edu.id} className="flex flex-col gap-0.5 text-xs">
                          <div className="flex justify-between items-start font-bold">
                            <span className="text-slate-900 font-extrabold">{edu.institution}</span>
                            <span className="text-[10px] font-mono text-slate-500 print:text-black">{edu.startDate} – {edu.endDate || 'Hiện tại'}</span>
                          </div>
                          <div className="text-slate-650 italic print:text-black">{edu.degree}</div>
                          {edu.description && <p className="text-[10px] text-slate-500 mt-0.5">{edu.description}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skills, Certificates, Languages Grid */}
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    
                    {cvData.skills.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <h3 className={`text-xs font-extrabold uppercase tracking-wider ${activeColor.primary} pb-0.5 flex items-center gap-1.5`}>
                          <Wrench className="h-3.5 w-3.5 stroke-[2.5]" />
                          {t('skillsUpper')}
                        </h3>
                        <div className="flex flex-col gap-1 text-xs">
                          {cvData.skills.map((grp) => (
                            <div key={grp.id} className="leading-snug">
                              <span className="font-bold text-slate-850">{grp.category}: </span>
                              <span className="text-slate-700">{grp.skills.join(", ")}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-4">
                      {/* Certificates */}
                      {cvData.certificates.length > 0 && (
                        <div className="flex flex-col gap-1">
                          <h3 className={`text-xs font-extrabold uppercase tracking-wider ${activeColor.primary} pb-0.5 flex items-center gap-1.5`}>
                            <Award className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('certificatesUpper')}
                          </h3>
                          {cvData.certificates.map((c) => (
                            <div key={c.id} className="text-xs text-slate-750">
                              <span className="font-bold text-slate-900">{c.name}</span> <span className="text-[10px] text-slate-550">({c.date})</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Languages */}
                      {cvData.languages.length > 0 && (
                        <div className="flex flex-col gap-1">
                          <h3 className={`text-xs font-extrabold uppercase tracking-wider ${activeColor.primary} pb-0.5 flex items-center gap-1.5`}>
                            <Languages className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('languagesUpper')}
                          </h3>
                          <div className="text-xs text-slate-750 flex flex-col gap-0.5">
                            {cvData.languages.map((l) => (
                              <div key={l.id}>
                                <span className="font-bold text-slate-900">{l.name}</span>: {l.level}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              )}

              {/* ========================================================
                  TEMPLATE 3: CREATIVE TECH (Modern pill badges)
                 ======================================================== */}
              {template === 'creative' && (
                <div className="flex flex-col flex-1 gap-6 text-sm">
                  
                  {/* Creative Header */}
                  <div className={`flex flex-col md:flex-row justify-between items-center gap-4 ${activeColor.bg} text-white p-6 rounded-2xl print:bg-white print:text-black print:p-0 print:border-b-2 print:border-black print:rounded-none`}>
                    <div className="flex items-center gap-4">
                      {cvData.personalInfo.avatar && (
                        <img 
                          src={cvData.personalInfo.avatar} 
                          alt="Avatar" 
                          className="w-16 h-16 rounded-full object-cover border-2 border-white print:border-slate-800" 
                        />
                      )}
                      <div>
                        <h1 className="text-3xl font-black tracking-tight text-white m-0 print:text-black">
                          {cvData.personalInfo.fullName || "HỌ VÀ TÊN"}
                        </h1>
                        <div className={`inline-block ${activeColor.lightBg} ${activeColor.primary} px-3 py-0.5 rounded-full text-xs font-bold mt-2 font-mono print:bg-slate-100 print:text-black print:border-slate-300`}>
                          {cvData.personalInfo.title || "VỊ TRÍ ỨNG TUYỂN"}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 text-slate-100 text-xs font-mono sm:items-end mt-2 md:mt-0 print:text-black">
                      <div>{cvData.personalInfo.email}</div>
                      {cvData.personalInfo.phone && <div>{cvData.personalInfo.phone}</div>}
                      {cvData.personalInfo.location && <div>{cvData.personalInfo.location}</div>}
                      <div className="flex flex-wrap gap-2 mt-1 md:justify-end">
                        {cvData.personalInfo.github && <span className="bg-white/15 text-white px-2 py-0.5 rounded text-[10px] font-bold border border-white/10 print:bg-slate-50 print:border-slate-300 print:text-black">GitHub</span>}
                        {cvData.personalInfo.linkedin && <span className="bg-white/15 text-white px-2 py-0.5 rounded text-[10px] font-bold border border-white/10 print:bg-slate-50 print:border-slate-300 print:text-black">LinkedIn</span>}
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  {cvData.summary && (
                    <div className={`${activeColor.lightBg} p-4 rounded-xl border border-slate-200/40 print:bg-white print:p-0 print:border-none`}>
                      <p className="text-xs leading-relaxed text-slate-750 font-medium text-justify">{cvData.summary}</p>
                    </div>
                  )}

                  {/* Linear details */}
                  <div className="flex flex-col gap-6">
                    
                    {/* Experience */}
                    {cvData.experience.length > 0 && (
                      <div className="flex flex-col gap-4">
                        <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} flex items-center gap-1.5`}>
                          <Briefcase className="h-3.5 w-3.5 stroke-[2.5]" />
                          {t('experienceUpper')}
                        </h3>
                        {cvData.experience.map((exp) => (
                          <div key={exp.id} className={`border-l-2 ${activeColor.border} pl-4 py-0.5 flex flex-col gap-1 relative print:border-slate-300`}>
                            <div className="flex justify-between items-start text-xs">
                              <div>
                                <span className="font-extrabold text-slate-900 text-sm">{exp.company}</span>
                                <span className={`mx-2 ${activeColor.primary}`}>•</span>
                                <span className="font-bold text-slate-850">{exp.position}</span>
                              </div>
                              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded print:bg-slate-50 print:border print:border-slate-200">{exp.startDate} – {exp.endDate || 'Hiện tại'}</span>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-650 font-medium whitespace-pre-line mt-1 print:text-black">
                              {exp.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Projects */}
                    {cvData.projects.length > 0 && (
                      <div className="flex flex-col gap-4">
                        <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} flex items-center gap-1.5`}>
                          <FolderGit2 className="h-3.5 w-3.5 stroke-[2.5]" />
                          {t('projectsUpper')}
                        </h3>
                        {cvData.projects.map((proj) => (
                          <div key={proj.id} className={`border-l-2 ${activeColor.border} pl-4 py-0.5 flex flex-col gap-1 print:border-slate-300`}>
                            <div className="flex justify-between items-center text-xs">
                              <div>
                                <span className="font-extrabold text-slate-900 text-sm">{proj.name}</span>
                                <span className="text-slate-400 mx-1.5">•</span>
                                <span className="text-[10px] text-slate-550 font-semibold italic">{proj.role}</span>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-slate-400 print:text-black">{proj.startDate}</span>
                            </div>
                            {proj.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-0.5">
                                  {proj.technologies.map((tech, idx) => (
                                    <span key={idx} className={`${activeColor.pill} rounded px-2 py-0.5 text-[9px] font-bold font-mono`}>
                                      {tech}
                                    </span>
                                  ))}
                              </div>
                            )}
                            <p className="text-xs leading-relaxed text-slate-650 font-medium whitespace-pre-line mt-1 print:text-black">
                              {proj.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Skills Group Grid layout */}
                    {cvData.skills.length > 0 && (
                      <div className="flex flex-col gap-3">
                        <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} flex items-center gap-1.5`}>
                          <Wrench className="h-3.5 w-3.5 stroke-[2.5]" />
                          {t('skillsUpper')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {cvData.skills.map((grp) => (
                            <div key={grp.id} className="bg-slate-50 border border-slate-150 p-3 rounded-xl print:bg-white print:border-slate-300">
                              <span className="text-xs font-bold text-slate-850 block mb-1.5 border-b pb-0.5 print:border-slate-300">{grp.category}</span>
                              <div className="flex flex-wrap gap-1">
                                {grp.skills.map((s, idx) => (
                                  <span key={idx} className="bg-white border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-semibold print:bg-slate-50 print:border-slate-300 print:text-black">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education, Certificates and Languages split */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Education */}
                      {cvData.education.length > 0 && (
                        <div className="flex flex-col gap-3">
                          <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} flex items-center gap-1.5`}>
                            <GraduationCap className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('educationUpper')}
                          </h3>
                          {cvData.education.map((edu) => (
                            <div key={edu.id} className="flex flex-col gap-0.5 text-xs">
                              <div className="flex justify-between items-start font-bold">
                                <span className="text-slate-900 font-extrabold">{edu.institution}</span>
                                <span className="text-[10px] font-mono text-slate-500 print:text-black">{edu.startDate} – {edu.endDate || 'Hiên tại'}</span>
                              </div>
                              <div className={`font-semibold ${activeColor.primary} print:text-black`}>{edu.degree}</div>
                              {edu.description && <p className="text-[10px] text-slate-500 italic mt-0.5">{edu.description}</p>}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Certificates & Languages */}
                      <div className="flex flex-col gap-4">
                        {/* Certificates */}
                        {cvData.certificates.length > 0 && (
                          <div className="flex flex-col gap-2">
                            <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} flex items-center gap-1.5`}>
                              <Award className="h-3.5 w-3.5 stroke-[2.5]" />
                              {t('certificatesUpper')}
                            </h3>
                            <div className="flex flex-col gap-1.5 text-xs text-slate-750">
                              {cvData.certificates.map((c) => (
                                <div key={c.id} className="leading-snug">
                                  <span className="font-extrabold text-slate-900">{c.name}</span> — <span className="text-slate-500 text-[11px] font-medium">{c.issuer} ({c.date})</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Languages */}
                        {cvData.languages.length > 0 && (
                          <div className="flex flex-col gap-2">
                            <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} flex items-center gap-1.5`}>
                              <Languages className="h-3.5 w-3.5 stroke-[2.5]" />
                              {t('languagesUpper')}
                            </h3>
                            <div className="flex flex-col gap-1 text-xs">
                              {cvData.languages.map((l) => (
                                <div key={l.id} className="flex justify-between font-medium">
                                  <span className="font-bold text-slate-900">{l.name}</span>
                                  <span className="text-slate-500 font-mono text-[10px] print:text-black">{l.level}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* ========================================================
                  TEMPLATE 4: EXECUTIVE ELITE (Asymmetrical Layout)
                 ======================================================== */}
              {template === 'executive' && (
                <div className="flex-1 flex flex-col text-sm">
                  {/* Top Header */}
                  <div className={`border-b-[4px] ${activeColor.border} pb-5 mb-5`}>
                    <h1 className="text-3.5xl font-extrabold tracking-tight text-slate-900 leading-tight m-0 uppercase">
                      {cvData.personalInfo.fullName || "HỌ VÀ TÊN"}
                    </h1>
                    <p className={`${activeColor.primary} font-bold text-sm tracking-widest uppercase mt-1.5`}>
                      {cvData.personalInfo.title || "VỊ TRÍ ỨNG TUYỂN"}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-6 flex-1">
                    {/* Left Wide Section (2/3) */}
                    <div className="col-span-2 flex flex-col gap-5 pr-4 border-r border-slate-100 print:border-slate-350">
                      {/* Summary */}
                      {cvData.summary && (
                        <div className="flex flex-col gap-2">
                          <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} font-mono pb-0.5 flex items-center gap-1.5`}>
                            <User className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('summaryUpper')}
                          </h3>
                          <p className="text-xs leading-relaxed text-slate-700 text-justify">{cvData.summary}</p>
                        </div>
                      )}

                      {/* Experience */}
                      {cvData.experience.length > 0 && (
                        <div className="flex flex-col gap-4">
                          <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} font-mono pb-0.5 flex items-center gap-1.5`}>
                            <Briefcase className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('experienceUpper')}
                          </h3>
                          <div className="flex flex-col gap-4">
                            {cvData.experience.map((exp) => (
                              <div key={exp.id} className="flex flex-col gap-1">
                                <div className="flex justify-between items-start text-xs">
                                  <div>
                                    <span className="font-extrabold text-slate-900">{exp.company}</span>
                                    <span className="text-slate-400 mx-1.5">•</span>
                                    <span className={`font-semibold ${activeColor.primary}`}>{exp.position}</span>
                                  </div>
                                  <span className="text-[10px] font-mono font-bold text-slate-400 print:text-black">{exp.startDate} - {exp.endDate || 'Hiện tại'}</span>
                                </div>
                                <p className="text-xs leading-relaxed text-slate-650 whitespace-pre-line mt-1 print:text-black">
                                  {exp.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Projects */}
                      {cvData.projects.length > 0 && (
                        <div className="flex flex-col gap-4">
                          <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} font-mono pb-0.5 flex items-center gap-1.5`}>
                            <FolderGit2 className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('projectsUpper')}
                          </h3>
                          <div className="flex flex-col gap-4">
                            {cvData.projects.map((proj) => (
                              <div key={proj.id} className="flex flex-col gap-1">
                                <div className="flex justify-between items-center text-xs">
                                  <div>
                                    <span className="font-extrabold text-slate-900">{proj.name}</span>
                                    <span className="text-slate-400 mx-1.5">•</span>
                                    <span className="text-[10px] text-slate-550 font-semibold italic">{proj.role}</span>
                                  </div>
                                  <span className="text-[10px] font-mono font-bold text-slate-400 print:text-black">{proj.startDate}</span>
                                </div>
                                <p className="text-xs leading-relaxed text-slate-650 whitespace-pre-line mt-1 print:text-black">
                                  {proj.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Education */}
                      {cvData.education.length > 0 && (
                        <div className="flex flex-col gap-3">
                          <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} font-mono pb-0.5 flex items-center gap-1.5`}>
                            <GraduationCap className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('educationUpper')}
                          </h3>
                          {cvData.education.map((edu) => (
                            <div key={edu.id} className="flex flex-col gap-0.5 text-xs">
                              <div className="flex justify-between items-start">
                                <span className="font-extrabold text-slate-900">{edu.institution}</span>
                                <span className="text-[10px] font-mono font-bold text-slate-400 print:text-black">{edu.startDate} - {edu.endDate || 'Hiện tại'}</span>
                              </div>
                              <div className="text-slate-600 font-semibold">{edu.degree}</div>
                              {edu.description && <p className="text-[11px] text-slate-500 italic mt-0.5">{edu.description}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Narrow Column (1/3) with beautiful Glassmorphism sidebar styling */}
                    <div className="col-span-1 flex flex-col gap-5 glass-sidebar">
                      {cvData.personalInfo.avatar && (
                        <div className="flex justify-center mb-1">
                          <img 
                            src={cvData.personalInfo.avatar} 
                            alt="Avatar" 
                            className={`w-24 h-24 rounded-full object-cover border-2 ${activeColor.border} p-0.5`} 
                          />
                        </div>
                      )}
                      {/* Contacts Info */}
                      <div className="flex flex-col gap-2">
                        <h4 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} font-mono border-b border-slate-250 pb-1 mb-1`}>
                          {t('personalInfo')}
                        </h4>
                        <div className="flex flex-col gap-1.5 text-xs text-slate-700">
                          <div className="truncate" title={cvData.personalInfo.email}>
                            <span className="font-bold text-slate-800">Email:</span> {cvData.personalInfo.email}
                          </div>
                          {cvData.personalInfo.phone && (
                            <div>
                              <span className="font-bold text-slate-800">SĐT:</span> {cvData.personalInfo.phone}
                            </div>
                          )}
                          {cvData.personalInfo.location && (
                            <div>
                              <span className="font-bold text-slate-800">ĐC:</span> {cvData.personalInfo.location}
                            </div>
                          )}
                          {cvData.personalInfo.website && (
                            <div className="truncate">
                              <span className="font-bold text-slate-800">Web:</span> {cvData.personalInfo.website.replace(/^https?:\/\//, '')}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Technical Skills */}
                      {cvData.skills.length > 0 && (
                        <div className="flex flex-col gap-3">
                          <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} font-mono pb-1 flex items-center gap-1.5`}>
                            <Wrench className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('skillsUpper')}
                          </h3>
                          {cvData.skills.map((grp) => (
                            <div key={grp.id} className="flex flex-col gap-1">
                              <span className="text-xs font-bold text-slate-850">{grp.category}</span>
                              <div className="flex flex-wrap gap-1">
                                {grp.skills.map((s, idx) => (
                                  <span key={idx} className={`${activeColor.pill} px-2 py-0.5 rounded text-[10px] font-semibold`}>
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Languages */}
                      {cvData.languages.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} font-mono pb-1 flex items-center gap-1.5`}>
                            <Languages className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('languagesUpper')}
                          </h3>
                          <div className="flex flex-col gap-1.5">
                            {cvData.languages.map((l) => (
                              <div key={l.id} className="text-xs flex flex-col gap-0.5">
                                <span className="font-bold text-slate-850">{l.name}</span>
                                <span className="text-[10px] text-slate-550 font-mono">{l.level}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certificates */}
                      {cvData.certificates.length > 0 && (
                        <div className="flex flex-col gap-3">
                          <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} font-mono pb-1 flex items-center gap-1.5`}>
                            <Award className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('certificatesUpper')}
                          </h3>
                          {cvData.certificates.map((c) => (
                            <div key={c.id} className="text-xs flex flex-col gap-0.5">
                              <span className="font-bold text-slate-855 leading-snug">{c.name}</span>
                              <span className="text-[10px] text-slate-550 font-medium">{c.issuer} ({c.date})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  TEMPLATE 5: MINIMAL SERIF (Elegant Editorial Layout)
                 ======================================================== */}
              {template === 'minimal' && (
                <div className="flex flex-col flex-1 gap-6 text-sm">
                  {/* Elegant Editorial Header */}
                  <div className="text-center flex flex-col items-center gap-1.5 pb-4 border-b border-slate-250 print:border-slate-350">
                    {cvData.personalInfo.avatar && (
                      <img 
                        src={cvData.personalInfo.avatar} 
                        alt="Avatar" 
                        className="w-20 h-20 rounded-full object-cover border border-slate-300 mb-2" 
                      />
                    )}
                    <h1 className="text-3.5xl font-light tracking-wide text-slate-900 uppercase font-serif">
                      {cvData.personalInfo.fullName || "HỌ VÀ TÊN"}
                    </h1>
                    <p className={`${activeColor.primary} font-semibold text-xs tracking-widest uppercase font-serif`}>
                      {cvData.personalInfo.title || "VỊ TRÍ ỨNG TUYỂN"}
                    </p>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-slate-500 text-xs font-mono mt-1 print:text-black">
                      <span>{cvData.personalInfo.email}</span>
                      {cvData.personalInfo.phone && <span>• {cvData.personalInfo.phone}</span>}
                      {cvData.personalInfo.location && <span>• {cvData.personalInfo.location}</span>}
                      {cvData.personalInfo.website && <span>• {cvData.personalInfo.website.replace(/^https?:\/\//, '')}</span>}
                    </div>
                  </div>

                  {/* Linear clean sections */}
                  
                  {/* Summary */}
                  {cvData.summary && (
                    <div className="flex flex-col gap-2">
                      <h3 className={`text-xs font-bold tracking-widest uppercase ${activeColor.primary} flex items-center justify-center gap-1.5 font-serif`}>
                        <User className="h-3.5 w-3.5 stroke-[2.5]" />
                        {t('summaryUpper')}
                      </h3>
                      <div className={`w-8 h-0.5 ${activeColor.bg} mx-auto mb-1`}></div>
                      <p className="text-xs leading-relaxed text-slate-700 text-center max-w-xl mx-auto italic">
                        "{cvData.summary}"
                      </p>
                    </div>
                  )}

                  {/* Experience */}
                  {cvData.experience.length > 0 && (
                    <div className="flex flex-col gap-4">
                      <h3 className={`text-xs font-bold tracking-widest uppercase ${activeColor.primary} flex items-center justify-center gap-1.5 font-serif`}>
                        <Briefcase className="h-3.5 w-3.5 stroke-[2.5]" />
                        {t('experienceUpper')}
                      </h3>
                      <div className={`w-8 h-0.5 ${activeColor.bg} mx-auto mb-2`}></div>
                      <div className="flex flex-col gap-4">
                        {cvData.experience.map((exp) => (
                          <div key={exp.id} className="flex flex-col gap-1">
                            <div className="flex justify-between items-baseline text-xs">
                              <div>
                                <span className="font-bold text-slate-900 font-serif text-sm">{exp.company}</span>
                                <span className="mx-2 text-slate-450">•</span>
                                <span className="text-slate-655 font-medium italic">{exp.position}</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 print:text-black">{exp.startDate} – {exp.endDate || 'Hiện tại'}</span>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-655 text-justify mt-0.5 whitespace-pre-line print:text-black">
                              {exp.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {cvData.projects.length > 0 && (
                    <div className="flex flex-col gap-4">
                      <h3 className={`text-xs font-bold tracking-widest uppercase ${activeColor.primary} flex items-center justify-center gap-1.5 font-serif`}>
                        <FolderGit2 className="h-3.5 w-3.5 stroke-[2.5]" />
                        {t('projectsUpper')}
                      </h3>
                      <div className={`w-8 h-0.5 ${activeColor.bg} mx-auto mb-2`}></div>
                      <div className="flex flex-col gap-4">
                        {cvData.projects.map((proj) => (
                          <div key={proj.id} className="flex flex-col gap-1">
                            <div className="flex justify-between items-baseline text-xs">
                              <div>
                                <span className="font-bold text-slate-900 font-serif text-sm">{proj.name}</span>
                                <span className="mx-2 text-slate-450">•</span>
                                <span className="text-slate-500 font-medium italic text-[11px]">{proj.role}</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 print:text-black">{proj.startDate}</span>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-655 text-justify mt-0.5 whitespace-pre-line print:text-black">
                              {proj.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Grid elements at bottom */}
                  <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-4 print:border-slate-350">
                    
                    {/* Left Grid: Education & Certs */}
                    <div className="flex flex-col gap-5">
                      {/* Education */}
                      {cvData.education.length > 0 && (
                        <div className="flex flex-col gap-3">
                          <h3 className={`text-xs font-bold tracking-widest uppercase ${activeColor.primary} flex items-center gap-1.5 font-serif`}>
                            <GraduationCap className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('educationUpper')}
                          </h3>
                          {cvData.education.map((edu) => (
                            <div key={edu.id} className="flex flex-col gap-0.5 text-xs">
                              <div className="flex justify-between items-start font-bold">
                                <span className="text-slate-900 font-serif">{edu.institution}</span>
                                <span className="text-[9px] font-mono text-slate-400 print:text-black">{edu.startDate} – {edu.endDate || 'Hiện tại'}</span>
                              </div>
                              <div className="text-slate-500 font-medium italic">{edu.degree}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Certificates */}
                      {cvData.certificates.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <h3 className={`text-xs font-bold tracking-widest uppercase ${activeColor.primary} flex items-center gap-1.5 font-serif`}>
                            <Award className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('certificatesUpper')}
                          </h3>
                          {cvData.certificates.map((c) => (
                            <div key={c.id} className="text-xs text-slate-770 leading-snug">
                              <span className="font-bold text-slate-900 font-serif">{c.name}</span>
                              <span className="text-[10px] text-slate-550 block">{c.issuer} ({c.date})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Grid: Skills & Languages */}
                    <div className="flex flex-col gap-5">
                      {/* Skills */}
                      {cvData.skills.length > 0 && (
                        <div className="flex flex-col gap-3">
                          <h3 className={`text-xs font-bold tracking-widest uppercase ${activeColor.primary} flex items-center gap-1.5 font-serif`}>
                            <Wrench className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('skillsUpper')}
                          </h3>
                          <div className="flex flex-col gap-2 text-xs">
                            {cvData.skills.map((grp) => (
                              <div key={grp.id} className="leading-relaxed">
                                <span className="font-bold text-slate-900 font-serif block">{grp.category}</span>
                                <span className="text-slate-655">{grp.skills.join(", ")}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Languages */}
                      {cvData.languages.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <h3 className={`text-xs font-bold tracking-widest uppercase ${activeColor.primary} flex items-center gap-1.5 font-serif`}>
                            <Languages className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('languagesUpper')}
                          </h3>
                          <div className="text-xs flex flex-col gap-1">
                            {cvData.languages.map((l) => (
                              <div key={l.id} className="flex justify-between">
                                <span className="font-bold text-slate-900 font-serif">{l.name}</span>
                                <span className="text-slate-500 font-mono text-[10px] print:text-black">{l.level}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              )}

            </div>
          </div>
        </section>

      </main>

      {/* ==========================================
          FOOTER (Hidden when printing)
         ========================================== */}
      <footer className="print:hidden border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 CV Builder Skill. Được xây dựng bài bản bằng React, FastAPI, SQLite và Tailwind v4.</p>
        </div>
      </footer>

      {/* ==========================================
          MODAL: PASSCODE VERIFICATION
         ========================================== */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 mb-2">
              <Lock className="h-5 w-5 text-purple-500" />
              Mở khóa quyền Chỉnh sửa
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Bạn đang yêu cầu quyền chỉnh sửa CV này. Vui lòng nhập mật mã (Passcode) đã thiết lập để tiếp tục.
            </p>

            {verifyError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl mb-4 text-xs font-semibold text-rose-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {verifyError}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">{t('passcode')} chỉnh sửa</label>
                <input
                  type="password"
                  value={verifyPasscodeVal}
                  onChange={(e) => setVerifyPasscodeVal(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowVerifyModal(false);
                    setVerifyPasscodeVal("");
                    setVerifyError("");
                  }}
                  className="px-4 py-2 bg-slate-850 hover:bg-slate-800 rounded-xl text-xs font-semibold transition-all text-slate-300 cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleUnlockVerify}
                  disabled={isLoading}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-xs font-bold text-white rounded-xl transition-all shadow-md shadow-purple-600/10 flex items-center gap-1 cursor-pointer"
                >
                  {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                  Xác minh
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
