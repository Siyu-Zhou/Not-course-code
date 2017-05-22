
var innerresult = [];
var rightoutresult = [];
var leftoutresult = [];
var fulloutresult = [];

function innerjoin(firstfile, secondfile, firstkey, secondkey,flength,slength){
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
    return JSON.stringify(innerresult);
};


function rightoutjoin(firstfile, secondfile, firstkey, secondkey, flength, slength){
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
    return JSON.stringify(rightoutresult);
};


function leftoutjoin(ffile, sfile, fkey, skey, flength, slength){
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
    return JSON.stringify(leftoutresult);
};

function fulloutjoin(firstfile, secondfile, firstkey, secondkey, flength, slength){
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
    return JSON.stringify(fulloutresult);
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


exports.innerjoin=innerjoin;
exports.rightoutjoin=rightoutjoin;
exports.leftoutjoin=leftoutjoin;
exports.fulloutjoin=fulloutjoin;
//exports.printName=printName;

