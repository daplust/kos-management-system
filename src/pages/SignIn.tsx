import { User, Lock, EyeOff, Eye } from 'lucide-react';
import { useState } from 'react';

export const SignIn = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(''); 
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-full mb-4">
                            <Lock className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="font-bold text-3xl text-primary text-center">Wisma Videra</h1>
                        <h3 className="text-lg text-gray-500 mt-2">Sistem Management</h3>
                    </div>
                    <form className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="username" className="text-base font-semibold block mb-3">Username</label>
                            <div className='relative'>
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input id="username" name="username" type="email" autoComplete="email" required className="w-full pl-12 pr-4 py-4 text-base border-2 border-border rounded-lg focus:border-primary focus:outline-none transition-colors" placeholder="Masukkan email" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="text-base font-semibold block mb-3">Password</label>
                            <div className='relative'>
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input id="password" name="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError('');
                                }} required className="w-full pl-12 pr-4 py-4 text-base border-2 border-border rounded-lg focus:border-primary focus:outline-none transition-colors" placeholder="Masukkan password" />
                                <button type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        {error && (
                            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-base">
                                {error}
                            </div>
                        )}
                    </form>
                    <button
                        type="submit"
                        className="mt-8 w-full bg-primary text-white py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                    >
                        Masuk
                    </button>
                </div>
            </div>
        </div>
    );
}