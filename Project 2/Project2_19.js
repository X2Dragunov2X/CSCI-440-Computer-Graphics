"use strict";

var canvas;
var gl;

var NumVertices  = 36;

var points = [];
var colors = [];

var fill = 0;
var faces = 1;
var rotate = 0;
var explode = 0;
var modleViewMatrix = mat4();
var modleViewMatrixLoc;


var theta = 1;



window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

   colorCube1(); 
   colorCube();
   wireCube();
   wireCube1();
	
	
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );


    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	modleViewMatrixLoc = gl.getUniformLocation(program, "modleViewMatrix");



    //event listeners for buttons

    document.getElementById( "rotate" ).onclick = function () {
        if(rotate == 1){
			rotate = 0;
		}else{
			rotate = 1;
		}
    };
    document.getElementById( "fill" ).onclick = function () {
        if(fill == 1){
			fill = 0;
		}else{
			fill = 1;
		}
    };
    document.getElementById( "faces" ).onclick = function () {
		
		if(faces == 1){
			faces = 0;
		}else{
			faces = 1;
		}
    };
	document.getElementById( "explode" ).onclick = function () {
	
		if(explode == 1){
			explode = 0;
		}else{
			explode = 1;
		}
    };

    render();
}

function colorCube()
{
   quad( 1, 0, 3, 2 );
   quad( 2, 3, 7, 6 );
   quad( 3, 0, 4, 7 );
   quad( 6, 5, 1, 2 );
   quad( 4, 5, 6, 7 );
   quad( 5, 4, 0, 1 );
}

function quad(a, b, c, d)
{
    var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4(  0.5,  0.5,  0.5, 1.0 ),
        vec4(  0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4(  0.5,  0.5, -0.5, 1.0 ),
        vec4(  0.5, -0.5, -0.5, 1.0 )
    ];

	

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c, a, c, d ];

   
	for ( var i = 0; i < indices.length; ++i ) {
		points.push( vertices[indices[i]] );
        colors.push(vertexColors[a]);
    }
}

function colorCube1()
{
    quad1( 1, 0, 3, 2 );
    quad1( 2, 3, 7, 6 );
    quad1( 3, 0, 4, 7 );
    quad1( 6, 5, 1, 2 );
    quad1( 4, 5, 6, 7 );
    quad1( 5, 4, 0, 1 );
}

function quad1(a, b, c, d)
{
    var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4(  0.5,  0.5,  0.5, 1.0 ),
        vec4(  0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4(  0.5,  0.5, -0.5, 1.0 ),
        vec4(  0.5, -0.5, -0.5, 1.0 )
    ];

	

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c, a, c, d ];

	for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        colors.push( vertexColors[indices[i]] );
    }
}

function wireCube()
{
    quad2( 1, 0, 3, 2 );
    quad2( 2, 3, 7, 6 );
    quad2( 3, 0, 4, 7 );
    quad2( 6, 5, 1, 2 );
    quad2( 4, 5, 6, 7 );
    quad2( 5, 4, 0, 1 );
}

function quad2(a, b, c, d)
{
    var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4(  0.5,  0.5,  0.5, 1.0 ),
        vec4(  0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4(  0.5,  0.5, -0.5, 1.0 ),
        vec4(  0.5, -0.5, -0.5, 1.0 )
    ];

	

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, b, c, c, d, d, a ];

	for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        colors.push( vertexColors[indices[i]] );
    }
}

function wireCube1()
{
    quad3( 1, 0, 3, 2 );
    quad3( 2, 3, 7, 6 );
    quad3( 3, 0, 4, 7 );
    quad3( 6, 5, 1, 2 );
    quad3( 4, 5, 6, 7 );
    quad3( 5, 4, 0, 1 );
}

function quad3(a, b, c, d)
{
    var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4(  0.5,  0.5,  0.5, 1.0 ),
        vec4(  0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4(  0.5,  0.5, -0.5, 1.0 ),
        vec4(  0.5, -0.5, -0.5, 1.0 )
    ];

	

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, b, c, c, d, d, a ];

	for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        colors.push(vertexColors[a]);
    }
}

function render()
{
if(rotate == 0){
    theta +=1;
}else{
	theta +=0;
}

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
if(explode == 0){
	if(faces == 0){
		if(fill == 0){
			
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.TRIANGLES, 0, 36);
		modleViewMatrix = mat4();
		}else{
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.LINES,72,48);
		
		modleViewMatrix = mat4();
		}
	}else{
		if(fill == 0){
		
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.TRIANGLES, 36, 36);
		modleViewMatrix = mat4();
		}else{
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.LINES, 120, 48);
		
		modleViewMatrix = mat4();
		}
	}
		
}else{
	if(faces == 0){
		if(fill == 0){
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(-.5,.5,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.TRIANGLES, 0, 36);
		modleViewMatrix = mat4();
		
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(0,.5,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.TRIANGLES, 0, 36);
		modleViewMatrix = mat4();
		
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(.5,.5,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.TRIANGLES, 0, 36);
		modleViewMatrix = mat4();
		
			modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
			modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(-.5,0,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.TRIANGLES, 0, 36);
		modleViewMatrix = mat4();
		
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(0,0,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.TRIANGLES, 0, 36);
		modleViewMatrix = mat4();
		
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(.5,0,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.TRIANGLES, 0, 36);
		modleViewMatrix = mat4();
			modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
			modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(-.5,-.5,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.TRIANGLES, 0, 36);
		modleViewMatrix = mat4();
		
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(0,-.5,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.TRIANGLES, 0, 36);
		modleViewMatrix = mat4();
		
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(.5,-.5,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.TRIANGLES, 0, 36);
		modleViewMatrix = mat4();
	}else{
			modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
			modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(-.5,.5,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.LINES, 72, 48);
		modleViewMatrix = mat4();
		
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(0,.5,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.LINES, 72, 48);
		modleViewMatrix = mat4();
		
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(.5,.5,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.LINES, 72, 48);
		modleViewMatrix = mat4();
		
			modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
			modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(-.5,0,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.LINES, 72, 48);
		modleViewMatrix = mat4();
		
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(0,0,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.LINES, 72, 48);
		modleViewMatrix = mat4();
		
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(.5,0,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.LINES, 72, 48);
		modleViewMatrix = mat4();
			modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
			modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(-.5,-.5,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.LINES, 72, 48);
		modleViewMatrix = mat4();
		
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(0,-.5,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.LINES, 72, 48);
		modleViewMatrix = mat4();
		
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(.5,-.5,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.LINES, 72, 48);
		modleViewMatrix = mat4();
	}
	}else{
		if(fill == 0){
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(-.5,.5,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.TRIANGLES, 36, 36);
		modleViewMatrix = mat4();
		
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(0,.5,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.TRIANGLES, 36, 36);
		modleViewMatrix = mat4();
		
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(.5,.5,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.TRIANGLES, 36, 36);
		modleViewMatrix = mat4();
		
			modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
			modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(-.5,0,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.TRIANGLES, 36, 36);
		modleViewMatrix = mat4();
		
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(0,0,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.TRIANGLES, 36, 36);
		modleViewMatrix = mat4();
		
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(.5,0,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.TRIANGLES, 36, 36);
		modleViewMatrix = mat4();
			modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
			modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(-.5,-.5,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.TRIANGLES, 36, 36);
		modleViewMatrix = mat4();
		
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(0,-.5,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.TRIANGLES, 36, 36);
		modleViewMatrix = mat4();
		
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(.5,-.5,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.TRIANGLES, 36, 36);
		modleViewMatrix = mat4();
	}else{
			modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
			modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(-.5,.5,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.LINES, 120, 48);
		modleViewMatrix = mat4();
		
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(0,.5,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.LINES, 120, 48);
		modleViewMatrix = mat4();
		
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(.5,.5,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.LINES, 120, 48);
		modleViewMatrix = mat4();
		
			modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
			modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(-.5,0,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.LINES, 120, 48);
		modleViewMatrix = mat4();
		
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(0,0,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.LINES, 120, 48);
		modleViewMatrix = mat4();
		
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(.5,0,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.LINES, 120, 48);
		modleViewMatrix = mat4();
			modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
			modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(-.5,-.5,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.LINES, 120, 48);
		modleViewMatrix = mat4();
		
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(0,-.5,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.LINES, 120, 48);
		modleViewMatrix = mat4();
		
		modleViewMatrix = mult(scalem(.25,.25,.25),modleViewMatrix);
		modleViewMatrix = mult(rotateX(45),modleViewMatrix);
		modleViewMatrix = mult(rotateY(theta),modleViewMatrix);
		modleViewMatrix = mult(translate(.5,-.5,0),modleViewMatrix);
		gl.uniformMatrix4fv(modleViewMatrixLoc,false,flatten(modleViewMatrix));

		gl.drawArrays( gl.LINES, 120, 48);
		modleViewMatrix = mat4();
	}
	}
}

		
    requestAnimFrame( render );
}
