import * as roomRepository from '../repositories/roomRepository';

export const getAllRooms = () => {
  return roomRepository.findAll();
}

export const getRoomById = (id: string) => {
  return roomRepository.findById(id);
}

export const createRoom = (data: any) => {
  if (data.capacity < 15 || data.capacity > 30) {
    throw new Error("Capacité invalide (15 à 30 max)");
  }
  return roomRepository.create(data);
};

export const updateRoom = (id: string, data: any) => {
  return roomRepository.update(id, data);
};

export const deleteRoom = (id: string) => roomRepository.remove(id);