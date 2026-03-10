'use client'

import NavigationBar from "@/components/NavigationBar";
import { useAppDispatch, useAppSelector } from "@/redux/3_redux";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef, useEffect, useState } from "react";
import { icArrowBack, imgProfileTemp } from "../../../public/images/asset";
import Link from "next/link";
import { useGetUserProfile } from "../(commonfunctions)/hooksProfile";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { useDoUpdateProfile } from "./hooksUpdateProfile";
import { updateLoginData } from "@/redux/1_authSlice";
import { UpdateProfileResponse } from "./updateProfileType";

const UpdateProfile = () => {
    const router = useRouter();
    const authState = useAppSelector((state) => state.auth);
    const isLoggedIn = (authState.isLoggedin && authState.accessToken !== "");

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, router]);

    const {
        data: dataProfile,
        isLoading: isLoadingProfile
    } = useGetUserProfile(authState.loginUserName);

    console.log(dataProfile, 'dataProfile');

    const [name, setName] = useState("");
    const [nameValid, setNameValid] = useState(true);
    const [email, setEmail] = useState("");
    const [emailValid, setEmailValid] = useState(true);
    const [userName, setUserName] = useState("");
    const [userNameValid, setUserNameValid] = useState(true);
    const [numberPhone, setNumberPhone] = useState("");
    const [numberPhoneValid, setNumberPhoneValid] = useState(true);
    const [bio, setBio] = useState("");
    const [bioValid, setBioValid] = useState(true);

    useEffect(() => {
    if (dataProfile?.data) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setName(dataProfile.data.name);
        setUserName(dataProfile.data.username);
        setEmail(dataProfile.data.email);
        setNumberPhone(dataProfile.data.phone);
        setBio(dataProfile.data.bio);
    }
}, [dataProfile]);

    const handleName = (text: string) => {
        setName(text);
        setNameValid(text.length > 0);
    }
    const handleUserName = (text: string) => {
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

    const handleBio = (text: string) => {
        setBio(text);
        setBioValid(text.length > 0);
    }

    // file foto
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };
    // file foto

    const dispatch = useAppDispatch();
    const { mutate: mutateUpdateProfile, isPending: isPendingUpdateProfile } = useDoUpdateProfile();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("name", name ?? "");
        formData.append("username", userName ?? "");
        formData.append("phone", numberPhone ?? "");
        formData.append("email", email ?? "");
        formData.append("bio", bio ?? "");
        if (selectedFile) {
            formData.append("avatar", selectedFile);
        } else {
            formData.append("avatarUrl", authState.avatarUrl);
        }

        mutateUpdateProfile(formData, {
            onSuccess: (response: UpdateProfileResponse) => {
                dispatch(updateLoginData(response));
                sessionStorage.setItem('toastSuksesUpdate', '1')
                router.push(`/${response.data.username}`);
            },
            onError: () => {

            }
        })
    };

    if (isLoadingProfile) {
        return (
            <div className="flex h-64 w-full items-center justify-center gap-2">
                <Spinner className="h-8 w-8" /> Loading profile
            </div>
        )
    }


    return (
        <div className=" flex min-h-screen justify-center font-sans bg-black">
            <NavigationBar
                authState={authState}
                profileName={authState.loginName}
                userName={authState.loginUserName}
                pagetitle="Edit Profile"
            />
            <main className="flex min-h-screen w-full max-w-360 flex-col px-4 md:py-10 md:px-0 mt-20 mb-30 md:mb-35">
                <div className="flex flex-col w-full md:max-w-200 gap-8 mx-auto">

                    <Link href={`/${authState.loginUserName}`} className="hidden md:flex gap-3">
                        <Image src={icArrowBack} alt="arrow back" className="w-8 h-8" />
                        <span className="text-display-xs font-bold">Edit Profile</span>
                    </Link>

                    <form method="POST" onSubmit={handleSubmit}
                        className="flex flex-col md:flex-row md:justify-between w-full gap-12">
                        <div className="flex flex-col flex-1 md:max-w-40 items-center gap-4">
                            <div className="relative shrink-0 rounded-full overflow-hidden w-20 h-20 md:w-32.5 md:h-32.5">
                                <Image
                                    id="avatar-img-display"
                                    src={previewUrl || authState.avatarUrl || imgProfileTemp}
                                    alt={`avatar `}
                                    width={130}
                                    height={130}
                                    className="rounded-full w-20 h-20 md:w-32.5 md:h-32.5 object-cover" />

                            </div>

                            <input
                                id="avatar"
                                name="avatar"
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />

                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                type="button"
                                variant={'ghost2'}
                                className="border border-neutral-900 rounded-full">Change Photo</Button>
                        </div>

                        <div className="flex flex-col flex-1 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-bold">Name</Label>
                                <Field data-invalid={!nameValid}>
                                    <Input
                                        key={dataProfile?.data.name}
                                        disabled={isPendingUpdateProfile}
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your name"
                                        className="pr-10 h-12 rounded-xl"
                                        required
                                        onChange={(e) => handleName(e.target.value)}
                                        value={name}
                                        // defaultValue={dataProfile?.data.name}
                                        aria-invalid={!nameValid}
                                    />
                                    {!nameValid && (<FieldLabel className="text-xs text-accent-red">Name required</FieldLabel>)}
                                </Field>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="username" className="text-sm font-bold">Username</Label>
                                <Field data-invalid={!userNameValid}>
                                    <Input
                                        key={dataProfile?.data.username}
                                        disabled={isPendingUpdateProfile}
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="Enter your username"
                                        className="pr-10 h-12 rounded-xl"
                                        required
                                        onChange={(e) => handleUserName(e.target.value)}
                                        value={userName}
                                        // defaultValue={dataProfile?.data.username}
                                        aria-invalid={!userNameValid}
                                    />
                                    {!userNameValid && (<FieldLabel className="text-xs text-accent-red">Username required</FieldLabel>)}
                                </Field>

                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-bold">Email</Label>
                                <Field data-invalid={!emailValid}>
                                    <Input
                                        key={dataProfile?.data.email}
                                        disabled={isPendingUpdateProfile}
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="pr-10 h-12 rounded-xl"
                                        required
                                        onChange={(e) => handleEmail(e.target.value)}
                                        value={email}
                                        // defaultValue={dataProfile?.data.email}
                                        aria-invalid={!emailValid}
                                    />
                                    {!emailValid && (<FieldLabel className="text-xs text-accent-red">Email required</FieldLabel>)}
                                </Field>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="numberphone" className="text-sm font-bold">Number Phone</Label>
                                <Field data-invalid={!numberPhoneValid}>
                                    <Input
                                        key={dataProfile?.data.phone}
                                        disabled={isPendingUpdateProfile}
                                        id="numberphone"
                                        name="numberphone"
                                        type="text"
                                        placeholder="Enter your number phone"
                                        className="pr-10 h-12 rounded-xl"
                                        required
                                        onChange={(e) => handleNumberPhone(e.target.value)}
                                        value={numberPhone}
                                        // defaultValue={dataProfile?.data.phone}
                                        aria-invalid={!numberPhoneValid}
                                    />
                                    {!numberPhoneValid && (<FieldLabel className="text-xs text-accent-red">Number phone required</FieldLabel>)}
                                </Field>

                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="bio" className="text-sm font-bold">Bio</Label>
                                <Field data-invalid={!bioValid}>
                                    <Textarea
                                        key={dataProfile?.data.bio}
                                        disabled={isPendingUpdateProfile}
                                        id="bio"
                                        name="bio"
                                        placeholder="Enter your bio"
                                        className="pr-10 h-25.25 rounded-xl"
                                        rows={4}
                                        required
                                        onChange={(e) => handleBio(e.target.value)}
                                        value={bio}
                                        // defaultValue={dataProfile?.data.bio}
                                        aria-invalid={!bioValid}
                                    />
                                    {!bioValid && (<FieldLabel className="text-xs text-accent-red">Bio required</FieldLabel>)}
                                </Field>

                            </div>

                            <Button
                                disabled={isPendingUpdateProfile}
                                type="submit"
                                className="w-full rounded-full h-12 text-sm">{isPendingUpdateProfile && (<Spinner />)} Save Changes</Button>

                        </div>
                    </form>

                </div>
            </main>
        </div>
    )
}

export default UpdateProfile;