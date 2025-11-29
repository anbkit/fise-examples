import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

function Navbar() {
    const location = useLocation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const isActive = (path) => location.pathname === path

    return (
        <nav className="bg-white shadow-none sticky top-0 z-[1000]">
            <div className="max-w-[1200px] mx-auto px-5">
                <div className="flex justify-between items-center py-4">
                    <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-primary !no-underline flex-shrink-0">
                        <span className="bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">FISE</span>
                    </Link>

                    <button
                        className="md:hidden flex flex-col bg-transparent border-none cursor-pointer p-2 flex-shrink-0"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className="w-[25px] h-[3px] bg-primary my-[3px] transition-all duration-300 rounded-[3px]"></span>
                        <span className="w-[25px] h-[3px] bg-primary my-[3px] transition-all duration-300 rounded-[3px]"></span>
                        <span className="w-[25px] h-[3px] bg-primary my-[3px] transition-all duration-300 rounded-[3px]"></span>
                    </button>

                    <div className={`${isMenuOpen ? 'flex' : 'hidden'
                        } md:flex gap-4 md:gap-4 items-center absolute md:static top-full left-0 right-0 bg-white flex-col md:flex-row p-4 md:p-0 shadow-md md:shadow-none transform transition-all duration-300 md:flex-nowrap ${isMenuOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible md:translate-y-0 md:opacity-100 md:visible'
                        }`}>
                        <Link
                            to="/demo"
                            className={`text-dark !no-underline font-medium transition-colors duration-300 whitespace-nowrap flex-shrink-0 ${isActive('/demo') ? 'text-primary' : ''
                                } hover:text-primary md:w-auto md:py-0 w-full py-2`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Live Demo
                        </Link>
                        <a
                            href="https://github.com/anbkit/fise/blob/main/docs/WHITEPAPER.md"
                            className="text-dark !no-underline md:mr-10 md:ml-4  font-medium transition-colors duration-300 hover:text-primary whitespace-nowrap flex-shrink-0 md:w-auto md:py-0 w-full py-2"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Engineering Paper
                        </a>
                        <a
                            href="https://github.com/anbkit/fise"
                            className="flex items-center justify-center w-10 h-10 p-2 rounded-lg transition-all duration-300 hover:bg-primary/10 hover:text-primary hover:-translate-y-0.5 flex-shrink-0 [&>svg]:w-6 [&>svg]:h-6"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                        >
                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                        <a
                            href="https://www.npmjs.com/package/fise"
                            className="flex items-center justify-center w-10 h-10 p-2 rounded-lg transition-all duration-300 hover:bg-primary/10 hover:text-primary hover:-translate-y-0.5 flex-shrink-0 [&>svg]:w-6 [&>svg]:h-6"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="npm"
                        >
                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
