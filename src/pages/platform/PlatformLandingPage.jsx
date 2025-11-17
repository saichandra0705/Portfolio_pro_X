import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faRocket,
    faChartLine,
    faShieldAlt,
    faUsers,
    faCogs,
    faBuilding,
    faChevronLeft,
    faChevronRight,
    faCheckCircle,
    faLaptopCode,
    faArrowRight,
    faSpinner,
    faBolt,
    faGem
} from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faLinkedin, faGithub, faAws, faGoogle, faStripe, faSlack } from '@fortawesome/free-brands-svg-icons';

// --- MOCK DATA (Replaces API & Context) ---
const mockSettings = {
    platformName: "Nexus SaaS",
    platformLogoUrl: null, // Using icon fallback
    primaryColor: "blue"
};

const mockClients = [
    { id: 1, name: "Acme Corp", icon: faBuilding },
    { id: 2, name: "Stripe", icon: faStripe },
    { id: 3, name: "AWS", icon: faAws },
    { id: 4, name: "Google", icon: faGoogle },
    { id: 5, name: "Slack", icon: faSlack },
    { id: 6, name: "Global Tech", icon: faLaptopCode },
];

// --- Data: Main Features ---
const featureCards = [
    {
        title: "Multi-Tenant Architecture",
        subtitle: "Isolated data silos for every organization ensuring 100% privacy.",
        icon: faBuilding,
        bgColor: "bg-blue-50",
        iconColor: "text-blue-600",
        delay: "0s"
    },
    {
        title: "Role-Based Access",
        subtitle: "Granular permissions, groups, and security policies out of the box.",
        icon: faShieldAlt,
        bgColor: "bg-purple-50",
        iconColor: "text-purple-600",
        delay: "0.1s"
    },
    {
        title: "Advanced Analytics",
        subtitle: "Real-time dashboards, reporting engine, and exportable insights.",
        icon: faChartLine,
        bgColor: "bg-green-50",
        iconColor: "text-green-600",
        delay: "0.2s"
    },
    {
        title: "Automated Workflows",
        subtitle: "Trigger actions, webhooks, and notifications based on events.",
        icon: faCogs,
        bgColor: "bg-red-50",
        iconColor: "text-red-600",
        delay: "0.3s"
    }
];

// --- Data: Key Modules ---
const saasModules = [
    { title: "User Management", desc: "Onboard, invite, and manage users with ease.", icon: faUsers },
    { title: "Subscription Billing", desc: "Stripe integration for recurring payments.", icon: faRocket },
    { title: "Data Security", desc: "SOC2 compliant encryption standards.", icon: faShieldAlt },
    { title: "API First", desc: "Full REST/GraphQL API coverage.", icon: faLaptopCode },
    { title: "Audit Logs", desc: "Track every click and change in the system.", icon: faCheckCircle },
    { title: "White Labeling", desc: "Your logo, your colors, your domain.", icon: faGem }
];

// --- Data: Testimonials ---
const testimonialData = [
    { quote: "This platform accelerated our development by months. We launched in 2 weeks instead of 6 months.", author: "Sarah Jenkins, CTO at TechFlow" },
    { quote: "The multi-tenant architecture is rock solid. We scaled to 500 tenants without touching the codebase.", author: "Mike T., Founder of SaaSy" },
    { quote: "Excellent support and a feature-rich environment. It's the WordPress of Enterprise SaaS.", author: "Elena R., Product Manager" }
];

const footerLinks = {
    "Product": [
        { name: "Features", link: "#" },
        { name: "Pricing", link: "/platform/pricing" },
        { name: "Integrations", link: "#" },
        { name: "Changelog", link: "#" }
    ],
    "Resources": [
        { name: "Documentation", link: "#" },
        { name: "API Reference", link: "#" },
        { name: "Community", link: "#" },
        { name: "Help Center", link: "#" }
    ],
    "Company": [
        { name: "About Us", link: "#" },
        { name: "Careers", link: "#" },
        { name: "Contact", link: "#" },
        { name: "Privacy Policy", link: "#" }
    ],
    "Social": [
        { name: "Twitter", link: "#", icon: faTwitter },
        { name: "GitHub", link: "#", icon: faGithub },
        { name: "LinkedIn", link: "#", icon: faLinkedin }
    ]
};

// --- CSS STYLES (Animations) ---
const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');
    .font-inter { font-family: 'Inter', sans-serif; }

    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-15px); }
        100% { transform: translateY(0px); }
    }
    @keyframes pulse-soft {
        0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
        70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
        100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
    }
    .animate-fade-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-pulse-soft { animation: pulse-soft 2s infinite; }
    .delay-100 { animation-delay: 0.1s; }
    .delay-200 { animation-delay: 0.2s; }
    .delay-300 { animation-delay: 0.3s; }
`;

const PlatformLandingPage = () => {
    const [loading, setLoading] = useState(true);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    // Simulate loading for effect
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonialData.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const nextTestimonial = () => setCurrentTestimonial((currentTestimonial + 1) % testimonialData.length);
    const prevTestimonial = () => setCurrentTestimonial((currentTestimonial - 1 + testimonialData.length) % testimonialData.length);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center animate-pulse">
                    <FontAwesomeIcon icon={faBolt} className="text-5xl text-blue-600 mb-4" />
                    <p className="text-xl font-bold text-gray-800">Initializing Nexus...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white text-gray-800 font-inter selection:bg-blue-100">
            <style>{styles}</style>
            
            {/* --- Navigation Bar --- */}
            <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-100 transition-all duration-300">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-2">
                            <Link to="/" className="text-2xl font-black flex items-center text-gray-900 tracking-tighter">
                                <div className="h-9 w-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white mr-2 shadow-lg">
                                    <FontAwesomeIcon icon={faBolt} />
                                </div>
                                {mockSettings.platformName}
                            </Link>
                        </div>
                        <div className="hidden md:flex space-x-8">
                            <Link to="#" className="text-gray-600 font-medium hover:text-blue-600 transition-colors">Products</Link>
                            <Link to="#" className="text-gray-600 font-medium hover:text-blue-600 transition-colors">Solutions</Link>
                            <Link to="/platform/pricing" className="text-gray-600 font-medium hover:text-blue-600 transition-colors">Pricing</Link>
                            <Link to="#" className="text-gray-600 font-medium hover:text-blue-600 transition-colors">Docs</Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/platform/login" className="text-gray-700 font-bold hover:text-blue-600">Log In</Link>
                            <Link 
                                to="/platform/pricing" 
                                className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- Hero Section --- */}
            <section className="relative pt-24 pb-32 flex items-center justify-center overflow-hidden">
                {/* Background Shapes */}
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-[10%] left-[-5%] w-72 h-72 bg-blue-300/30 rounded-full blur-3xl animate-float delay-100"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="animate-fade-up">
                        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold text-sm border border-blue-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            v2.0 is now live: See what's new
                        </div>
                        
                        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
                            Build SaaS <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Faster Than Ever</span>
                        </h1>
                        
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
                            The complete boilerplate for multi-tenant applications. 
                            Don't waste time on auth, billing, or tenant isolation. 
                            Focus on your unique value.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link to="/platform/pricing" className="animate-pulse-soft px-10 py-4 bg-blue-600 text-white font-bold rounded-full text-lg hover:bg-blue-700 transition-all shadow-xl flex items-center justify-center">
                                Start Free Trial <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                            </Link>
                            <Link to="#" className="px-10 py-4 bg-white text-gray-800 font-bold rounded-full text-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center shadow-sm">
                                View Demo
                            </Link>
                        </div>

                        <div className="mt-12 text-sm text-gray-500 font-medium flex justify-center gap-6">
                            <span className="flex items-center"><FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" /> No credit card required</span>
                            <span className="flex items-center"><FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" /> Cancel anytime</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Trusted Companies (Marquee Effect) --- */}
            <section className="py-10 border-y border-gray-100 bg-gray-50/50">
                <div className="container mx-auto px-4">
                    <p className="text-center text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-8">Powering next-gen startups</p>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {mockClients.map((client) => (
                            <div key={client.id} className="flex items-center gap-2 text-xl font-bold text-gray-500 hover:text-blue-900 transition-colors cursor-pointer transform hover:scale-110 duration-300">
                                <FontAwesomeIcon icon={client.icon} className="text-3xl" />
                                <span className="hidden md:block">{client.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Feature Highlights --- */}
            <section className="bg-white py-24">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">Everything you need to scale</h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">Stop building boilerplate. We handle the infrastructure so you can push code.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featureCards.map((card, index) => (
                            <div 
                                key={index} 
                                className="p-8 rounded-3xl border border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group bg-white"
                                style={{ animationDelay: card.delay }}
                            >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${card.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                                    <FontAwesomeIcon icon={card.icon} className={`text-3xl ${card.iconColor}`} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{card.subtitle}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Core Modules (Split Layout) --- */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="w-full lg:w-1/2">
                            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-4 uppercase tracking-wide">
                                Batteries Included
                            </div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                                Powerful modules <br/> <span className="text-blue-600">ready to go.</span>
                            </h2>
                            <p className="text-lg text-gray-600 mb-10">
                                Don't reinvent the wheel. Our platform comes pre-loaded with essential SaaS modules so you can start selling immediately.
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {saasModules.map((mod, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="mt-1 p-2 bg-white rounded-lg shadow-sm text-blue-600">
                                            <FontAwesomeIcon icon={mod.icon} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">{mod.title}</h4>
                                            <p className="text-sm text-gray-500">{mod.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Graphic/Dashboard Preview */}
                        <div className="w-full lg:w-1/2 relative">
                            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
                            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-300 rounded-full filter blur-3xl opacity-30 animate-pulse delay-100"></div>
                            
                            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    <div className="ml-auto text-xs text-gray-400">dashboard.nexus.com</div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-blue-50 p-4 rounded-xl">
                                        <div className="text-blue-600 text-2xl font-bold mb-1">$24k</div>
                                        <div className="text-xs text-blue-400 font-bold uppercase">MRR</div>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-xl">
                                        <div className="text-purple-600 text-2xl font-bold mb-1">1,204</div>
                                        <div className="text-xs text-purple-400 font-bold uppercase">Users</div>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-xl">
                                        <div className="text-green-600 text-2xl font-bold mb-1">99.9%</div>
                                        <div className="text-xs text-green-400 font-bold uppercase">Uptime</div>
                                    </div>
                                </div>
                                <div className="h-48 bg-gray-50 rounded-xl flex items-center justify-center border border-dashed border-gray-300">
                                    <div className="text-center text-gray-400">
                                        <FontAwesomeIcon icon={faChartLine} size="3x" className="mb-2 opacity-50" />
                                        <p className="text-sm">Real-time Analytics Graph</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CTA Section --- */}
            <section className="bg-gray-900 py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Ready to launch?</h2>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                        Get started today and save months of development time. Join the community of developers shipping faster.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/platform/pricing" className="px-10 py-4 bg-blue-600 text-white font-bold rounded-full text-lg hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1">
                            Get Started Now
                        </Link>
                        <Link to="/contact" className="px-10 py-4 border border-gray-600 text-gray-300 font-bold rounded-full hover:bg-gray-800 hover:text-white transition-colors">
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- Testimonials --- */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-5xl text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-16">Loved by Developers & Founders</h2>
                    
                    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 p-12 rounded-3xl shadow-inner">
                        <FontAwesomeIcon icon={faRocket} className="text-6xl text-blue-200 absolute top-10 left-10 transform -rotate-12" />
                        
                        <div className="relative overflow-hidden min-h-[160px] flex flex-col justify-center items-center z-10">
                            {testimonialData.map((t, index) => (
                                <div 
                                    key={index}
                                    className={`transition-all duration-700 absolute inset-0 flex flex-col justify-center items-center ${index === currentTestimonial ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                                >
                                    <p className="text-2xl md:text-3xl text-gray-800 font-medium mb-8 leading-relaxed italic">"{t.quote}"</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {t.author.charAt(0)}
                                        </div>
                                        <p className="text-gray-900 font-bold text-sm uppercase tracking-wide">{t.author}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center gap-4 mt-10 relative z-20">
                            <button onClick={prevTestimonial} className="w-12 h-12 rounded-full bg-white hover:bg-blue-600 text-gray-400 hover:text-white shadow-md transition-all flex items-center justify-center group">
                                <FontAwesomeIcon icon={faChevronLeft} className="group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                            <button onClick={nextTestimonial} className="w-12 h-12 rounded-full bg-white hover:bg-blue-600 text-gray-400 hover:text-white shadow-md transition-all flex items-center justify-center group">
                                <FontAwesomeIcon icon={faChevronRight} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Footer --- */}
            <footer className="bg-gray-900 text-gray-400 py-20 border-t border-gray-800">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
                        <div className="col-span-2 lg:col-span-2">
                            <Link to="/" className="text-2xl font-bold text-white mb-6 flex items-center">
                                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white mr-2">
                                    <FontAwesomeIcon icon={faBolt} />
                                </div>
                                {mockSettings.platformName}
                            </Link>
                            <p className="text-sm leading-relaxed mb-8 max-w-xs opacity-80">
                                The robust, scalable, and secure foundation for your next big software project. Built for speed and reliability.
                            </p>
                            <div className="flex space-x-6">
                                {footerLinks["Social"].map(link => (
                                    <Link to={link.link} key={link.name} className="text-2xl hover:text-white hover:-translate-y-1 transition-all">
                                        <FontAwesomeIcon icon={link.icon} />
                                    </Link>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <h5 className="font-bold text-white mb-6">Product</h5>
                            <ul className="space-y-3">
                                {footerLinks["Product"].map(link => (
                                    <li key={link.name}><Link to={link.link} className="text-sm hover:text-white transition-colors">{link.name}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-white mb-6">Resources</h5>
                            <ul className="space-y-3">
                                {footerLinks["Resources"].map(link => (
                                    <li key={link.name}><Link to={link.link} className="text-sm hover:text-white transition-colors">{link.name}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-white mb-6">Company</h5>
                            <ul className="space-y-3">
                                {footerLinks["Company"].map(link => (
                                    <li key={link.name}><Link to={link.link} className="text-sm hover:text-white transition-colors">{link.name}</Link></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-500">© 2025 {mockSettings.platformName}. All rights reserved.</p>
                        <div className="flex gap-8 mt-4 md:mt-0 text-sm">
                            <Link to="#" className="hover:text-white transition-colors">Terms</Link>
                            <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
                            <Link to="#" className="hover:text-white transition-colors">Cookies</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PlatformLandingPage;