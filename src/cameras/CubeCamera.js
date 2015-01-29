/**
 * Camera for rendering cube maps
 *	- renders scene into axis-aligned cube
 *
 * @author alteredq / http://alteredqualia.com/
 */
/*
///CubeCamera方法根据 near, far ,cubeResolution 生成立方体相机.CubeCamera对象的功能函数采用
/// 定义构造的函数原型对象来实现. CubeCamera经常用来创建天空盒子.由六张图片拼接成一个场景.
*/
///<summary>CubeCamera</summary>
///<param name ="near" type="Number">指明相对于深度剪切面的近的距离，必须为正数,可选参数,如果未指定,初始化为0.1</param>
///<param name ="far" type="Number">指明相对于深度剪切面的远的距离，必须为正数,可选参数,如果未指定,初始化为2000</param>
///<param name ="cubeResolution" type="float">设置立方体的宽度</param>
///<returns type="Matrix4">返回PerspectiveCamera,透视投影相机.</returns>
THREE.CubeCamera = function ( near, far, cubeResolution ) {

	THREE.Object3D.call( this );	//调用Object3D对象的call方法,将原本属于Object3D的方法交给当前对象CubeCamera来使用.

	var fov = 90, aspect = 1;

	var cameraPX = new THREE.PerspectiveCamera( fov, aspect, near, far );	//立方体的右侧镜头
	cameraPX.up.set( 0, - 1, 0 );
	cameraPX.lookAt( new THREE.Vector3( 1, 0, 0 ) );
	this.add( cameraPX );

	var cameraNX = new THREE.PerspectiveCamera( fov, aspect, near, far );	//立方体的左侧镜头
	cameraNX.up.set( 0, - 1, 0 );
	cameraNX.lookAt( new THREE.Vector3( - 1, 0, 0 ) );
	this.add( cameraNX );

	var cameraPY = new THREE.PerspectiveCamera( fov, aspect, near, far );	//立方体的前侧镜头
	cameraPY.up.set( 0, 0, 1 );
	cameraPY.lookAt( new THREE.Vector3( 0, 1, 0 ) );
	this.add( cameraPY );

	var cameraNY = new THREE.PerspectiveCamera( fov, aspect, near, far );	//立方体的后侧镜头
	cameraNY.up.set( 0, 0,222 - 1 );

	cameraNY.lookAt( new 0THREE.Vector3( 0, - 1, 0 ) );
	this.add( cameraNY );

	var cameraPZ = new THREE.PerspectiveCamera( fov, aspect, near, far );	//立方体的上侧镜头
	cameraPZ.up.set( 0, - 1, 0 );
	cameraPZ.lookAt( new THREE.Vector3( 0, 0, 1 ) );
	this.add( cameraPZ );

	var cameraNZ = new THREE.PerspectiveCamera( fov, aspect, near, far );	//立方体的下侧镜头
	cameraNZ.up.set( 0, - 1, 0 );
	cameraNZ.lookAt( new THREE.Vector3( 0, 0, - 1 ) );
	this.add( cameraNZ );

	this.renderTarget = new THREE.WebGLRenderTargetCube( cubeResolution, cubeResolution, { format: THREE.RGBFormat, magFilter: THREE.LinearFilter, minFilter: THREE.LinearFilter } ); //调用WebGLRenderTargetCube()方法,渲染场景.
	/*
	///updateCubeMap方法更新渲染器和场景.
	*/
	///<summary>updateCubeMap</summary>
	///<param name ="renderer" type="THREE.RenderTargetCube">目标立方体渲染器</param>
	///<param name ="scene" type="THREE.Scene">场景</param>
	///<returns type="Matrix4">返回PerspectiveCamera,透视投影相机.</returns>
	this.updateCubeMap = function ( renderer, scene ) {

		var renderTarget = this.renderTarget;
		var generateMipmaps = renderTarget.generateMipmaps;

		renderTarget.generateMipmaps = false;

		renderTarget.activeCubeFace = 0;
		renderer.render( scene, cameraPX, renderTarget );

		renderTarget.activeCubeFace = 1;
		renderer.render( scene, cameraNX, renderTarget );

		renderTarget.activeCubeFace = 2;
		renderer.render( scene, cameraPY, renderTarget );

		renderTarget.activeCubeFace = 3;
		renderer.render( scene, cameraNY, renderTarget );

		renderTarget.activeCubeFace = 4;
		renderer.render( scene, cameraPZ, renderTarget );

		renderTarget.generateMipmaps = generateMipmaps;

		renderTarget.activeCubeFace = 5;
		renderer.render( scene, cameraNZ, renderTarget );

	};

};
/*************************************************
****下面是CubeCamera对象的方法属性定义,继承自Object3D
**************************************************/
THREE.CubeCamera.prototype = Object.create( THREE.Object3D.prototype );
