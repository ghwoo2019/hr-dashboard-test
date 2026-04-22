import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserPlus,
  UserMinus,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  ShieldCheck,
  Settings,
  LogOut,
  ChevronRight,
  Search,
  Bell,
  LayoutDashboard,
  Briefcase,
  Star,
  Rocket
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Mock Data
const MOCK_MONTHLY_DATA = [
  { name: '1월', total: 420, in: 15, out: 5 },
  { name: '2월', total: 430, in: 12, out: 2 },
  { name: '3월', total: 440, in: 18, out: 8 },
  { name: '4월', total: 450, in: 14, out: 4 },
  { name: '5월', total: 460, in: 10, out: 0 },
  { name: '6월', total: 472, in: 20, out: 8 },
];

const MOCK_DEPT_DATA = [
  { name: '경영지원', value: 45 },
  { name: 'R&D 본부', value: 180 },
  { name: '마케팅', value: 65 },
  { name: '영업본부', value: 120 },
  { name: '디자인실', value: 62 },
];

const RECENT_CHANGES = [
  { id: 1, name: '김철수', type: '승진', dept: 'R&D', date: '2024.06.01', role: '수석연구원' },
  { id: 2, name: '이영희', type: '입사', dept: '디자인', date: '2024.06.03', role: '선임디자이너' },
  { id: 3, name: '박지민', type: '전보', dept: '마케팅', date: '2024.06.05', role: '팀장' },
  { id: 4, name: '최동욱', type: '퇴사', dept: '영업', date: '2024.06.10', role: '매니저' },
];

const CHART_COLORS = ['#00f2ff', '#ff00e5', '#7000ff', '#10b981', '#f59e0b', '#3b82f6'];

// Background Effect Component with fixed random generation
const BackgroundEffect = () => {
  const stars = useMemo(() =>
    [...Array(50)].map((_, i) => ({
      id: i,
      width: Math.random() * 3,
      height: Math.random() * 3,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 5 + 3,
    })),
    []
  );

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#050b18]">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#7000ff]/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00f2ff]/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 opacity-30">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full"
            style={{
              width: star.width + 'px',
              height: star.height + 'px',
              top: star.top + '%',
              left: star.left + '%',
              animation: `twinkle ${star.duration}s infinite linear`
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

// Glass Card Component
const GlassCard = ({ children, className = "", title, icon: Icon, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`relative overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-6 ${className}`}
  >
    {title && (
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-[#00f2ff]" />}
          <h3 className="text-lg font-semibold text-white/90">{title}</h3>
        </div>
        <div className="w-2 h-2 rounded-full bg-[#00f2ff] shadow-[0_0_8px_#00f2ff]" />
      </div>
    )}
    {children}
  </motion.div>
);

// Stat Box Component
const StatBox = ({ label, value, change, icon: Icon, color }: any) => (
  <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all duration-300 group">
    <div className="flex justify-between items-start">
      <div className={`p-2 rounded-lg bg-opacity-20`} style={{ backgroundColor: `${color}33` }}>
        <Icon className="w-6 h-6" style={{ color: color }} />
      </div>
      <span className={`text-xs font-medium ${change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
        {change >= 0 ? '+' : ''}{change}%
      </span>
    </div>
    <div className="mt-2">
      <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{label}</p>
      <h4 className="text-2xl font-bold text-white mt-1">{value}</h4>
    </div>
    <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-1000" style={{ width: '70%', backgroundColor: color }} />
    </div>
  </div>
);

// Main App Component
export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    // Simulate auth check
    setLoading(false);
    setIsAdmin(true);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050b18] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#00f2ff]/20 border-t-[#00f2ff] rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Rocket className="w-6 h-6 text-[#00f2ff] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    console.log('Logout');
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen text-slate-200 font-sans selection:bg-[#00f2ff]/30">
        <BackgroundEffect />
        <nav className="fixed left-0 top-0 h-full w-20 md:w-64 backdrop-blur-2xl bg-black/40 border-r border-white/10 z-50 flex flex-col transition-all duration-300">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00f2ff] to-[#7000ff] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,242,255,0.4)]">
              <Star className="text-white w-6 h-6 fill-current" />
            </div>
            <span className="hidden md:block font-bold text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              HR INSIGHT
            </span>
          </div>
          <div className="flex-1 px-4 py-8 space-y-2">
            {[
              { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
              { id: 'personnel', label: '인력현황', icon: Users },
              { id: 'admin', label: '인사관리', icon: ShieldCheck, restricted: true },
              { id: 'settings', label: '설정', icon: Settings },
            ].map((item) => (
              (!item.restricted || isAdmin) && (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    activeTab === item.id
                      ? 'bg-white/10 text-[#00f2ff] shadow-[inset_0_0_10px_rgba(0,242,255,0.1)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'drop-shadow-[0_0_5px_#00f2ff]' : ''} group-hover:translate-y-[-1px] transition-transform`} />
                  <span className="hidden md:block font-medium">{item.label}</span>
                  {activeTab === item.id && (
                    <motion.div layoutId="nav-pill" className="absolute left-0 w-1 h-8 bg-[#00f2ff] rounded-r-full shadow-[0_0_10px_#00f2ff]" />
                  )}
                </button>
              )
            ))}
          </div>
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:block font-medium">로그아웃</span>
            </button>
          </div>
        </nav>

        <main className="ml-20 md:ml-64 p-6 md:p-10 min-h-screen">
          <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                {activeTab === 'dashboard' ? 'Executive Overview' :
                  activeTab === 'personnel' ? 'Personnel Assets' :
                    activeTab === 'admin' ? 'Strategic HR Management' : 'System Configuration'}
              </h1>
              <p className="text-slate-400 mt-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Real-time update: {new Date().toLocaleDateString('ko-KR')} 기준 데이터
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#00f2ff] transition-colors" />
                <input
                  type="text"
                  placeholder="임직원 검색..."
                  className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 outline-none focus:border-[#00f2ff]/50 focus:bg-white/10 transition-all w-64"
                />
              </div>
              <button className="relative p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <Bell className="w-5 h-5 text-slate-300" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#050b18]" />
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-white">Admin User</p>
                  <p className="text-xs text-[#00f2ff]">경영진(CEO)</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-white/20 p-[2px]">
                  <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                    <Users className="w-6 h-6 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatBox label="전체 임직원" value="472 명" change={4.2} icon={Users} color="#00f2ff" />
                  <StatBox label="이번 달 입사" value="20 명" change={12.5} icon={UserPlus} color="#7000ff" />
                  <StatBox label="이번 달 퇴사" value="8 명" change={-5.2} icon={UserMinus} color="#ff00e5" />
                  <StatBox label="이직률 (연간)" value="3.1%" change={-0.4} icon={TrendingUp} color="#10b981" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <GlassCard title="월별 인력 변동 추이" icon={BarChart3} className="lg:col-span-2" delay={0.1}>
                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MOCK_MONTHLY_DATA}>
                          <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#00f2ff" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                          <Area type="monotone" dataKey="total" stroke="#00f2ff" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </GlassCard>

                  <GlassCard title="부서별 인원 분포" icon={PieIcon} delay={0.2}>
                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={MOCK_DEPT_DATA} innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value">
                            {MOCK_DEPT_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="rgba(255,255,255,0.1)" />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                          <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px', color: '#fff' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </GlassCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <GlassCard title="최근 인사 발령 현황" icon={Briefcase} delay={0.3}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">이름</th>
                            <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">구분</th>
                            <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">부서</th>
                            <th className="pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">일자</th>
                            <th className="pb-4 text-right"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {RECENT_CHANGES.map((change) => (
                            <tr key={change.id} className="group hover:bg-white/5 transition-colors">
                              <td className="py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-[#00f2ff]">
                                    {change.name[0]}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-white">{change.name}</p>
                                    <p className="text-xs text-slate-500">{change.role}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4">
                    
(Content truncated due to size limit. Use line ranges to read remaining content)
