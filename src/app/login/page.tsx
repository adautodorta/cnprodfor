"use client"

import Link from "next/link"
import { LoginForm } from "../_components/login-form"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function Login() {
  const router = useRouter();

  const goToHome = () => {
    router.replace('/');
  };

  return (
    <div className="flex min-h-screen flex-col items-center mt-40 p-4">
      <div className="w-full max-w-md space-y-8">
        <button className="flex flex-row items-center gap-3 cursor-pointer" onClick={goToHome}>
            <ArrowLeft size={18} />
            Voltar
        </button>
        <div className="text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="mt-2 text-sm text-muted-foreground">Entre com suas credenciais para acessar sua conta</p>
        </div>

        <LoginForm />

        <div className="text-center text-sm">
          <p>
            Não tem uma conta?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
