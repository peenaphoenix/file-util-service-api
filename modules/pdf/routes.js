const fileManager = require("../common/file-manager");
const commander = require("./command_executor");
const fs = require('fs')
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
const prefix = "/pdf";

let pdfRoutes = [{
    method: 'GET',
    path: '/merge',
    handler: (request, h) => {

        return 'Hello World! merge' + fileManager.createUploadStorageSession();
    }
},{
    method: 'POST',
    path: '/merge2',
    config: {
        payload: {
            output: "stream",
            parse: true,
            allow: "multipart/form-data",
            maxBytes: 2 * 1000 * 1000
        }
    },
    handler: async (request, h) => {
        const uploadSessionDir = await fileManager.upload(request);
        let inputfiles = request.payload['file'].map((item)=>item.hapi.filename);
        let outputfile = 'merged.pdf';
        await commander.merge({
            infiles:inputfiles,
            dir:uploadPath+uploadSessionDir,
            outfile:outputfile
        }).catch(err=>console.log(err));
        let streamData = fileManager.getStreamToFile(uploadPath+uploadSessionDir+"/"+outputfile);
        return h.response(streamData)
            .header('Content-Type', 'application/pdf')
            .header('Content-Disposition', 'attachment; filename= ' + outputfile);
    }
},{
    method: 'POST',
    path: '/compress',
    config: {
        payload: {
            output: "stream",
            parse: true,
            allow: "multipart/form-data",
            maxBytes: 2 * 1000 * 1000
        }
    },
    handler: async (request, h) => {
        console.log(JSON.stringify(request.payload['file'].length))
        const uploadSessionDir = await fileManager.upload(request);
        let infile = request.payload['file'].hapi.filename;
        let outfile = 'compressed_'+infile;
        
        await commander.compress({
            type:'default',
            infile:infile,
            dir:uploadPath+uploadSessionDir,
            outfile:outfile
        }).catch(err=>console.log(err));
        let streamData = fileManager.getStreamToFile(uploadPath+uploadSessionDir+"/"+outfile);
        return h.response(streamData)
            .header('Content-Type', 'application/pdf')
            .header('Content-Disposition', 'attachment; filename= ' + outfile);
    }
},{
    method: 'POST',
    path: '/convert',
    config: {
        payload: {
            output: "stream",
            parse: true,
            allow: "multipart/form-data",
            maxBytes: 2 * 1000 * 1000
        }
    },
    handler: async (request, h) => {
        console.log(JSON.stringify(request.payload['type']))
        const uploadSessionDir = await fileManager.upload(request);
        let infile = request.payload['file'].hapi.filename;
        let outfile = 'converted_'+infile.replace('.pdf','.zip');
        
        await commander.convert({
            type:request.payload['type'],
            infile:infile,
            dir:uploadPath+uploadSessionDir,
            outfile:outfile
        }).catch(err=>console.log(err));
        let streamData = fileManager.getStreamToFile(uploadPath+uploadSessionDir+"/"+outfile);
        return h.response(streamData)
            .header('Content-Type', 'application/zip')
            .header('Content-Disposition', 'attachment; filename= ' + outfile);
    }
},{
    method: 'GET',
    path: '/analyse',
    handler: (request, h) => {

        return 'Hello World! analyse';
    }
},{
    method: 'GET',
    path: '/convert12',
    handler: (request, h) => {
        
        return 'Hello World! convertt';
    }
}]

pdfRoutes = pdfRoutes.map(item=>{
    item.path = prefix + item.path;
    return item;
});

module.exports = pdfRoutes;