import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Languages, HelpCircle } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleNext = (e) => {
        e.preventDefault();
        if (step === 1 && email.trim()) {
            setIsLoading(true);
            setTimeout(() => {
                setStep(2);
                setIsLoading(false);
            }, 600);
        } else if (step === 2 && password.trim()) {
            setIsLoading(true);
            setTimeout(() => {
                onLogin(email);
                setIsLoading(false);
            }, 1000);
        }
    };

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 400 : -400,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction) => ({
            x: direction < 0 ? 400 : -400,
            opacity: 0,
        }),
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center p-4 font-['Inter',sans-serif]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[448px] bg-white rounded-lg border border-[#dadce0] px-6 md:px-10 py-12 relative overflow-hidden"
            >
                {isLoading && (
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.6, ease: "linear" }}
                        className="absolute top-0 left-0 h-[4px] bg-[#1a73e8] z-10"
                    />
                )}

                <div className="flex flex-col items-center mb-8">
                    <svg className="w-[75px] h-[24px] mb-4" viewBox="0 0 75 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.48 18.59c-2.43 0-4.47-.8-6.13-2.42-1.66-1.62-2.48-3.69-2.48-6.17 0-2.47.82-4.54 2.48-6.16C4.94 2.22 7 1.41 9.48 1.41c1.23 0 2.39.23 3.47.69s1.95 1.12 2.65 1.96l-2.4 2.4a6.4 6.4 0 00-3.72-1.12c-1.57 0-2.91.56-4.04 1.68-1.13 1.13-1.69 2.51-1.69 4.15 0 1.63.56 3.01 1.69 4.13 1.13 1.13 2.47 1.69 4.04 1.69 1.12 0 2.08-.22 2.92-.66a4.8 4.8 0 002-1.87v-3.41h-4.92V8.41h7.82V20c-.82.84-1.78 1.5-2.88 1.95s-2.3.68-3.62.68c-.62 0-1.22-.05-1.8-.16z" fill="#4285F4" />
                        <path d="M26.41 1.41v18.59h-3.41V1.41h3.41z" fill="#34A853" />
                        <circle cx="35" cy="12" r="5" fill="#FBBC05" />
                        <path d="M50 12a5 5 0 11-10 0 5 5 0 0110 0z" fill="#EA4335" />
                    </svg>
                    <h1 className="text-2xl font-normal text-[#202124] mt-2">
                        {step === 1 ? 'Sign in' : `Hi, ${email}`}
                    </h1>
                    <p className="text-[#202124] text-base mt-2 flex items-center justify-center gap-1">
                        {step === 1 ? (
                            'Use your Google Account'
                        ) : (
                            <span className="px-3 py-1 border border-[#dadce0] rounded-full text-sm inline-flex items-center gap-2 cursor-pointer hover:bg-gray-50">
                                {email} <ChevronDown className="w-4 h-4" />
                            </span>
                        )}
                    </p>
                </div>

                <div className="relative min-h-[160px]">
                    <AnimatePresence initial={false} custom={step}>
                        {step === 1 && (
                            <motion.form
                                key="step1"
                                custom={1}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                onSubmit={handleNext}
                                className="w-full"
                            >
                                <div className="relative mt-8">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-4 text-base border border-[#dadce0] rounded-[4px] outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] peer placeholder-transparent"
                                        placeholder="Email or phone"
                                    />
                                    <label className="absolute left-4 top-4 text-[#5f6368] transition-all pointer-events-none peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:text-[#1a73e8] peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1">
                                        Email or phone
                                    </label>
                                </div>
                                <button type="button" className="text-[#1a73e8] font-medium text-sm mt-2 hover:bg-[#f8f9fa] px-2 py-1 rounded inline-block">
                                    Forgot email?
                                </button>
                                <p className="text-[#5f6368] text-sm mt-8 leading-relaxed">
                                    Not your computer? Use Guest mode to sign in privately. <a href="#" className="text-[#1a73e8] font-medium">Learn more</a>
                                </p>
                                <div className="flex items-center justify-between mt-10">
                                    <button type="button" className="text-[#1a73e8] font-medium text-sm hover:bg-[#f8f9fa] px-6 py-2 rounded">
                                        Create account
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-[#1a73e8] text-white px-6 py-2 rounded font-medium text-sm hover:bg-[#1b66c9] shadow-sm"
                                    >
                                        Next
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {step === 2 && (
                            <motion.form
                                key="step2"
                                custom={-1}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                onSubmit={handleNext}
                                className="w-full pt-4"
                            >
                                <div className="relative mt-8">
                                    <input
                                        type="password"
                                        autoFocus
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-4 text-base border border-[#dadce0] rounded-[4px] outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] peer placeholder-transparent"
                                        placeholder="Enter your password"
                                    />
                                    <label className="absolute left-4 top-4 text-[#5f6368] transition-all pointer-events-none peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:text-[#1a73e8] peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1">
                                        Enter your password
                                    </label>
                                </div>
                                <div className="flex items-center gap-2 mt-4">
                                    <input type="checkbox" id="show-password" />
                                    <label htmlFor="show-password" className="text-sm text-[#202124]">Show password</label>
                                </div>
                                <div className="flex items-center justify-between mt-12">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-[#1a73e8] font-medium text-sm hover:bg-[#f8f9fa] px-6 py-2 rounded"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-[#1a73e8] text-white px-6 py-2 rounded font-medium text-sm hover:bg-[#1b66c9] shadow-sm"
                                    >
                                        Next
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            <div className="w-full max-w-[448px] mt-6 flex flex-wrap items-center justify-between px-2 text-xs text-[#5f6368]">
                <div className="flex items-center gap-4 py-2">
                    <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-200 px-2 py-1 rounded">
                        English (United Kingdom) <ChevronDown className="w-3 h-3" />
                    </div>
                </div>
                <div className="flex items-center gap-6 py-2">
                    <a href="#" className="hover:bg-gray-200 px-2 py-1 rounded">Help</a>
                    <a href="#" className="hover:bg-gray-200 px-2 py-1 rounded">Privacy</a>
                    <a href="#" className="hover:bg-gray-200 px-2 py-1 rounded">Terms</a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
