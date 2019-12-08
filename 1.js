//fs=require('fs')
/*

var fs = require('fs');
try {
  if (fs.existsSync('F:\\important_files\\Website_practise\\Nodejs_Code\\server\\Client1\\Branch1.txt')) { // or fs.existsSync

      console.log('Path exists')
  }
  else {
      console.log('Path doesnt exists')
  }
} catch (e) {
  console.log(e)
}


function writefile(path,file_text="This is file for testing")
{
  fs.writeFile(path, file_text, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
}

writefile('F:\\test folder\\testing_write1.txt',"Demo")


console.log(fs.existsSync('F:\\important_files\\Website_practise\\Nodejs_Code\\server\\Client1\\Branch1.txt'))
*/

fs=require('fs')
if(fs.existsSync('F:\\testfolder\\test2\\dsaf.txt'))
{
  fs.unlink('F:\\testfolder\\test2\\dsaf.txt', (err) => {
    if (err) {
      console.error(err)
      return
    }});
}
else {
  console.log("File not found")
}
