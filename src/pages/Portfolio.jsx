//D:\code software\portfolio\vite-project\src\pages\Portfolio.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


import saiChandraImage from './images/Sai.jpg';
// --- ICONS (Added faEnvelope here) ---
const faCode = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5 7.5L13.5 12l-2.25-2.25" /></svg>;
const faDatabase = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg>;
const faServer = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 0 1 .9 2.7m0 0a3 3 0 0 1-3 3m0 3h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Zm-3 6h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Z" /></svg>;
const faBars = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
const faTimes = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;
const faArrowRight = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>;
const faExternalLink = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>;
const faSun = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>;
const faMoon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>;
// ✅ Added this missing icon
const faEnvelope = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5H4.5a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L4.25 8.909A2.25 2.25 0 0 1 3.18 6.75M12 11.25V18" /></svg>;

const sections = [
    { id: 'home', name: 'Home' },
    { id: 'expertise', name: 'Tech Stack' },
    { id: 'experience', name: 'Experience' },
    { id: 'team', name: 'The Team' },
    { id: 'projects', name: 'Projects' },
];

const expertiseData = [
    { 
        title: "Frontend Engineering", 
        icon: faCode,
        skills: ["React (Server/Client Components)", "Next.js", "Performance Tuning", "Tailwind CSS"] 
    },
    { 
        title: "Backend Technologies", 
        icon: faServer,
        skills: ["Node.js", "Next.js API Routes", "PHP (Legacy & Modern)", "SAP ABAP"] 
    },
    { 
        title: "Database & Data Flow", 
        icon: faDatabase,
        skills: ["PostgreSQL (Clustering/Sharding)", "Cassandra", "Kafka", "Data Modeling (OLTP/OLAP)", "Schema Migrations"] 
    },
];

const teamProfiles = [
    {
        name: "Laxmi Kanth",
        role: "Senior Mentor & Full Stack PHP Lead",
        exp: "15+ Years Experience",
        email: "laxmikanthphp@gmail.com",
        description: "A veteran in the industry specializing in robust backend architectures using PHP and scalable database systems.",
        image: "https://ui-avatars.com/api/?name=Laxmi+Kanth&background=0D8ABC&color=fff&size=256" 
    },
    {
        name: "K. Sai Chandra",
        role: "Full Stack & SAP ABAP Developer",
        exp: "3+ Years Experience",
        email: "saichandra0917@gmail.com",
        description: "Specializing in React, Next.js, and SAP ABAP integrations. Bridging the gap between modern web apps and enterprise ERP systems.",
        // image: "https://ui-avatars.com/api/?name=Sai+Chandra&background=random&color=fff&size=256"
        image: saiChandraImage
    }
];

const projectData = [
    {
        title: "Enterprise SaaS Platform",
        subtitle: "Live Demo Available",
        description: "A complete multi-tenant foundation featuring isolated data architecture, role-based access control, and subscription billing.",
        tags: ["React", "Node.js", "SaaS", "Stripe"],
        link: "/saas-demo",
        isFeatured: true,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
    },
    {
        title: "CRM for Organization",
        subtitle: "Internal Tool",
        description: "Comprehensive customer relationship management tool for tracking leads, sales pipelines, and automated follow-ups.",
        tags: ["PHP", "MySQL", "jQuery"],
        link: "#", 
        isFeatured: false,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2340&auto=format&fit=crop"
    },
    {
        title: "Coming Soon",
        subtitle: "Project In Development",
        description: "An upcoming e-commerce solution bridging SAP inventory with modern storefronts.",
        tags: ["Next.js", "SAP ABAP"],
        link: null,
        isFeatured: false,
        image: "https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=2564&auto=format&fit=crop"
    },
    {
        title: "Coming Soon",
        subtitle: "Future Concept",
        description: "Experimental blockchain integration for supply chain transparency.",
        tags: ["Research"],
        link: null,
        isFeatured: false,
        image: null
    }
];

// --- Styles ---
const customStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200..900&display=swap');
    
    :root {
        scroll-behavior: smooth;
    }
    
    .font-outfit { font-family: 'Outfit', sans-serif; }

    /* 3D Card Hover Effect */
    .card-3d-wrapper {
        perspective: 1000px;
    }
    .card-3d {
        transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.5s ease;
        transform-style: preserve-3d;
    }
    .card-3d:hover {
        transform: translateY(-10px) rotateX(2deg) rotateY(2deg);
        box-shadow: 0 20px 40px -5px rgba(0,0,0,0.2);
    }

    /* Floating Animation */
    @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
        100% { transform: translateY(0px); }
    }
    .animate-float {
        animation: float 6s ease-in-out infinite;
    }

    /* Gradient Text */
    .text-gradient {
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-image: linear-gradient(to right, #3b82f6, #06b6d4);
    }
`;

const NavLink = ({ href, children, isActive, onClick }) => (
    <a
        href={href}
        onClick={onClick}
        className={`px-4 py-2 font-medium rounded-full transition-all duration-300 relative 
            ${isActive 
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-white'
            }`}
    >
        {children}
    </a>
);

// --- Main Component ---
const Portfolio = () => {
    const [activeSection, setActiveSection] = useState('home');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(true); // Default to Dark Mode
    const navigate = useNavigate();

    // Toggle Dark Mode
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    // Scroll Spy
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                        entry.target.classList.add('animate-in');
                    }
                });
            },
            { rootMargin: '-30% 0px -30% 0px' }
        );

        sections.forEach(section => {
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    const handleScrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMenuOpen(false);
        }
    };

    return (
        <div className={`min-h-screen font-outfit transition-colors duration-500 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <style>{customStyles}</style>

            {/* --- Navigation --- */}
            <header className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-colors duration-300 ${darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200 shadow-sm'}`}>
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <a href="#home" className="text-2xl font-black tracking-tighter">
                        <span className="text-blue-600">DEV</span>.STUDIO
                    </a>
                    
                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-2">
                        {sections.map(section => (
                            <NavLink
                                key={section.id}
                                href={`#${section.id}`}
                                isActive={activeSection === section.id}
                                onClick={(e) => { e.preventDefault(); handleScrollTo(section.id); }}
                            >
                                {section.name}
                            </NavLink>
                        ))}
                        
                        {/* Theme Toggle */}
                        <button 
                            onClick={() => setDarkMode(!darkMode)}
                            className={`ml-4 p-2 rounded-full transition-transform hover:scale-110 ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-gray-600'}`}
                        >
                            {darkMode ? faSun : faMoon}
                        </button>
                    </nav>

                    {/* Mobile Toggle */}
                    <div className="flex items-center gap-4 md:hidden">
                        <button 
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-gray-600'}`}
                        >
                            {darkMode ? faSun : faMoon}
                        </button>
                        <button 
                            className={`p-2 rounded-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? faTimes : faBars}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-40 bg-gray-900 md:hidden transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col p-8 pt-24 space-y-6">
                    {sections.map(section => (
                        <a
                            key={section.id}
                            href={`#${section.id}`}
                            onClick={(e) => { e.preventDefault(); handleScrollTo(section.id); }}
                            className="text-2xl font-bold text-gray-300 hover:text-blue-500"
                        >
                            {section.name}
                        </a>
                    ))}
                </div>
            </div>

            <main className="container mx-auto px-6">
                
                {/* --- 1. Hero Section --- */}
                <section id="home" className="min-h-[90vh] flex flex-col md:flex-row items-center justify-center pt-10">
                    <div className="w-full md:w-1/2 text-left z-10">
                        <div className="inline-block px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-6 border border-blue-500/20">
                            Full Stack • SAP ABAP • Enterprise Solutions
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
                            Hi, I'm <span className="text-gradient">K. Sai Chandra</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
                            Building scalable web applications & SAP integrations under the mentorship of <span className="text-blue-500 font-bold">Laxmi Kanth</span>.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button 
                                onClick={() => handleScrollTo('projects')}
                                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all hover:scale-105 flex items-center gap-2"
                            >
                                View Our Work {faArrowRight}
                            </button>
                            <button 
                                onClick={() => handleScrollTo('team')}
                                className={`px-8 py-4 rounded-xl font-bold border transition-all hover:bg-gray-100 dark:hover:bg-gray-800 ${darkMode ? 'border-gray-700 text-white' : 'border-gray-300 text-gray-900'}`}
                            >
                                Meet The Team
                            </button>
                        </div>
                    </div>
                    
                    {/* Abstract Hero Visual */}
                    <div className="w-full md:w-1/2 flex justify-center relative mt-12 md:mt-0 animate-float">
                         <div className={`relative w-80 h-80 md:w-96 md:h-96 rounded-full blur-3xl opacity-30 ${darkMode ? 'bg-blue-600' : 'bg-blue-300'}`}></div>
                         <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 rounded-2xl rotate-12 border-4 z-10 ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-white bg-white/50'} backdrop-blur-xl flex items-center justify-center shadow-2xl`}>
                            <div className="text-center">
                                <p className="text-6xl font-black text-blue-500">3+</p>
                                <p className="text-sm uppercase tracking-widest font-bold opacity-70">Years Exp.</p>
                            </div>
                         </div>
                         <div className={`absolute top-1/3 right-0 w-48 h-48 rounded-2xl -rotate-6 border-4 z-0 ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-white bg-gray-100'} flex items-center justify-center shadow-xl`}>
                             <div className="text-center">
                                <p className="text-5xl font-black text-purple-500">15+</p>
                                <p className="text-sm uppercase tracking-widest font-bold opacity-70">Mentor Exp.</p>
                             </div>
                         </div>
                    </div>
                </section>

                {/* --- 2. Tech Stack --- */}
                <section id="expertise" className="py-20">
                    <h2 className="text-4xl font-bold mb-16 text-center">Technical <span className="text-gradient">Expertise</span></h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {expertiseData.map((item, idx) => (
                            <div key={idx} className={`p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 ${darkMode ? 'bg-gray-800/50 border-gray-700 hover:border-blue-500/50' : 'bg-white border-gray-200 shadow-lg hover:shadow-xl'}`}>
                                <div className="w-14 h-14 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                                <ul className="space-y-3">
                                    {item.skills.map((skill, sIdx) => (
                                        <li key={sIdx} className="flex items-center gap-3 text-sm opacity-80">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                            {skill}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- 3. Professional Experience --- */}
                <section id="experience" className="py-20">
                   <div className={`rounded-3xl p-8 md:p-16 ${darkMode ? 'bg-gray-800' : 'bg-blue-600 text-white'}`}>
                        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Professional Journey</h2>
                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="border-l-4 border-blue-400 pl-6 relative">
                                <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-blue-400"></div>
                                <h3 className="text-2xl font-bold">Frontend & SAP ABAP Integration</h3>
                                <p className={`text-lg font-medium mt-2 ${darkMode ? 'text-gray-400' : 'text-blue-100'}`}>K. Sai Chandra</p>
                                <p className="mt-4 opacity-80 leading-relaxed">
                                    Specializing in building modern interfaces with React and Next.js while managing complex data flows from SAP backend systems using ABAP. Expert in PostgreSQL clustering and schema migrations.
                                </p>
                            </div>
                            <div className="border-l-4 border-purple-400 pl-6 relative">
                                <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-purple-400"></div>
                                <h3 className="text-2xl font-bold">Backend Architecture & PHP</h3>
                                <p className={`text-lg font-medium mt-2 ${darkMode ? 'text-gray-400' : 'text-blue-100'}`}>Laxmi Kanth</p>
                                <p className="mt-4 opacity-80 leading-relaxed">
                                    15 years of robust backend engineering. Architecting scalable server-side logic using Node.js and Legacy/Modern PHP frameworks. Ensuring database stability and high-performance API delivery.
                                </p>
                            </div>
                        </div>
                   </div>
                </section>

                {/* --- 4. The Team (About) --- */}
                <section id="team" className="py-20">
                    <h2 className="text-4xl font-bold mb-16 text-center">Meet the <span className="text-gradient">Team</span></h2>
                    <div className="grid md:grid-cols-2 gap-12 card-3d-wrapper">
                        {teamProfiles.map((profile, index) => (
                            <div key={index} className={`card-3d relative overflow-hidden rounded-3xl p-8 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-2xl'}`}>
                                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                                    <img 
                                        src={profile.image} 
                                        alt={profile.name} 
                                        className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover shadow-lg"
                                    />
                                    <div className="text-center md:text-left">
                                        <h3 className="text-2xl font-bold">{profile.name}</h3>
                                        <p className="text-blue-500 font-semibold">{profile.role}</p>
                                        <p className="text-sm opacity-60 mb-4">{profile.exp}</p>
                                        <p className="text-sm leading-relaxed opacity-80 mb-4">{profile.description}</p>
                                        <a href={`mailto:${profile.email}`} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                            {faEnvelope} {profile.email}
                                        </a>
                                    </div>
                                </div>
                                {/* Decorative bg element */}
                                <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-20 ${index === 0 ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- 5. Projects --- */}
                <section id="projects" className="py-20">
                    <h2 className="text-4xl font-bold mb-12 text-center">Selected <span className="text-gradient">Projects</span></h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {projectData.map((project, index) => (
                            <div 
                                key={index}
                                onClick={() => project.link && navigate(project.link)}
                                className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 hover:shadow-2xl cursor-pointer ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} ${!project.link ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {/* Image Area */}
                                <div className="h-64 w-full overflow-hidden bg-gray-900 relative">
                                    {project.image ? (
                                        <img 
                                            src={project.image} 
                                            alt={project.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                            <span className="text-gray-500 font-bold text-lg">Image Coming Soon</span>
                                        </div>
                                    )}
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>
                                    
                                    {/* Floating Status Badge */}
                                    <div className="absolute top-4 right-4">
                                        {project.isFeatured ? (
                                            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg animate-pulse">
                                                LIVE DEMO
                                            </span>
                                        ) : (
                                            <span className="bg-gray-700/80 text-white text-xs px-3 py-1 rounded-full font-bold backdrop-blur-sm">
                                                {project.subtitle}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-8 relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-2xl font-bold group-hover:text-blue-500 transition-colors">{project.title}</h3>
                                        {project.link && <div className="text-gray-400 group-hover:text-blue-500 transition-colors">{faExternalLink}</div>}
                                    </div>
                                    <p className="text-sm opacity-70 mb-6 leading-relaxed">{project.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag, tIdx) => (
                                            <span key={tIdx} className={`text-xs font-semibold px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            {/* --- Footer --- */}
            <footer className={`border-t py-10 mt-20 ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
                <div className="container mx-auto px-6 text-center">
                    <p className="opacity-60 text-sm">
                        &copy; {new Date().getFullYear()} K. Sai Chandra & Laxmi Kanth. All Rights Reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Portfolio;