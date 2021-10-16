"use strict";

var canvas;
var gl;

var numTimesToSubdivide = 4;

var index = 0;

var pointsArray = [];
var normalsArray = [];


var near = -10;
var far = 10;
var radius = 1.5;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -3.0;
var right = 3.0;
var ytop = 3.0;
var bottom = -3.0;

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
var lightAmbient = vec4(0.3, 0.3, 0.3, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( .5, .5, .5, 1.0 );
var materialDiffuse = vec4( .2, .2, .2, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 15.0;

var ctm;
var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var normalMatrix, normalMatrixLoc;

var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var delta = 0;
var decrement = false;
var decrementM = false;


var ambientProductLoc; 
var diffuseProductLoc; 
var specularProductLoc; 
var lightPositionLoc; 
var shininessLoc; 

var ambientProduct;
var diffuseProduct;
var specularProduct;

var red = false;
var green = false;
var blue = false;
var pulse = false;
var singleColor = false;
var changed = false;
var mushroom = false;

var r = 0;
var g = 0;
var b = 0;


function triangle(a, b, c) {

     pointsArray.push(a);
     pointsArray.push(b);
     pointsArray.push(c);

          // normals are vectors

     normalsArray.push(a[0],a[1], a[2], 0.0);
     normalsArray.push(b[0],b[1], b[2], 0.0);
     normalsArray.push(c[0],c[1], c[2], 0.0);


     index += 3;
}


function divideTriangle(a, b, c, count) {
    if ( count > 0 ) {

        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else {
        triangle( a, b, c );
    }
}


function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);


    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);


    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );


  
    document.getElementById("Button6").onclick = function(){
        numTimesToSubdivide++;
        index = 0;
        pointsArray = [];
        normalsArray = [];
        init();
    };
    document.getElementById("Button7").onclick = function(){
        if(numTimesToSubdivide) numTimesToSubdivide--;
        index = 0;
        pointsArray = [];
        normalsArray = [];
        init();
    };
	
	document.getElementById("lightUp").onclick = function(){
        lightPosition = add(lightPosition,vec4(0,0.25,0,0));
    };
	
	document.getElementById("lightDown").onclick = function(){
        lightPosition = add(lightPosition,vec4(0,-0.25,0,0));
    };
	
	document.getElementById("lightLeft").onclick = function(){
        lightPosition = add(lightPosition,vec4(-0.25,0,0,0));
    };
	
	document.getElementById("lightRight").onclick = function(){
        lightPosition = add(lightPosition,vec4(0.25,0,0,0));
    };
	
	document.getElementById("red").onclick = function(){
		if(red){
		}else{
			red = true
			delta = 0;
		};
		changed = true;
		blue = false;
		green = false;
		
    };
	
	document.getElementById("green").onclick = function(){
        if(green){
		}else{
			green = true;
			delta = 0;
		}
		changed = true;
		red = false;
		blue = false;
		
      };
	
	document.getElementById("blue").onclick = function(){
        if(blue){
		}else{
			blue = true;
			delta = 0;
		}
		changed = true;
		red = false;
		green = false;
    };
	
	document.getElementById("pulse").onclick = function(){
        if(pulse){
			pulse = false;
		}else{
			pulse = true;
		}
    };
	
	document.getElementById("singleColor").onclick = function(){
			singleColor = true;
    };

	document.getElementById("mushroom").onclick = function(){
        if(mushroom){
			mushroom = false;
		}else{
			mushroom = true;
		}
    };
	
	
	

	 ambientProductLoc = gl.getUniformLocation(program,"ambientProduct")
	 diffuseProductLoc = gl.getUniformLocation(program,"diffuseProduct");
	 specularProductLoc = gl.getUniformLocation(program,"specularProduct");
	 lightPositionLoc = gl.getUniformLocation(program,"lightPosition");
	 shininessLoc = gl.getUniformLocation(program,"shininess");

   

    render();
}


function render() {
	
	if(pulse){
		if(delta == 20){
			decrement = true;
		}
		if(delta == 0){
			decrement = false;
		}
		if(decrement){
			delta -= 1;
			if(red){
				r -= .05;
			}else if(green){
				g -= .05;
			}else if(blue){
				b -= .05;
			}else{
				materialDiffuse = add(materialDiffuse,vec4(-.05,-.05,-.05,0));
			}
		}
		
		if(!decrement){
			delta += 1;
			if(red){
				r += .05;
			}else if(green){
				g += .05;
			}else if(blue){
				b += .05;
			}else{
				materialDiffuse = add(materialDiffuse,vec4(.05,.05,.05,0));
			}
		}
		
		if(singleColor){
			singleColor = false;
			if(red){
				g = 0;
				b = 0;
			}else if(green){
				r = 0;
				b = 0;
			}else{
				r = 0;
				g = 0;
			}
		}
		
		if(changed){
			materialDiffuse = vec4(r,g,b,1);
		}
		
		
			
	}
	
	if(mushroom){
		if( ytop >= 3){
			decrementM = true;
		}
		if( ytop >= 1 && ytop <= 1.1){
			decrementM = false;
		}
		if(!decrementM){
			ytop +=   .03;
			bottom -= .03;
			left -=   .03;
			right +=  .03;
			
		}
		
		if(decrementM){
			ytop -=   .03;
			bottom += .03;
			left +=   .03;
			right -=  .03;
			
		}
		
	}
	
	
	ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	
	
	
	
	gl.uniform4fv( ambientProductLoc ,flatten(ambientProduct));
    gl.uniform4fv( diffuseProductLoc ,flatten(diffuseProduct));
    gl.uniform4fv( specularProductLoc ,flatten(specularProduct));
    gl.uniform4fv( lightPositionLoc ,flatten(lightPosition));
    gl.uniform1f( shininessLoc ,materialShininess );

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);

        normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];

	

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
for(var i = 0; i<index;i+=3){
	gl.drawArrays( gl.TRIANGLES, i, 3 );
}
    window.requestAnimFrame(render);
}
