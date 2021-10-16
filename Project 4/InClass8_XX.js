"use strict";

var canvas;
var gl;
var program;
var walkingf = false;
var walkingb = false;
var reset1 = false;
var jump = false;
var x = 0;
var y = 0;
var walk = false;
var projectionMatrix;
var modelViewMatrix;
var instanceMatrix;
var modelViewMatrixLoc;
var walkDistance =2;
var wag = false;
var wagging = false;
var jump = false;
var jumping = false;
var jumpDistance = 0;
var dog1 = false;
var dog2 = false;
var walkDistance1 = 0;
var x1 = 0;
var y1 = 0;
var walkingf1 = false;
var walk1 = false;
var walkingb1 = false;


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

var lightPosition = vec4(-15, 5, 15, 0.0 );
var lightAmbient = vec4(0.9, 0.9, 0.9, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 0.0, 1.0 );

//gold
var materialAmbient = vec4( 0.24725, 0.1995, 0.0745, 1.0 );
var materialDiffuse = vec4( 0.75164, 0.60648, 0.22648, 1.0);
var materialSpecular = vec4( 0.628281, 0.555802, 0.366065, 1.0 );
var materialShininess = 10.0;

var torsoId = 0;
var headId  = 1;
var head1Id = 1;
var head2Id = 10;
var tailId =11;
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;

var torsobId = 12;
var headbId  = 13;
var head1bId = 13;
var head2bId = 22;
var tailbId =23;
var leftUpperArmbId = 14;
var leftLowerArmbId = 15;
var rightUpperArmbId = 16;
var rightLowerArmbId = 17;
var leftUpperLegbId = 18;
var leftLowerLegbId = 19;
var rightUpperLegbId = 20;
var rightLowerLegbId = 21;

var torsoHeight = 2.5;
var torsoWidth  = 3.0;
var upperArmHeight = 2.0;
var lowerArmHeight = 2.0;
var upperArmWidth  = 0.7;
var lowerArmWidth  = 0.6;
var upperLegWidth  = 0.35;
var lowerLegWidth  = 0.3;
var lowerLegHeight = 1.5;
var upperLegHeight = 2.5;
var headHeight = 1.5;
var headWidth  = 1.0;
var tailHeight = 1.5;
var tailWidth = .45;

var numNodes = 12;
var numAngles = 11;

var theta = [30, 170, 180, 0, 180, 0, 180, 0, 180, 0, 0, 0, -30, 170, 180, 0, 180, 0, 180, 0, 180, 0, 0, 0];


var stack = [];
var figure = [];
var figure2 = [];


for( var i=0; i<numNodes; i++){
	figure[i] = createNode(null, null, null, null);
	figure2[i] = createNode(null, null, null, null);	
}
var vBuffer, nBuffer;

var pointsArray = [];
var colorsArray = [];
var normalsArray = [];

//-------------------------------------------
function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}
//--------------------------------------------

function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}

function initNodes(Id) {

    var m = mat4();

    switch(Id) {

    case torsoId:
		m = translate(walkDistance-6, jumpDistance, 0.0);
		m = mult(m, rotate(theta[torsoId], 0, 1, 0 ));
		
		
		figure[torsoId] = createNode( m, torso, null, headId );
    break;

    case headId:
    case head1Id:
    case head2Id:
		m = translate(0.0, torsoHeight+0.95*torsoHeight, 2.5);
		m = mult(m, rotate(theta[head1Id], 1, 0, 0))
		m = mult(m, rotate(theta[head2Id], 0, 1, 0));
		m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
		figure[headId] = createNode( m, head, leftUpperArmId, null);
    break;
	
	case tailId:
		m = translate(-(torsoWidth/1.75)+1.75, 0.95*torsoHeight, -2.5);
		m = mult(m, rotate(theta[tailId], 0, 0, 1));
		figure[tailId] = createNode( m, tail, null, null );
    break;

    case leftUpperArmId:
		m = translate(-(torsoWidth/2.0), 0.1*upperLegHeight, 2.3);
		m = mult(m, rotate(theta[leftUpperArmId], 1, 0, 0));
		figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftLowerArmId );
    break;

    case rightUpperArmId:
		m = translate(torsoWidth/2.0, 0.1*upperLegHeight, 2.3);
		m = mult(m, rotate(theta[rightUpperArmId], 1, 0, 0));
		figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, rightLowerArmId );
    break;

    case leftUpperLegId:
		m = translate(-(torsoWidth/2.0), 0.1*upperLegHeight, -2.3);
		m = mult(m , rotate(theta[leftUpperLegId], 1, 0, 0));
		figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
    break;

    case rightUpperLegId:
		m = translate(torsoWidth/2.0, 0.1*upperLegHeight, -2.3);
		m = mult(m, rotate(theta[rightUpperLegId], 1, 0, 0));
		figure[rightUpperLegId] = createNode( m, rightUpperLeg, tailId, rightLowerLegId );
    break;

    case leftLowerArmId:
		m = translate(0.0, upperLegHeight, 0.0);
		m = mult(m, rotate(theta[leftLowerArmId], 1, 0, 2.3));
		figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
    break;

    case rightLowerArmId:
		m = translate(0.0, upperLegHeight, 0.0);
		m = mult(m, rotate(theta[rightLowerArmId], 1, 0, 2.3));
		figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
    break;

    case leftLowerLegId:
		m = translate(0.0, upperLegHeight, 0.0);
		m = mult(m, rotate(theta[leftLowerLegId], 1, 0, -2.3));
		figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, null );
    break;

    case rightLowerLegId:
		m = translate(0.0, upperLegHeight, 0.0);
		m = mult(m, rotate(theta[rightLowerLegId], 1, 0, -2.3));
		figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, null );
    break;

    }
}

function initNodes2(Id) {

    var m2 = mat4();

    switch(Id) {

    case torsoId:
		m2 = translate(walkDistance1+6, jumpDistance, 0.0);
		m2 = mult(m2, rotate(theta[torsobId], 0, 1, 0 ));
		
		
		figure2[torsoId] = createNode( m2, torso, null, headId );
    break;
/*
    case headId:
    case head1Id:
    case head2Id:
		m2 = translate(0.0, torsoHeight+0.95*torsoHeight, 2.5);
		m2 = mult(m2, rotate(theta[head2Id], 1, 0, 0));
		m2 = mult(m2, rotate(theta[head2Id], 0, 1, 0));
		m2 = mult(m2, translate(0.0, -0.5*headHeight, 0.0));
		figure2[headId] = createNode( m2, head, leftUpperArmId, null);
    break;
	
	case tailId:
		m2 = translate(-(torsoWidth/1.75)+1.75, 0.95*torsoHeight, -2.5);
		m2 = mult(m2, rotate(theta[tailbId], 0, 0, 1));
		figure2[tailId] = createNode( m2, tail, null, null );
    break;

    case leftUpperArmId:
		m2 = translate(-(torsoWidth/2.0), 0.1*upperLegHeight, 2.3);
		m2 = mult(m2, rotate(theta[leftUpperArmId], 1, 0, 0));
		figure2[leftUpperArmId] = createNode( m2, leftUpperArm, rightUpperArmId, leftLowerArmId );
    break;

    case rightUpperArmId:
		m2 = translate(torsoWidth/2.0, 0.1*upperLegHeight, 2.3);
		m2 = mult(m2, rotate(theta[rightUpperArmId], 1, 0, 0));
		figure2[rightUpperArmId] = createNode( m2, rightUpperArm, leftUpperLegId, rightLowerArmId );
    break;

    case leftUpperLegId:
		m2 = translate(-(torsoWidth/2.0), 0.1*upperLegHeight, -2.3);
		m2 = mult(m2 , rotate(theta[leftUpperLegId], 1, 0, 0));
		figure2[leftUpperLegId] = createNode( m2, leftUpperLeg, rightUpperLegId, leftLowerLegId );
    break;

    case rightUpperLegId:
		m2 = translate(torsoWidth/2.0, 0.1*upperLegHeight, -2.3);
		m2 = mult(m2, rotate(theta[rightUpperLegId], 1, 0, 0));
		figure2[rightUpperLegId] = createNode( m2, rightUpperLeg, tailId, rightLowerLegId );
    break;

    case leftLowerArmId:
		m2 = translate(0.0, upperLegHeight, 0.0);
		m2 = mult(m2, rotate(theta[leftLowerArmId], 1, 0, 2.3));
		figure2[leftLowerArmId] = createNode( m2, leftLowerArm, null, null );
    break;

    case rightLowerArmId:
		m2 = translate(0.0, upperLegHeight, 0.0);
		m2 = mult(m2, rotate(theta[rightLowerArmId], 1, 0, 2.3));
		figure2[rightLowerArmId] = createNode( m2, rightLowerArm, null, null );
    break;

    case leftLowerLegId:
		m2 = translate(0.0, upperLegHeight, 0.0);
		m2 = mult(m2, rotate(theta[leftLowerLegId], 1, 0, -2.3));
		figure2[leftLowerLegId] = createNode( m2, leftLowerLeg, null, null );
    break;

    case rightLowerLegId:
		m2 = translate(0.0, upperLegHeight, 0.0);
		m2 = mult(m2, rotate(theta[rightLowerLegId], 1, 0, -2.3));
		figure2[rightLowerLegId] = createNode( m2, rightLowerLeg, null, null );
    break;
	*/

    }
}

function traverse(Id) {

   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
   modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function traverse2(Id) {

   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure2[Id].transform);
   figure2[Id].render();
   if(figure2[Id].child != null) traverse(figure2[Id].child);
   modelViewMatrix = stack.pop();
   if(figure2[Id].sibling != null) traverse(figure2[Id].sibling);
}

function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoWidth+2));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0,  headHeight+1.5, -0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head2() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0,  headHeight+1.5, -0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function tail() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0,  headHeight-.65, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(tailWidth, tailHeight, tailWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function quad(a, b, c, d) {
     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);
	 
     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     
	 pointsArray.push(vertices[b]);
     normalsArray.push(normal);
     
	 pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     
	 pointsArray.push(vertices[d]);
     normalsArray.push(normal);
}

function cube(id){
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function walkf(){
	if(walkingf){
		if(x == 210 ){
			walk = !walk;
		}else if(x == 156){
			walk = !walk;
		}
		
		theta[rightLowerLegId] = 0;
		theta[leftLowerLegId] = 0;
		initNodes(leftLowerLegId);
		initNodes(rightLowerLegId);
		theta[leftUpperArmId] = x;
		theta[rightUpperArmId] = -x;
		initNodes(leftUpperArmId);
		initNodes(rightUpperArmId);
		
		if(walk){
			
			theta[leftUpperLegId] = x;
			theta[rightUpperLegId] = -x;
			initNodes(leftUpperLegId);
			initNodes(rightUpperLegId);
			theta[leftUpperArmId] = x;
			theta[rightUpperArmId] = -x;
			initNodes(leftUpperArmId);
			initNodes(rightUpperArmId);
			x-=2;
			walkDistance+=.01;
			initNodes(torsoId);
			
		}else{
			
			theta[leftUpperLegId] = x;
			theta[rightUpperLegId] = -x;
			initNodes(leftUpperLegId);
			initNodes(rightUpperLegId);
			theta[leftUpperArmId] = x;
			theta[rightUpperArmId] = -x;
			initNodes(leftUpperArmId);
			initNodes(rightUpperArmId);
			x+=2;
			walkDistance+=.01;
			initNodes(torsoId);
		}
	}
	if(walkingf1){
		if(x1 == 210 ){
			walk1 = !walk1;
		}else if(x1 == 156){
			walk1 = !walk1;
		}
		
		theta[rightLowerLegbId] = 0;
		theta[leftLowerLegbId] = 0;
		initNodes2(leftLowerLegId);
		initNodes2(rightLowerLegId);
		theta[leftUpperArmbId] = x;
		theta[rightUpperArmbId] = -x;
		initNodes2(leftUpperArmId);
		initNodes2(rightUpperArmId);
		
		if(walk){
			
			theta[leftUpperLegbId] = x1;
			theta[rightUpperLegbId] = -x1;
			initNodes2(20);
			initNodes2(18);
			theta[leftUpperArmbId] = x1;
			theta[rightUpperArmbId] = -x1;
			initNodes2(20);
			initNodes2(18);
			x1-=2;
			walkDistance1-=.01;
			initNodes2(torsoId);
			
			
		}else{
			
			theta[leftUpperLegbId] = x1;
			theta[rightUpperLegbId] = -x1;
			initNodes2(leftUpperLegId);
			initNodes2(rightUpperLegId);
			theta[leftUpperArmbId] = x1;
			theta[rightUpperArmbId] = -x1;
			initNodes2(leftUpperArmId);
			initNodes2(rightUpperArmId);
			x1+=2;
			walkDistance1-=.01;
			initNodes2(torsoId);
		}
	}
	
}

function walkb(){
	if(x == 210 ){
			walk = !walk;
		}else if(x == 156){
			walk = !walk;
		}
		
		theta[rightLowerLegId] = 0;
		theta[leftLowerLegId] = 0;
		initNodes(leftLowerLegId);
		initNodes(rightLowerLegId);
		theta[leftUpperArmId] = x;
		theta[rightUpperArmId] = -x;
		initNodes(leftUpperArmId);
		initNodes(rightUpperArmId);
		
		if(walk){
			
			theta[leftUpperLegId] = x;
			theta[rightUpperLegId] = -x;
			initNodes(leftUpperLegId);
			initNodes(rightUpperLegId);
			theta[leftUpperArmId] = x;
			theta[rightUpperArmId] = -x;
			initNodes(leftUpperArmId);
			initNodes(rightUpperArmId);
			x-=2;
			walkDistance-=.01;
			initNodes(torsoId);
			
		}else{
			
			theta[leftUpperLegId] = x;
			theta[rightUpperLegId] = -x;
			initNodes(leftUpperLegId);
			initNodes(rightUpperLegId);
			theta[leftUpperArmId] = x;
			theta[rightUpperArmId] = -x;
			initNodes(leftUpperArmId);
			initNodes(rightUpperArmId);
			x+=2;
			walkDistance-=.01;
			initNodes(torsoId);
			
			
		}
}

function jump1(){
	if(jumpDistance >= 2 ){
		jump= !jump;
	}else if(jumpDistance <= 0){
		jump = !jump;
	}
	
	if(jump){
		jumpDistance += .1;
		initNodes(torsoId);
	}else{
		jumpDistance -= .1;
		initNodes(torsoId);
	}
		
}

function wag1(){
	if(y == 30 ){
		wag = !wag;
	}else if(y == -30){
		wag = !wag;
	}
	if(wag){
			
			theta[tailId] = y;
			initNodes(tailId);
			y-=2;	
		}else{
			
			theta[tailId] = y;
			initNodes(tailId);
			y+=2;
		}
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
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program);

    instanceMatrix = mat4();

    projectionMatrix = ortho(-15.0,15.0,-15.0, 15.0,-15.0,15.0);
    modelViewMatrix = mat4();

    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    cube();

	nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );
	
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

	
	document.getElementById("slider0").onchange = function(event) {
        theta[torsoId ] = event.target.value;
        initNodes(torsoId);
    };

	
	// Buttons here
	document.getElementById("Button1").onclick = function(){
		
		x=180;
		walkingb = false;
		if(walkingf){
			walkingf = false;
		}else{
			walkingf = true;
		}
		
		
		
	};
	
	document.getElementById("Button2").onclick = function(){
		x=180;
		walkingf = false;
		if(walkingb){
			walkingb = false;
		}else{
			walkingb = true;
		}
		
	};
	
	document.getElementById("Button3").onclick = function(){
		y = 0;
		if(wagging){
			wagging = false;
		}else{
			wagging = true;
		}
	};
	
	document.getElementById("Button4").onclick = function(){
		if(jumping){
			jumping = false;
		}else{
			jumping = true;
		}
	};
	
	document.getElementById("Button5").onclick = function(){
		if(reset1){
			reset1 = false;
		}else{
			reset1 = true;
		}
	};
	
	document.getElementById("Button6").onclick = function(){
		
		x1=180;
		
		if(walkingf1){
			walkingf1 = false;
		}else{
			walkingf1 = true;
		}
		
		
		
	};

	
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition));

    gl.uniform1f(gl.getUniformLocation(program, "shininess"),materialShininess);	
	
    for(i=0; i<numNodes; i++) initNodes(i);
	for(i=0; i<numNodes; i++) initNodes2(i);

	render();
}

var render = function() {

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		traverse(torsoId);
		traverse2(torsoId);
		
		theta[head2Id]= -30;
		initNodes(head2Id);
		
		if (walkingf || walkingf1){
			walkf();
			traverse2(torsoId);
		}
		
		if (walkingb){
			walkb();
		}
		
		if (wagging){
		wag1();
		}
		
		if(jumping){
			jump1();
		}
		
        requestAnimFrame(render);
}
