import React, { useMemo, useRef, useState } from 'react';
import studentsData from './student.json';
import {
  GraduationCap, ShieldCheck, BookOpen, Users, CalendarCheck, FileText,
  UserRound, ArrowLeft, LogOut, Search, Plus, Trash2, UploadCloud, X,
  LayoutDashboard, ChevronRight, CheckCircle2, Clock3, Download, Menu
} from 'lucide-react';

const initialStudents = [
  { id: 1, name: 'Aarav Sharma', className: 'B.Tech CSE', roll: 'CSE2401', section: 'A', batch: '2024', subjects: ['Data Structures', 'DBMS', 'Computer Networks'] },
  { id: 2, name: 'Ananya Verma', className: 'B.Tech CSE', roll: 'CSE2402', section: 'A', batch: '2024', subjects: ['Data Structures', 'DBMS', 'Computer Networks'] },
  { id: 3, name: 'Ishaan Gupta', className: 'B.Tech CSE', roll: 'CSE2403', section: 'A', batch: '2024', subjects: ['Data Structures', 'DBMS', 'Computer Networks'] },
  { id: 4, name: 'Meera Singh', className: 'B.Tech CSE', roll: 'CSE2404', section: 'B', batch: '2024', subjects: ['Data Structures', 'Operating Systems'] },
  { id: 5, name: 'Rohan Mehta', className: 'B.Tech CSE', roll: 'CSE2405', section: 'B', batch: '2024', subjects: ['Data Structures', 'Operating Systems'] },
  { id: 6, name: 'Sara Khan', className: 'B.Tech IT', roll: 'IT2401', section: 'A', batch: '2024', subjects: ['DBMS', 'Computer Networks'] },
  { id: 7, name: 'Dev Patel', className: 'B.Tech CSE', roll: 'CSE2501', section: 'A', batch: '2025', subjects: ['Data Structures', 'DBMS'] },
  { id: 8, name: 'Diya Kapoor', className: 'B.Tech CSE', roll: 'CSE2502', section: 'A', batch: '2025', subjects: ['Data Structures', 'DBMS'] }
];
const initialAssignments = [
  { id: 1, title: 'DSA Practice Sheet 01.pdf', subject: 'Data Structures', className: 'B.Tech CSE', section: 'A', batch: '2024', fileName: 'DSA Practice Sheet 01.pdf', size: 'Demo assignment' },
  { id: 2, title: 'DBMS Normalization.docx', subject: 'DBMS', className: 'B.Tech CSE', section: 'A', batch: '2024', fileName: 'DBMS Normalization.docx', size: 'Demo assignment' },
  { id: 3, title: 'OS Scheduling Worksheet.pdf', subject: 'Operating Systems', className: 'B.Tech CSE', section: 'B', batch: '2024', fileName: 'OS Scheduling Worksheet.pdf', size: 'Demo assignment' }
];
const initialAttendance = {
  '1|Data Structures': 'P', '2|Data Structures': 'P', '3|Data Structures': 'A',
  '4|Data Structures': 'P', '5|Data Structures': 'P', '1|DBMS': 'P',
  '2|DBMS': 'A', '3|DBMS': 'P', '6|DBMS': 'P'
};
const subjects = ['Data Structures', 'DBMS', 'Computer Networks', 'Operating Systems'];
const credentials = {
  admin: { username: 'admin', password: 'admin123' },
  student: { username: 'student', password: 'student123' }
};

function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}
function Select({ value, onChange, children, ...props }) {
  return <select value={value} onChange={onChange} {...props}>{children}</select>;
}
function StatCard({ icon: Icon, label, value, note, tone = 'blue' }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={19}/></div><div className="stat-copy"><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div>;
}
function Empty({ title, message }) {
  return <div className="empty"><div className="empty-icon"><FileText size={23}/></div><strong>{title}</strong><span>{message}</span></div>;
}

export default function App() {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [page, setPage] = useState('overview');
  const [students, setStudents] = useState(initialStudents);
  const [attendance, setAttendance] = useState(initialAttendance);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [notice, setNotice] = useState('');
  const [filter, setFilter] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState({ section: 'A', batch: '2024', subject: 'Data Structures' });
  const [attendanceShown, setAttendanceShown] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', className: '', roll: '', section: 'A', batch: '2024' });
  const [studentLookup, setStudentLookup] = useState({ name: '', className: '', section: 'A' });
  const [assignmentLookup, setAssignmentLookup] = useState({ name: '', className: '', section: 'A', subject: 'Data Structures' });
  const [fileForm, setFileForm] = useState({ subject: 'Data Structures', className: 'B.Tech CSE', section: 'A', batch: '2024' });
  const [mobileMenu, setMobileMenu] = useState(false);
  const uploadRef = useRef(null);

  const notify = (message) => { setNotice(message); window.setTimeout(() => setNotice(''), 3000); };
  const login = (e) => {
    e.preventDefault();
    const valid = credentials[role];
    if (user.trim() === valid.username && password === valid.password) {
      setPage('overview'); setPassword(''); setNotice('');
    } else notify('Incorrect username or password. Try the demo credentials below.');
  };
  const logout = () => { setRole(null); setUser(''); setPassword(''); setPage('overview'); setAttendanceShown(false); };
  const admin = role === 'admin';
  const filteredStudents = useMemo(() => students.filter(s =>
    [s.name, s.roll, s.className, s.section, s.batch].join(' ').toLowerCase().includes(filter.toLowerCase())
  ), [students, filter]);
  const selectedAttendanceStudents = students.filter(s =>
    s.section === attendanceFilter.section && s.batch === attendanceFilter.batch &&
    (s.subjects.includes(attendanceFilter.subject) || s.subjects.length === 0)
  );
  const studentRecord = students.find(s =>
    s.name.trim().toLowerCase() === studentLookup.name.trim().toLowerCase() &&
    s.className.trim().toLowerCase() === studentLookup.className.trim().toLowerCase() &&
    s.section === studentLookup.section
  );
  const assignmentStudent = students.find(s =>
    s.name.trim().toLowerCase() === assignmentLookup.name.trim().toLowerCase() &&
    s.className.trim().toLowerCase() === assignmentLookup.className.trim().toLowerCase() &&
    s.section === assignmentLookup.section
  );
  const studentAssignments = assignments.filter(a => a.subject === assignmentLookup.subject &&
    a.className.toLowerCase() === assignmentLookup.className.trim().toLowerCase() &&
    a.section === assignmentLookup.section && (!assignmentStudent || a.batch === assignmentStudent.batch));
  const markedCount = selectedAttendanceStudents.filter(s => attendance[`${s.id}|${attendanceFilter.subject}`]).length;
  const presentCount = selectedAttendanceStudents.filter(s => attendance[`${s.id}|${attendanceFilter.subject}`] === 'P').length;

  const addStudent = (e) => {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.className.trim() || !addForm.roll.trim()) return notify('Please fill in name, class and roll number.');
    if (students.some(s => s.roll.toLowerCase() === addForm.roll.trim().toLowerCase())) return notify('That roll number already exists.');
    setStudents(prev => [...prev, { id: Math.max(0, ...prev.map(s => s.id)) + 1, name: addForm.name.trim(), className: addForm.className.trim(), roll: addForm.roll.trim(), section: addForm.section, batch: addForm.batch, subjects: [...subjects] }]);
    setAddForm({ name: '', className: '', roll: '', section: 'A', batch: '2024' });
    notify('Student saved successfully');
  };
  const deleteStudent = (id) => {
    const target = students.find(s => s.id === id);
    if (!target || !window.confirm(`Delete ${target.name} (${target.roll})? This cannot be undone in this session.`)) return;
    setStudents(prev => prev.filter(s => s.id !== id));
    setAttendance(prev => Object.fromEntries(Object.entries(prev).filter(([key]) => !key.startsWith(`${id}|`))));
    notify('STUDENT DELETED');
  };
  const uploadAssignment = (e) => {
    e.preventDefault();
    const file = uploadRef.current?.files?.[0];
    if (!file) return notify('Choose a PDF or Word document first.');
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext)) return notify('Only PDF, DOC or DOCX files are accepted.');
    const id = Math.max(0, ...assignments.map(a => a.id)) + 1;
    setAssignments(prev => [...prev, { id, title: file.name, fileName: file.name, file, subject: fileForm.subject, className: fileForm.className, section: fileForm.section, batch: fileForm.batch, size: `${(file.size / 1024).toFixed(0)} KB` }]);
    uploadRef.current.value = '';
    notify('Assignment added successfully');
  };
  const navItems = admin ? [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'add', label: 'Add student', icon: Plus },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'delete', label: 'Delete student', icon: Trash2 }
  ] : [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'viewAttendance', label: 'View attendance', icon: CalendarCheck },
    { id: 'showAssignments', label: 'Show assignment', icon: FileText }
  ];
  const go = (id) => { setPage(id); setMobileMenu(false); if (id === 'attendance') setAttendanceShown(false); };

  if (!role) return <div className="welcome-shell">
    <header className="topbar"><div className="brand"><div className="brand-mark"><GraduationCap size={22}/></div><span>Campus<span className="brand-light">Desk</span></span></div><span className="topbar-note">STUDENT RECORD MANAGEMENT</span></header>
    <main className="welcome-main">
      <div className="welcome-copy"><div className="eyebrow"><span className="eyebrow-dot"/> YOUR CAMPUS, ORGANIZED</div><h1>Every student record.<br/><span>One clear view.</span></h1><p>A simple, thoughtful workspace for student records, attendance and assignments.</p><div className="welcome-points"><div><CheckCircle2 size={17}/> Organized student records</div><div><CheckCircle2 size={17}/> Attendance at a glance</div><div><CheckCircle2 size={17}/> Assignments in one place</div></div><div className="welcome-illustration"><div className="ill-circle circle-one"/><div className="ill-circle circle-two"/><div className="ill-card card-back"><div className="ill-line short"/><div className="ill-line"/><div className="ill-line mid"/></div><div className="ill-card card-front"><div className="ill-avatar"><GraduationCap size={24}/></div><div className="ill-line short"/><div className="ill-line mid"/><div className="ill-progress"><i/></div><div className="ill-dots"><i/><i/><i/></div></div><div className="float-check"><CheckCircle2 size={21}/></div><div className="float-book"><BookOpen size={21}/></div></div></div>
      <div className="role-panel"><div className="panel-kicker">GET STARTED</div><h2>Welcome back</h2><p className="panel-subtitle">Choose how you'd like to continue.</p>
        <button className="role-card" onClick={() => { setRole('admin'); setPage('overview'); }}><div className="role-icon admin-icon"><ShieldCheck size={22}/></div><div className="role-info"><strong>Continue as Admin</strong><span>Manage records, attendance & assignments</span></div><ChevronRight size={19} className="role-arrow"/></button>
        <button className="role-card" onClick={() => { setRole('student'); setPage('overview'); }}><div className="role-icon student-icon"><UserRound size={22}/></div><div className="role-info"><strong>Continue as Student</strong><span>View your attendance & assignments</span></div><ChevronRight size={19} className="role-arrow"/></button>
        <div className="secure-note"><ShieldCheck size={15}/> Demo environment · use the sample credentials</div>
      </div>
    </main><footer className="welcome-footer"><span>© 2026 CampusDesk</span><span>MADE FOR LEARNING</span></footer>
  </div>;

  const isLogin = !(admin && user === credentials.admin.username && password === '__loggedin__') &&
    !(role === 'student' && user === credentials.student.username && password === '__loggedin__');
  // Successful login is represented by the page state below; authenticated flag is explicit.
  return <DashboardApp
    role={role} setRole={setRole} user={user} setUser={setUser} password={password} setPassword={setPassword}
    page={page} setPage={setPage} students={students} attendance={attendance} setAttendance={setAttendance}
    assignments={assignments} filteredStudents={filteredStudents} filter={filter} setFilter={setFilter}
    attendanceFilter={attendanceFilter} setAttendanceFilter={setAttendanceFilter} attendanceShown={attendanceShown}
    setAttendanceShown={setAttendanceShown} addForm={addForm} setAddForm={setAddForm} addStudent={addStudent}
    deleteStudent={deleteStudent} uploadRef={uploadRef} fileForm={fileForm} setFileForm={setFileForm}
    uploadAssignment={uploadAssignment} studentLookup={studentLookup} setStudentLookup={setStudentLookup}
    studentRecord={studentRecord} assignmentLookup={assignmentLookup} setAssignmentLookup={setAssignmentLookup}
    studentAssignments={studentAssignments} notify={notify} notice={notice} logout={logout}
    navItems={navItems} go={go} selectedAttendanceStudents={selectedAttendanceStudents}
    presentCount={presentCount} markedCount={markedCount} />
}

function DashboardApp(props) {
  const {
    role, user, setUser, password, setPassword, page, setPage, students, attendance, setAttendance,
    assignments, filteredStudents, filter, setFilter, attendanceFilter, setAttendanceFilter,
    attendanceShown, setAttendanceShown, addForm, setAddForm, addStudent, deleteStudent,
    uploadRef, fileForm, setFileForm, uploadAssignment, studentLookup, setStudentLookup,
    studentRecord, assignmentLookup, setAssignmentLookup, studentAssignments, notify, notice,
    logout, navItems, go, selectedAttendanceStudents, presentCount, markedCount
  } = props;
  const admin = role === 'admin';
  const [authenticated, setAuthenticated] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const visibleStudents = filteredStudents.filter(s => !localSearch || `${s.name} ${s.roll} ${s.section}`.toLowerCase().includes(localSearch.toLowerCase()));
  const doLogin = (e) => {
    e.preventDefault();
    const expected = admin ? credentials.admin : credentials.student;
    if (user.trim() === expected.username && password === expected.password) setAuthenticated(true);
    else notify('Incorrect username or password. Please try again.');
  };
  const signOut = () => { setAuthenticated(false); logout(); };
  const titleMap = { overview: 'Overview', add: 'Add student', attendance: 'Attendance management', assignments: 'Assignments', delete: 'Student directory', viewAttendance: 'My attendance', showAssignments: 'My assignments' };

  if (!authenticated) return <div className="login-shell"><div className="login-side"><div className="brand"><div className="brand-mark"><GraduationCap size={22}/></div><span>Campus<span className="brand-light">Desk</span></span></div><div className="login-art"><div className="login-art-circle"/><div className="login-art-card"><div className="login-art-head"><div className="mini-avatar"><UserRound size={20}/></div><div><b>Student overview</b><small>Academic year 2026–27</small></div></div><div className="fake-chart"><i/><i/><i/><i/><i/><i/><i/></div><div className="fake-bottom"><span/><span/><span/></div></div><div className="login-float"><CheckCircle2 size={18}/> Records organized</div></div><div className="login-side-bottom"><span>YOUR CAMPUS, ORGANIZED</span><p>Good systems make room for great learning.</p></div></div><div className="login-content"><button className="back-link" onClick={signOut}><ArrowLeft size={16}/> Back to role selection</button><div className="login-form-wrap"><div className={`login-symbol ${admin ? 'admin-icon' : 'student-icon'}`}>{admin ? <ShieldCheck size={25}/> : <UserRound size={25}/>}</div><div className="panel-kicker">{admin ? 'ADMIN PORTAL' : 'STUDENT PORTAL'}</div><h1>Sign in to your<br/>workspace</h1><p className="login-description">Enter your demo credentials to continue.</p><form onSubmit={doLogin} className="stack-form"><Field label="Username"><input autoComplete="username" value={user} onChange={e => setUser(e.target.value)} placeholder="Enter your username" required/></Field><Field label="Password"><input autoComplete="current-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required/></Field><button className="primary-btn full-btn" type="submit">Sign in <ChevronRight size={17}/></button></form><div className="demo-credentials"><div className="demo-title"><ShieldCheck size={15}/> DEMO LOGIN DETAILS</div><div><span>Username</span><code>{admin ? 'admin' : 'student'}</code><button onClick={() => { setUser(admin ? 'admin' : 'student'); setPassword(admin ? 'admin123' : 'student123'); }} type="button">Use demo</button></div><div><span>Password</span><code>{admin ? 'admin123' : 'student123'}</code></div></div></div><div className="login-foot">CampusDesk · Student Record Management</div></div>{notice && <div className="toast"><CheckCircle2 size={18}/>{notice}</div>}</div>;

  return <div className="app-shell">
    <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}><div className="sidebar-brand"><div className="brand-mark"><GraduationCap size={22}/></div><span>Campus<span className="brand-light">Desk</span></span><button className="mobile-close" onClick={() => setMobileMenu(false)}><X size={18}/></button></div><div className="workspace-label">WORKSPACE</div><nav className="side-nav">{navItems.map(item => { const Icon = item.icon; return <button key={item.id} className={`nav-item ${page === item.id ? 'active' : ''}`} onClick={() => go(item.id)}><Icon size={18}/><span>{item.label}</span>{page === item.id && <i/>}</button>; })}</nav><div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><BookOpen size={18}/></div><b>Need a hand?</b><span>This is a demo workspace with sample student records.</span></div><div className="profile-row"><div className={`profile-avatar ${admin ? 'av-admin' : ''}`}>{admin ? 'AD' : 'ST'}</div><div className="profile-info"><b>{admin ? 'Administrator' : 'Student User'}</b><span>{admin ? 'Admin access' : 'Student access'}</span></div><button title="Sign out" onClick={signOut} className="logout-icon"><LogOut size={17}/></button></div></div></aside>
    {mobileMenu && <div className="sidebar-scrim" onClick={() => setMobileMenu(false)}/>}
    <main className="main-area"><header className="app-header"><div className="header-left"><button className="mobile-menu-btn" onClick={() => setMobileMenu(true)}><Menu size={20}/></button><div><div className="breadcrumb">Workspace <ChevronRight size={13}/> <span>{titleMap[page] || 'Overview'}</span></div><h1>{titleMap[page] || 'Overview'}</h1></div></div><div className="header-right"><div className="academic-year"><span className="year-dot"/><span>Academic year 2026–27</span></div><div className="header-avatar">{admin ? 'AD' : 'ST'}</div></div></header>
      <div className="page-content">
        {page === 'overview' && <Overview admin={admin} students={students} assignments={assignments} go={go} attendance={attendance}/>}
        {page === 'add' && <section className="content-grid"><div className="content-main"><div className="section-heading"><div><h2>Add a student</h2><p>Add a new student record to the directory.</p></div><span className="section-chip"><Plus size={14}/> NEW RECORD</span></div><form className="surface form-surface" onSubmit={addStudent}><div className="form-title"><div className="form-title-icon"><UserRound size={19}/></div><div><h3>Student information</h3><p>Fields marked with * are required.</p></div></div><div className="form-grid"><Field label="Full name *"><input value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} placeholder="e.g. Aditi Sharma" required/></Field><Field label="Class / programme *"><input value={addForm.className} onChange={e => setAddForm({...addForm, className: e.target.value})} placeholder="e.g. B.Tech CSE" required/></Field><Field label="Roll number *"><input value={addForm.roll} onChange={e => setAddForm({...addForm, roll: e.target.value})} placeholder="e.g. CSE2609" required/></Field><Field label="Section"><Select value={addForm.section} onChange={e => setAddForm({...addForm, section: e.target.value})}><option>A</option><option>B</option><option>C</option><option>D</option></Select></Field><Field label="Batch"><Select value={addForm.batch} onChange={e => setAddForm({...addForm, batch: e.target.value})}><option>2024</option><option>2025</option><option>2026</option><option>2027</option></Select></Field></div><div className="form-actions"><button type="button" className="secondary-btn" onClick={() => setAddForm({name:'',className:'',roll:'',section:'A',batch:'2024'})}>Clear form</button><button type="submit" className="primary-btn"><Plus size={16}/> Save student</button></div></form></div><aside className="content-aside"><div className="aside-card accent-aside"><div className="aside-illustration"><Users size={24}/></div><h3>Growing your directory</h3><p>Keep your student records up to date. New students will be available in attendance and the student directory.</p><div className="aside-metric"><span>Total students</span><strong>{students.length}</strong></div></div><div className="aside-card"><h3>Quick checklist</h3><div className="check-row"><CheckCircle2 size={17}/> Enter the student's full name</div><div className="check-row"><CheckCircle2 size={17}/> Use a unique roll number</div><div className="check-row"><CheckCircle2 size={17}/> Confirm class and section</div></div></aside></section>}
        {page === 'attendance' && <><div className="section-heading"><div><h2>Attendance management</h2><p>Filter a class and mark each student's attendance.</p></div><span className="section-chip"><CalendarCheck size={14}/> DAILY REGISTER</span></div><div className="surface filter-surface"><div className="filter-heading"><div className="filter-icon"><Search size={18}/></div><div><h3>Find a class</h3><p>Choose all three filters, then select View all.</p></div></div><div className="filter-grid"><Field label="Section"><Select value={attendanceFilter.section} onChange={e => {setAttendanceFilter({...attendanceFilter, section:e.target.value});setAttendanceShown(false);}}><option>A</option><option>B</option><option>C</option><option>D</option></Select></Field><Field label="Batch"><Select value={attendanceFilter.batch} onChange={e => {setAttendanceFilter({...attendanceFilter, batch:e.target.value});setAttendanceShown(false);}}>{['2024','2025','2026','2027'].map(x=><option key={x}>{x}</option>)}</Select></Field><Field label="Subject"><Select value={attendanceFilter.subject} onChange={e => {setAttendanceFilter({...attendanceFilter, subject:e.target.value});setAttendanceShown(false);}}>{subjects.map(x=><option key={x}>{x}</option>)}</Select></Field><button className="primary-btn view-all-btn" onClick={() => setAttendanceShown(true)}>View all <ChevronRight size={16}/></button></div></div>{attendanceShown && <div className="surface table-surface"><div className="table-heading"><div><h3>Attendance register</h3><p>Section {attendanceFilter.section} · Batch {attendanceFilter.batch} · {attendanceFilter.subject}</p></div><div className="attendance-summary"><span><i className="legend-p"/> Present {presentCount}</span><span><i className="legend-a"/> Absent {selectedAttendanceStudents.filter(s => attendance[`${s.id}|${attendanceFilter.subject}`] === 'A').length}</span></div></div>{selectedAttendanceStudents.length ? <div className="table-scroll"><table><thead><tr><th>STUDENT</th><th>ROLL NUMBER</th><th>CLASS</th><th>ATTENDANCE</th></tr></thead><tbody>{selectedAttendanceStudents.map(s => <tr key={s.id}><td><div className="student-cell"><div className="table-avatar">{s.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div><div><b>{s.name}</b><small>Section {s.section}</small></div></div></td><td className="muted-cell">{s.roll}</td><td>{s.className}</td><td><div className="attendance-input"><button type="button" className={`attendance-choice present ${attendance[`${s.id}|${attendanceFilter.subject}`] === 'P' ? 'chosen' : ''}`} onClick={() => setAttendance({...attendance, [`${s.id}|${attendanceFilter.subject}`]:'P'})}>P</button><button type="button" className={`attendance-choice absent ${attendance[`${s.id}|${attendanceFilter.subject}`] === 'A' ? 'chosen' : ''}`} onClick={() => setAttendance({...attendance, [`${s.id}|${attendanceFilter.subject}`]:'A'})}>A</button></div></td></tr>)}</tbody></table></div> : <Empty title="No students found" message="There are no students matching this section, batch and subject."/>}<div className="table-footer"><span>{selectedAttendanceStudents.length} student(s) in this register</span><span><CheckCircle2 size={15}/> Changes are saved in this demo session</span></div></div>}</>}
        {page === 'delete' && <><div className="section-heading"><div><h2>Student directory</h2><p>Review all student records and remove records when needed.</p></div><span className="section-chip"><Users size={14}/> {students.length} STUDENTS</span></div><div className="surface table-surface"><div className="table-heading"><div><h3>All student records</h3><p>Delete a student to remove them from the active directory.</p></div><div className="search-box"><Search size={16}/><input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search students..."/></div></div><div className="table-scroll"><table><thead><tr><th>STUDENT</th><th>ROLL NUMBER</th><th>CLASS</th><th>SECTION</th><th>BATCH</th><th>ACTION</th></tr></thead><tbody>{filteredStudents.map(s => <tr key={s.id}><td><div className="student-cell"><div className="table-avatar">{s.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div><div><b>{s.name}</b><small>{s.subjects.length} subjects</small></div></div></td><td className="muted-cell">{s.roll}</td><td>{s.className}</td><td><span className="section-badge">{s.section}</span></td><td>{s.batch}</td><td><button className="delete-btn" onClick={() => deleteStudent(s.id)}><Trash2 size={15}/> Delete</button></td></tr>)}</tbody></table>{!filteredStudents.length && <Empty title="No matching students" message="Try another name or roll number."/>}</div><div className="table-footer"><span>Showing {filteredStudents.length} of {students.length} students</span><span><ShieldCheck size={15}/> Deletion requires confirmation</span></div></div></>}
        {page === 'assignments' && <><div className="section-heading"><div><h2>Assignment library</h2><p>Upload PDF or Word documents for a class and subject.</p></div><span className="section-chip"><FileText size={14}/> FILE LIBRARY</span></div><div className="content-grid"><div className="content-main"><form className="surface form-surface" onSubmit={uploadAssignment}><div className="form-title"><div className="form-title-icon"><UploadCloud size={19}/></div><div><h3>Upload an assignment</h3><p>Accepted formats: PDF, DOC and DOCX.</p></div></div><div className="form-grid"><Field label="Class / programme"><Select value={fileForm.className} onChange={e=>setFileForm({...fileForm,className:e.target.value})}><option>B.Tech CSE</option><option>B.Tech IT</option><option>B.Tech ECE</option></Select></Field><Field label="Section"><Select value={fileForm.section} onChange={e=>setFileForm({...fileForm,section:e.target.value})}><option>A</option><option>B</option><option>C</option><option>D</option></Select></Field><Field label="Batch"><Select value={fileForm.batch} onChange={e=>setFileForm({...fileForm,batch:e.target.value})}>{['2024','2025','2026','2027'].map(x=><option key={x}>{x}</option>)}</Select></Field><Field label="Subject"><Select value={fileForm.subject} onChange={e=>setFileForm({...fileForm,subject:e.target.value})}>{subjects.map(x=><option key={x}>{x}</option>)}</Select></Field></div><button className="upload-drop" type="button" onClick={() => uploadRef.current?.click()}><div className="upload-icon"><UploadCloud size={24}/></div><strong>Click to choose a file</strong><span>PDF, DOC or DOCX · upload from your computer</span><input ref={uploadRef} type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={() => {}} hidden/></button><div className="form-actions"><span className="file-note"><ShieldCheck size={15}/> Local demo upload</span><button className="primary-btn" type="submit"><UploadCloud size={16}/> Upload assignment</button></div></form></div><aside className="content-aside"><div className="aside-card accent-aside"><div className="aside-illustration"><FileText size={24}/></div><h3>Assignment library</h3><p>Uploaded files are matched to a class, section, batch and subject so students can find their work.</p><div className="aside-metric"><span>Total assignments</span><strong>{assignments.length}</strong></div></div></aside></div><div className="surface table-surface assignments-list"><div className="table-heading"><div><h3>Recently available</h3><p>Sample and newly uploaded assignments</p></div></div><div className="assignment-items">{assignments.map(a=><div className="assignment-item" key={a.id}><div className="file-type-icon">{a.fileName.toLowerCase().endsWith('.pdf')?'PDF':'DOC'}</div><div className="assignment-details"><b>{a.title}</b><span>{a.subject} · Section {a.section} · Batch {a.batch}</span></div><span className="file-size">{a.size}</span>{a.file && <button className="icon-button" onClick={() => {const url=URL.createObjectURL(a.file);const link=document.createElement('a');link.href=url;link.download=a.fileName;link.click();URL.revokeObjectURL(url);}} title="Download"><Download size={17}/></button>}</div>)}</div></div></>}
        {page === 'viewAttendance' && <><div className="section-heading"><div><h2>My attendance</h2><p>Look up your attendance by student details.</p></div><span className="section-chip"><CalendarCheck size={14}/> ATTENDANCE</span></div><div className="surface filter-surface"><div className="filter-heading"><div className="filter-icon"><Search size={18}/></div><div><h3>Find your record</h3><p>Enter your details exactly as registered.</p></div></div><form onSubmit={e=>{e.preventDefault();setShowAll(true);}}><div className="filter-grid student-lookup-grid"><Field label="Full name"><input required value={studentLookup.name} onChange={e=>setStudentLookup({...studentLookup,name:e.target.value})} placeholder="e.g. Aarav Sharma"/></Field><Field label="Class / programme"><input required value={studentLookup.className} onChange={e=>setStudentLookup({...studentLookup,className:e.target.value})} placeholder="e.g. B.Tech CSE"/></Field><Field label="Section"><Select value={studentLookup.section} onChange={e=>setStudentLookup({...studentLookup,section:e.target.value})}><option>A</option><option>B</option><option>C</option><option>D</option></Select></Field><button className="primary-btn view-all-btn" type="submit">View attendance <ChevronRight size={16}/></button></div></form></div>{showAll && <StudentAttendance record={studentRecord} attendance={attendance} notify={notify}/>}</>}
        {page === 'showAssignments' && <><div className="section-heading"><div><h2>My assignments</h2><p>Find the assignments shared with your class.</p></div><span className="section-chip"><BookOpen size={14}/> LEARNING MATERIAL</span></div><div className="surface filter-surface"><div className="filter-heading"><div className="filter-icon"><Search size={18}/></div><div><h3>Find your assignments</h3><p>Enter your details and choose a subject.</p></div></div><form onSubmit={e=>{e.preventDefault();setShowAll(true);}}><div className="filter-grid assignment-lookup-grid"><Field label="Full name"><input required value={assignmentLookup.name} onChange={e=>setAssignmentLookup({...assignmentLookup,name:e.target.value})} placeholder="e.g. Aarav Sharma"/></Field><Field label="Class / programme"><input required value={assignmentLookup.className} onChange={e=>setAssignmentLookup({...assignmentLookup,className:e.target.value})} placeholder="e.g. B.Tech CSE"/></Field><Field label="Section"><Select value={assignmentLookup.section} onChange={e=>setAssignmentLookup({...assignmentLookup,section:e.target.value})}><option>A</option><option>B</option><option>C</option><option>D</option></Select></Field><Field label="Subject"><Select value={assignmentLookup.subject} onChange={e=>setAssignmentLookup({...assignmentLookup,subject:e.target.value})}>{subjects.map(x=><option key={x}>{x}</option>)}</Select></Field><button className="primary-btn view-all-btn" type="submit">Find assignments <ChevronRight size={16}/></button></div></form></div>{showAll && <div className="surface table-surface"><div className="table-heading"><div><h3>Available assignments</h3><p>{assignmentLookup.subject} · Section {assignmentLookup.section}</p></div></div>{!assignmentStudent ? <Empty title="Student record not found" message="Check your name, class and section, then try again."/> : studentAssignments.length ? <div className="assignment-items">{studentAssignments.map(a=><div className="assignment-item" key={a.id}><div className="file-type-icon">{a.fileName.toLowerCase().endsWith('.pdf')?'PDF':'DOC'}</div><div className="assignment-details"><b>{a.title}</b><span>{a.subject} · {a.className} · Section {a.section}</span></div>{a.file ? <button className="secondary-btn compact-btn" onClick={()=>{const url=URL.createObjectURL(a.file);const link=document.createElement('a');link.href=url;link.download=a.fileName;link.click();URL.revokeObjectURL(url);}}>Download <Download size={15}/></button> : <span className="demo-file-tag">Sample file</span>}</div>)}</div> : <Empty title="No assignments found" message="No assignment matches this student and subject yet."/>}</div>}</>}
      </div><footer className="app-footer"><span>© 2026 CampusDesk <i/> Student Record Management</span><span><span className="footer-status"/> All systems operational</span></footer>
    </main>{notice && <div className="toast"><CheckCircle2 size={18}/>{notice}</div>}
  </div>;
}

function Overview({ admin, students, assignments, go, attendance }) {
  const present = Object.values(attendance).filter(v => v === 'P').length;
  const absent = Object.values(attendance).filter(v => v === 'A').length;
  return <><div className="welcome-banner"><div className="banner-copy"><div className="banner-label"><span/> YOUR CAMPUS AT A GLANCE</div><h2>{admin ? 'Good to see you, Admin.' : 'Welcome to your student hub.'}</h2><p>{admin ? 'Here’s what’s happening across your student records today.' : 'Your academic information, attendance and assignments — all in one place.'}</p><button onClick={() => go(admin ? 'add' : 'viewAttendance')} className="banner-btn">{admin ? 'Add a student' : 'Check attendance'} <ChevronRight size={16}/></button></div><div className="banner-graphic"><div className="banner-orbit orbit-a"/><div className="banner-orbit orbit-b"/><div className="banner-cap"><GraduationCap size={45}/></div><div className="banner-mini mini-one"><Users size={17}/></div><div className="banner-mini mini-two"><BookOpen size={17}/></div><div className="banner-spark spark-one">✦</div><div className="banner-spark spark-two">✧</div></div></div><div className="section-heading stats-heading"><div><h2>At a glance</h2><p>A quick snapshot of your academic workspace.</p></div><span className="date-label"><Clock3 size={14}/> DEMO OVERVIEW</span></div><div className="stats-grid"><StatCard icon={Users} label="Total students" value={students.length} note="In the directory" tone="blue"/><StatCard icon={CalendarCheck} label="Present marks" value={present} note="Recorded attendance" tone="green"/><StatCard icon={FileText} label="Assignments" value={assignments.length} note="In the library" tone="purple"/><StatCard icon={BookOpen} label="Subjects" value={subjects.length} note="Available subjects" tone="orange"/></div><div className="overview-lower"><div className="surface quick-actions"><div className="surface-heading"><div><h3>{admin ? 'Quick actions' : 'Your workspace'}</h3><p>{admin ? 'Common tasks, just one click away.' : 'Jump into your academic information.'}</p></div><span className="heading-dots">•••</span></div><div className="action-list">{(admin ? [{id:'add',icon:Plus,tone:'blue',title:'Add a student',desc:'Create a new student record'},{id:'attendance',icon:CalendarCheck,tone:'green',title:'Manage attendance',desc:'Mark P or A for a class'},{id:'assignments',icon:UploadCloud,tone:'purple',title:'Upload assignment',desc:'Share a PDF or Word document'}] : [{id:'viewAttendance',icon:CalendarCheck,tone:'green',title:'View attendance',desc:'Check your attendance record'},{id:'showAssignments',icon:FileText,tone:'purple',title:'Show assignment',desc:'Find class learning materials'}]).map(a=>{const Icon=a.icon;return <button key={a.id} className="action-row" onClick={()=>go(a.id)}><div className={`action-icon ${a.tone}`}><Icon size={18}/></div><div className="action-copy"><b>{a.title}</b><span>{a.desc}</span></div><ChevronRight size={17} className="action-arrow"/></button>})}</div></div><div className="surface directory-preview"><div className="surface-heading"><div><h3>Recently added students</h3><p>Latest records in the directory.</p></div><button className="text-link" onClick={()=>go(admin?'delete':'viewAttendance')}>{admin?'View directory':'View attendance'} <ChevronRight size={14}/></button></div><div className="preview-list">{students.slice(-4).reverse().map(s=><div className="preview-row" key={s.id}><div className="table-avatar">{s.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div><div className="preview-name"><b>{s.name}</b><span>{s.roll} · Section {s.section}</span></div><span className="section-badge">{s.batch}</span></div>)}</div></div></div><div className="overview-note"><div className="note-icon"><ShieldCheck size={18}/></div><div><b>Demo data, real workflow</b><p>Explore the dashboard using sample student records. Changes remain in your browser session and reset when the page is refreshed.</p></div></div></>;
}

function StudentAttendance({ record, attendance }) {
  if (!record) return <div className="surface table-surface"><Empty title="Student record not found" message="Check your name, class and section, then try again."/></div>;
  const rows = record.subjects.map(subject => ({ subject, marks: Object.entries(attendance).filter(([key]) => key.endsWith(`|${subject}`) && key.startsWith(`${record.id}|`)).map(([,v])=>v) })).map(r => ({...r, present:r.marks.filter(x=>x==='P').length, absent:r.marks.filter(x=>x==='A').length}));
  const totalP = rows.reduce((n,r)=>n+r.present,0), totalA = rows.reduce((n,r)=>n+r.absent,0);
  const percent = totalP + totalA ? Math.round(totalP/(totalP+totalA)*100) : 0;
  return <div className="surface table-surface"><div className="student-result-head"><div className="large-avatar">{record.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div><div><h3>{record.name}</h3><p>{record.roll} · {record.className} · Section {record.section}</p></div><span className="section-badge">Batch {record.batch}</span></div><div className="student-stat-grid"><div><span>Attendance recorded</span><strong>{totalP+totalA}</strong></div><div><span>Present marks</span><strong className="green-text">{totalP}</strong></div><div><span>Absent marks</span><strong className="red-text">{totalA}</strong></div><div><span>Overall attendance</span><strong>{percent}%</strong></div></div><div className="table-heading"><div><h3>Subject breakdown</h3><p>Only attendance marks saved by the admin are included.</p></div></div><div className="table-scroll"><table><thead><tr><th>SUBJECT</th><th>PRESENT</th><th>ABSENT</th><th>ATTENDANCE</th></tr></thead><tbody>{rows.map(r=>{const total=r.present+r.absent;return <tr key={r.subject}><td><b>{r.subject}</b></td><td><span className="status-pill status-p">{r.present} P</span></td><td><span className="status-pill status-a">{r.absent} A</span></td><td><div className="progress-cell"><div className="progress-track"><i style={{width:`${total?Math.round(r.present/total*100):0}%`}}/></div><span>{total?Math.round(r.present/total*100):0}%</span></div></td></tr>})}</tbody></table></div></div>;
}