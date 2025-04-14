"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { db } from '@/firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function Home() {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [patientName, setPatientName] = useState('');

  const [nameError, setNameError] = useState('');
  const [cpfError, setCpfError] = useState('');
  const [birthDateError, setBirthDateError] = useState('');
  const [patientNameError, setPatientNameError] = useState('');

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!name) {
      setNameError('Por favor, digite seu nome.');
      hasError = true;
    } else {
      setNameError('');
    }

    if (!cpf) {
      setCpfError('Por favor, digite seu CPF.');
      hasError = true;
    } else {
      setCpfError('');
    }

    if (!birthDate) {
      setBirthDateError('Por favor, selecione sua data de nascimento.');
      hasError = true;
    } else {
      setBirthDateError('');
    }

    if (!patientName) {
      setPatientNameError('Por favor, informe o nome do paciente.');
      hasError = true;
    } else {
      setPatientNameError('');
    }

    if (hasError) {
      toast({
        title: "Erro!",
        description: "Por favor, preencha todos os campos corretamente.",
        variant: "destructive",
      });
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "visitors"), {
        name,
        cpf,
        birthDate,
        patientName
      });
      console.log("Document written with ID: ", docRef.id);
      toast({
        title: "Sucesso!",
        description: "Cadastro efetuado com sucesso.",
      });
      setName('');
      setCpf('');
      setBirthDate('');
      setPatientName('');
    } catch (error: any) {
      toast({
        title: "Erro!",
        description: `Registration failed: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const formatCPF = (value: string) => {
    const cleanedValue = value.replace(/\D/g, '');

    if (cleanedValue.length > 11) {
      return cleanedValue.substring(0, 11);
    }

    let maskedValue = cleanedValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    if (cleanedValue.length < 4) {
      maskedValue = cleanedValue;
    }
    else if (cleanedValue.length < 7) {
      maskedValue = cleanedValue.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    else if (cleanedValue.length < 10) {
      maskedValue = cleanedValue.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    }

    return maskedValue;
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
  };

  return (
    <div className="flex flex-col items-center justify-start h-screen bg-secondary">
      <header className="w-full py-4 bg-accent shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-center gap-2">
          <img src="/images/VitalHeathLogo.png" alt="Logo 1" className="h-20 rounded-md" />
          <img src="/images/UnaItabira.png" alt="Logo 2" className="h-20 rounded-md" />
        </div>
      </header>

      <div className="bg-card rounded-lg shadow-xl p-8 w-full max-w-md mt-8">
        <h1 className="text-2xl font-bold mb-4 text-center text-foreground">Controle de acesso de visitantes</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
              className={cn(nameError ? "border-destructive" : "")}
            />
            {nameError && <p className="text-xs text-destructive">{nameError}</p>}
          </div>
          <div>
            <Label htmlFor="cpf">CPF</Label>
            <Input
              type="text"
              id="cpf"
              value={cpf}
              onChange={handleCpfChange}
              placeholder="Digite seu CPF"
              maxLength={14}
              className={cn(cpfError ? "border-destructive" : "")}
            />
            {cpfError && <p className="text-xs text-destructive">{cpfError}</p>}
          </div>
          <div>
            <Label htmlFor="birthDate">Data de nascimento</Label>
            <Input
              type="date"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              placeholder="Selecione a data de nascimento"
              className={cn(birthDateError ? "border-destructive" : "")}
            />
            {birthDateError && <p className="text-xs text-destructive">{birthDateError}</p>}
          </div>
          <div>
            <Label htmlFor="patientName">Nome do paciente</Label>
            <Input
              type="text"
              id="patientName"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Informe o nome do paciente"
              className={cn(patientNameError ? "border-destructive" : "")}
            />
            {patientNameError && <p className="text-xs text-destructive">{patientNameError}</p>}
          </div>
          <Button type="submit" className="bg-accent text-accent-foreground hover:bg-teal-700">
            Cadastrar
          </Button>
        </form>
      </div>
       <Link href="/cadastros" className="mt-4">
          <Button className="bg-accent text-accent-foreground hover:bg-teal-700">
            Ver Cadastros
          </Button>
        </Link>
    </div>
  );
}
