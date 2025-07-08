import { redirect } from "next/navigation";
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { UsersTable } from "../_components/users-table"
import { prisma } from "@/lib/prisma";

export default async function Volunteers() {
    const session = await auth.api.getSession({ headers: await headers() });
  
    if(!session) {
      redirect('/');
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true, name: true, email: true },
      });

    if (user?.role === 'ADMIN') {
        return (
            <UsersTable />
        )
      }
    
    return (
        <h1 className="flex text-center">Você não tem permissão para acessar essa página.
            <br/> Por favor, contate o administrador.
        </h1>
    )
}