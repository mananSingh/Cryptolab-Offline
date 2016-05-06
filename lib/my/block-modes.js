//global variable: is null_pad (the null character '00000000' used for padding  i.e. )


// xor the elements of two arrays together
function xor_strings( a1, a2 ){
   var i;
   var res = "";

   for( i=0; i<a1.length; i++ )
      res += a1[i] ^ a2[i];

   return res;
}


//text-to-binary & binary-to-text function
function toBinary(str, spaceSeparatedOctets) {
		    return str.replace(/[\s\S]/g, function(str) {
		      str = zeroPad(str.charCodeAt().toString(2));
		      return !1 == spaceSeparatedOctets ? str : str + " "
		    });
		}
		function zeroPad(num) {
		    return "00000000".slice(String(num).length) + num;
		}
function toAscii(bin){
			    return bin.replace(/\s*[01]{8}\s*/g, function(bin) {
			      return String.fromCharCode(parseInt(bin, 2));
		    	});
			}

/*////////////////////////////////
	For One DES Block.

	The Main DES function  
	
	from "my/des.js" file:
	function prototype:
	
	des_call_one_block(iString, keyString, mode);

*////////////////////////////////



/*************************
	MODES oF OPERATIONS.
*//////////////////////////

/*/////////////////////////////////
	Electronic Code Book Mode

*///////////////////////////
//keyString is a 'long' (64-bit) binary string.
function des_ecb(iString_blocks_array, keyString, mode){
	var oString_final = "";
	var output = "";
	var oString = ""; //for 1-block.

	output += "<br><strong>Using Electronic Code Book (ECB) Mode</strong><br><br>";

	for(var i = 0 ; i < iString_blocks_array.length; i++){

		output += "<strong><em>For Block "+(i+1)+"</em></strong><br>";

		//to padding re-color.
		if( i == iString_blocks_array.length-1){	//for last block, take 'care' of 'block_length'.
			output += "Input Block:<br><span class='teal lighten-4'>" + iString_blocks_array[i].substr(0, 64-null_pad.length).replace(/(.{8})/g,"$1 ") +"</span>";
			output += "<span class='orange lighten-4'>"+ iString_blocks_array[i].substr(64-null_pad.length).replace(/(.{8})/g,"$1 ") +"</span><br>";
			
		}else{	//for all other-than-last blocks.
			output += "Input Block:<br><span class='teal lighten-4'>" + iString_blocks_array[i].replace(/(.{8})/g,"$1 ") +"</span><br>";
		}

		output += "Key String:<br><span class='blue lighten-4'>" + keyString.replace(/(.{8})/g,"$1 ") +"</span><br>";

		if(mode == true){	//meaning, decryption.
			output += "After DES 'Decryption' Process on above two, <br>";
		}else{
			output += "After DES 'Encryption' Process on above two, <br>";
		}

		
		oString = des_call_one_block(iString_blocks_array[i], keyString, mode);	//mode=false (encryption), mode=true (decryption)

		output += "Output Block:<br><span class='deep-purple lighten-4'>" + oString.replace(/(.{8})/g,"$1 ") + "</span><br><br>";

		oString_final += oString;
	}

	//Combine the final array.
	output += "<br><br><em>finally:</em><br> <strong>Output String</strong> (in binary) = ";
	output += "<span class='deep-purple lighten-4'>" + oString_final.replace(/(.{8})/g,"$1 ") + "</span><br><br>";

	//show-final:
	$("#intermediate_mode").html(output);

	//convert oString_final binary to ASCII
	oString_final = toAscii(oString_final);
	return oString_final;
}


/*////////////////////
	Cipher Block Chaining

*//////////////////
//keyString is a 'long' (64-bit) binary string.
function des_cbc(iString_blocks_array, keyString, mode, ivString){
	var oString_final = "";
	var output = "";
	var oString = ""; //for 1-block.

	output += "<br><strong>Using Cipher Block Chaining (CBC) Mode</strong><br><br>";

	if(mode == false){ //encryption case.


		/*////////////////////////////////////////////
			DES CBC ENCRYPTION
		*///////////////////////////////////////

		var outputString_prev = "";
		for(var i = 0; i<iString_blocks_array.length; i++){
		
			var temp_string = "";

			output += "<strong><em>For Block "+(i+1)+"</em></strong><br>";

			/*Firstly, XOR*/

			//to padding re-color.
			if( i == iString_blocks_array.length-1){	//for last block, take 'care' of 'block_length'.
				console.log(null_pad);
				output += "Input Block:<br><span class='teal lighten-4'>" + iString_blocks_array[i].substr(0, 64-null_pad.length).replace(/(.{8})/g,"$1 ") +"</span>";
				output += "<span class='orange lighten-4'>"+ iString_blocks_array[i].substr(64-null_pad.length).replace(/(.{8})/g,"$1 ") +"</span><br>";
				
			}else{	//for all other-than-last blocks.
				output += "Input Block:<br><span class='teal lighten-4'>" + iString_blocks_array[i].replace(/(.{8})/g,"$1 ") +"</span><br>";
			}

			if(i == 0){	//THE first time: Inititalization Vector
				output += "Initialization Vector:<br>" + toBinary(ivString) + "<br>";
				ivString = toBinary(ivString, 0);	//no-space in the string '10010100100'
			}else{	//all other 'cases'
				output += "'Previous' Output Block:<br>" + outputString_prev.replace(/(.{8})/g,"$1 ") + "<br>";
				ivString = outputString_prev;	//ivString used to store 'prev_output_block'
			}

			//temp_string = iString_blocks_array[i] ^ ivString;
			temp_string = xor_strings(ivString, iString_blocks_array[i]);

			output += "After 'XOR'ing the above two, <br>";
			output += "Temporary String:<br>" + temp_string.replace(/(.{8})/g,"$1 ") + "<br><br>";


			/* Then, encrypt */
			output += "Now,<br>";
			output += "Temporary String:<br>" + temp_string.replace(/(.{8})/g,"$1 ") + "<br>";
			output += "Key String:<br><span class='blue lighten-4'>" + keyString.replace(/(.{8})/g,"$1 ") +"</span><br>";
			output += "After DES 'Encryption' Process on above two, <br>";
			
			oString = des_call_one_block(temp_string, keyString, false);	//mode=false (encryption), mode=true (decryption)

			output += "Output Block:<br><span class='deep-purple lighten-4'>" + oString.replace(/(.{8})/g,"$1 ") + "</span><br><br><br>";

			outputString_prev = oString;	//store for next-round of CBC.
			oString_final += oString;	//append for the 'final' output.

		}

	}else{	//decryption case. 

		/*////////////////////////////////////////////
			DES CBC Decryption
		*///////////////////////////////////////


		var inputString_prev = "";
		for(var i = 0; i<iString_blocks_array.length; i++){
		
			var temp_string = "";

			output += "<strong><em>For Block "+(i+1)+"</em></strong><br>";

			/* Decrypt first */
			output += "Input Block:<br><span class='teal lighten-4'>" + iString_blocks_array[i].replace(/(.{8})/g,"$1 ") +"</span><br>";
			
			output += "Key String:<br><span class='blue lighten-4'>" + keyString.replace(/(.{8})/g,"$1 ") +"</span><br>";
			
			temp_string = des_call_one_block(iString_blocks_array[i], keyString, true);	//mode=false (encryption), mode=true (decryption)

			output += "After DES 'Decryption' Process on above two, <br>";			
			output += "Temporary String:<br>" + temp_string.replace(/(.{8})/g,"$1 ") + "<br><br>";


			/* Then, XOR */
			output += "Now,<br>";
			output += "Temporary String:<br>" + temp_string.replace(/(.{8})/g,"$1 ") + "<br>";
			

			if(i == 0){	//THE first time: Inititalization Vector
				output += "Initialization Vector:<br>" + toBinary(ivString) + "<br>";
				ivString = toBinary(ivString, 0);	//no-space in the string '10010100100'
			}else{	//all other 'cases'
				output += "'Previous' Input Block:<br>" + inputString_prev.replace(/(.{8})/g,"$1 ") + "<br>";
				ivString = inputString_prev;	//ivString used to store 'prev_output_block'
			}

			//temp_string = iString_blocks_array[i] ^ ivString;
			oString = xor_strings(ivString, temp_string);

			output += "After 'XOR'ing the above two, <br>";


			//to padding re-color.
			if(i==iString_blocks_array.length - 1 && oString.indexOf("00000000")>-1){//THE last 'block' && if it has '00000000'
				output += "Output Block:<br><span class='deep-purple lighten-4'>" + oString.replace(/(.{8})/g,"$1 ").substr(0, oString.replace(/(.{8})/g,"$1 ").indexOf("00000000")) +"</span>";
				output += "<span class='orange lighten-4'>"+ oString.replace(/(.{8})/g,"$1 ").substr(oString.replace(/(.{8})/g,"$1 ").indexOf("00000000")) +"</span><br>";

			}else{	//for all other 'blocks'.
				output += "Output Block:<br><span class='deep-purple lighten-4'>" + oString.replace(/(.{8})/g,"$1 ") + "</span><br><br><br>";
			}


			inputString_prev = iString_blocks_array[i];	//store for next-round of CBC.
			oString_final += oString;	//append for the 'final' output.

		}
	}

	//Combine the final array.
	output += "<br><br><em>finally:</em><br> <strong>Output String</strong> (in binary) = ";
	output += "<span class='deep-purple lighten-4'>" + oString_final.replace(/(.{8})/g,"$1 ") + "</span><br><br>";

	//show-final:
	$("#intermediate_mode").html(output);

	//convert oString_final binary to ASCII
	oString_final = toAscii(oString_final);
	return oString_final;
}


/*///////////////////////////
	Display Basic "Intermediate Steps"

/////////////////////////*/
//show-0: given binary string.
function display_basic(str, key){
		var output = "";
	output += "<em>Given:</em><br> <strong>Input String</strong> (in binary) = <span class='teal lighten-4'>" +toBinary(str) + "</span><br>";
	key = key.substr(0, 8);
	output += "<strong>Key String</strong> (in binary) = <span class='blue lighten-4'>" + toBinary(key) + "</span><br>";
	output += "Key String (plaintext) = " + key + "<br><br>";

	//show-0.2: objective
	output += "<em>Objective:</em><br> To convert the original 'input-bytes' to 'cipher-bytes', <br> one-block-at-a-time (because it's a block cipher), <br> in such a smart-secure way that it can't be 'cracked' easily. <br><br>"

	//show-0.5: note
	output += "<em>Note:</em><br> This technique is based on <em>'block'</em>-oriented operations.<br>(1 block = 8 bytes = 64 bits)<br><br>";
	
	//show-0.6: color coding
	output += "<em>Color Codes:</em><br> Byte Strings - <span class='teal lighten-4'>Input</span> <span class='blue lighten-4'>Key</span> <span class='deep-purple lighten-4'>Output</span>  <span class='orange lighten-4'>Padding</span><br><br>";

	//how-0.7: Blocks
	output += "<em>Blocks:</em><br>";
	var bin_blocks_array = toBinary(str,0).match(/.{1,64}/g);
	for(var i=0; i < bin_blocks_array.length; i++){
		output += "<strong><em>Block "+(i+1)+":</em></strong><br>";
		
		var null_pad = "";
		
		if(bin_blocks_array[i].length % 64 == 0){
			output += "<span class='teal lighten-4'>" + bin_blocks_array[i].replace(/(.{8})/g,"$1 ") + "</span><br>";
			window.null_pad = null_pad; //global.
		}else{	//last block!
			output += "<span class='teal lighten-4'>" + bin_blocks_array[i].replace(/(.{8})/g,"$1 ") + "</span>";
			
			//add 'null'-padding
			output += "<span class='orange lighten-4'>";
			for(var j=0; j < ((64 - bin_blocks_array[i].length)/8); j++){
				null_pad += "00000000"; //i.e. pad with binary of null character i.e. (00100000)
			}
			output += null_pad.replace(/(.{8})/g,"$1 ") + "</span><br><br>";			
			bin_blocks_array[i] += null_pad;

			window.null_pad = null_pad;	//global.
		}
	}

	//show-final:
	$("#intermediate_begin").html(output);
	return bin_blocks_array;
}

/*********************

Our main JS function to 'Call' DES

*****************/

function des_call(iString, keyString, mode, block_cipher_mode, ivString){
	var oString = "";

	var str = iString, key = keyString;

	
	if(mode == true){	//decryption checked!
		iString = atob(iString);	//from base64 to plaintext

		iString_blocks_array = display_basic(iString, keyString);		//like: [0011.., 01011.., ... upto 'n' blocks]

		keyString = toBinary(keyString, 0);	//keystring becomes like 0101001010... upto 64bits.
		
		//BASED ON MODE
		if(block_cipher_mode == 1){		//ecb selected
			oString = des_ecb(iString_blocks_array, keyString, mode);
		}
		else if(block_cipher_mode == 2){	//cbc selected
			oString = des_cbc(iString_blocks_array, keyString, mode, ivString);
		}

		/* also change the label to "Output String (normal)" */
		$("#outputString").next().text("Output String");

	}
	else{		//encryption checked!

		iString_blocks_array = display_basic(iString, keyString);		//like: [0011.., 01011.., ... upto 'n' blocks]

		keyString = toBinary(keyString, 0);	//keystring becomes like 0101001010... upto 64bits.

		//BASED ON MODE
		if(block_cipher_mode == 1){		//ecb selected
			oString = des_ecb(iString_blocks_array, keyString, mode);
		}
		else if(block_cipher_mode == 2){	//cbc selected
			oString = des_cbc(iString_blocks_array, keyString, mode, ivString);
		}

		oString = btoa(oString);	//from plaintext to base64

		/* also change the label to "Output String (in Base64)"	*/
		$("#outputString").next().text("Output String (in Base64)");
	}


	return oString;
}