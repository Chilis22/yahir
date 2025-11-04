import React from 'react';
import { WYDLogo, GoogleIcon } from '../constants';

interface LoginScreenProps {
    onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="inline-block text-slate-900">
                      <WYDLogo />
                    </div>
                    <p className="mt-2 text-lg text-slate-600">Convierte tus metas en una aventura.</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-slate-100 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                placeholder="Email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-slate-100 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                placeholder="Contraseña"
                            />
                        </div>
                        <div className="flex flex-col space-y-4">
                            <button
                                type="button"
                                onClick={onLogin}
                                className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 rounded-lg text-white font-semibold transition-colors"
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                type="button"
                                onClick={onLogin}
                                className="w-full py-3 px-4 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-800 font-semibold transition-colors"
                            >
                                Crear Cuenta
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 flex items-center justify-center">
                        <div className="flex-grow border-t border-slate-300"></div>
                        <span className="px-4 text-slate-500 text-sm">o</span>
                        <div className="flex-grow border-t border-slate-300"></div>
                    </div>

                    <div className="mt-6">
                         <button
                            type="button"
                            onClick={onLogin}
                            className="w-full flex items-center justify-center py-3 px-4 bg-white hover:bg-slate-100 rounded-lg text-slate-700 font-semibold transition-colors border border-slate-300"
                        >
                            <GoogleIcon />
                            Continuar con Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;