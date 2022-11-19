/**
 *
 * @param mimetype
 */
 function getFileType(mimetype: String) {
    let type = ''
    let baseDir = ''
  
    switch (mimetype) {
      case 'image/png':
      case 'image/jpg':
      case 'image/jpeg':
      case 'image/gif':
        type = 'image'
        baseDir = 'images'
        break
      case 'video/x-flv': // *.flv
      case 'video/mp4': // *.mp4
      case 'video/quicktime': // *.mov
      case 'video/mpeg': // *.mpg
      case 'video/x-msvideo': // *.avi
      case 'video/x-ms-wmv': // *.wmv
      case 'video/ogg': // *.ogg
      case 'video/webm': // *.webm
      case 'video/3gpp': // *.3gpp
        type = 'video'
        baseDir = 'videos'
        break
      case 'application/pdf':
        type = 'pdf'
        baseDir = 'pdf'
        break
      case 'application/vnd.ms-powerpoint':
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        type = 'ppt'
        baseDir = 'ppt'
        break
      default:
        type = 'unknown'
        baseDir = ''
    }
  
    return { type, baseDir }
  }

  export {
    getFileType,
  }
  