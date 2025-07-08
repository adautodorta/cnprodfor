import { Button } from "@/components/ui/button";
import { ButtonSignOut } from "./_components/button-signout"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if(!session) {
    redirect('/');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true, name: true, email: true },
  });

  function getGreetingByTime(): string {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return "Bom dia";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Boa tarde";
    } else {
      return "Boa noite";
    }
  }

  if (user?.role !== 'ADMIN') {
    return (
      <>
        <h2 className="flex text-center">Bem vindo, voluntário! A plataforma interna está sendo construída.<br/>Mas por enquanto, você pode acessar a página principal conforme anteriormente.</h2>
        <Link href="/" passHref>
          <Button className="mt-7" variant="secondary">Ir para checklist</Button>
        </Link>
      </>
    )
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">{getGreetingByTime()}, {session.user.name}!</h1>
      <p>Sua conta é administradora.</p>
    </>
  )
}
