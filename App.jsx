import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, BookOpen, PlaySquare, MessageCircle, Menu, X, Send, 
  User, Bot, AlertCircle, FilePlus, Save, 
  Trash2, FileText, Download, Upload, Eye, Lock, Unlock, MessageSquare, Filter, CheckCircle2
} from 'lucide-react';

// --- CẤU HÌNH HỆ THỐNG ---
const GRADES = ["Khối 10", "Khối 11", "Khối 12"];
const PROGRAMS = ["Cánh Diều", "Kết nối tri thức", "Chân trời sáng tạo"];
const apiKey = ""; 
const SYSTEM_INSTRUCTION = `Bạn là Trợ lý ảo GDQP&AN. Chỉ trả lời kiến thức quốc phòng Việt Nam. Từ chối nội dung nhạy cảm, phản động.`;

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // State lưu trữ dữ liệu
  const [uploadedFiles, setUploadedFiles] = useState(() => {
    const saved = localStorage.getItem('gdqp_files_v3');
    return saved ? JSON.parse(saved) : [];
  });

  const [feedbacks, setFeedbacks] = useState(() => {
    const saved = localStorage.getItem('gdqp_feedbacks_v2');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('gdqp_files_v3', JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

  useEffect(() => {
    localStorage.setItem('gdqp_feedbacks_v2', JSON.stringify(feedbacks));
  }, [feedbacks]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* HEADER */}
      <header className="bg-emerald-900 text-white shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <ShieldCheck size={32} className="text-yellow-400" />
            <span className="text-xl font-bold uppercase tracking-tighter">GDQP&AN PRO</span>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<ShieldCheck size={18} />} text="Trang chủ" />
            <NavButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<BookOpen size={18} />} text="Sách & Tài liệu" />
            <NavButton active={activeTab === 'practice'} onClick={() => setActiveTab('practice')} icon={<PlaySquare size={18} />} text="Video" />
            <NavButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageCircle size={18} />} text="Trợ lý AI" />
            <NavButton active={activeTab === 'feedback'} onClick={() => setActiveTab('feedback')} icon={<MessageSquare size={18} />} text="Góp ý" />
          </nav>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsAdmin(!isAdmin)}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${isAdmin ? 'bg-yellow-500 border-yellow-600 text-emerald-950' : 'bg-emerald-800 border-emerald-700 text-emerald-300'}`}
            >
              {isAdmin ? <Unlock size={14} /> : <Lock size={14} />}
              <span>{isAdmin ? 'QUẢN TRỊ VIÊN' : 'NGƯỜI DÙNG'}</span>
            </button>
            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-emerald-800 text-white p-4 space-y-2 border-t border-emerald-700">
          <MobileNavBtn onClick={() => {setActiveTab('home'); setIsMobileMenuOpen(false)}} text="Trang chủ" />
          <MobileNavBtn onClick={() => {setActiveTab('theory'); setIsMobileMenuOpen(false)}} text="Sách & Tài liệu" />
          <MobileNavBtn onClick={() => {setActiveTab('practice'); setIsMobileMenuOpen(false)}} text="Video thực hành" />
          <MobileNavBtn onClick={() => {setActiveTab('chat'); setIsMobileMenuOpen(false)}} text="Trợ lý AI" />
          <MobileNavBtn onClick={() => {setActiveTab('feedback'); setIsMobileMenuOpen(false)}} text="Góp ý ẩn danh" />
        </div>
      )}

      {/* CONTENT */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {activeTab === 'home' && <HomeSection setActiveTab={setActiveTab} isAdmin={isAdmin} />}
        {activeTab === 'theory' && (
          <TheorySection 
            uploadedFiles={uploadedFiles} 
            setUploadedFiles={setUploadedFiles} 
            isAdmin={isAdmin} 
          />
        )}
        {activeTab === 'practice' && <PracticeSection />}
        {activeTab === 'chat' && <ChatSection />}
        {activeTab === 'feedback' && <FeedbackSection feedbacks={feedbacks} setFeedbacks={setFeedbacks} isAdmin={isAdmin} />}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-yellow-500 font-bold uppercase tracking-widest mb-2">Học viện Quốc phòng Số Việt Nam</p>
          <p className="text-sm">Hệ thống sandbox lưu trữ & quản lý bài giảng chuyên sâu</p>
        </div>
      </footer>
    </div>
  );
};

// --- COMPONENTS ---

const NavButton = ({ active, onClick, icon, text }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
      active ? 'bg-emerald-700 text-white shadow-inner' : 'hover:bg-emerald-800 text-emerald-100'
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{text}</span>
  </button>
);

const MobileNavBtn = ({ onClick, text }) => (
  <button onClick={onClick} className="w-full text-left py-3 px-4 hover:bg-emerald-700 rounded-lg font-medium">{text}</button>
);

const HomeSection = ({ setActiveTab, isAdmin }) => (
  <div className="py-12 flex flex-col items-center text-center animate-in fade-in duration-700">
    <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center mb-6 shadow-xl border-4 border-white rotate-3 group hover:rotate-0 transition-transform">
      <ShieldCheck size={48} className="text-emerald-700" />
    </div>
    <h1 className="text-5xl font-black text-slate-800 mb-4 tracking-tighter">
      GIÁO DỤC <span className="text-emerald-600 italic">QUỐC PHÒNG</span>
    </h1>
    <p className="text-slate-500 max-w-2xl mb-10 text-lg leading-relaxed font-medium">
      Nền tảng quản lý tài liệu và hỗ trợ huấn luyện Quốc phòng - An ninh theo chuẩn chương trình 2018.
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
      <FeatureCard icon={<BookOpen className="text-blue-600" />} title="Kho Tài Liệu" sub="Phân loại theo Khối & Sách" onClick={() => setActiveTab('theory')} />
      <FeatureCard icon={<PlaySquare className="text-red-600" />} title="Video Bài Giảng" sub="Trực quan & Sinh động" onClick={() => setActiveTab('practice')} />
      <FeatureCard icon={<Bot className="text-emerald-600" />} title="Trợ Lý Thông Minh" sub="Hỗ trợ giải đáp 24/7" onClick={() => setActiveTab('chat')} />
    </div>
  </div>
);

const FeatureCard = ({ icon, title, sub, onClick }) => (
  <div onClick={onClick} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group">
    <div className="bg-slate-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:scale-110 transition-all shadow-inner">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-1">{title}</h3>
    <p className="text-slate-400 text-xs font-medium">{sub}</p>
  </div>
);

// --- TAB: SÁCH & TÀI LIỆU ---
const TheorySection = ({ uploadedFiles, setUploadedFiles, isAdmin }) => {
  const [filterGrade, setFilterGrade] = useState("Tất cả");
  const [filterProgram, setFilterProgram] = useState("Tất cả");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  // Form upload state
  const [newFileGrade, setNewFileGrade] = useState(GRADES[0]);
  const [newFileProgram, setNewFileProgram] = useState(PROGRAMS[0]);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && isAdmin) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = {
          id: Date.now(),
          name: file.name,
          grade: newFileGrade,
          program: newFileProgram,
          date: new Date().toLocaleDateString(),
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          content: reader.result // Lưu base64 để download thật
        };
        setUploadedFiles([fileData, ...uploadedFiles]);
        setShowUploadModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteFile = (id) => {
    if (confirm("Xóa tài liệu này khỏi hệ thống?")) {
      setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
    }
  };

  const downloadFile = (file) => {
    const link = document.createElement('a');
    link.href = file.content || "#";
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredFiles = uploadedFiles.filter(f => 
    (filterGrade === "Tất cả" || f.grade === filterGrade) &&
    (filterProgram === "Tất cả" || f.program === filterProgram)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in slide-in-from-bottom-4">
      {/* FILTER BAR */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 px-2 py-1 bg-slate-100 rounded-lg text-slate-500">
            <Filter size={16} />
            <span className="text-xs font-bold uppercase">Bộ lọc</span>
          </div>
          <select value={filterGrade} onChange={e => setFilterGrade(e.target.value)} className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-emerald-500">
            <option>Tất cả Khối</option>
            {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select value={filterProgram} onChange={e => setFilterProgram(e.target.value)} className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-emerald-500">
            <option>Tất cả Chương trình</option>
            {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {isAdmin && (
          <button 
            onClick={() => setShowUploadModal(true)}
            className="w-full lg:w-auto bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 transition-all active:scale-95"
          >
            <Upload size={18} /> Đăng tải tài liệu mới
          </button>
        )}
      </div>

      {/* FILE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFiles.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100 flex flex-col items-center">
            <div className="bg-slate-50 p-4 rounded-full mb-4"><FileText size={40} className="text-slate-200"/></div>
            <p className="text-slate-400 font-medium italic">Không tìm thấy tài liệu phù hợp.</p>
          </div>
        ) : (
          filteredFiles.map(file => (
            <div key={file.id} className="bg-white p-6 rounded-[32px] border border-slate-200 hover:shadow-2xl transition-all group flex flex-col h-full">
              <div className="flex justify-between items-start mb-5">
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-sm">
                  <FileText size={32} />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setPreviewFile(file)} className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Xem nhanh"><Eye size={20}/></button>
                  <button onClick={() => downloadFile(file)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Tải xuống"><Download size={20}/></button>
                  {isAdmin && (
                    <button onClick={() => deleteFile(file.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Xóa"><Trash2 size={20}/></button>
                  )}
                </div>
              </div>
              <h4 className="font-bold text-slate-800 mb-4 line-clamp-2 text-lg leading-tight flex-grow">{file.name}</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-wider">{file.grade}</span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider">{file.program}</span>
              </div>
              <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                <span>{file.size}</span>
                <span>{file.date}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* UPLOAD MODAL (ADMIN) */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-slate-800">Tải lên tài liệu</h3>
              <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={24}/></button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-2 px-1">Chọn Khối Lớp</label>
                <div className="grid grid-cols-3 gap-2">
                  {GRADES.map(g => (
                    <button key={g} onClick={() => setNewFileGrade(g)} className={`py-2 text-xs font-bold rounded-xl border-2 transition-all ${newFileGrade === g ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>{g}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-2 px-1">Chọn Chương Trình</label>
                <div className="space-y-2">
                  {PROGRAMS.map(p => (
                    <button key={p} onClick={() => setNewFileProgram(p)} className={`w-full py-3 px-4 text-left text-sm font-bold rounded-2xl border-2 transition-all flex justify-between items-center ${newFileProgram === p ? 'bg-emerald-50 border-emerald-600 text-emerald-800' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                      {p} {newFileProgram === p && <CheckCircle2 size={18}/>}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-4">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf" />
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="w-full bg-slate-900 text-white py-4 rounded-3xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                >
                  <FilePlus size={20}/> Chọn File PDF để hoàn tất
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewFile && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-800 text-xl">{previewFile.name}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase">{previewFile.grade} • {previewFile.program}</p>
              </div>
              <button onClick={() => setPreviewFile(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={24}/></button>
            </div>
            <div className="flex-grow bg-slate-200 flex items-center justify-center p-10 overflow-y-auto">
              <div className="bg-white shadow-2xl w-full max-w-2xl min-h-[800px] p-12 text-center flex flex-col items-center justify-center">
                <FileText size={120} className="text-red-100 mb-8" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Chế độ Xem trước Sandbox</h2>
                <p className="text-slate-400 max-w-sm">Tài liệu "{previewFile.name}" hiện đang ở dạng giả lập. Vui lòng bấm "Tải xuống" để xem nội dung đầy đủ trên máy tính của đồng chí.</p>
                <button onClick={() => downloadFile(previewFile)} className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700">
                  <Download size={20}/> Tải xuống tài liệu gốc
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- TAB: VIDEO THỰC HÀNH ---
const PracticeSection = () => {
  const videos = [
    { id: "ScMzIvxBSi4", title: "Điều lệnh đội ngũ từng người không có súng", tag: "Điều lệnh" },
    { id: "dQw4w9WgXcQ", title: "Các tư thế vận động trên chiến trường", tag: "Chiến thuật" },
    { id: "M5uB06CBy4g", title: "Kỹ thuật tháo lắp súng tiểu liên AK", tag: "Vũ khí" }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
      <div className="text-center">
        <h2 className="text-4xl font-black text-slate-800 mb-2">Thư Viện Thực Hành</h2>
        <p className="text-slate-500 font-medium">Video hướng dẫn kỹ thuật chi tiết theo giáo trình huấn luyện quân sự</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map(v => (
          <div key={v.id} className="bg-white rounded-[32px] shadow-sm overflow-hidden border border-slate-200 flex flex-col group hover:shadow-2xl transition-all">
            <div className="aspect-video bg-black relative">
              <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${v.id}`} allowFullScreen title={v.title}></iframe>
            </div>
            <div className="p-6 flex-grow">
              <span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full mb-3 inline-block tracking-widest border border-emerald-100">{v.tag}</span>
              <h3 className="font-bold text-slate-800 leading-snug text-lg group-hover:text-emerald-700 transition-colors">{v.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- TAB: GÓP Ý ẨN DANH ---
const FeedbackSection = ({ feedbacks, setFeedbacks, isAdmin }) => {
  const [content, setContent] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    const newFeedback = {
      id: Date.now(),
      text: content,
      date: new Date().toLocaleString()
    };
    setFeedbacks([newFeedback, ...feedbacks]);
    setContent('');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const deleteFeedback = (id) => {
    if (confirm("Xác nhận xóa góp ý này?")) {
      setFeedbacks(feedbacks.filter(f => f.id !== id));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in zoom-in-95">
      <div className="text-center">
        <h2 className="text-4xl font-black text-slate-800 mb-2">Hòm Thư Góp Ý</h2>
        <p className="text-slate-500 font-medium">Báo cáo các nội dung sai phạm hoặc đề xuất cải tiến hệ thống</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Form gửi */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm h-fit">
          <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-blue-600"><MessageSquare size={24}/></div>
          <h3 className="text-xl font-bold text-slate-800 mb-4">Gửi phản hồi ẩn danh</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea 
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Nhập nội dung góp ý tại đây... Ý kiến của bạn sẽ được giữ bí mật hoàn toàn."
              className="w-full h-48 p-5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-3xl outline-none transition-all text-sm font-medium leading-relaxed"
            />
            <button 
              type="submit"
              className="w-full bg-emerald-900 text-white py-4 rounded-3xl font-bold hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-100"
            >
              <Send size={18} /> Gửi góp ý ngay
            </button>
            {sent && <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold animate-pulse"><CheckCircle2 size={16}/> Đã gửi thành công!</div>}
          </form>
        </div>

        {/* Danh sách quản lý (Admin có quyền xóa) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Bot size={20} className="text-emerald-600" />
              {isAdmin ? 'Quản lý toàn bộ góp ý' : 'Góp ý cộng đồng'}
            </h3>
            {isAdmin && <span className="text-[10px] font-black bg-red-100 text-red-600 px-2 py-0.5 rounded uppercase">Quản trị</span>}
          </div>
          <div className="space-y-4 h-[550px] overflow-y-auto pr-2 custom-scrollbar">
            {(isAdmin ? feedbacks : feedbacks.slice(0, 5)).map(f => (
              <div key={f.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group hover:border-emerald-200 transition-colors">
                <p className="text-sm text-slate-700 mb-4 leading-relaxed font-medium">"{f.text}"</p>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1"><User size={10}/> User ẩn danh</span>
                  <span>{f.date}</span>
                </div>
                {isAdmin && (
                  <button 
                    onClick={() => deleteFeedback(f.id)}
                    className="absolute top-4 right-4 p-2 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    title="Xóa góp ý tiêu cực/phản động"
                  >
                    <Trash2 size={16}/>
                  </button>
                )}
              </div>
            ))}
            {feedbacks.length === 0 && <div className="text-center py-20 bg-slate-50 rounded-[40px] text-slate-300 italic font-medium">Chưa có dữ liệu góp ý nào.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- CHAT AI ---
const ChatSection = () => {
  const [messages, setMessages] = useState([{ role: 'model', text: 'Chào đồng chí! Tôi có thể giúp gì cho đồng chí về kiến thức Quốc phòng 2018?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  useEffect(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = input; setInput('');
    setMessages(p => [...p, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: messages.concat({ role: 'user', text: userMsg }).map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] }
        })
      });
      const data = await res.json();
      setMessages(p => [...p, { role: 'model', text: data.candidates?.[0]?.content?.parts?.[0]?.text || "Lỗi phản hồi." }]);
    } catch { setMessages(p => [...p, { role: 'model', text: "Lỗi kết nối." }]); }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[650px] flex flex-col bg-white rounded-[40px] shadow-2xl border border-slate-200 overflow-hidden">
      <div className="bg-emerald-900 p-6 flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md"><Bot size={28} className="text-yellow-400" /></div>
          <div>
            <h2 className="font-black text-lg tracking-tight leading-none">AI TRỢ LÝ QUỐC PHÒNG</h2>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1 inline-block">Sẵn sàng giải đáp 24/7</span>
          </div>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-8 space-y-6 bg-slate-50/50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-3xl text-sm shadow-sm leading-relaxed font-medium ${m.role === 'user' ? 'bg-emerald-700 text-white rounded-tr-none shadow-emerald-100' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div className="flex items-center gap-2 text-slate-400 text-xs px-2 font-bold uppercase tracking-widest animate-pulse">AI đang phân tích...</div>}
        <div ref={scrollRef} />
      </div>
      <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-100 flex gap-4 items-center">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Hỏi về kiến thức vũ khí, điều lệnh, lịch sử..." className="flex-grow p-4 bg-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-sm font-medium transition-all" />
        <button type="submit" className="bg-emerald-900 text-white p-5 rounded-3xl hover:bg-emerald-800 shadow-xl shadow-emerald-100 transition-transform active:scale-90"><Send size={20} /></button>
      </form>
    </div>
  );
};

export default App;