import {FaInstagram, FaLinkedin, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt} from "react-icons/fa"
import {FaX} from "react-icons/fa6";

const Footer = () => {
    return(
        <footer className="bg-gray-900 text-white py-12 mt-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <img
                                className="h-12 w-12 rounded-lg"
                                src="/logo_transparent.png"
                                alt="codeXbhawesh Logo"
                            />
                            <div>
                                <h3 className="text-xl font-bold">codeXbhawesh</h3>
                                <p className="text-gray-400 text-sm">Software Developer & AI Engineer</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Passionate about creating innovative web solutions and bringing ideas to life through code.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Quick Links</h4>
                        <nav className="flex flex-col space-y-2">
                            <a href="/" className="text-gray-400 hover:text-white transition-colors duration-200">Home</a>
                            <a href="/Project" className="text-gray-400 hover:text-white transition-colors duration-200">Projects</a>
                            <a href="/Blog" className="text-gray-400 hover:text-white transition-colors duration-200">Blog</a>
                            <a href="/Contact" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</a>
                        </nav>
                    </div>

                    {/* Services */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Skills</h4>
                        <nav className="flex flex-col space-y-2">
                            <p className="text-gray-400 hover:text-white transition-colors duration-200">Web Development</p>
                            <p className="text-gray-400 hover:text-white transition-colors duration-200">Custom AI</p>
                            <p className="text-gray-400 hover:text-white transition-colors duration-200">Data Analytics</p>
                            <p className="text-gray-400 hover:text-white transition-colors duration-200">Social Agent</p>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Get In Touch</h4>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <FaEnvelope className="text-blue-400 text-sm" />
                                <a
                                    href="mailto:owner@bhaweshagrawal.com.np"
                                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                                >
                                    owner@bhaweshagrawal.com.np
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaPhone className="text-green-400 text-sm" />
                                <a
                                    href="tel:+977-9813155015"
                                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                                >
                                    +977-9813155015
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaMapMarkerAlt className="text-red-400 text-sm" />
                                <span className="text-gray-400 text-sm">Kathmandu, Nepal</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Media & Copyright */}
                <div className="border-t border-gray-800 mt-8 pt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <div className="flex space-x-6">
                            <a
                                href="https://instagram.com/bhawesh_agr_16"
                                className="text-gray-400 hover:text-pink-400 transition-colors duration-200"
                                aria-label="Instagram"
                            >
                                <FaInstagram size={20} />
                            </a>
                            <a
                                href="https://x.com/BhaweshAgr87299"
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                                aria-label="X (Twitter)"
                            >
                                <FaX size={20} />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/bhawesh-agrawal/"
                                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                                aria-label="LinkedIn"
                            >
                                <FaLinkedin size={20} />
                            </a>
                            <a
                                href="https://github.com/Bhawesh-Agrawal"
                                className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
                                aria-label="GitHub"
                            >
                                <FaGithub size={20} />
                            </a>
                        </div>

                        <div className="text-center sm:text-right">
                            <p className="text-gray-400 text-sm">
                                © 2025 codeXbhawesh. All rights reserved.
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                                Made by Bhawesh
                            </p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-8 pt-8 border-t border-gray-800">
                    <p className="text-gray-400 mb-4">Ready to bring your ideas to life?</p>
                    <a
                        href="/Contact"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        Let's Work Together
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer