/**
 * @author alteredq / http://alteredqualia.com/
 */
/*
///MorphAnimMesh对象,最终的网格对象,和Mesh对象不同的是,这个对象是专门针对变形动画的,增加了许多角色变形动画的内容.有高人把图形学建模比作是制作灯笼,先用Geometry创建灯笼的框架,
/// 然后将材质material贴在框架上,最后形成的总体灯笼,就是Mesh对象.下面看一下Mesh对象的用法和具体实现.
/// 用法:var geometry = new THREE.Geometry(1,1,1);				//创建geometry对象(灯笼的框架),
///																//有一下可选对象BoxGeometry,CircleGeometry,CubeGeometry,CylinderGeometry,DodecahedronGeometry,ExtrudeGeometry,IcosahedronGeometry,
///																//LatheGeometry,OctahedronGeometry,ParametricGeometry,PlaneGeometry,PolyhedronGeometry,RingGeometry,ShapeGeometry,SphereGeometry,
///																//TetrahedronGeometry,TextGeometry,TorusGeometry,TorusKnotGeometry,TubeGeometry
///		 var material = new THREE.Material({color: 0xffff00});	//创建材质对象(灯笼的表面)
///																//有以下可选对象LineBasicMaterial,LineDashedMaterial,Material,MeshBasicMaterial,MeshDepthMaterial,MeshFaceMaterial,
///																//MeshLambertMaterial,MeshNormalMaterial,MeshPhongMaterial,PointCloudMaterial,RawShaderMaterial,ShaderMaterial,
///																//SpriteCanvasMaterial,SpriteMaterial
///		 var mesh = new THREE.MorphAnimMesh(geometry, material);	//创建mesh(灯笼)对象,并将geometry对象(灯笼的框架)和material对象(灯笼的表面)传递给mesh(灯笼)对象
///		 mesh.duration = 5000;
///		 scene.add(mesh); 	//将mesh(灯笼)添加到场景中.
/// 	var delta = clock.getDelta();
/// 	function render (){
///			mesh.updateAnimation(1000 * delta);		//在渲染器里设置动画跟新的频率.
/// 	}
*/
///<summary>MorphAnimMesh</summary>
///<param name ="geometry" type="THREE.Geometry">Geometry对象(灯笼的框架)</param>
///<param name ="material" type="THREE.Material">Material对象(材质对象)</param>
///<returns type="MorphAnimMesh">返回MorphAnimMesh对象</returns>
THREE.MorphAnimMesh = function ( geometry, material ) {

	THREE.Mesh.call( this, geometry, material );	//调用Mesh对象的call方法,将原本属于Mesh的方法交给当前对象MorphAniMesh来使用.

	// API

	this.duration = 1000; // milliseconds	//周期,单位毫秒,默认初始化为1000毫秒,每帧间隔时长.
	this.mirroredLoop = false;	//镜像循环,看下面的算法,应该是播放完后,回放动画,
	this.time = 0;		//动画时长

	// internals

	this.lastKeyframe = 0;	//最后关键帧
	this.currentKeyframe = 0;	//当前关键帧

	this.direction = 1;		//方向,应该指的是时间轴的方向
	this.directionBackwards = false;	//时间轴是否是返方向,默认为false

	this.setFrameRange( 0, this.geometry.morphTargets.length - 1 );	//创建关键帧动画时间轴,从morphTargets数组创建.

};
/*************************************************
****下面是MorphAnimMesh对象的方法属性定义,继承自Mesh
**************************************************/
THREE.MorphAnimMesh.prototype = Object.create( THREE.Mesh.prototype );

/*
///setFrameRange方法将创建关键帧动画时间轴,从morphTargets数组创建
*/
///<summary>setFrameRange</summary>
///<param name ="start" type="int">morphTargets元素的索引,用来指定关键帧动画的开始</param>
///<param name ="end" type="int">morphTargets元素的索引,用来指定关键帧动画的结束</param>
///<returns type="MorphAnimMesh">包含关键帧动画的MorphAnimMesh对象.</returns>
THREE.MorphAnimMesh.prototype.setFrameRange = function ( start, end ) {

	this.startKeyframe = start;	//开始帧等于参数start
	this.endKeyframe = end;		//结束帧等于参数end

	this.length = this.endKeyframe - this.startKeyframe + 1;	//动画长度等于开始帧到结束帧

};

/*
///setDirectionForward方法设置关键帧动画正放.
*/
///<summary>setDirectionForward</summary>
THREE.MorphAnimMesh.prototype.setDirectionForward = function () {

	this.direction = 1;		//
	this.directionBackwards = false;

};

/*
///setDirectionForward方法设置关键帧动画倒放.
*/
///<summary>setDirectionForward</summary>
THREE.MorphAnimMesh.prototype.setDirectionBackward = function () {

	this.direction = - 1;
	this.directionBackwards = true;

};
/*
///setDirectionForward方法从morphTagets数组中解析关键帧动画
*/
///<summary>setDirectionForward</summary>
THREE.MorphAnimMesh.prototype.parseAnimations = function () {

	var geometry = this.geometry;

	if ( ! geometry.animations ) geometry.animations = {};

	var firstAnimation, animations = geometry.animations;

	var pattern = /([a-z]+)_?(\d+)/;

	for ( var i = 0, il = geometry.morphTargets.length; i < il; i ++ ) {

		var morph = geometry.morphTargets[ i ];		//获得单个变形动画关键帧
		var parts = morph.name.match( pattern );	//

		if ( parts && parts.length > 1 ) {

			var label = parts[ 1 ];	//
			var num = parts[ 2 ];

			if ( ! animations[ label ] ) animations[ label ] = { start: Infinity, end: - Infinity };

			var animation = animations[ label ];

			if ( i < animation.start ) animation.start = i;
			if ( i > animation.end ) animation.end = i;

			if ( ! firstAnimation ) firstAnimation = label;

		}

	}

	geometry.firstAnimation = firstAnimation;	//第一个动画.

};
/*
///setAnimationLabel方法从morphTagets数组中设置关键帧动画标签,可以将morphTargets数组中,分成几段动画,分别存放.
*/
///<summary>setAnimationLabel</summary>
///<param name ="label" type="string">动画标签名</param>
///<param name ="start" type="int">morphTargets元素的索引,用来指定关键帧动画的开始</param>
///<param name ="end" type="int">morphTargets元素的索引,用来指定关键帧动画的结束</param>
///<returns type="MorphAnimMesh">返回带有动画标签的MorphAnimMesh对象.</returns>
THREE.MorphAnimMesh.prototype.setAnimationLabel = function ( label, start, end ) {

	if ( ! this.geometry.animations ) this.geometry.animations = {};

	this.geometry.animations[ label ] = { start: start, end: end };

};
/*
///playAnimation方法根据动画的标签名(参数lab)按照指定的速度(参数fps)播放动画
*/
///<summary>playAnimation</summary>
///<param name ="label" type="string">动画标签名</param>
///<param name ="fps" type="int">多少帧/秒</param>
THREE.MorphAnimMesh.prototype.playAnimation = function ( label, fps ) {

	var animation = this.geometry.animations[ label ];

	if ( animation ) {

		this.setFrameRange( animation.start, animation.end );
		this.duration = 1000 * ( ( animation.end - animation.start ) / fps );
		this.time = 0;

	} else {

		console.warn( 'animation[' + label + '] undefined' );

	}

};

/*
///updateAnimation方法根据当前时钟频率生成补间动画.
*/
///<summary>updateAnimation</summary>
///<param name ="delta" type="string">时钟频率</param>
THREE.MorphAnimMesh.prototype.updateAnimation = function ( delta ) {

	var frameTime = this.duration / this.length;

	this.time += this.direction * delta;

	if ( this.mirroredLoop ) {

		if ( this.time > this.duration || this.time < 0 ) {

			this.direction *= - 1;

			if ( this.time > this.duration ) {

				this.time = this.duration;
				this.directionBackwards = true;

			}

			if ( this.time < 0 ) {

				this.time = 0;
				this.directionBackwards = false;

			}

		}

	} else {

		this.time = this.time % this.duration;

		if ( this.time < 0 ) this.time += this.duration;

	}

	var keyframe = this.startKeyframe + THREE.Math.clamp( Math.floor( this.time / frameTime ), 0, this.length - 1 );

	if ( keyframe !== this.currentKeyframe ) {

		this.morphTargetInfluences[ this.lastKeyframe ] = 0;
		this.morphTargetInfluences[ this.currentKeyframe ] = 1;

		this.morphTargetInfluences[ keyframe ] = 0;

		this.lastKeyframe = this.currentKeyframe;
		this.currentKeyframe = keyframe;

	}

	var mix = ( this.time % frameTime ) / frameTime;

	if ( this.directionBackwards ) {

		mix = 1 - mix;

	}

	this.morphTargetInfluences[ this.currentKeyframe ] = mix;
	this.morphTargetInfluences[ this.lastKeyframe ] = 1 - mix;

};

/*
///updateAnimation方法根据变形幅度t将morphTaInfluences[a]设置为1-t,morphTaInfluences[b]设置为5.
*/
///<summary>updateAnimation</summary>
///<param name ="a" type="int">节点a</param>
///<param name ="b" type="int">节点b</param>
///<param name ="t" type="float">变形幅度</param>
THREE.MorphAnimMesh.prototype.interpolateTargets = function ( a, b, t ) {

	var influences = this.morphTargetInfluences;

	for ( var i = 0, l = influences.length; i < l; i ++ ) {

		influences[ i ] = 0;

	}

	if ( a > -1 ) influences[ a ] = 1 - t;
	if ( b > -1 ) influences[ b ] = t;

};

/*clone方法
///clone方法克隆一个MorphAnimMesh带有变形动画的网格对象.
*/
///<summary>clone</summary>
///<param name ="object" type="MorphAnimMesh">接收克隆的MorphAnimMesh对象</param>
///<param name ="recursive" type="boolean">是否对子对象一一进行克隆</param>
///<returns type="Ray">返回MorphAnimMesh带有变形动画的网格对象.</returns>	
THREE.MorphAnimMesh.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.MorphAnimMesh( this.geometry, this.material );

	object.duration = this.duration;
	object.mirroredLoop = this.mirroredLoop;
	object.time = this.time;

	object.lastKeyframe = this.lastKeyframe;
	object.currentKeyframe = this.currentKeyframe;

	object.direction = this.direction;
	object.directionBackwards = this.directionBackwards;

	THREE.Mesh.prototype.clone.call( this, object );	//继承Mesh的clone方法

	return object;		//返回MorphAnimMesh带有变形动画网格对象.

};
