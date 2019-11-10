const multer = require ('multer');
const moment = require ('moment');
const fs = require ('fs');
const {Readable} = require ('stream');

const id_prefixer = ['apple', 'orange', 'grapes', 'kiwi', 'pineapple', 'lemon'];

class FileManager {
  createUploadStorageSession = () => {
    const prefix =
      id_prefixer[Math.floor (Math.random () * id_prefixer.length)];
    return prefix + '_' + moment ().valueOf ();
  };

  upload = request => {
    return new Promise ((resolve, reject) => {
      const id = this.createUploadStorageSession ();
      const uploaddir = uploadPath + id;
      fs.mkdir (uploadPath + id, () => {
        console.log (uploaddir);
        if (!fs.existsSync (uploaddir)) reject ('failed');
        if (request.payload['file'].length) {
          for (var i = 0; i < request.payload['file'].length; i++) {
            request.payload['file'][i].pipe (
              fs.createWriteStream (
                uploaddir + '/' + request.payload['file'][i].hapi.filename
              )
            );
            // console.log(request.payload["file"][i]);
          }
        } else {
          request.payload['file'].pipe (
            fs.createWriteStream (
              uploaddir + '/' + request.payload['file'].hapi.filename
            )
          );
          // console.log(request.payload["file"][i]);
        }
        resolve (id);
      });
    });
  };

  getStreamToFile (filename) {
    let stream = fs.createReadStream (filename);
    let streamData = new Readable ().wrap (stream);
    return streamData;
  }

  getContentType (fileExt) {
    let contentType;
    switch (fileExt) {
      case 'pdf':
        contentType = 'application/pdf';
        break;
      case 'ppt':
        contentType = 'application/vnd.ms-powerpoint';
        break;
      case 'pptx':
        contentType =
          'application/vnd.openxmlformats-officedocument.preplyentationml.preplyentation';
        break;
      case 'xls':
        contentType = 'application/vnd.ms-excel';
        break;
      case 'xlsx':
        contentType =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'doc':
        contentType = 'application/msword';
        break;
      case 'docx':
        contentType =
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'csv':
        contentType = 'application/octet-stream';
        break;
      case 'xml':
        contentType = 'application/xml';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'jpg':
        contentType = 'image/jpg';
        break;
    }
    return contentType;
  }
}

module.exports = new FileManager ();
