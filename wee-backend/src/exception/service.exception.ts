import { HttpException } from '@nestjs/common';
import { ACCESS_DENIED, CHAT_NOUF_FOUND, ErrorCode, INVALID_INPUT, INVALID_TOKEN, ROOM_NOT_FOUND, USER_NOT_FOUND, USERNAME_DUPLICATION } from './error.code';

export const UserNotFoundException = (message?: string): ServiceException => {
  return new ServiceException(USER_NOT_FOUND, message);
};

export const RoomNotFoundException = (message?: string): ServiceException => {
  return new ServiceException(ROOM_NOT_FOUND, message);
}
export const UsernameConflictException = (message?: string): ServiceException => {
  return new ServiceException(USERNAME_DUPLICATION, message);
};

export const InvalidTokenException = (message: string): ServiceException => {
  return new ServiceException(INVALID_TOKEN, message);
}

export const AccessDiniedException = (message: string): ServiceException => {
    return new ServiceException(ACCESS_DENIED, message);
}

export const InvalidInputException = (message: string): ServiceException => {
    return new ServiceException(INVALID_INPUT, message);
}

export const ChatNotFoundException = (message?: string): ServiceException => {
  return new ServiceException(CHAT_NOUF_FOUND, message);
}

export class ServiceException extends HttpException {
  readonly errorCode: ErrorCode;

  constructor(errorCode: ErrorCode, message?: string) {
    super(message || errorCode.message, errorCode.status);
    this.errorCode = errorCode;
  }
}
