"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/firebase/firebaseConfig'; // Adjust path if needed
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link'; // Import the Link component
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


interface VisitTrackData {
    id: string;
    name: string;
    cpf: string;
    birthDate: string;
    patientName: string;
}

const Cadastros = () => {
    const [registrations, setRegistrations] = useState<VisitTrackData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "visitors"));
                const data: VisitTrackData[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    cpf: doc.data().cpf,
                    birthDate: doc.data().birthDate,
                    patientName: doc.data().patientName
                }));
                setRegistrations(data);
            } catch (e: any) {
                setError(`Failed to fetch data: ${e.message}`);
                console.error("Error fetching data:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Lista de Cadastros</h1>
                <Link href="/" className="ml-4">
                    <Button className="bg-accent text-accent-foreground hover:bg-teal-700">Voltar para a tela inicial</Button>
                </Link>
            </div>
            {loading ? (
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            ) : error ? (
                <p>Error: {error}</p>
            ) : registrations.length > 0 ? (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Nome</TableHead>
                                <TableHead>CPF</TableHead>
                                <TableHead>Data de Nascimento</TableHead>
                                <TableHead>Nome do Paciente</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {registrations.map(reg => (
                                <TableRow key={reg.id}>
                                    <TableCell className="font-medium">{reg.name}</TableCell>
                                    <TableCell>{reg.cpf}</TableCell>
                                    <TableCell>{reg.birthDate}</TableCell>
                                    <TableCell>{reg.patientName}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <p>Nenhum cadastro encontrado.</p>
            )}
        </div>
    );
};

export default Cadastros;

    