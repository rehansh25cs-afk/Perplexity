import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import {useAuth} from "../Hooks/useAuth"

const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const {handleRegister} = useAuth()

    const handleSubmit = async(e) => {
        e.preventDefault()
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
            </div>

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur"
            >
                <h1 className="text-3xl font-semibold tracking-tight text-white">Create account</h1>
                <p className="mt-2 text-sm text-slate-400">Join and start using your dashboard.</p>

                <div className="mt-8 space-y-5">
                    <div>
                        <label className="mb-2 block text-sm text-slate-300" htmlFor="username">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
                            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-slate-300" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-slate-300" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="mt-7 w-full rounded-xl bg-sky-600 px-4 py-3 font-medium text-white transition duration-150 hover:bg-sky-500 active:scale-[0.98] active:bg-sky-700"
                >
                    Register
                </button>

                <p className="mt-6 text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="font-medium text-sky-400 transition duration-150 hover:text-sky-300 active:scale-[0.98] active:text-sky-200"
                    >
                        Login
                    </button>
                </p>
            </form>
        </div>
    )
}

export default Register
