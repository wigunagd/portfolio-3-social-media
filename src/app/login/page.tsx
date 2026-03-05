'use client'

import Image from "next/image";
import { gradientBg, iconEye, iconEyeOff } from "../../../public/images/asset";
import { Field, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/3_redux";
import { useRouter } from "next/navigation";
import { useDoLogin } from "./hooksLogin";
import { Spinner } from "@/components/ui/spinner";
import { setLoginData } from "@/redux/1_authSlice";
import { LoginResponse } from "./typeLogin";
import Logo from "@/components/Logo";
import { AxiosError } from "axios";
import { RegisterResponse } from "../register/typeRegister";
import { ForceLogin } from "./forceLogin";

export default function Login() {

    ForceLogin();

    const authState = useAppSelector((state) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (authState.isLoggedin && authState.accessToken !== "") {
            router.push('/');
        }
    }, [authState.accessToken, authState.isLoggedin, router]);

    const dispatch = useAppDispatch();
    const { mutate, isPending } = useDoLogin();

    const [email, setEmail] = useState("");
    const [emailValid, setEmailValid] = useState(true);
    const [passwd, setPasswd] = useState("");
    const [passwdValid, setPasswdValid] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loginGagal, setLoginGagal] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const handleEmail = (text: string) => {
        setEmail(text);
        setEmailValid(text.length > 0);
    }

    const handlePassword = (text: string) => {
        setPasswd(text);
        setPasswdValid(text.length > 0);
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onLogin = () => {
        const isEmailValid = email.length > 0;
        const isPasswdValid = passwd.length > 0;
        setLoginGagal(false);

        setEmailValid(isEmailValid);
        setPasswdValid(isPasswdValid);

        if (isEmailValid && isPasswdValid) {
            mutate({
                email: email,
                password: passwd
            }, {
                onSuccess: (response: LoginResponse) => {
                    dispatch(setLoginData(response.data));
                    router.push('/');
                },
                onError: (e) => {
                    const error = e as AxiosError<RegisterResponse>;

                    if (Number(error.code) === 401) {
                        setErrMsg('Login failed. Username or password incorect.');
                        setLoginGagal(true);
                    }else{
                        setErrMsg(`${error.message} ${error.code}`);
                        setLoginGagal(true);
                    }
                }
            })
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin();
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center font-sans">
            <main className="flex min-h-screen w-full max-w-360 px-6 md:px-0 flex-col items-center justify-center ">

                <div className="flex flex-col w-full px-5 py-10 max-w-111.5 items-center gap-6 bg-neutral-950/50 border border-neutral-900 rounded-2xl">

                    <Logo className="flex" />

                    <span className="text-display-xs font-bold">Welcome Back!</span>

                    <form method="POST" onSubmit={handleSubmit} className="flex flex-col w-full gap-5">


                        <div className="grid gap-4">
                            <Label htmlFor="email" className="text-sm font-bold">Email</Label>
                            <Field data-invalid={!emailValid}>
                                <Input
                                    disabled={isPending}
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="pr-10 h-12 rounded-xl"
                                    required
                                    onChange={(e) => handleEmail(e.target.value)}
                                    value={email}
                                    aria-invalid={!emailValid}
                                />
                                {!emailValid && (<FieldLabel className="text-xs text-accent-red">Email required</FieldLabel>)}
                            </Field>
                        </div>

                        <div className="grid gap-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-bold">Password</Label>
                            </div>

                            <Field data-invalid={!passwdValid}>
                                <div className="relative">
                                    <Input
                                        disabled={isPending}
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className="pr-10 h-12 rounded-xl"
                                        required
                                        onChange={(e) => handlePassword(e.target.value)}
                                        value={passwd}
                                        aria-invalid={!passwdValid}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none hover:opacity-70 transition-opacity"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        <Image
                                            src={showPassword ? iconEyeOff : iconEye}
                                            alt="Toggle Visibility"
                                            width={20}
                                            height={20}
                                        />
                                    </button>
                                </div>
                                {!passwdValid && (<FieldLabel className="text-xs text-accent-red">Password required</FieldLabel>)}
                            </Field>

                        </div>

                        <div className="grid gap-4">
                            <Button
                                disabled={isPending}
                                type="submit"
                                className="w-full rounded-full h-12 text-sm">{isPending && (<Spinner />)}Login</Button>
                            {loginGagal && (
                                <span className="text-sm colorerrormsg text-center">{errMsg}</span>
                            )}
                            <div className="text-sm font-semibold text-center">
                                Don`t have an account?{" "}
                                <Link
                                    href={`/register`}
                                    className="text-primary-300 font-semibold hover:underline"
                                >
                                    Register
                                </Link>
                            </div>
                        </div>
                    </form>

                </div>

            </main>
            <Image id="gradient-bg" src={gradientBg} alt="backgroud Login" className="absolute bottom-0 left-0 w-full md:h-1/2 -z-10" />
        </div>
    );
}
