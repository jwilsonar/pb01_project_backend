import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { t_users } from './t_users.entity';
import { t_employee_documents } from './t_employee_documents.entity';

@Entity()
export class t_employees {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    job_title: string;

    @Column()
    salary: number;

    @OneToOne(() => t_users, (user) => user.employee)
    @JoinColumn()
    user: t_users;

    @ManyToOne(() => t_users, (hr_user) => hr_user.created_employees)
    created_by: t_users;

    @OneToMany(() => t_employee_documents, (document) => document.employee)
    employee_documents: t_employee_documents[];
}
