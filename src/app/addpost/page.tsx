'use client'

import NavigationBar from "@/components/NavigationBar";
import { useAppSelector } from "@/redux/3_redux";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { icArrowBack, icArrowUpload, icTrash, icUpload } from "../../../public/images/asset";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { useDoAddPost } from "./hooksAddPost";
import { toast } from "sonner";

const AddPost = () => {
    const router = useRouter();
    const authState = useAppSelector((state) => state.auth);
    const isLoggedIn = (authState.isLoggedin && authState.accessToken !== "");

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, router]);

    // handle gambar
    const maxPhotoSize = 5 * 1024 * 1024;
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedFileValid, setSelectedFileValid] = useState(true);
    const [selectedFileValidText, setSelectedFileValidText] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isDragging, setIsDragging] = useState(false);

    const processFile = (file: File) => {
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };


    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > maxPhotoSize) {
                setSelectedFileValid(false);
                setSelectedFileValidText(`Picture maximum size is 5MB`);
                return;
            } else {
                setSelectedFileValid(true);
                setSelectedFileValidText(``);
            }

            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };
    // handle gambar

    const [caption, setCaption] = useState("");
    const [captionValid, setCaptionValid] = useState(true);

    const handleBio = (text: string) => {
        setCaption(text);
        setCaptionValid(text.length > 0);
    }

    const handleDeleteImage = () => {
        setPreviewUrl(null);
        setSelectedFile(null);
    }

    const { mutate: mutateAddPost, isPending: isPendingAddPost } = useDoAddPost();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            setSelectedFileValid(false);
            setSelectedFileValidText(`Picture not selected`);
        } else {
            setSelectedFileValid(true);
            setSelectedFileValidText(``);
        }

        if (caption.length === 0) {
            setCaptionValid(false);
        }

        if (!selectedFile || caption.length === 0) {
            return;
        }

        const formData = new FormData();

        formData.append("caption", caption);
        if (selectedFile) {
            formData.append("image", selectedFile);
        }

        mutateAddPost(formData, {
            onSuccess: () => {
                sessionStorage.setItem('toastSuksesAddPost', '1')
                router.push(`/`);
            },
            onError: () => {
                toast.error('Unable to upload the image');
            }
        })
    };

    return (
        <div className=" flex min-h-screen justify-center font-sans bg-black">
            <NavigationBar
                authState={authState}
                profileName={authState.loginName}
                userName={authState.loginUserName}
                pagetitle="Add Post"
            />
            <main className="flex min-h-screen w-full max-w-360 flex-col px-4 md:py-10 md:px-0 mt-20 mb-30 md:mb-35">
                <div id="content" className="flex flex-col w-full md:max-w-122.75 gap-6 mx-auto">

                    <Link href={`/${authState.loginUserName}`} className="hidden md:flex gap-3">
                        <Image src={icArrowBack} alt="arrow back" className="w-8 h-8" />
                        <span className="text-display-xs font-bold">Add Post</span>
                    </Link>

                    <form method="POST" onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop} onSubmit={handleSubmit} className="flex flex-col w-full gap-4">

                        <div className="grid gap-2">
                            <Label className="text-sm font-bold">Photo</Label>
                            <Field data-invalid={!selectedFileValid}>
                                <div className={`flex flex-col w-full min-h-36 border rounded-xl px-6 py-4 border-dashed bg-neutral-950 
                                ${selectedFileValid ? 'border-neutral-900' : 'border-accent-red'} 
                                ${isDragging && ('border border-neutral-500 rounded-2xl')} `}>

                                    {
                                        !previewUrl && (
                                            <div className={`flex flex-col w-full h-full items-center justify-center p-5 text-neutral-600  `}>

                                                {
                                                    !isDragging && (
                                                        <>
                                                            <Button
                                                                onClick={() => fileInputRef.current?.click()}
                                                                type="button"
                                                                variant={`ghost`}
                                                                className="flex w-10 h-10 p-0 rounded-md border border-neutral-900">
                                                                <Image src={icUpload} alt="upload" width={20} height={20} />
                                                            </Button>

                                                            <span className="text-sm font-black "><Button type="button" onClick={() => fileInputRef.current?.click()} variant={'ghost2'} className="text-primary-300 p-0">Click to upload</Button> or drag and drop</span>
                                                            <span className="text-sm font-black ">PNG or JPG  (max. 5mb)</span>
                                                        </>
                                                    )
                                                }

                                                {
                                                    isDragging && (
                                                        <span className="text-sm my-auto font-black h-full min-h-24">Drop image here</span>
                                                    )
                                                }
                                            </div>
                                        )
                                    }

                                    <input
                                        id="avatar"
                                        name="avatar"
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />

                                    {
                                        previewUrl && (
                                            <div className="flex flex-col w-full gap-3">
                                                <Image
                                                    id="avatar-img-display"
                                                    src={previewUrl}
                                                    alt={`avatar `}
                                                    width={1200}
                                                    height={1200}
                                                    className="w-full h-auto max-h-full object-contain transition-transform" />

                                                <div className="flex w-full justify-center gap-3">
                                                    <Button
                                                        onClick={() => fileInputRef.current?.click()}
                                                        type="button"
                                                        variant={'ghost'}
                                                        className="bg-neutral-900">
                                                        <Image src={icArrowUpload} alt="arrow upload" width={20} height={20} />Change Image
                                                    </Button>

                                                    <Button
                                                        onClick={handleDeleteImage}
                                                        type="button"
                                                        variant={'ghost'}
                                                        className="bg-neutral-900 text-accent-red">
                                                        <Image src={icTrash} alt="arrow upload" width={20} height={20} />Delete Image
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    }

                                </div>
                                {!selectedFileValid && (<FieldLabel className="text-xs text-accent-red">{selectedFileValidText}</FieldLabel>)}
                            </Field>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="bio" className="text-sm font-bold">Caption</Label>
                            <Field data-invalid={!captionValid}>
                                <Textarea
                                    disabled={isPendingAddPost}
                                    id="bio"
                                    name="bio"
                                    placeholder="Create your caption"
                                    className="py-2 px-4 h-25.25 rounded-xl"
                                    rows={4}
                                    required
                                    onChange={(e) => handleBio(e.target.value)}
                                    value={caption}
                                    aria-invalid={!captionValid}
                                />
                                {!captionValid && (<FieldLabel className="text-xs text-accent-red">Bio required</FieldLabel>)}
                            </Field>

                        </div>

                        <Button
                            disabled={isPendingAddPost}
                            type="submit"
                            className="w-full rounded-full h-12 text-sm">{isPendingAddPost && (<Spinner />)} Share</Button>

                    </form>

                </div>
            </main>
        </div>
    )
}

export default AddPost;