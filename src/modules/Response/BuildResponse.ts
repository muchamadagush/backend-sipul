type DataResponse =
  | {
      message?: string
      code?: number
    }
  | any

class BuildResponse {
  private static baseResponse(dataResponse: DataResponse) {
    const {
      message = 'Data sudah diterima',
      code = 200,
      ...rest
    } = dataResponse
    return {
      code,
      message,
      ...rest,
    }
  }

  /**
   * Response Success
   */
  public static get(dataResponse: DataResponse) {
    return this.baseResponse(dataResponse)
  }

  /**
   * Response Create
   */
  public static created(dataResponse: DataResponse) {
    return this.baseResponse({
      code: 201,
      message: 'Data berhasil dibuat',
      ...dataResponse,
    })
  }

  /**
   * Response Update
   */
  public static updated(dataResponse: DataResponse) {
    return this.baseResponse({
      message: 'Data berhasil diperbarui',
      ...dataResponse,
    })
  }

  /**
   * Response Delete
   */
  public static deleted(dataResponse: DataResponse) {
    return this.baseResponse({
      message: 'Data berhasil dihapus',
      ...dataResponse,
    })
  }
}

export default BuildResponse
