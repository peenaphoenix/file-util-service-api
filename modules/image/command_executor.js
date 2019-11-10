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
    // let commandString2 = 'cd ' + dir + ' && zip ' + outfile + ' ' + '*';

    console.log (commandString1);
    // console.log (commandString2);

    return new Promise ((resolve, reject) => {
      this.execute (commandString1, (output, errorBool) => {
        // if (!errorBool) {
        //   this.execute (commandString2, (output2, errorBool) => {
        //     resolve (output2);
        //   });
        // } else {
        resolve (output);
        // }
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
