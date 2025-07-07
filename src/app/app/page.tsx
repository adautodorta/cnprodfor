import { ButtonSignOut } from "./_components/button-signout"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  if(!session) {
    redirect('/');
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">Página dashboard</h1>
          <h3>Usuário logado: {session.user.name}</h3>
          <h3>Email: {session.user.email}</h3>
          <ButtonSignOut />
    </>
  )
}
