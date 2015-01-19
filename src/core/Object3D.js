/**
 * @author mrdoob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 */
/*
///Object3D是场景中图形对象的基类.Object3D对象的功能函数采用定义构造的函数原型对象来实现.
*/
///<summary>Object3D</summary>
THREE.Object3D = function () {

/****************************************
****下面是Object3D对象的属性定义
****************************************/

	this.id = THREE.Object3DIdCount ++;		//Object3D对象id属性.
	this.uuid = THREE.Math.generateUUID();	//调用THREE.Math.generateUUID()方法,Object3D对象uuid(通用唯一识别码)属性,

	this.name = '';		//Object3D对象name属性,可以为当前对象定义一个名称,初始化为''

	this.parent = undefined;		//Object3D对象parent属性,初始化为undefined.
	this.children = [];			//Object3D对象children属性,初始化为[].

	this.up = THREE.Object3D.DefaultUp.clone();	////Object3D对象up属性,当前对象的上方,初始化为THREE.Vector3( 0, 1, 0 )	

	var scope = this;

	var position = new THREE.Vector3();
	var rotation = new THREE.Euler();
	var quaternion = new THREE.Quaternion();
	var scale = new THREE.Vector3( 1, 1, 1 );

	rotation.onChange( function () {
		quaternion.setFromEuler( rotation, false );	//给对象的rotation属性绑定setFromEuler()方法,当rotation属性值更改,调用setFromEuler()方法
	} );

	quaternion.onChange( function () {
		rotation.setFromQuaternion( quaternion, undefined, false );		//给对象的quaternion属性绑定setFromQuaternion()方法,当rotation属性值更改,调用setFromEuler()方法
	} );

	Object.defineProperties( this, {
		position: {					//Object3D对象position属性
			enumerable: true,
			value: position
		},
		rotation: {					//Object3D对象rotation属性,以弧度为单位
			enumerable: true,
			value: rotation
		},
		quaternion: {					//Object3D对象quaternion属性,当useQuaternion属性为true,可用.
			enumerable: true,
			value: quaternion
		},
		scale: {					//Object3D对象scale属性
			enumerable: true,
			value: scale
		},
	} );

	this.renderDepth = null;		//Object3D对象renderDepth属性,初始化为null,如果设置了值将会覆盖渲染深度.

	this.rotationAutoUpdate = true;		//Object3D对象rotationAutoUpdate属性,初始化为true,表示每帧都会重新计算.

	this.matrix = new THREE.Matrix4();		//Object3D对象matrix属性,变换矩阵
	this.matrixWorld = new THREE.Matrix4();		//Object3D对象matrixWorld属性,如果当前对象是子对象,matrixWorld属性为上一级对象的变换矩阵,否则是自己的变换矩阵.

	this.matrixAutoUpdate = true;		//Object3D对象matrixAutoUpdate属性,初始化为true,表示每帧都会重新计算缩放,位置,旋转或四元数矩阵.matrixWorld属性也会重新计算
	this.matrixWorldNeedsUpdate = false;		//Object3D对象matrixWorldNeedsUpdate属性,初始化为false

	this.visible = true;		//Object3D对象visible属性,表示当前对象场景中是否可见,初始化为trure

	this.castShadow = false;		//Object3D对象castShadow属性,初始化为false,表示不产生阴影
	this.receiveShadow = false;		//Object3D对象receiveShadow属性,初始化为false,表示材质不接受烘焙阴影

	this.frustumCulled = true;		//Object3D对象frustumCulled属性,初始化为true

	this.userData = {};		//Object3D对象userData属性,初始化为{},用户自定义的其它属性,这里的数值不会被clone

};

THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 1, 0 );	//设置Object3D对象的默认上方向.

/****************************************
****下面是Object3D对象提供的功能函数.
****************************************/
THREE.Object3D.prototype = {

	constructor: THREE.Object3D,	//构造器,返回对创建此对象Object3D函数的引用.

	/*
	///get eulerOrder 方法用来获得欧拉角的轴顺序
	///NOTE: get eulerOrder()的用法是Quaternion.prototype.eulerOrder,这种用法在除ie浏览器以外的浏览器上可以使用.
	///NOTE: .eulerOrder方法已经被删除了, 现在使用.rotation.order.这里保留这个方法,为了向下兼容.
	*/
	///<summary>get eulerOrder</summary>
	///<returns type="number">返回欧拉角的轴顺序</returns>
	get eulerOrder () {
		//.eulerOrder方法已经被删除了.这里保留这个方法, 现在使用.rotation.order.为了向下兼容.
		console.warn( 'THREE.Object3D: .eulerOrder has been moved to .rotation.order.' );
		//返回欧拉角的轴顺序
		return this.rotation.order;

	},

	/*
	///set eulerOrder 方法用来设置欧拉角的轴顺序
	///NOTE: set eulerOrder()的用法是Quaternion.prototype.eulerOrder,这种用法在除ie浏览器以外的浏览器上可以使用.
	///NOTE: .eulerOrder方法已经被删除了, 现在使用.rotation.order.这里保留这个方法,为了向下兼容.
	*/
	///<summary>set eulerOrder</summary>
	///<returns type="number">返回新的欧拉角的轴顺序</returns>
	set eulerOrder ( value ) {
		//.eulerOrder方法已经被删除了.这里保留这个方法, 现在使用.rotation.order.为了向下兼容.
		console.warn( 'THREE.Object3D: .eulerOrder has been moved to .rotation.order.' );
		//返回新的欧拉角的轴顺序
		this.rotation.order = value;

	},

	/*
	///get useQuaternion 方法用来获得useQuaternion属性是否被设置为true
	///NOTE: get useQuaternion()的用法是Quaternion.prototype.eulerOrder,这种用法在除ie浏览器以外的浏览器上可以使用.
	///NOTE: .useQuaternion方法已经被删除了, 现在默认使用quaternions.
	*/
	///<summary>get useQuaternion</summary>
	///<returns type="Boolean">返回useQuaternion属性是否被设置为true</returns>
	get useQuaternion () {
		///提示用户.useQuaternion方法已经被删除了, 现在默认使用quaternions.
		console.warn( 'THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.' );

	},

	/*
	///set useQuaternion 方法用来获得useQuaternion属性是否被设置为true
	///NOTE: set useQuaternion()的用法是Quaternion.prototype.eulerOrder,这种用法在除ie浏览器以外的浏览器上可以使用.
	///NOTE: .useQuaternion方法已经被删除了, 现在默认使用quaternions.
	*/
	///<summary>set useQuaternion</summary>
	set useQuaternion ( value ) {
		///提示用户.useQuaternion方法已经被删除了, 现在默认使用quaternions.
		console.warn( 'THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.' );

	},

	/*
	///applyMatrix方法对对象的matrix属性应用矩阵变换.达到旋转,缩放,移动的目的.
	*/
	///<summary>applyMatrix</summary>
	///<param name ="m" type="Matrix4">仿射矩阵</param>
	///<returns type="Object3D">返回新的Object3D对象</returns>
	applyMatrix: function ( matrix ) {
		//multiply方法用来将矩阵a,b相乘,并返回新的Matrix4(4x4矩阵).
		this.matrix.multiplyMatrices( matrix, this.matrix );
		//decompose方法和compose()方法对应.将转换矩阵的平移、旋转和缩放设置作为由三个 Vector3 对象组成的矢量返回。第一个 Vector3 对象容纳平移元素。第二个 Vector3 对象容纳旋转元素。第三个 Vector3 对象容纳缩放元素。 
		this.matrix.decompose( this.position, this.quaternion, this.scale );	

	},

	/*
	///setRotationFromAxisAngle方法通过四元数的方式旋转任意坐标轴(参数axis)旋转角度(参数angle),最后将结果返回到this.quternion属性中.
	/// NOTE:参数axis必须是单位向量,通过调用.normalize()得到单位向量.
	*/
	///<summary>setRotationFromAxisAngle</summary>
	///<param name ="axis" type="Vector3">三维向量</param>
	///<param name ="angle" type="float">角度</param>
	///<returns type="Object3D">返回新的Object3D对象</returns>
	setRotationFromAxisAngle: function ( axis, angle ) {

		// assumes axis is normalized
		// 确保坐标轴是单位向量

		this.quaternion.setFromAxisAngle( axis, angle );	//调用quaternion.setFromAxisAngle方法,绕任意轴设定旋转四元数

	},

	/*
	///setRotationFromEuler方法通过一次欧拉旋转(参数euler)设置四元数旋转,最后将结果返回到this.quternion属性中.
	*/
	///<summary>setRotationFromEuler</summary>
	///<param name ="euler" type="THREE.Euler">THREE.Euler对象,欧拉对象</param>
	///<param name ="update" type="bool">true 或者 false,如果不等于false,Quaternion对象调用onChangeCallback函数</param>
	///<returns type="Object3D">返回新的Object3D对象</returns>
	setRotationFromEuler: function ( euler ) {

		this.quaternion.setFromEuler( euler, true );	//调用quaternion.setFromEuler方法,applyEuler方法通过一次欧拉旋转(参数euler)设置四元数旋转

	},

	/*
	///setRotationFromMatrix方法利用一个参数m(旋转矩阵),达到旋转变换的目的吧,最后将结果返回到this.quternion属性中.
	/// NOTE:m是一个旋转矩阵,更多公式:http://en.wikipedia.org/wiki/Transformation_matrix
	///	
	/// 样例:

		这个样例是z轴旋转30度.

					/----------------------------------------------------\
					|cos(heading) = 0.866	| sin(heading) = 0.5   | 0	 |
					|-----------------------|----------------------------|
		matrix =	|-sin(heading) = -0.5   |cos(heading) = 0.866  | 0   |
					|-----------------------|----------------------|-----|
					|     0                 |     0                | 1   |
					\----------------------------------------------------/

		angle = acos ( ( m00 + m11 + m22 - 1)/2)

		angle = acos ( ( 0.866 + 0.866 + 1 - 1)/2)

		angle = acos ( 0.866 )

		angle = 30 degrees

		x = (m21 - m12) = 0 - 0 =0
		y = (m02 - m20) = 0 - 0 =0
		z = (m10 - m01) = -0.5 - 0.5 = -1

	*/
	///<summary>setRotationFromMatrix</summary>
	///<param name ="m" type="Matrix3">3x3矩阵(旋转矩阵)</param>
	///<param name ="order" type="String">order(旋转顺序) 默认顺序是'XYZ' 取值范围是['XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX' ]</param>
	///<returns type="Object3D">返回新的Object3D对象</returns>
	setRotationFromMatrix: function ( m ) {

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
		// 确保参数m是一个3x3的旋转矩阵.

		this.quaternion.setFromRotationMatrix( m );	//调用quaternion.setFromRotationMatrix方法,setFromRotationMatrix方法通过参数m(旋转矩阵)设置旋转四元数

	},

	/*
	///setRotationFromQuaternion方法通过规范化的旋转四元数直接应用旋转
	*/
	///<summary>setRotationFromQuaternion</summary>
	///<param name ="q" type="Quaternion">四元数</param>
	///<returns type="Object3D">返回新的Object3D对象</returns>
	setRotationFromQuaternion: function ( q ) {

		// assumes q is normalized
		// 确保参数q是规范化的

		this.quaternion.copy( q );	//调用quaternion.copy方法,copy方法通过直接将规范化的旋转四元数设置给this.quternion属性

	},

	/*
	///rotateOnAxis方法绕任意坐标轴(参数axis)旋转角度(参数angle)
	*/
	///<summary>rotateOnAxis</summary>
	///<param name ="axis" type="Vector3">三维向量</param>
	///<param name ="angle" type="float">角度</param>
	///<returns type="Object3D">返回新的Object3D对象</returns>
	rotateOnAxis: function () {

		// rotate object on axis in object space
		// 在指定的坐标轴上旋转对象.
		// axis is assumed to be normalized
		// 保证参数axis是规范化的

		var q1 = new THREE.Quaternion();

		return function ( axis, angle ) {

			q1.setFromAxisAngle( axis, angle );	//调用setFromAxisAngle()方法,绕坐标轴旋转指定角度.

			this.quaternion.multiply( q1 );	

			return this;	//返回新的Object3D对象

		}

	}(),

	/*
	///rotateX方法旋转绕x轴旋转角度(参数angle)
	*/
	///<summary>rotateX</summary>
	///<param name ="angle" type="float">角度</param>
	///<returns type="Object3D">返回新的Object3D对象</returns>
	rotateX: function () {

		var v1 = new THREE.Vector3( 1, 0, 0 );

		return function ( angle ) {

			return this.rotateOnAxis( v1, angle );	//调用rotateOnAxis()方法,绕x轴旋转指定角度.

		};

	}(),

	/*
	///rotateY方法旋转绕x轴旋转角度(参数angle)
	*/
	///<summary>rotateY</summary>
	///<param name ="angle" type="float">角度</param>
	///<returns type="Object3D">返回新的Object3D对象</returns>
	rotateY: function () {

		var v1 = new THREE.Vector3( 0, 1, 0 );

		return function ( angle ) {

			return this.rotateOnAxis( v1, angle );	//调用rotateOnAxis()方法,绕Y轴旋转指定角度.

		};

	}(),

	/*
	///rotateZ方法旋转绕x轴旋转角度(参数angle)
	*/
	///<summary>rotateZ</summary>
	///<param name ="angle" type="float">角度</param>
	///<returns type="Object3D">返回新的Object3D对象</returns>
	rotateZ: function () {

		var v1 = new THREE.Vector3( 0, 0, 1 );

		return function ( angle ) {

			return this.rotateOnAxis( v1, angle );	//调用rotateOnAxis()方法,绕Z轴旋转指定角度.

		};

	}(),

	/*
	///translateOnAxis方法沿任意坐标轴(参数axis)移动指定距离(参数distance)
	*/
	///<summary>translateOnAxis</summary>
	///<param name ="axis" type="Vector3">三维向量</param>
	///<param name ="distance" type="float">距离</param>
	///<returns type="Object3D">返回新的Object3D对象</returns>
	translateOnAxis: function () {

		// translate object by distance along axis in object space
		// 在指定轴上移动对象
		// axis is assumed to be normalized
		// 参数axis必须是规范化的.

		var v1 = new THREE.Vector3();

		return function ( axis, distance ) {

			v1.copy( axis ).applyQuaternion( this.quaternion );	//调用applyQuaternion()方法,沿任意坐标轴(参数axis)移动指定距离(参数distance)

			this.position.add( v1.multiplyScalar( distance ) );

			return this;	//返回新的Object3D对象

		}

	}(),

	/*
	///translate方法沿任意坐标轴(参数axis)移动指定距离(参数distance)
	/// NOTE:translate方法已经被删除,被translateOnAxis替代.这里保留,为了向下兼容
	*/
	///<summary>translate</summary>
	///<param name ="distance" type="float">距离</param>
	///<param name ="axis" type="Vector3">三维向量</param>
	///<returns type="Object3D">返回新的Object3D对象</returns>
	translate: function ( distance, axis ) {
		//提示用户translate方法已经被删除,被translateOnAxis替代.
		console.warn( 'THREE.Object3D: .translate() has been removed. Use .translateOnAxis( axis, distance ) instead.' );
		return this.translateOnAxis( axis, distance );	//调用translateOnAxis()方法,移动对象,返回新的Object3D对象

	},

	/*
	///translateX方法沿任意x轴移动指定距离(参数distance)
	*/
	///<summary>translateX</summary>
	///<param name ="distance" type="float">距离</param>
	///<returns type="Object3D">返回新的Object3D对象</returns>
	translateX: function () {

		var v1 = new THREE.Vector3( 1, 0, 0 );

		return function ( distance ) {

			return this.translateOnAxis( v1, distance );	//调用translateOnAxis()方法,绕X轴旋转指定角度.

		};

	}(),

	/*
	///translateY方法沿任意Y轴移动指定距离(参数distance)
	*/
	///<summary>translateY</summary>
	///<param name ="distance" type="float">距离</param>
	///<returns type="Object3D">返回新的Object3D对象</returns>
	translateY: function () {

		var v1 = new THREE.Vector3( 0, 1, 0 );

		return function ( distance ) {

			return this.translateOnAxis( v1, distance );	//调用translateOnAxis()方法,绕Y轴旋转指定角度.

		};

	}(),

	/*
	///translateZ方法沿任意Z轴移动指定距离(参数distance)
	*/
	///<summary>translateZ</summary>
	///<param name ="distance" type="float">距离</param>
	///<returns type="Object3D">返回新的Object3D对象</returns>
	translateZ: function () {

		var v1 = new THREE.Vector3( 0, 0, 1 );

		return function ( distance ) {

			return this.translateOnAxis( v1, distance );	//调用translateOnAxis()方法,绕Z轴旋转指定角度.

		};

	}(),

	/*
	///localToWorld方法与worldToLocal方法相对应,将参数vector,从对象坐标空间变换成世界坐标空间
	*/
	///<summary>localToWorld</summary>
	///<param name ="vector" type="Vector">Vector3对象</param>
	///<returns type="Object3D">返回世界坐标空间的Vector3对象.</returns>
	localToWorld: function ( vector ) {

		return vector.applyMatrix4( this.matrixWorld );	//返回世界坐标空间的Vector3对象.

	},

	/*
	///worldToLocal方法与localToWorld方法相对应,将参数vector,从世界坐标空间变换成对象坐标空间
	*/
	///<summary>worldToLocal</summary>
	///<param name ="vector" type="Vector">Vector3对象</param>
	///<returns type="Object3D">返回对象坐标空间的Vector3对象.</returns>
	worldToLocal: function () {

		var m1 = new THREE.Matrix4();

		return function ( vector ) {

			return vector.applyMatrix4( m1.getInverse( this.matrixWorld ) );	//返回对象坐标空间的Vector3对象.

		};

	}(),

	/*
	///lookAt方法用来旋转对象,并将对象面对空间中的点(参数vector)
	*/
	///<summary>lookAt</summary>
	///<param name ="vector" type="Vector">Vector3对象</param>
	///<returns type="Object3D">返回新的Object3D对象</returns>
	lookAt: function () {

		// This routine does not support objects with rotated and/or translated parent(s)
		// lookat不支持嵌套对象的旋转,变换

		var m1 = new THREE.Matrix4();

		return function ( vector ) {

			m1.lookAt( vector, this.position, this.up );	//调用THREE.Matrix4.lookAt()方法.

			this.quaternion.setFromRotationMatrix( m1 );	//返回新的Object3D对象

		};

	}(),

	/*
	///add方法用来将对象(参数object),设置为当前对象的子对象
	/// NOTE:参数是多个Object3D对象.
	*/
	///<summary>add</summary>
	///<param name ="object" type="Object3D">Object3D对象</param>
	///<returns type="Object3D">返回包含Object3D对象的Object3D对象.</returns>
	add: function ( object ) {

		if ( arguments.length > 1 ) {

			for ( var i = 0; i < arguments.length; i++ ) {

				this.add( arguments[ i ] );

			}

			return this;	//返回包含Object3D对象的Object3D对象.

		};

		if ( object === this ) {
			//提示用户,自己不能添加自己.
			console.error( "THREE.Object3D.add:", object, "can't be added as a child of itself." );
			return this;

		}

		if ( object instanceof THREE.Object3D ) {

			if ( object.parent !== undefined ) {

				object.parent.remove( object );

			}

			object.parent = this;
			object.dispatchEvent( { type: 'added' } );

			this.children.push( object );

			// add to scene
			// 添加到当前场景中.

			var scene = this;

			while ( scene.parent !== undefined ) {

				scene = scene.parent;

			}

			if ( scene !== undefined && scene instanceof THREE.Scene )  {

				scene.__addObject( object );

			}

		} else {
		
			console.error( "THREE.Object3D.add:", object, "is not an instance of THREE.Object3D." );
		
		}

		return this;	//返回包含Object3D对象的Object3D对象.

	},

	/*
	///remove方法用来将当前对象的子对象(参数object)删除
	/// NOTE:参数是多个Object3D对象.
	*/
	///<summary>remove</summary>
	///<param name ="object" type="Object3D">当前对象的子对象,Object3D对象</param>
	///<returns type="Object3D">返回新的Object3D对象</returns>
	remove: function ( object ) {

		if ( arguments.length > 1 ) {

			for ( var i = 0; i < arguments.length; i++ ) {

				this.remove( arguments[ i ] );

			}

		};

		var index = this.children.indexOf( object );

		if ( index !== - 1 ) {

			object.parent = undefined;
			object.dispatchEvent( { type: 'removed' } );

			this.children.splice( index, 1 );

			// remove from scene
			// 从场景中删除对象.

			var scene = this;

			while ( scene.parent !== undefined ) {

				scene = scene.parent;

			}

			if ( scene !== undefined && scene instanceof THREE.Scene ) {

				scene.__removeObject( object );

			}

		}

	},

	raycast: function () {},	//光线跟踪

	/*
	///traverse方法遍历当前对象以及子对象并且应用callback方法.
	*/
	///<summary>traverse</summary>
	///<param name ="callback" type="Function">要应用的方法</param>
	///<returns type="Object3D">返回新的Object3D对象</returns>
	traverse: function ( callback ) {

		callback( this );	//应用callback方法.

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {		//遍历所有子对象,递归调用traverse方法,应用callback方法.

			this.children[ i ].traverse( callback );

		}

	},

	/*
	///traverse方法遍历当前对象以及子对象并且当对象的Visible属性为true,应用callback方法.
	*/
	///<summary>traverse</summary>
	///<param name ="callback" type="Function">要应用的方法</param>
	///<returns type="Object3D">返回新的Object3D对象</returns>
	traverseVisible: function ( callback ) {

		if ( this.visible === false ) return;

		callback( this );

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {		//遍历所有子对象,递归调用traverseVisible方法,应用callback方法.

			this.children[ i ].traverseVisible( callback );

		}

	},

	/*
	///getObjectById方法通过id获得子对象.recursive默认为false,表示不才查找子对象的子对象.
	*/
	///<summary>getObjectById</summary>
	///<param name ="id" type="String">要应用的方法</param>
	///<param name ="recursive" type="Boolean">可选参数,true或者false</param>
	///<returns type="Object3D">返回id等于id的Object3D对象,没找到返回undefined</returns>
	getObjectById: function ( id, recursive ) {

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			var child = this.children[ i ];

			if ( child.id === id ) {

				return child;	//返回id等于id的Object3D对象

			}

			if ( recursive === true ) {

				child = child.getObjectById( id, recursive );

				if ( child !== undefined ) {

					return child;	//返回id等于id的Object3D对象

				}

			}

		}

		return undefined;	//没找到返回undefined.

	},

	/*
	///getObjectById方法通过name获得子对象.recursive默认为false,表示不才查找子对象的子对象.
	*/
	///<summary>getObjectById</summary>
	///<param name ="name" type="String">要应用的方法</param>
	///<param name ="recursive" type="Boolean">可选参数,true或者false</param>
	///<returns type="Object3D">返回name等于name的Object3D对象,没找到返回undefined</returns>
	getObjectByName: function ( name, recursive ) {

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			var child = this.children[ i ];

			if ( child.name === name ) {

				return child;	//返回name等于name的Object3D对象

			}

			if ( recursive === true ) {

				child = child.getObjectByName( name, recursive );

				if ( child !== undefined ) {

					return child;	//返回name等于name的Object3D对象

				}

			}

		}

		return undefined;	///没找到返回undefined

	},

	/*
	///getChildByName方法通过name获得子对象.recursive默认为false,表示不才查找子对象的子对象.
	///NOTE:getChildByName方法已经被getObjectByName方法替换,这里保留为了向后兼容.
	*/
	///<summary>getChildByName</summary>
	///<param name ="name" type="String">要应用的方法</param>
	///<param name ="recursive" type="Boolean">可选参数,true或者false</param>
	///<returns type="Object3D">返回name等于name的Object3D对象,没找到返回undefined</returns>
	getChildByName: function ( name, recursive ) {
		//提示用户getChildByName方法已经被getObjectByName方法替换,这里保留为了向后兼容.
		console.warn( 'THREE.Object3D: .getChildByName() has been renamed to .getObjectByName().' );
		return this.getObjectByName( name, recursive );	//调用getObjectByName()方法.

	},

	/*
	///updateMatrix方法对当前对象的matrix属性应用位移,旋转,缩放变换.
	*/
	///<summary>updateMatrix</summary>
	///<returns type="Object3D">返回新的Object3D对象</returns>	
	updateMatrix: function () {

		this.matrix.compose( this.position, this.quaternion, this.scale );	//对当前对象的matrix属性应用位移,旋转,缩放变换.

		this.matrixWorldNeedsUpdate = true;	//设置matrixWorldNeedsUpdate为true

	},

	/*
	///updateMatrixWorld方法对当前对象及其子对象的matrix属性应用全局位移,旋转,缩放变换.
	///NOTE: 在updateMatrixWorld方法中如果参数force为true,将对其子对象应用同样的全局变换.
	*/
	///<summary>updateMatrixWorld</summary>
	///<param name ="force" type="Boolean">true或者false</param>
	///<returns type="Object3D">返回新的Object3D对象</returns>		
	updateMatrixWorld: function ( force ) {

		if ( this.matrixAutoUpdate === true ) this.updateMatrix();

		if ( this.matrixWorldNeedsUpdate === true || force === true ) {

			if ( this.parent === undefined ) {

				this.matrixWorld.copy( this.matrix );

			} else {

				this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );

			}

			this.matrixWorldNeedsUpdate = false;

			force = true;

		}

		// update children
		// 更新子对象.

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			this.children[ i ].updateMatrixWorld( force );	//调用updateMatrixWorld方法,对子对象应用变换

		}

	},

	/*clone方法
	///clone方法克隆Object3D对象,如果参数force为true,克隆其子对象,否则只克隆当前对象,默认为true.
	///NOTE: 在clone方法中如果参数force为true,将对其子对象应用同样的全局变换,默认为true.
	*/
	///<summary>clone</summary>
	///<param name ="object" type="Object3D">接收克隆的Object3D对象</param>
	///<param name ="recursive" type="boolean">是否对子对象一一进行克隆</param>
	///<returns type="Object3D">返回克隆的Object3D对象</returns>	
	clone: function ( object, recursive ) {

		if ( object === undefined ) object = new THREE.Object3D();
		if ( recursive === undefined ) recursive = true;

		object.name = this.name;

		object.up.copy( this.up );

		object.position.copy( this.position );
		object.quaternion.copy( this.quaternion );
		object.scale.copy( this.scale );

		object.renderDepth = this.renderDepth;

		object.rotationAutoUpdate = this.rotationAutoUpdate;

		object.matrix.copy( this.matrix );
		object.matrixWorld.copy( this.matrixWorld );

		object.matrixAutoUpdate = this.matrixAutoUpdate;
		object.matrixWorldNeedsUpdate = this.matrixWorldNeedsUpdate;

		object.visible = this.visible;

		object.castShadow = this.castShadow;
		object.receiveShadow = this.receiveShadow;

		object.frustumCulled = this.frustumCulled;

		object.userData = JSON.parse( JSON.stringify( this.userData ) );

		if ( recursive === true ) {		//对子对象一一进行克隆.

			for ( var i = 0; i < this.children.length; i ++ ) {

				var child = this.children[ i ];
				object.add( child.clone() );

			}

		}

		return object;	//返回克隆的Object3D对象

	}

};
///EventDispatcher方法应用到当前Object3D对象.
THREE.EventDispatcher.prototype.apply( THREE.Object3D.prototype );
///设置全局的Object3D对象计数器.
THREE.Object3DIdCount = 0;
