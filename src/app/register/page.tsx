'use client'

import Image from "next/image";
import { gradientBg, iconEye, iconEyeOff, logoCompany } from "../../../public/images/asset";
import { Field, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Register() {
    const [email, setEmail] = useState("");
    const [emailValid, setEmailValid] = useState(true);
    const [userName, setUserName] = useState("");
    const [userNameValid, setUserNameValid] = useState(true);
    const [numberPhone, setNumberPhone] = useState("");
    const [numberPhoneValid, setNumberPhoneValid] = useState(true);
    const [passwd, setPasswd] = useState("");
    const [passwdValid, setPasswdValid] = useState(true);
    const [confirmpasswd, setConfirmPasswd] = useState("");
    const [confirmpasswdValid, setConfirmPasswdValid] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const handleName = (text: string) => {
        setUserName(text);
        setUserNameValid(text.length > 0);
    }

    const handleEmail = (text: string) => {
        setEmail(text);
        setEmailValid(text.length > 0);
    }

    const handleNumberPhone = (text: string) => {
        setNumberPhone(text);
        setNumberPhoneValid(text.length > 0);
    }

    const handlePassword = (text: string) => {
        setPasswd(text);
        setPasswdValid(text.length > 0);
    }

    const handleConfirmPassword = (text: string) => {
        setConfirmPasswd(text);
        setConfirmPasswdValid(text.length > 0);
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const togglePasswordConfirmVisibility = () => {
        setShowPasswordConfirm(!showPasswordConfirm);
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center font-sans">
            <main className="flex min-h-screen w-full max-w-360 px-6 md:px-0 flex-col items-center justify-center ">

                <div className="flex flex-col w-full px-5 py-10 max-w-130.75 items-center gap-6 bg-neutral-950/50 border border-neutral-900 rounded-2xl">

                    <div id="logo-group" className="flex gap-2.75 items-center">
                        <Image src={logoCompany} alt="logo company" className="w-7.5 h-7.5" /> <span className="text-display-xs font-bold">Sociality</span>
                    </div>

                    <span className="text-display-xs font-bold">Register</span>

                    <form method="POST" className="flex flex-col w-full gap-5">
                        

                        <div className="grid gap-4">
                            <Label htmlFor="email" className="text-sm font-bold">Email</Label>
                            <Field data-invalid={!emailValid}>
                                <Input
                                    // disabled={isPending}
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
                            <Label htmlFor="name" className="text-sm font-bold">Username</Label>
                            <Field data-invalid={!userNameValid}>
                                <Input
                                    // disabled={isPending}
                                    id="name"
                                    type="text"
                                    placeholder="Enter your username"
                                    className="pr-10 h-12 rounded-xl"
                                    required
                                    onChange={(e) => handleName(e.target.value)}
                                    value={userName}
                                    aria-invalid={!userNameValid}
                                />
                                {!userNameValid && (<FieldLabel className="text-xs text-accent-red">Username required</FieldLabel>)}
                            </Field>

                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="name" className="text-sm font-bold">Number Phone</Label>
                            <Field data-invalid={!numberPhoneValid}>
                                <Input
                                    // disabled={isPending}
                                    id="numberPhone"
                                    type="text"
                                    placeholder="Enter your number phone"
                                    className="pr-10 h-12 rounded-xl"
                                    required
                                    onChange={(e) => handleNumberPhone(e.target.value)}
                                    value={numberPhone}
                                    aria-invalid={!numberPhoneValid}
                                />
                                {!numberPhoneValid && (<FieldLabel className="text-xs text-accent-red">Number phone required</FieldLabel>)}
                            </Field>

                        </div>

                        <div className="grid gap-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-bold">Password</Label>
                            </div>

                            <Field data-invalid={!passwdValid}>
                                <div className="relative">
                                    <Input
                                        // disabled={isPending}
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
                            <div className="flex items-center justify-between">
                                <Label htmlFor="passwordconfirm" className="text-sm font-bold">Confirm Password</Label>
                            </div>
                            <Field data-invalid={!confirmpasswdValid}>
                                <div className="relative">
                                    <Input
                                        // disabled={isPending}
                                        id="passwordconfirm"
                                        type={showPasswordConfirm ? "text" : "password"}
                                        placeholder="Enter your confirm password"
                                        className="pr-10 h-12 rounded-xl"
                                        required
                                        onChange={(e) => handleConfirmPassword(e.target.value)}
                                        value={confirmpasswd}
                                        aria-invalid={!confirmpasswdValid}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordConfirmVisibility}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none hover:opacity-70 transition-opacity"
                                        aria-label={showPasswordConfirm ? "Hide password" : "Show password"}
                                    >
                                        <Image
                                            src={showPasswordConfirm ? iconEyeOff : iconEye}
                                            alt="Toggle Visibility"
                                            width={20}
                                            height={20}
                                        />
                                    </button>
                                </div>
                                {!confirmpasswdValid && (<FieldLabel className="text-xs text-accent-red">Confirm password required</FieldLabel>)}
                            </Field>


                        </div>

                        <div className="grid gap-4">
                            <Button
                                // disabled={isPending}
                                // onClick={onRegister}
                                className="w-full rounded-full h-12 text-sm">{/* {isPending && (<Spinner />)}  */}Submit</Button>
                            {errorMsg !== '' && (
                                <span className="text-sm colorerrormsg text-center">{errorMsg}</span>
                            )}
                            <div className="text-sm font-semibold text-center">
                                Already have an account?{" "}
                                <Link
                                    href={`/login`}
                                    className="text-primary-300 font-semibold hover:underline"
                                >
                                    Login
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
