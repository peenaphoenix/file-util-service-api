const fileManager = require ('../common/file-manager');
const commander = require ('./command_executor');
const fs = require ('fs');
/**
 * controller 
 * Functions defined : 
 * 1. unite
 * 2. split - sub pdf
 * 3. pdf info  - analyse phase 
 * 4. pdf fonts - analyse phase
 * 5. convert - html
 * 6. convert - svg / jpeg / png
 * 7. Conver - to text
 */
const prefix = '/image';

let imageRoutes = [
  {
    method: 'POST',
    path: '/convert',
    config: {
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        maxBytes: 2 * 1000 * 1000,
      },
    },
    handler: async (request, h) => {
      console.log (JSON.stringify (request.payload['type']));
      const uploadSessionDir = await fileManager.upload (request);
      let infile = request.payload['file'].hapi.filename;
      let outfile = 'converted_' + infile.replace ('.jpg', '.png');

      await commander
        .convert ({
          infile: infile,
          dir: uploadPath + uploadSessionDir,
          outfile: outfile,
        })
        .catch (err => console.log (err));
      let streamData = fileManager.getStreamToFile (
        uploadPath + uploadSessionDir + '/' + outfile
      );
      return h
        .response (streamData)
        .header ('Content-Type', fileManager.getContentType ('png'))
        .header ('Content-Disposition', 'attachment; filename= ' + outfile);
    },
  },
];

imageRoutes = imageRoutes.map (item => {
  item.path = prefix + item.path;
  return item;
});

module.exports = imageRoutes;
