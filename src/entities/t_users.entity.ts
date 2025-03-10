import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { t_employees } from './t_employees.entity';

@Entity()
export class t_users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: false })
    is_hr: boolean;

    @OneToOne(() => t_employees, (employee) => employee.user)
    employee: t_employees;

    @OneToMany(() => t_employees, (employee) => employee.created_by)
    created_employees: t_employees[];
}
