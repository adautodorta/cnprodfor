import { redirect } from "next/navigation";
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default async function ConfigureChecklist() {
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
            <div className="w-full max-w-md p-8">
                <div className="mt-10 justify-between flex items-center">
                    <h1 className="text-3xl font-bold">Checklist</h1>
                    <Button variant="secondary">Adicionar Tarefa</Button>
                </div>
                
                <p className="mt-4 text-sm text-muted-foreground">Você está no lugar certopara editar o checklist geral.</p>
                <Accordion className="mt-7" type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Atividades P1</AccordionTrigger>
                        <AccordionContent>
                            conteudo aqui
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Atividades STAGE</AccordionTrigger>
                        <AccordionContent>
                            conteudo aqui
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        )
      }
    
    return (
        <h1 className="flex text-center">Você não tem permissão para acessar essa página.
            <br/> Por favor, contate o administrador.
        </h1>
    )
}