import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, JoinColumn } from 'typeorm';
import { t_employees } from './t_employees.entity';
import { t_document_types } from './t_document_types.entity';

@Entity()
@Unique(['employee_id', 'document_type_id'])
export class t_employee_documents {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => t_document_types, (document_type) => document_type.employee_documents, {
        eager: true
    })
    @JoinColumn({ name: 'document_type_id' })
    document_type: t_document_types;

    @Column()
    document_type_id: number;

    @ManyToOne(() => t_employees, (employee) => employee.employee_documents, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'employee_id' })
    employee: t_employees;

    @Column()
    employee_id: number;

    @Column()
    file_path: string;

    @Column({ default: true })
    is_active: boolean;
} 