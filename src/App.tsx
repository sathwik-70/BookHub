import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Github } from 'lucide-react'
import { Footer } from './Footer'
import { ToastContainer } from './Toast'

export default function App() {
    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col">
            {/* Background ambient glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-hub-primary rounded-full opacity-10 animate-pulse-slow blur-[120px] pointer-events-none -z-10" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-hub-secondary rounded-full opacity-10 animate-float blur-[100px] pointer-events-none -z-10" />

            {/* Navbar */}
            <nav className="sticky top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 shadow-sm py-3 transition-all duration-300">
                <div className="mx-auto w-full max-w-7xl px-4 md:px-8 xl:px-12 flex items-center justify-between">
                    {/* Logo Lockup */}
                    <div className="flex items-center gap-2.5 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-lg pr-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} tabIndex={0} role="button">
                        <div className="bg-gradient-to-br from-hub-primary to-hub-secondary p-2 rounded-xl text-white shadow-lg shadow-hub-primary/20 group-hover:scale-105 transition-transform duration-300 relative flex items-center justify-center">
                            <BookOpen size={20} className="relative z-10" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-slate-900 group-hover:text-hub-primary transition-colors">
                            BookHub.
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Navigation Links */}
                        <div className="flex items-center gap-1 sm:gap-2 mr-2">
                            <NavLink
                                to="/category/books"
                                className={({ isActive }) => `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${isActive || location.pathname.startsWith('/category') ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                            >
                                <span className="hidden sm:inline">Browse </span>Collections
                            </NavLink>
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) => `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${isActive ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                            >
                                <LayoutDashboard size={16} />
                                <span className="hidden sm:inline">Analytics</span>
                            </NavLink>
                        </div>

                        {/* Utility Actions / Open Source */}
                        <div className="flex items-center gap-3 border-l border-slate-200/60 pl-3 sm:pl-4">
                            <a
                                href="https://github.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                            >
                                <Github size={16} />
                                <span className="hidden sm:inline">Star on GitHub</span>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Since navbar is sticky, the margin-top is optional, but taking it off prevents massive gap on top */}
            <div className="flex-1 mt-8">
                <Outlet />
            </div>

            <Footer />
            <ToastContainer />
        </div>
    )
}
