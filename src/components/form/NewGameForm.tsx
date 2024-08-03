"use client";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { useEffect, useState } from "react";
import debounce from 'lodash/debounce';
import { signIn, useSession } from "next-auth/react";

const FormSchema = z.object({
    username: z.string().min(1, 'Name is required.').max(100),
    password: z.string().min(1, 'Password is required.').min(8, 'Password must have at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Password confirmation is required.'),
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Password do not match."
});

export default function SignUpForm() {
    const { toast } = useToast();
    const router = useRouter();

    const session = useSession();

    if (session.data?.user) {
        router.back();
    }

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: '',
            password: '',
            confirmPassword: '',
        }
    });

    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);

    // Debounced function to check username availability
    const checkUsernameAvailability = debounce(async (username: string | undefined) => {
        if (username && username.length > 0) {
            const response = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setIsUsernameAvailable(data.isAvailable);
        }
    }, 300);

    useEffect(() => {
        const subscription = form.watch((value) => {
            checkUsernameAvailability(value.username);
        });
        return () => subscription.unsubscribe();
    }, [form.watch, checkUsernameAvailability]);

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        if (!isUsernameAvailable) return;
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: values.username,
                password: values.password,
            })
        });

        if (response.ok) {
            const signInData = await signIn('credentials', {
                username: values.username,
                password: values.password,
                redirect: false,
            });

            if (signInData?.ok) {
                router.push("/");
            } else {
                toast({
                    title: "Failed create sign in as new User",
                    description: "Oops, something went wrong.",
                    variant: 'destructive',
                });
            }
        } else {
            if (response.status === 400) {
                toast({
                    title: "Failed create new User",
                    description: "Username has been registered. Please enter another username.",
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Failed create new User",
                    description: "Oops, something went wrong.",
                    variant: 'destructive',
                });
            }
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name='username'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your name" {...field} />
                            </FormControl>
                            {isUsernameAvailable === false && (
                                <p className="text-red-500 text-sm mt-1 ml-1">Username is already taken.</p>
                            )}
                            {isUsernameAvailable === true && field.value !== '' && (
                                <p className="text-green-500 text-sm mt-1 ml-1">Username is available.</p>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Enter your password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm your Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Re-Enter your Password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full mt-6">New Game</Button>
            </form>
            <div className="mx-auto my-4 flex w-full items-center justify-evenly
            before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400
            after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
                or
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
                If you already have an account, please&nbsp;
                <Link href="/load-game" className="text-blue-500 hover:underline">Load Game</Link>
            </p>
        </Form>
    );
}
