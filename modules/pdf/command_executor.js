const exec = require('child_process').exec;

function MergeOptions(files, inputdir, outdir) {
    this.files = files;
    this.inputdir = inputdir;
    this.outdir = outdir;
}

class Commander {

    merge({ infiles, dir, outfile }) {
        console.log(infiles);
        console.log(dir);
        console.log(outfile);

        let commandString = 'pdfunite ';
        infiles.forEach((filename) => {
            commandString = commandString + dir + "/" + filename + " ";
        })

        commandString = commandString + dir + "/" + outfile + "";

        console.log(commandString);

        return new Promise((resolve, reject) => {
            this.execute(commandString, (output, errorBool) => {
                console.log(output)
                resolve(commandString + output);
            });
        })
    }

    compress({ type, infile, outfile, dir }) {
        console.log(type)
        console.log(infile)
        console.log(outfile)
        type = type === 'default' ? 'ebook' : type;
        let commandstring = "cpdf " + type + " " + dir + "/" + infile + " " + dir + "/" + outfile;
        console.log(commandstring);
        console.log(__dirname);
        return new Promise((resolve, reject) => {
            this.execute(commandstring, (output, errorBool) => {
                resolve(output);
            });
        })
    }

    split(options) {
        return new Promise((resolve, reject) => {
            this.execute("dir", (output, errorBool) => {
                resolve(output);
            });
        })
    }

    convert({ type, infile, dir, outfile }) {
        switch (type) {
            case 'html':
                return this.convertToHtml({
                    infile: infile,
                    outfile: outfile,
                    dir: dir
                });

            case 'text':
                return this.convertTotext({
                    infile: infile,
                    outfile: outfile,
                    dir: dir
                });
        }
    }


    convertToHtml({ infile, dir, outfile }) {
        let commandString1 = "pdftohtml -s " + dir + "/" + infile
        let commandString2 = "cd " + dir + " && zip " + outfile + " " + "*"

        console.log(commandString1)
        console.log(commandString2)

        return new Promise((resolve, reject) => {
            this.execute(commandString1, (output, errorBool) => {
                if (!errorBool) {
                    this.execute(commandString2, (output2, errorBool) => {
                        resolve(output2);
                    });
                } else {
                    resolve(output);
                }

            });
        })
    }

    convertTotext({ infile, dir, outfile }) {
        let commandString1 = "cd "+dir+" && pdftotext -layout "+ infile + " cnverted_output.txt"
        // let commandString1 = "cd "+dir+" && ls"
        // let commandString2 = "ls "
        let commandString2 = "cd "+dir+" && zip " + outfile + " " + "cnverted_output.txt"

        console.log(commandString1)
        console.log(commandString2)

        return new Promise((resolve, reject) => {
            this.execute(commandString1, (output, errorBool) => {
                console.log(output)
                if (!errorBool) {
                    this.execute(commandString2, (output2, errorBool) => {
                        console.log(output2)
                        resolve(output2);
                    });
                } else {
                    resolve(output);
                }

            });
        })
    }

    execute(command, callback) {
        exec(command, function (error, stdout, stderr) {
            if (error || stderr) {
                console.log(error || stderr);
                callback(error || stderr, true)
            }
            callback(stdout, false);
        });
    }
}

module.exports = new Commander();