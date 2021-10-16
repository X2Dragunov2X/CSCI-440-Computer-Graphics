"use strict";

var canvas;
var gl;

var maxNumTriangles = 200;
var maxNumVertices  = 3 * maxNumTriangles;
var index = 0;
var filled = 0;
var first = true;
var second = true;
var third = true;
var shape = 0;
var indicies = [200];
	indicies[0]=0;
var numShapes = 0;

var t, t1, t2, t3, t4;

var cIndex = 0;

var colors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var m = document.getElementById("mymenu");

    m.addEventListener("click", function() {
       cIndex = m.selectedIndex;
        });
	var s = document.getElementById("shape");
	s.addEventListener("click", function() {
       shape = s.selectedIndex;
        });
	
	var b = document.getElementById("filled");
	b.addEventListener("click", function() {
       if(filled){
			filled =0;
	   }else{
	   filled = 1;
	   }
        });


    canvas.addEventListener("mousedown", function(event){
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
        if(first) {
			if(shape == 0){
				indicies[numShapes] = 2;
			}else if(shape == 1){
				indicies[numShapes] = 3;
			}else{
				indicies[numShapes] = 4;
			}
          first = false;
          t1 = vec2(2*event.clientX/canvas.width-1,
            2*(canvas.height-event.clientY)/canvas.height-1);
        }else if(second){
			second = false;
			t2 = vec2(2*event.clientX/canvas.width-1,
				2*(canvas.height-event.clientY)/canvas.height-1);

			if(shape == 0){
				first = true;
				second = true;
				gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t1));
				gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+1), flatten(t2));
				gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
				index += 2;
				var t = vec4(colors[cIndex]);
				gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-2), flatten(t));
				gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-1), flatten(t));
				numShapes+=2;
				render();
				
			}
		}else if(third){
			third = false;
			t3 = vec2(2*event.clientX/canvas.width-1,
				2*(canvas.height-event.clientY)/canvas.height-1);
			if(shape == 1){
				first = true;
				second = true;
				third = true;
				gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t1));
				gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+1), flatten(t2));
				gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+2), flatten(t3));
				gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
				index += 3;
				var t = vec4(colors[cIndex]);
				gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-3), flatten(t));
				gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-2), flatten(t));
				gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-1), flatten(t));
				numShapes+=3;
				render();
			}
		}else{
			first = true;
			second = true;
			third = true;
			t4 = vec2(2*event.clientX/canvas.width-1,
				2*(canvas.height-event.clientY)/canvas.height-1);
				gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t1));
				gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+1), flatten(t2));
				gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+2), flatten(t3));
				gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+3), flatten(t4));
				gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
				index += 4;
				var t = vec4(colors[cIndex]);
				gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-4), flatten(t));
				gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-3), flatten(t));
				gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-2), flatten(t));
				gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-1), flatten(t));
				numShapes+=4;
				render();
		
		}
    } );

    render();
}


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    for(var i = 0; i<index; i+=2)
		if(indicies[i] == 3){
			if(filled){
				gl.drawArrays(gl.LINE_LOOP, i, indicies[i]);
				i+=1;
			}else{
			
			gl.drawArrays( gl.TRIANGLE_FAN, i, indicies[i] );
			i+=1;
			}
		}else if(indicies[i] == 4){
			if(filled){
				gl.drawArrays(gl.LINE_LOOP, i, indicies[i]);
				i+=2;
			
			}else{
				gl.drawArrays( gl.TRIANGLE_FAN, i, indicies[i] );
			i+=2;
			}
		}else{
			gl.drawArrays( gl.LINE_LOOP, i, indicies[i] );
		}

    window.requestAnimFrame(render);

}
