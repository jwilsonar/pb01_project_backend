import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { t_employees } from './t_employees';
import { t_document_types } from './t_document_types.entity';

@Entity()
export class t_employee_documents {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => t_document_types, (document_type) => document_type.employee_documents)
    document_type: t_document_types;

    @Column()
    document_type_id: number;

    @ManyToOne(() => t_employees, (employee) => employee.employee_documents)
    employee: t_employees;

    @Column()
    employee_id: number;

    @Column()
    file_path: string;

    @Column({ default: true })
    is_active: boolean;
} 