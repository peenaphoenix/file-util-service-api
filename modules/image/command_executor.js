const exec = require ('child_process').exec;

function MergeOptions (files, inputdir, outdir) {
  this.files = files;
  this.inputdir = inputdir;
  this.outdir = outdir;
}

class Commander {
  convert({type, infile, dir, outfile}) {
    this.convert (infile, dir, outfile);
  }

  convert({infile, dir, outfile}) {
    let commandString1 = 'cd ' + dir + '&& convert ' + infile + ' ' + outfile;

    console.log (commandString1)

    return new Promise ((resolve, reject) => {
      this.execute (commandString1, (output, errorBool) => {
        resolve (output);
      });
    });
  }

  execute (command, callback) {
    exec (command, function (error, stdout, stderr) {
      if (error || stderr) {
        console.log (error || stderr);
        callback (error || stderr, true);
      }
      callback (stdout, false);
    });
  }
}

module.exports = new Commander ();
