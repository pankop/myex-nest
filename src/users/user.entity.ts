import { Exclude } from 'class-transformer';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude() //ini interceptor agar password tidak nampak ketika dipanggil 
  password: string;

  @AfterInsert() // ini namanya hook dijalankan setelah method crete
  logInsert() {
    console.log('Inserted User with id: ' + this.id);
  }

  @AfterUpdate() // ini namanya hook dijalankan setelah method crete
  logUpdate() {
    console.log('Updated User with id: ' + this.id);
  }

  @AfterRemove() // ini namanya hook dijalankan setelah method crete
  logRemove() {
    console.log('Removed User with id: ' + this.id);
  }
}
