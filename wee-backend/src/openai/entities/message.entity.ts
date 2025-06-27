import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import { RoomEntity } from '../../room/entities/room.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('message')
export class MessageEntity extends BaseEntity{
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;
    
  @Column('varchar', { unique: false, nullable: false })
  userMessage: string;

  @Column('text', { nullable: false })
  aiResponse: string;

  @Column({
    name: 'user_id',
    type: 'integer',
    nullable: false
  })
  userId: number;
  
  @ManyToOne(() => UserEntity, (user) => user.messages)
  @JoinColumn({ name: 'user_id'})
  user: UserEntity;

  @Column({
    name: 'room_id',
    type: 'integer',
    nullable: false
  })
  roomId: number;

  @ManyToOne(() => RoomEntity, (room) => room.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id'})
  room: RoomEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
