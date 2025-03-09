import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { t_employee_documents } from './t_employee_documents.entity';

@Entity()
export class t_document_types {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => t_employee_documents, (document) => document.document_type)
    employee_documents: t_employee_documents[];
} 