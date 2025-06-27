import {  Injectable, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoomDto } from 'src/room/dto/create-room.dto';
import { RoomEntity } from 'src/room/entities/room.entity';
import { Repository } from 'typeorm';
import { AccessDiniedException, RoomNotFoundException } from 'src/exception/service.exception';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>,
    ) {}

    async createRoom(createRoomDto: CreateRoomDto, userId: number): Promise<RoomEntity> {

        const room = await this.roomRepository.save({
            name: createRoomDto.name,
            userId: userId,
          });

          return room;
    }

    async findOneRoom(id: number, userId: number): Promise<RoomEntity> {
        const room = await this.roomRepository.findOne({ where: { id, userId } });
      
        if (!room) {
          throw RoomNotFoundException('채팅방을 찾을 수 없습니다.')
        }
      
        return room;
      }

    async findAllRoom(userId: number): Promise<RoomEntity[]> {
        return await this.roomRepository.find({
            where: { userId }
        })
    }

    async modifyRoom(updateRoomDto: UpdateRoomDto, id: number, userId: number): Promise<RoomEntity>{
        const room = await this.findOneRoom(id, userId);
        
        if(room.userId !== userId) {
            throw AccessDiniedException('방을 수정할 수 있는 권한이 없습니다.');
        }

        await this.roomRepository.update(id, updateRoomDto);
        const updateRoom = await this.findOneRoom(id, userId);
        return updateRoom;
    }

    async deleteRoom(id: number, userId: number): Promise<void> {

       const room = await this.findOneRoom(id, userId);

       if (!room) {
           throw RoomNotFoundException('채팅방을 찾을 수 없습니다.');
       }
   
       if (room.userId !== userId) {
           throw AccessDiniedException('방을 삭제할 권한이 없습니다.');
       }
   
       await this.roomRepository.delete(id);
    }

    async deleteAllRooms(userId: number): Promise<void>{
        await this.roomRepository.delete({ userId });
    }
}
