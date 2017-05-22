var http = require('http');
var fs = require('fs');
var url = require('url');
var mime = require('mime-types');
var junk = require('junk');
var corefuncs = require('./exports.js');
const ROOT = "./public_html";
const DATAROOT = "./public_html/Data/";

var server = http.createServer(handleRequest);
server.listen(2406);
console.log('Server listening on port 2406');

function handleRequest(req, res){
	console.log("URL:"+req.url);
	var data ='';
	if(req.url === '/'){
        filecontent(ROOT+'/index.html');	
	}else if (req.method==="GET"){
           	if(req.url ==="/ftablename" || req.url ==="/stablename"){
                getftablename();
           	}else if(req.url.indexOf("/ftablename?")!= -1 || req.url.indexOf("/stablename?")!= -1){
           		    var filename = url.parse(req.url).query;
                    getkeys(filename);
           		  }else if(req.url.startsWith("/innerjoin")){
                           var tableskeys = url.parse(req.url).query;
                           var tknames = tableskeys.split("&");
                           var firstfile = getcontents(DATAROOT+tknames[0]); 
                           var secondfile = getcontents(DATAROOT+tknames[1]); 
                           var flength = filelength(tknames[0]);
                           var slength = filelength(tknames[1]);
                    	   var innercontent = corefuncs.innerjoin(firstfile,secondfile,tknames[2],tknames[3],flength,slength);
                    	   newFile(DATAROOT+'innerjoin'+Date()+'.json', innercontent);
	                       respond(200, "File success");
                        }else if(req.url.startsWith("/rightoutjoin")){
                        	    var tableskeys = url.parse(req.url).query;
                                var tknames = tableskeys.split("&");
                                var firstfile = getcontents(DATAROOT+tknames[0]); 
                                var secondfile = getcontents(DATAROOT+tknames[1]); 
                                var flength = filelength(tknames[0]);
                                var slength = filelength(tknames[1]);
                    	        var rightoutjoincontent = corefuncs.rightoutjoin(firstfile,secondfile,tknames[2],tknames[3],flength,slength);
                    	        console.log("import");
                    	        newFile(DATAROOT+'rightoutjoin'+Date()+'.json', rightoutjoincontent);
	                            respond(200, "File success");
                              }
                                else if(req.url.startsWith("/leftoutjoin")){
                                	    var tableskeys = url.parse(req.url).query;
                                        var tknames = tableskeys.split("&");
                                        var firstfile = getcontents(DATAROOT+tknames[0]); 
                                        var secondfile = getcontents(DATAROOT+tknames[1]); 
                                        var flength = filelength(tknames[0]);
                                        var slength = filelength(tknames[1]);
                    	                var leftoutjoincontent = corefuncs.leftoutjoin(secondfile,firstfile,tknames[3],tknames[2],flength,slength);
                    	                console.log("import");
                    	                newFile(DATAROOT+'leftoutjoin'+Date()+'.json', leftoutjoincontent);
	                                    respond(200, "File success");

                                     }
                                	 else if(req.url.startsWith("/fulloutjoin")){
                                	 	    var tableskeys = url.parse(req.url).query;
                                            var tknames = tableskeys.split("&");
                                            var firstfile = getcontents(DATAROOT+tknames[0]); 
                                            var secondfile = getcontents(DATAROOT+tknames[1]); 
                                            var flength = filelength(tknames[0]);
                                            var slength = filelength(tknames[1]);
                    	                    var fulloutjoincontent = corefuncs.fulloutjoin(firstfile,secondfile,tknames[2],tknames[3],flength,slength);
                    	                    console.log("import");
                    	                    newFile(DATAROOT+'fulloutjoin'+Date()+'.json', fulloutjoincontent);
	                                        respond(200, "File success");

                                	      }else{
                              	   //server static file 
                              	                var filename = url.parse(req.url).pathname;
                                                filecontent(ROOT+filename);
                                          }          	           
          }

function getftablename(){
 	fs.readdir(DATAROOT, function(err, data){
 		if(err)
 		    respondErr(err);
 		else{
 			//fisrt argument must be string or buffer
 			respond(200, JSON.stringify({filenames:data.filter(junk.not)}));
 		}

 	});
 }
//get all attributes from selected table, they are possible keys
//@para---contentobj: all the object in selected table
//@para---firstobj: the first object in selected table
//@para---allkeys: get all attributs name from the first object
//by default, all the objects in one file in Data fold should have same attributes 
function getkeys(name){
 	  var filename = DATAROOT+ name + '.json';
 	    fs.readFile(filename, 'utf-8',function(err,content){
            if(err)
                respondErr(err);
            else{
       	        var contentobj = JSON.parse(content);
       	        if(contentobj.length){
       	    	   var firstobj = contentobj[0];
                   var allkeys = Object.keys(firstobj);
                   res.writeHead(200, {'content-type':'text/html'});
	               res.end(JSON.stringify({keys:allkeys}));
       	        }else
       	           //file exists but empty file(no object)
       	           //respond(404, "0 tupleFile"); 
       	           server404();        
            }     
        });
 }

//get the number of tuples in selected file
function filelength(filename){
    var firstfile = getcontents(DATAROOT+filename);
    var flength = firstfile.length;
    return flength;
};

//parse file content
//has to use Sync
//because need to pass the return value of this function to calculate length 
function getcontents(filename){
	var content = fs.readFileSync(filename,"utf-8");
	return JSON.parse(content);
};   
//read File
function filecontent(filename){
    fs.readFile(filename,'utf-8', function(err,content){
       if(err)
       	  respondErr(err);
       else
          respond(200, content);
        });
 };
	
function respond(code, data){
	res.writeHead(code, {'content-type': mime.lookup(url.parse(req.url).pathname)||'text/html'});
	res.end(data);
 };


function respondErr(err){
 	if(err.code === 'ENOENT')
       server404();
 	else
 	   respond(500, err.message);
 };

function server404(){
 	fs.readFile(ROOT+'/404.html', function(err, data){
        if(err)
          respond(500, err.message);
        else
          respond(404,data);
     })
 };
function newFile(filename, content){
	fs.writeFile(filename, content, function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
    });
 };
}

	


	

