/*************************************************************
*1.This code is general enough for any two jason files like example, even the user choosen key is not primary key in any of these two files.
*However,you nedd to change some parameter as step 3 said.
*
*2.The requirment said "key". I am not sure it is primary key or keyvalue canbe duplicate  
*Time complexity for innerjoin, rightjoin is  O(m+n+X). m is the array length firstfile, n is the array length secondfile.
*X is the number of duplicate keyvalue in fistfile objects. 
*
*Time complexity for leftjoin is  O(m+n+X). X is the number of duplicate keyvalue in secondfile objects.
*
*Time complexity for outjoin is  O(m+n+X+Y). X is the number of duplicate keyvalue in fistfile objects.
*Y=(# of objects in firstfile cannot match to the secondfile)+(number of duplicate objects in former unmatched objects )
*
*2.This code is write in jsvascript in node.js.Devolpe and test at OSX 10.12.3 && node.js v6.10.2. Author by Siyu Zhou
*
*3If the two source json files or two keys changed, users just need to chage the following 
*three arguments(FileNames,firstkey,secondkey) and json properities names&corresponding value in parameter newtuple
*
*4.fold architecture
*   --shop.js
*   --public
*    --Data
*      --XX.json
*
*5.Reference from Carleton COMP2406 course material
*Reference from http://stackoverflow.com/questions/17500312/is-there-some-way-i-can-join-the-contents-of-two-javascript-arrays-much-like-i
**************************************************************/
var FileNames = ["customers.json","orders.json"];
var firstkey = 'cid';
var secondkey = 'customer_id';
var fs = require('fs');
//fold path to palce source json file
const DATAROOT = "./public/Data/";


if(FileNames.length != 2){
	console.log("There are not two files");
	return;
}	
else{

    var firstfile = filecontent(DATAROOT+FileNames[0]);
    var secondfile = filecontent(DATAROOT+FileNames[1]);
    var flength = firstfile.length;
	var slength = secondfile.length;
    var innerresult = [];
    var rightoutresult = [];
    var leftoutresult = [];
    var fulloutresult = [];


    innerjoin(firstfile, secondfile, firstkey, secondkey);
    console.log("The length of resulting array : "+innerresult.length);
    totalorder("Barry");
    totalorder("Steve");

    //bonus part
    rightoutjoin(firstfile, secondfile, firstkey, secondkey);
    leftoutjoin(secondfile, firstfile, secondkey, firstkey);
    fulloutjoin(firstfile, secondfile, firstkey, secondkey);
   
};

function filecontent(filename){
	content = fs.readFileSync(filename,"utf-8");
	return JSON.parse(content);
};

function innerjoin(firstfile, sencondfile, firstkey, secondkey){
//make an index according to firstkey value
//@para---index is a object(all properties are array）,properties name is the firstfile keyvalue.index construct like{propertity name: index[]}
//@para---index[firstfile keyvalue] is an array, collect tuple objects in firstfile according to the firsteky value
//incase the key is not primiary key which means maybe duplicate, so here use array to solve problem.
    var index = {};
	for(var i = 0; i < flength; i++){
        getIndexFromFirstFile(index, i, firstfile, firstkey);
	};

    for(var j = 0; j < slength; j++){
//find the corresponding fistfile rows match the current secondkey value
//@para---securrkv is key value of current second file row
//@para---index[scurrkv] is array contains objs, objs are tuple objectsin firstfile
//@para---copy is deep copy version of index[scurrkv], copy can guarantee all the tuple objects in firstfile will be 
//counted when these tuple objects have same keyvalue
//@para---newtuple the new tuple objects insert into finally result
	    var scurrkv=secondfile[j][secondkey];
        if(index[scurrkv]){
            var copy = index[scurrkv].slice(0);
//here will effect time complexity and dependent on how many tuple objects in first file have same keyvalue
	        while(copy.length){
		        var newtuple = {
			        cid: copy[0].cid,
                    name: copy[0].name,
                    oid: secondfile[j].oid,
                    price: secondfile[j].price
		        };
                innerresult.push(newtuple);
                copy.shift();
	        };
	    }
    };
	console.log("The innerjoin result: ");	
	console.dir(innerresult);
};


function totalorder(name){
	var sum = 0;
	for(var i = 0; i<innerresult.length; i++)
	{
		if(innerresult[i].name == name){
           sum = sum + innerresult[i].price;
		}
	}
	console.log("Total orders of "+name+"is "+sum);
};

function rightoutjoin(firstfile, sencondfile, firstkey, secondkey){
    var index = {};
	for(var i = 0; i < flength; i++){
        getIndexFromFirstFile(index, i, firstfile, firstkey);
	};

    for(var j = 0; j < slength; j++){
	    var scurrkv=secondfile[j][secondkey];
        if(index[scurrkv]){
            var copy = index[scurrkv].slice(0);
	        while(copy.length){
		        var newtuple = {
			        cid: copy[0].cid,
                    name: copy[0].name,
                    oid: secondfile[j].oid,
                    price: secondfile[j].price
		        };
                rightoutresult.push(newtuple);
                copy.shift();
	        };
	    }
	    else{
		        var newtuple = {
			        cid: null,
                    name: null,
                    oid: secondfile[j].oid,
                    customer_id: secondfile[j].customer_id,
                    price: secondfile[j].price
		        };
                rightoutresult.push(newtuple);
	    }
	}
	console.log("The rightoutjoin result: ");	
	console.dir(rightoutresult);
};


function leftoutjoin(ffile, sfile, fkey, skey){
    var index = {};
	for(var i = 0; i < slength; i++){
        getIndexFromFirstFile(index, i, ffile, fkey);
	};
    for(var j = 0; j < flength; j++){
        var scurrkv=sfile[j][skey];
        if(index[scurrkv]){
            var copy = index[scurrkv].slice(0);
	        while(copy.length){
		        var newtuple = {
			        cid: sfile[j].cid,
                    name: sfile[j].name,
                    oid: copy[0].oid,
                    price: copy[0].price
		        };
            leftoutresult.push(newtuple);
            copy.shift();
	        };
	    }
	    else{
		        var newtuple = {
			        cid: sfile[j].cid,
                    name: sfile[j].name,
                    oid: null,
                    customer_id: null,
                    price: null
		        };
                leftoutresult.push(newtuple);
	    }
	}
	console.log("The leftoutjoin result: ");	
	console.dir(leftoutresult);
};

function fulloutjoin(firstfile, sencondfile, firstkey, secondkey){
    var index = {};
	for(var i = 0; i < flength; i++){
        getIndexFromFirstFile(index, i, firstfile, firstkey);
	};
//@para---counterfirstfile, use this to count whether there are some tuple object haven't done outjoin in firstfile
//deep copy index object set into firstfile
var temp = JSON.stringify(index);
var countfirstfile = JSON.parse(temp);
    for(var j = 0; j < slength; j++){
	    var scurrkv=secondfile[j][secondkey];
        if(index[scurrkv]){
            var copy = index[scurrkv].slice(0);
            //console.log("copy "+copy);
	        while(copy.length){
		        var newtuple = {
			        cid: copy[0].cid,
                    name: copy[0].name,
                    oid: secondfile[j].oid,
                    price: secondfile[j].price
		        };
            fulloutresult.push(newtuple);
            copy.shift();
	        };
	    }
	    else{
		        var newtuple = {
			        cid: null,
                    name: null,
                    oid: secondfile[j].oid,
                    customer_id: secondfile[j].customer_id,
                    price: secondfile[j].price
		        };
                fulloutresult.push(newtuple);
	    } 
	    delete countfirstfile[scurrkv];
	}
//@para---copycountfirst, deepy copy of countfirstfile into copycountfirst
	if(countfirstfile){
		for(var name in countfirstfile){
            var copycountfirst = countfirstfile[name].slice(0);
	        while(copycountfirst.length){
		        var newtuple = {
			        cid: copycountfirst[0].cid,
                    name: copycountfirst[0].name,
                    oid: null,
                    customer_id: null,
                    price: null
		        };
                fulloutresult.push(newtuple);
                copycountfirst.shift();
	        };
	     
		}
	}
	console.log("The fulloutjoin result: ");	
	console.dir(fulloutresult);
};

function getIndexFromFirstFile(index, i, ffile, fkey){
   if(index[ffile[i][fkey]]){
            index[ffile[i][fkey]].push(ffile[i]);
        }
        else{
//here make all properties in index become array
            index[ffile[i][fkey]] = [];
            index[ffile[i][fkey]].push(ffile[i]);
        }
};