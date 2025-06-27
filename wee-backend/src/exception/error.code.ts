class ErrorCodeVo {
    readonly status;
    readonly message;

    constructor(status, message) {
        this.status = status;
        this.message = message;
    }
}

export type ErrorCode =  ErrorCodeVo;

export const USER_NOT_FOUND = new ErrorCodeVo(404, '사용자를 찾을 수 없습니다.');
export const INTERNAL_SERVER_ERROR = new ErrorCodeVo(500, '서버 내부 오류가 발생했습니다.');
export const USERNAME_DUPLICATION = new ErrorCodeVo(409, "이미 사용중인 아이디입니디.");
export const INVALID_TOKEN = new ErrorCodeVo(401, "유효하지 않은 토큰입니다.");
export const ACCESS_DENIED = new ErrorCodeVo(403, "접근 권한이 없습니다.");
export const INVALID_INPUT = new ErrorCodeVo(400, '잘못된 입력값입니다.');
export const ROOM_NOT_FOUND = new ErrorCodeVo(404, '채팅방을 찾을 수 없습니다');
export const CHAT_NOUF_FOUND = new ErrorCodeVo(404, '채팅을 찾을 수 없습니다');