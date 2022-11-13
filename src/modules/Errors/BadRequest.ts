import BaseResponse from './BaseResponse'

class BadRequest extends BaseResponse {
  constructor(message: string, status?: number) {
    super(message, status || 400)
    Object.setPrototypeOf(this, BadRequest.prototype)
  }
}

export default BadRequest
