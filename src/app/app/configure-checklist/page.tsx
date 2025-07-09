"use client"

import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SortableList } from "../_components/sortable-list";
import { ActivityItem } from "../_components/activity-item";
import { SaveAll } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActivityItemSkeleton } from "../_components/activity-item-skeleton";
import { ChecklistEmptyState } from "../_components/checklist-empty-state";

type Activity = { id: string; name: string };

export default function ConfigureChecklist() {
  const [p1Activities, setP1Activities] = useState<Activity[]>([]);
  const [stageActivities, setStageActivities] = useState<Activity[]>([]);

  const [deletedP1Ids, setDeletedP1Ids] = useState<string[]>([]);
  const [deletedStageIds, setDeletedStageIds] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  const [newTaskName, setNewTaskName] = useState("");
  const [targetList, setTargetList] = useState<'p1' | 'stage'>('p1');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/p1-activities").then((res) => res.json()),
      fetch("/api/stage-activities").then((res) => res.json()),
    ])
      .then(([p1Data, stageData]) => {
        setP1Activities(p1Data);
        setStageActivities(stageData);
      })
      .catch(error => console.error("Falha ao carregar checklists:", error))
      .finally(() => setLoading(false));
  }, []);

  function handleDelete(id: string, type: 'p1' | 'stage') {
    if (type === 'p1') {
      setP1Activities((items) => items.filter((i) => i.id !== id));
      setDeletedP1Ids((ids) => [...ids, id]);
    } else {
      setStageActivities((items) => items.filter((i) => i.id !== id));
      setDeletedStageIds((ids) => [...ids, id]);
    }
  }

  async function handleSave(type: 'p1' | 'stage') {
    setIsSaving(true);
    const isP1 = type === 'p1';
    const endpoint = isP1 ? "/api/p1-activities" : "/api/stage-activities";
    const activities = isP1 ? p1Activities : stageActivities;
    const deletedIds = isP1 ? deletedP1Ids : deletedStageIds;

    await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order: activities.map((a, idx) => ({ id: a.id, order: idx })),
        delete: deletedIds,
      }),
    });

    if (isP1) setDeletedP1Ids([]);
    else setDeletedStageIds([]);
    
    setIsSaving(false);
  }

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    setIsSaving(true);
    const endpoint = targetList === 'p1' ? "/api/p1-activities" : "/api/stage-activities";
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTaskName }),
    });

    if (response.ok) {
        const newActivity = await response.json();
        if (targetList === 'p1') {
            setP1Activities(current => [...current, newActivity]);
        } else {
            setStageActivities(current => [...current, newActivity]);
        }
        setNewTaskName("");
    } else {
        console.error("Falha ao criar tarefa");
    }

    setIsSaving(false);
  }

  return (
    <div className="w-full max-w-md p-8">
      <div className="mt-10 justify-between flex items-center">
        <h1 className="text-3xl font-bold">Checklist</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">Criar tarefa</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTask}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task-name" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="task-name" 
                    value={newTaskName} 
                    onChange={(e) => setNewTaskName(e.target.value)} 
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="target-list" className="text-right">
                    Lista
                  </Label>
                  <Select onValueChange={(value: 'p1' | 'stage') => setTargetList(value)} defaultValue="p1">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione a lista" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="p1">Atividades P1</SelectItem>
                      <SelectItem value="stage">Atividades de Stage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Salvando..." : "Salvar Tarefa"}
                    </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Você está no lugar certo<br />para editar o checklist geral.
      </p>

      <Accordion className="mt-7" type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Atividades P1</AccordionTrigger>
          <AccordionContent>
            <Button onClick={() => handleSave('p1')} disabled={isSaving} className="w-full gap-2 mb-4">
              <SaveAll size={16} /> Salvar Checklist P1
            </Button>
            {loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <ActivityItemSkeleton key={i} />
                    ))}
                </div>
            ) : p1Activities.length === 0 ? (
                <ChecklistEmptyState
                title="Nenhuma Tarefa P1"
                description="Você ainda não adicionou tarefas. Clique em 'Criar tarefa' para começar."
                />
            ) : (
                <SortableList
                items={p1Activities}
                setItems={setP1Activities}
                renderItem={(activity) => (
                    <ActivityItem name={activity.name} onDelete={() => handleDelete(activity.id, 'p1')} />
                )}
                />
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Atividades de Stage</AccordionTrigger>
          <AccordionContent>
            <Button onClick={() => handleSave('stage')} disabled={isSaving} className="w-full gap-2 mb-4">
               <SaveAll size={16} /> Salvar Checklist Stage
            </Button>
            {loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <ActivityItemSkeleton key={i} />
                    ))}
                </div>
            ) : stageActivities.length === 0 ? (
                <ChecklistEmptyState
                    title="Nenhuma Tarefa de Stage"
                    description="Comece adicionando a primeira tarefa para este checklist."
                />
            ) : (
                <SortableList
                    items={stageActivities}
                    setItems={setStageActivities}
                    renderItem={(activity) => (
                        <ActivityItem name={activity.name} onDelete={() => handleDelete(activity.id, 'stage')} />
                    )}
                />
            )}
          </AccordionContent>
        </AccordionItem>
        
      </Accordion>
    </div>
  );
}