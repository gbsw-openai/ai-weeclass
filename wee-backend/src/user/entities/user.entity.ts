import { MessageEntity } from 'src/openai/entities/message.entity';
import { RoomEntity } from 'src/room/entities/room.entity';
import { BaseEntity, Column, Entity,  OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import { Exclude } from 'class-transformer';


@Entity('user')
export class UserEntity extends BaseEntity{
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Exclude()
  @Column('varchar', { unique: false, nullable: false})
  password: string;

  @Column('varchar', { unique: true, nullable: false, length: 50 })
  username: string;

  @OneToMany(() => MessageEntity, (message) => message.user)
  messages: MessageEntity[];

  @OneToMany(() => RoomEntity, (room) => room.user)
  rooms: RoomEntity[];
  
}
