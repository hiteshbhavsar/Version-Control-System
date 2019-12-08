//This file is just to test the basic operation of fs module

fs=require('fs')

// Working for reading the files in the folder
function readfile(path)
{
    return fs.readFileSync(path,'UTF8',function(data,err)
    {
        if(err) throw err;
        return data
    });
}

console.log(readfile('F:\\test folder\\destination.txt'))

//Working code for copying file
fs.copyFile('F:\\important files\\Website practise\\Nodejs Code\\Client\\Client1\\ABC.txt', 'F:\\test folder\\destination.txt', (err) => {
  if (err) throw err;
  console.log('source.txt was copied to destination.txt');
});


function writefile(path,file_text="This is file for testing")
{
  fs.writeFile(path, file_text, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
}

writefile('F:\\test folder\\testing_write.txt',"Demo")


function CopyFile(path1,path2)
{
  fs.copyFile('F:\\important files\\Website practise\\Nodejs Code\\Client\\Client1\\ABC.txt', 'F:\\test folder\\destination.txt', (err) => {
    if (err) throw err;
    console.log('File copied to destination');
  });
}
