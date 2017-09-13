
// File:src/math/Matrix4.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author jordi_ros / http://plattsoft.com
 * @author D1plo1d / http://github.com/D1plo1d
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author timknip / http://www.floorplanner.com/
 * @author bhouston / http://exocortex.com
 * @author WestLangley / http://github.com/WestLangley
 */
///Matrix4对象的构造函数.用来创建一个4x4矩阵.Matrix4对象的功能函数采用
///定义构造的函数原型对象来实现,实际就是一个数组.
///
///	用法: var m = new Matrix4(11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34, 41, 42, 43, 44)
///	创建一个4x4的矩阵,其实就是一个长度为16的数组,将参数(11, 12, 13, 21, 22, 23, 31, 32, 33, 41, 42, 43, 44)传递给数组用来初始化.
/// 一个变换矩阵可以执行任意的线形3D变换（例如，平移，旋转，缩放，切边等等）并且透视变换使用齐次坐标。
/// 脚本中很少使用矩阵：最常用Vector3，Quaternion，而且Transform类的功能更简单。单纯的矩阵用于特殊情况，如设置非标准相机投影。
///
///	NOTE: 参数 n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, 41, 42, 43, 44 代表4x4矩阵中的元素的值,n11表示矩阵的第一行,第一列的元素值
///
///<summary>Matrix4</summary>
///<param name ="n11" type="number">n11第 1 行,第 1 列的元素值</param>
///<param name ="n12" type="number">n12第 1 行,第 2 列的元素值</param>
///<param name ="n13" type="number">n13第 1 行,第 3 列的元素值</param>
///<param name ="n13" type="number">n13第 1 行,第 4 列的元素值</param>
///<param name ="n21" type="number">n21第 2 行,第 1 列的元素值</param>
///<param name ="n22" type="number">n22第 2 行,第 2 列的元素值</param>
///<param name ="n23" type="number">n23第 2 行,第 3 列的元素值</param>
///<param name ="n23" type="number">n23第 2 行,第 4 列的元素值</param>
///<param name ="n31" type="number">n31第 3 行,第 1 列的元素值</param>
///<param name ="n32" type="number">n32第 3 行,第 2 列的元素值</param>
///<param name ="n33" type="number">n33第 3 行,第 3 列的元素值</param>
///<param name ="n33" type="number">n33第 3 行,第 4 列的元素值</param>
///<param name ="n31" type="number">n31第 4 行,第 1 列的元素值</param>
///<param name ="n32" type="number">n32第 4 行,第 2 列的元素值</param>
///<param name ="n33" type="number">n33第 4 行,第 3 列的元素值</param>
///<param name ="n33" type="number">n33第 4 行,第 4 列的元素值</param>
///<returns type="Matrix4">返回新的4x4矩阵</returns>
THREE.Matrix4 = function ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {

	this.elements = new Float32Array( 16 );

	// TODO: 如果n11没有定义,Matrix4将被初始化为一个单位矩阵.如果n11定义了值,直接复制该值到矩阵中.
	// TODO: if n11 is undefined, then just set to identity, otherwise copy all other values into matrix
	// 我们不支持semi规范的Matrix4(4x4矩阵),semi规范很奇怪???(英语实在不过关)
	//   we should not support semi specification of Matrix4, it is just weird.

	var te = this.elements;

	te[ 0 ] = ( n11 !== undefined ) ? n11 : 1; te[ 4 ] = n12 || 0; te[ 8 ] = n13 || 0; te[ 12 ] = n14 || 0;
	te[ 1 ] = n21 || 0; te[ 5 ] = ( n22 !== undefined ) ? n22 : 1; te[ 9 ] = n23 || 0; te[ 13 ] = n24 || 0;
	te[ 2 ] = n31 || 0; te[ 6 ] = n32 || 0; te[ 10 ] = ( n33 !== undefined ) ? n33 : 1; te[ 14 ] = n34 || 0;
	te[ 3 ] = n41 || 0; te[ 7 ] = n42 || 0; te[ 11 ] = n43 || 0; te[ 15 ] = ( n44 !== undefined ) ? n44 : 1;	//初始化Matrix4(4x4矩阵)对象.

};

/****************************************
****下面是Matrix4对象提供的功能函数.
****************************************/
THREE.Matrix4.prototype = {

	constructor: THREE.Matrix4,	//构造器,返回对创建此对象的Matrix4函数的引用

	/*
	///set方法用来重新设置Matrix4(4x4矩阵)的元素值.并返回新的坐标值的Matrix4(4x4矩阵).
	/// TODO:修改set方法,兼容 n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, 41, 42, 43, 44 参数省略支持多态.
	*/
	///<summary>set</summary>
	///<param name ="n11" type="number">n11第 1 行,第 1 列的元素值</param>
	///<param name ="n12" type="number">n12第 1 行,第 2 列的元素值</param>
	///<param name ="n13" type="number">n13第 1 行,第 3 列的元素值</param>
	///<param name ="n13" type="number">n13第 1 行,第 4 列的元素值</param>
	///<param name ="n21" type="number">n21第 2 行,第 1 列的元素值</param>
	///<param name ="n22" type="number">n22第 2 行,第 2 列的元素值</param>
	///<param name ="n23" type="number">n23第 2 行,第 3 列的元素值</param>
	///<param name ="n23" type="number">n23第 2 行,第 4 列的元素值</param>
	///<param name ="n31" type="number">n31第 3 行,第 1 列的元素值</param>
	///<param name ="n32" type="number">n32第 3 行,第 2 列的元素值</param>
	///<param name ="n33" type="number">n33第 3 行,第 3 列的元素值</param>
	///<param name ="n33" type="number">n33第 3 行,第 4 列的元素值</param>
	///<param name ="n31" type="number">n31第 4 行,第 1 列的元素值</param>
	///<param name ="n32" type="number">n32第 4 行,第 2 列的元素值</param>
	///<param name ="n33" type="number">n33第 4 行,第 3 列的元素值</param>
	///<param name ="n33" type="number">n33第 4 行,第 4 列的元素值</param>
	///<returns type="Matrix4">返回新的4x4矩阵</returns>
	set: function ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {

		var te = this.elements;

		te[ 0 ] = n11; te[ 4 ] = n12; te[ 8 ] = n13; te[ 12 ] = n14;
		te[ 1 ] = n21; te[ 5 ] = n22; te[ 9 ] = n23; te[ 13 ] = n24;
		te[ 2 ] = n31; te[ 6 ] = n32; te[ 10 ] = n33; te[ 14 ] = n34;
		te[ 3 ] = n41; te[ 7 ] = n42; te[ 11 ] = n43; te[ 15 ] = n44;

		return this;	//返回新的4x4矩阵

	},

	/*
	///identity方法用来获得一个4x4矩阵的单位矩阵
	///
	/// NOTE:在矩阵的乘法中，有一种矩阵起着特殊的作用，如同数的乘法中的1,我们称这种矩阵为单位矩阵
	/// 	 它是个方阵，从左上角到右下角的对角线（称为主对角线）上的元素均为1以外全都为0。
	/// 	 对于单位矩阵，有AE=EA=A
	*/
	///<summary>identity</summary>
	///<returns type="Matrix4(4x4矩阵)">返回4x4矩阵的一个单位矩阵</returns>	
	identity: function () {

		this.set(

			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1

		);

		return this;	//返回4x4矩阵的一个单位矩阵

	},

	/*
	///copy方法用来复制4x4矩阵的元素值.并返回新的Matrix4(4x4矩阵).
	*/
	///<summary>copy</summary>
	///<param name ="m" type="Matrix4(4x4矩阵)">Matrix4(4x4矩阵)</param>
	///<returns type="Matrix4(4x4矩阵)">返回新的Matrix4(4x4矩阵)</returns>	
	copy: function ( m ) {

		this.elements.set( m.elements );

		return this;	//返回新的Matrix4(4x4矩阵)

	},

	/*
	///extractPosition方法用来复制参数m(4x4矩阵)的平移分量.并返回新的Matrix4(4x4矩阵).
	/// NOTE: extractPosition方法已经被重命名为.copyPosition()
	*/
	///<summary>extractPosition</summary>
	///<param name ="m" type="Matrix4(4x4矩阵)">Matrix4(4x4矩阵)</param>
	///<returns type="Matrix4(4x4矩阵)">返回新的Matrix4(4x4矩阵)</returns>	
	extractPosition: function ( m ) {

		console.warn( 'THREEMatrix4: .extractPosition() has been renamed to .copyPosition().' );
		return this.copyPosition( m );	//调用copyPosition()方法,返回新的Matrix4(4x4矩阵)

	},

	/*
	///copyPosition方法用来复制参数m(4x4矩阵)的平移分量.并返回新的Matrix4(4x4矩阵).
	*/
	///<summary>copyPosition</summary>
	///<param name ="m" type="Matrix4(4x4矩阵)">Matrix4(4x4矩阵)</param>
	///<returns type="Matrix4(4x4矩阵)">返回新的Matrix4(4x4矩阵)</returns>	
	copyPosition: function ( m ) {

		var te = this.elements;
		var me = m.elements;

		te[ 12 ] = me[ 12 ];
		te[ 13 ] = me[ 13 ];
		te[ 14 ] = me[ 14 ];

		return this;	//返回新的Matrix4(4x4矩阵)

	},

	/*
	///extractRotation方法用来提取参数m(4x4矩阵)的旋转分量.并返回新的Matrix4(4x4矩阵).
	*/
	///<summary>extractRotation</summary>
	///<param name ="m" type="Matrix4(4x4矩阵)">Matrix4(4x4矩阵)</param>
	///<returns type="Matrix4(4x4矩阵)">返回新的Matrix4(4x4矩阵)</returns>	
	extractRotation: function () {

		var v1 = new THREE.Vector3();

		return function ( m ) {

			var te = this.elements;
			var me = m.elements;

			var scaleX = 1 / v1.set( me[ 0 ], me[ 1 ], me[ 2 ] ).length();
			var scaleY = 1 / v1.set( me[ 4 ], me[ 5 ], me[ 6 ] ).length();
			var scaleZ = 1 / v1.set( me[ 8 ], me[ 9 ], me[ 10 ] ).length();

			te[ 0 ] = me[ 0 ] * scaleX;
			te[ 1 ] = me[ 1 ] * scaleX;
			te[ 2 ] = me[ 2 ] * scaleX;

			te[ 4 ] = me[ 4 ] * scaleY;
			te[ 5 ] = me[ 5 ] * scaleY;
			te[ 6 ] = me[ 6 ] * scaleY;

			te[ 8 ] = me[ 8 ] * scaleZ;
			te[ 9 ] = me[ 9 ] * scaleZ;
			te[ 10 ] = me[ 10 ] * scaleZ;

			return this;	//返回新的Matrix4(4x4矩阵)

		};

	}(),

	/*
	///applyEuler方法通过欧拉旋转(参数euler)对Matrix4(4x4矩阵)应用旋转变换.
	*/
	///<summary>applyEuler</summary>
	///<param name ="euler" type="THREE.Euler">THREE.Euler对象,欧拉对象</param>
	///<returns type="Matrix4">返回变换后的Matrix4(4x4矩阵)</returns>
	makeRotationFromEuler: function ( euler ) {

		if ( euler instanceof THREE.Euler === false ) {

			console.error( 'THREE.Matrix: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.' );

		}

		var te = this.elements;

		var x = euler.x, y = euler.y, z = euler.z;
		var a = Math.cos( x ), b = Math.sin( x );
		var c = Math.cos( y ), d = Math.sin( y );
		var e = Math.cos( z ), f = Math.sin( z );

		if ( euler.order === 'XYZ' ) {

			var ae = a * e, af = a * f, be = b * e, bf = b * f;

			te[ 0 ] = c * e;
			te[ 4 ] = - c * f;
			te[ 8 ] = d;

			te[ 1 ] = af + be * d;
			te[ 5 ] = ae - bf * d;
			te[ 9 ] = - b * c;

			te[ 2 ] = bf - ae * d;
			te[ 6 ] = be + af * d;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'YXZ' ) {

			var ce = c * e, cf = c * f, de = d * e, df = d * f;

			te[ 0 ] = ce + df * b;
			te[ 4 ] = de * b - cf;
			te[ 8 ] = a * d;

			te[ 1 ] = a * f;
			te[ 5 ] = a * e;
			te[ 9 ] = - b;

			te[ 2 ] = cf * b - de;
			te[ 6 ] = df + ce * b;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'ZXY' ) {

			var ce = c * e, cf = c * f, de = d * e, df = d * f;

			te[ 0 ] = ce - df * b;
			te[ 4 ] = - a * f;
			te[ 8 ] = de + cf * b;

			te[ 1 ] = cf + de * b;
			te[ 5 ] = a * e;
			te[ 9 ] = df - ce * b;

			te[ 2 ] = - a * d;
			te[ 6 ] = b;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'ZYX' ) {

			var ae = a * e, af = a * f, be = b * e, bf = b * f;

			te[ 0 ] = c * e;
			te[ 4 ] = be * d - af;
			te[ 8 ] = ae * d + bf;

			te[ 1 ] = c * f;
			te[ 5 ] = bf * d + ae;
			te[ 9 ] = af * d - be;

			te[ 2 ] = - d;
			te[ 6 ] = b * c;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'YZX' ) {

			var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

			te[ 0 ] = c * e;
			te[ 4 ] = bd - ac * f;
			te[ 8 ] = bc * f + ad;

			te[ 1 ] = f;
			te[ 5 ] = a * e;
			te[ 9 ] = - b * e;

			te[ 2 ] = - d * e;
			te[ 6 ] = ad * f + bc;
			te[ 10 ] = ac - bd * f;

		} else if ( euler.order === 'XZY' ) {

			var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

			te[ 0 ] = c * e;
			te[ 4 ] = - f;
			te[ 8 ] = d * e;

			te[ 1 ] = ac * f + bd;
			te[ 5 ] = a * e;
			te[ 9 ] = ad * f - bc;

			te[ 2 ] = bc * f - ad;
			te[ 6 ] = b * e;
			te[ 10 ] = bd * f + ac;

		}
		//最后一列
		// last column
		te[ 3 ] = 0;
		te[ 7 ] = 0;
		te[ 11 ] = 0;

		//最下面的一行
		// bottom row
		te[ 12 ] = 0;
		te[ 13 ] = 0;
		te[ 14 ] = 0;
		te[ 15 ] = 1;

		return this;	//返回变换后的Matrix4(4x4矩阵)

	},

	/*
	///setRotationFromQuaternion方法通过四元数对Matrix4(4x4矩阵)应用旋转变换.
	/// NOTE: setRotationFromQuaternion()方法已经被重命名为makeRotationFromQuaternion(),这里保留是为了向下兼容.
	*/
	///<summary>setRotationFromQuaternion</summary>
	///<param name ="q" type="Quaternion">四元数</param>
	///<returns type="Matrix4(4x4矩阵)">返回新的Matrix4(4x4矩阵)</returns>
	setRotationFromQuaternion: function ( q ) {

		console.warn( 'THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion().' );

		return this.makeRotationFromQuaternion( q );	//调用makeRotationFromQuaternion()方法,应用旋转变换,并返回新的Matrix4(4x4矩阵)对象.

	},

	/*
	///makeRotationFromQuaternion方法通过四元数对Matrix4(4x4矩阵)应用旋转变换.
	*/
	///<summary>setRotationFromQuaternion</summary>
	///<param name ="q" type="Quaternion">四元数</param>
	///<returns type="Matrix4(4x4矩阵)">返回新的Matrix4(4x4矩阵)</returns>
	makeRotationFromQuaternion: function ( q ) {

		var te = this.elements;

		var x = q.x, y = q.y, z = q.z, w = q.w;
		var x2 = x + x, y2 = y + y, z2 = z + z;
		var xx = x * x2, xy = x * y2, xz = x * z2;
		var yy = y * y2, yz = y * z2, zz = z * z2;
		var wx = w * x2, wy = w * y2, wz = w * z2;

		te[ 0 ] = 1 - ( yy + zz );
		te[ 4 ] = xy - wz;
		te[ 8 ] = xz + wy;

		te[ 1 ] = xy + wz;
		te[ 5 ] = 1 - ( xx + zz );
		te[ 9 ] = yz - wx;

		te[ 2 ] = xz - wy;
		te[ 6 ] = yz + wx;
		te[ 10 ] = 1 - ( xx + yy );

		//最后一列
		// last column
		te[ 3 ] = 0;
		te[ 7 ] = 0;
		te[ 11 ] = 0;

		//最后一行
		// bottom row
		te[ 12 ] = 0;
		te[ 13 ] = 0;
		te[ 14 ] = 0;
		te[ 15 ] = 1;

		return this;	//返回新的Matrix4(4x4矩阵)

	},

	/*
	///lookAt(eye,center,up)将对象设定为一个视图矩阵，参数都是Vector3对象，该矩阵只会用到eye和center的相对位置。
	///该视图矩阵表示，摄像机在eye位置看向center位置，且向上的向量（这一点稍后解释）为up时的视图矩阵。
	///视图矩阵又可以看做摄像机的模型矩阵，所以该函数产生的矩阵又可以表示以下变换：将物体从原点平移至位置center-eye，
	///再将其旋转至向上的向量为up。向上的向量up用来固定相机，可以想象当相机固定在一点，镜头朝向固定方向的时候，
	///还是可以在一个维度里自由旋转的，up向量固定相机的这个维度。
	///这里的解释摘抄自:http://www.cnblogs.com/yiyezhai/archive/2012/11/29/2791319.html
	*/
	///<summary>lookAt</summary>
	///<param name ="eye" type="Vector3">表示相机位置的Vector3三维向量</param>
	///<param name ="target" type="Vector3">表示目标的Vector3三维向量</param>
	///<param name ="up" type="Vector3">表示向上的Vector3三维向量</param>
	///<returns type="Matrix4(4x4矩阵)">返回新的Matrix4(4x4矩阵)</returns>
	lookAt: function () {

		var x = new THREE.Vector3();
		var y = new THREE.Vector3();
		var z = new THREE.Vector3();

		return function ( eye, target, up ) {

			var te = this.elements;

			z.subVectors( eye, target ).normalize();

			if ( z.length() === 0 ) {

				z.z = 1;

			}

			x.crossVectors( up, z ).normalize();

			if ( x.length() === 0 ) {

				z.x += 0.0001;
				x.crossVectors( up, z ).normalize();

			}

			y.crossVectors( z, x );


			te[ 0 ] = x.x; te[ 4 ] = y.x; te[ 8 ] = z.x;
			te[ 1 ] = x.y; te[ 5 ] = y.y; te[ 9 ] = z.y;
			te[ 2 ] = x.z; te[ 6 ] = y.z; te[ 10 ] = z.z;

			return this;	//返回新的Matrix4(4x4矩阵)

		};

	}(),

	/*
	///multiply方法用来将当前Matrix4(4x4矩阵)与参数m相乘.并返回新的Matrix4(4x4矩阵)
	/// NOTE:这里只接受一个参数,如果传递两个参数请使用.multiplyMatrices( a, b )方法替代,如果有两个参数会自动调用.multiplyMatrices( a, b )方法
	*/
	///<summary>multiply</summary>
	///<param name ="m" type="Matrix4(4x4矩阵)">与当前对象元素值相乘的Matrix4(4x4矩阵)</param>
	///<param name ="n" type="Matrix4(4x4矩阵)">判断是否有第二个参数w,如果有的话,调用.multiplyMatrices()方法</param>
	///<returns type="Matrix4(4x4矩阵)">返回新的Matrix4(4x4矩阵)</returns>
	multiply: function ( m, n ) {

		if ( n !== undefined ) {	//判断是否有第二个参数w,如果有的话,调用.multiplyMatrices()方法

			// NOTE:这里只接受一个参数,如果传递两个参数请使用.multiplyMatrices( a, b )方法替代,
			console.warn( 'THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead.' );
			return this.multiplyMatrices( m, n );	//调用.multiplyMatrices()方法,返回新的Matrix4(4x4矩阵),矩阵m和矩阵n相乘

		}

		return this.multiplyMatrices( this, m );	//调用.multiplyMatrices()方法,返回新的Matrix4(4x4矩阵),当前矩阵和矩阵m相乘

	},

	/*
	///multiply方法用来将矩阵a,b相乘,并返回新的Matrix4(4x4矩阵).
	*/
	///<summary>multiplyMatrices</summary>
	///<param name ="a" type="Matrix4(4x4矩阵)">Matrix4(4x4矩阵)</param>
	///<param name ="b" type="Matrix4(4x4矩阵)">Matrix4(4x4矩阵)</param>
	///<returns type="Matrix4(4x4矩阵)">返回新的Matrix4(4x4矩阵)</returns>
	multiplyMatrices: function ( a, b ) {

		var ae = a.elements;
		var be = b.elements;
		var te = this.elements;

		//将矩阵a,b相乘.
		var a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
		var a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
		var a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
		var a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];

		var b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
		var b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
		var b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
		var b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];

		te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		te[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		te[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		te[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

		te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		te[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		te[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		te[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

		te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		te[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		te[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		te[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

		te[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		te[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		te[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		te[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

		return this;	//返回新的Matrix4(4x4矩阵)

	},

	/*
	///multiply方法用来将矩阵a,b相乘,并返回新Matrix4(4x4矩阵)赋值给数组对象r
	*/
	///<summary>multiplyMatrices</summary>
	///<param name ="a" type="Matrix4(4x4矩阵)">Matrix4(4x4矩阵)</param>
	///<param name ="b" type="Matrix4(4x4矩阵)">Matrix4(4x4矩阵)</param>
	///<param name ="r" type="Array">数组对象</param>
	///<returns type="Array">返回新Matrix4(4x4矩阵)</returns>
	multiplyToArray: function ( a, b, r ) {

		var te = this.elements;

		this.multiplyMatrices( a, b );	//矩阵a,b相乘

		//新Matrix4(4x4矩阵)赋值给数组对象
		r[ 0 ] = te[ 0 ]; r[ 1 ] = te[ 1 ]; r[ 2 ] = te[ 2 ]; r[ 3 ] = te[ 3 ];
		r[ 4 ] = te[ 4 ]; r[ 5 ] = te[ 5 ]; r[ 6 ] = te[ 6 ]; r[ 7 ] = te[ 7 ];
		r[ 8 ]  = te[ 8 ]; r[ 9 ]  = te[ 9 ]; r[ 10 ] = te[ 10 ]; r[ 11 ] = te[ 11 ];
		r[ 12 ] = te[ 12 ]; r[ 13 ] = te[ 13 ]; r[ 14 ] = te[ 14 ]; r[ 15 ] = te[ 15 ];

		return this;	//返回新Matrix4(4x4矩阵)

	},


	/*
	///multiplyScalar方法用来将Matrix4(4x4矩阵)的元素直接与参数s相乘.并返回新的Matrix4(4x4矩阵).
	/// NOTE:这里传递的参数s是一个标量.
	*/
	///<summary>multiplyScalar</summary>
	///<param name ="s" type="number">与当前Matrix4(4x4矩阵)对象的值相乘的标量,数值</param>
	///<returns type="Matrix4">返回新的Matrix4(4x4矩阵)</returns>
	multiplyScalar: function ( s ) {

		var te = this.elements;

		te[ 0 ] *= s; te[ 4 ] *= s; te[ 8 ] *= s; te[ 12 ] *= s;
		te[ 1 ] *= s; te[ 5 ] *= s; te[ 9 ] *= s; te[ 13 ] *= s;
		te[ 2 ] *= s; te[ 6 ] *= s; te[ 10 ] *= s; te[ 14 ] *= s;
		te[ 3 ] *= s; te[ 7 ] *= s; te[ 11 ] *= s; te[ 15 ] *= s;

		return this;	//返回新的Matrix4(4x4矩阵)

	},

	/*
	///multiplyVector3方法用来将3x3矩阵和一个Vector3(三维向量)相乘.并返回新Matrix4(4x4矩阵)对象.
	/// NOTE:multiplyVector3方法已经被删除使用vector.applyMatrix4( matrix )方法替换,这里保留是为了向下兼容.
	/// NOTE:multiplyVector3方法经常用来应用某种变换.
	*/
	///<summary>multiplyVector3</summary>
	///<param name ="vector" type="Vector3">三维向量</param>
	///<returns type="Matrix4">并返回新的Matrix4(4x4矩阵)对象</returns>
	multiplyVector3: function ( vector ) {

	// 提示用户multiplyVector3方法已经被删除使用vector.applyMatrix4( matrix )方法替换,这里保留是为了向下兼容.
		console.warn( 'THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) or vector.applyProjection( matrix ) instead.' );
		return vector.applyProjection( this );	//并返回新的Matrix4(4x4矩阵)对象

	},

	/*
	///multiplyVector4方法用来将3x3矩阵和一个Vector4(四维向量)相乘.并返回新Matrix4(4x4矩阵)对象.
	/// NOTE:multiplyVector4方法已经被删除使用vector.applyMatrix4( matrix )方法替换,这里保留是为了向下兼容.
	/// NOTE:multiplyVector4方法经常用来应用某种变换.
	*/
	///<summary>multiplyVector4</summary>
	///<param name ="vector" type="Vector4">四维向量</param>
	///<returns type="Matrix4">并返回新的Matrix4(4x4矩阵)对象</returns>
	multiplyVector4: function ( vector ) {
	
		// 提示用户multiplyVector4方法已经被删除使用vector.applyMatrix4( matrix )方法替换,这里保留是为了向下兼容.
		console.warn( 'THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead.' );
		return vector.applyMatrix4( this );	//并返回新的Matrix4(4x4矩阵)对象

	},

	/*
	///multiplyVector3Array方法用来将数组a和一个Vector3(三维向量)相乘.并返回新的数组对象.
	/// NOTE:multiplyVector3Array方法已经被删除使用matrix.applyToVector3Array( array )方法替换,这里保留是为了向下兼容.
	/// NOTE:multiplyVector3Array方法经常用来应用某种变换.
	*/
	///<summary>multiplyVector3Array</summary>
	///<param name ="a" type="Array">数组对象</param>
	///<returns type="Array">并返回新的数组对象</returns>
	multiplyVector3Array: function ( a ) {

		// 提示用户multiplyVector3Array方法已经被删除使用matrix.applyToVector3Array( array )方法替换,这里保留是为了向下兼容.
		console.warn( 'THREE.Matrix4: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.' );
		return this.applyToVector3Array( a );	//并返回新的Matrix4(4x4矩阵)对象

	},


	/*
	///applyToVector3Array方法用来将当前矩阵应用到一个三维向量,并将结果转换成一个数组,返回数组对象.
	/// NOTE:applyToVector3Array方法经常用来对三维向量应用某种变换.	参数offset,length用来对不同长度的数组应用变换.
	///
	*/
	///<summary>applyMatrix4</summary>
	///<param name ="array" type="Array">数组对象</param>
	///<param name ="offset" type="Number">偏移量</param>
	///<param name ="length" type="Number">长度</param>
	///<returns type="Array">并返回新的数组对象</returns>
	applyToVector3Array: function () {

		var v1 = new THREE.Vector3();

		return function ( array, offset, length ) {

			if ( offset === undefined ) offset = 0;
			if ( length === undefined ) length = array.length;

			for ( var i = 0, j = offset, il; i < length; i += 3, j += 3 ) {

				v1.x = array[ j ];
				v1.y = array[ j + 1 ];
				v1.z = array[ j + 2 ];

				v1.applyMatrix4( this );	

				array[ j ]     = v1.x;
				array[ j + 1 ] = v1.y;
				array[ j + 2 ] = v1.z;

			}

			return array;	//并返回新的数组对象

		};

	}(),


	/*
	///rotateAxis方法对参数v三维向量的应用一个旋转变换
	/// NOTE:rotateAxis方法已经被删除使用Vector3.transformDirection( matrix )方法替换,这里保留是为了向下兼容.
	*/
	///<summary>rotateAxis</summary>
	///<param name ="v" type="Vector3">仿射矩阵</param>
	///<returns type="Vector3">返回新坐标值的三维向量</returns>
	rotateAxis: function ( v ) {

		//提示用户rotateAxis方法已经被删除使用Vector3.transformDirection( matrix )方法替换,这里保留是为了向下兼容.
		console.warn( 'THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead.' );

		v.transformDirection( this );	//调用Vector3.transformDirection( matrix ) 方法,对向量应用旋转变换

	},


	/*crossVector方法
	///crossVector方法将返回两个交叉乘积,调用者变为a，b的叉乘。叉乘是一个向量，垂直于参与叉乘的两个向量并呈右手螺旋法则。
	/// 返回为同时垂直于两个参数向量的向量，方向可朝上也可朝下，由两向量夹角的方向决定。
	/// NOTE:crossVector方法已经被删除使用vector.applyMatrix4( matrix )方法替换,这里保留是为了向下兼容.
	/// NOTE:借助右手定则辅助判断方向。参考:http://zh.wikipedia.org/zh/%E5%90%91%E9%87%8F%E7%A7%AF
	/// 叉乘是一种在向量空间中向量的二元运算。与点乘不同，它的运算结果是一个伪向量而不是一个标量。
	/// 叉乘的运算结果叫叉积（即交叉乘积）、外积或向量积。叉积与原来的两个向量都垂直。
		 1、理论知识
		   数学上的定义：c=axb【注：粗体小写字母表示向量】其中a,b,c均为向量。即两个向量的叉积得到的还是向量！
		   性质1：c⊥a，c⊥b，即向量c垂直与向量a,b所在的平面。
		   性质2：模长|c|=|a||b|sin<a,b>
		   性质3：满足右手法则。从这点我们有axb ≠ bxa，而axb = - bxa。所以我们可以使用叉积的正负值来判断向量a，b的相对位置，
		   		  即向量b是处于向量a的顺时针方向还是逆时针方向。
	*/
	///<summary>crossVector</summary>
	///<param name ="vector" type="Vector3">三维向量</param>
	///<returns type="Vector3">三维向量</returns>	
	crossVector: function ( vector ) {

		//提示用户crossVector方法已经被删除使用vector.applyMatrix4( matrix )方法替换,这里保留是为了向下兼容.
		console.warn( 'THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead.' );
		return vector.applyMatrix4( this );	//调用Vector3.applyMatrix4( matrix ) 方法,返回参数vector和当前矩阵的差乘.

	},

	/*
	///determinant方法用来获得Matrix4(4x4矩阵)的行列式
	/// NOTE:通过求解行列式值的方式来判断矩阵的逆矩阵是否存在(行列式的值不等于0,表示该矩阵有逆矩阵).
	*/
	///<summary>determinant</summary>
	///<returns type="Number">返回Matrix4(4x4矩阵)的四阶行列式</returns>
	determinant: function () {

		var te = this.elements;

		var n11 = te[ 0 ], n12 = te[ 4 ], n13 = te[ 8 ], n14 = te[ 12 ];
		var n21 = te[ 1 ], n22 = te[ 5 ], n23 = te[ 9 ], n24 = te[ 13 ];
		var n31 = te[ 2 ], n32 = te[ 6 ], n33 = te[ 10 ], n34 = te[ 14 ];
		var n41 = te[ 3 ], n42 = te[ 7 ], n43 = te[ 11 ], n44 = te[ 15 ];

		//TODO: make this more efficient
		//( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

		return (
			n41 * (
				+ n14 * n23 * n32
				 - n13 * n24 * n32
				 - n14 * n22 * n33
				 + n12 * n24 * n33
				 + n13 * n22 * n34
				 - n12 * n23 * n34
			) +
			n42 * (
				+ n11 * n23 * n34
				 - n11 * n24 * n33
				 + n14 * n21 * n33
				 - n13 * n21 * n34
				 + n13 * n24 * n31
				 - n14 * n23 * n31
			) +
			n43 * (
				+ n11 * n24 * n32
				 - n11 * n22 * n34
				 - n14 * n21 * n32
				 + n12 * n21 * n34
				 + n14 * n22 * n31
				 - n12 * n24 * n31
			) +
			n44 * (
				- n13 * n22 * n31
				 - n11 * n23 * n32
				 + n11 * n22 * n33
				 + n13 * n21 * n32
				 - n12 * n21 * n33
				 + n12 * n23 * n31
			)	//返回Matrix4(4x4矩阵)的四阶行列式

		);

	},

	/*
	///transpose方法用来获得Matrix4(4x4矩阵)的转置矩阵.
	/// NOTE:一个mxn的矩阵的转置矩阵式nxm矩阵,就是矩阵的行和列交换.
	/// 	例如:
	///			 
	///				--     -- 		--     -- T
	///				| 1 2 3 |		| 1 4 7 |
	///	matrix A =	| 4 5 6 |  = 	| 2 5 8 |
	///				| 7 8 9 |		| 3 6 9 |
	///				--     --		--     --
	*/
	///<summary>transpose</summary>
	///<returns type="Matrix4">返回Matrix4(4x4矩阵)的转置矩阵.</returns>
	transpose: function () {

		var te = this.elements;
		var tmp;

		tmp = te[ 1 ]; te[ 1 ] = te[ 4 ]; te[ 4 ] = tmp;
		tmp = te[ 2 ]; te[ 2 ] = te[ 8 ]; te[ 8 ] = tmp;
		tmp = te[ 6 ]; te[ 6 ] = te[ 9 ]; te[ 9 ] = tmp;

		tmp = te[ 3 ]; te[ 3 ] = te[ 12 ]; te[ 12 ] = tmp;
		tmp = te[ 7 ]; te[ 7 ] = te[ 13 ]; te[ 13 ] = tmp;
		tmp = te[ 11 ]; te[ 11 ] = te[ 14 ]; te[ 14 ] = tmp;

		return this;	//返回Matrix4(4x4矩阵)的转置矩阵.

	},

	/*
	///flattenToArrayOffset方法通过参数offset指定偏移量,将矩阵展开到数组(参数array)中,返回新的数组.
	/// NOTE:flattenToArrayOffset方法可以用在将3x3矩阵变换成4x4矩阵中.
	///				--     --
	///				| 1 2 3 |
	///	matrix A =	| 4 5 6 |  => flattenToArrayOffset(arrary,3) => array(0,0,0,0,1,2,3,0,0,0,0,4,5,6,0,0,0,0,7,8,9)
	///				| 7 8 9 |
	///				--     --
	*/
	///<summary>flattenToArrayOffset</summary>
	///<param name ="array" type="Array">Array数组对象</param>
	///<param name ="offset" type="Number">偏移量</param>
	///<returns type="Matrix4">返回包含矩阵元素的数组</returns>
	flattenToArrayOffset: function ( array, offset ) {

		var te = this.elements;

		array[ offset     ] = te[ 0 ];
		array[ offset + 1 ] = te[ 1 ];
		array[ offset + 2 ] = te[ 2 ];
		array[ offset + 3 ] = te[ 3 ];

		array[ offset + 4 ] = te[ 4 ];
		array[ offset + 5 ] = te[ 5 ];
		array[ offset + 6 ] = te[ 6 ];
		array[ offset + 7 ] = te[ 7 ];

		array[ offset + 8 ]  = te[ 8 ];
		array[ offset + 9 ]  = te[ 9 ];
		array[ offset + 10 ] = te[ 10 ];
		array[ offset + 11 ] = te[ 11 ];

		array[ offset + 12 ] = te[ 12 ];
		array[ offset + 13 ] = te[ 13 ];
		array[ offset + 14 ] = te[ 14 ];
		array[ offset + 15 ] = te[ 15 ];

		return array;	//返回包含矩阵元素的数组

	},

	/*
	///getPosition方法将当前矩阵中代表位置的元素值设置给三维向量
	/// NOTE:getPosition方法已经被删除使用vector.setFromMatrixPosition( matrix )方法替换,这里保留是为了向下兼容.
	*/
	///<summary>getPosition</summary>
	///<returns type="Vector3">返回三维向量</returns>
	getPosition: function () {

		var v1 = new THREE.Vector3();

		return function () {

			console.warn( 'THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead.' );

			var te = this.elements;
			return v1.set( te[ 12 ], te[ 13 ], te[ 14 ] );	//返回三维向量

		};

	}(),

	/*
	///setPosition方法将当前矩阵中代表位置的元素值设置给三维向量
	*/
	///<summary>setPosition</summary>
	///<param name ="v" type="Vector3">偏移量</param>
	///<returns type="Matrix4">返回新的Matrix4(4x4矩阵)</returns>
	setPosition: function ( v ) {

		var te = this.elements;

		te[ 12 ] = v.x;
		te[ 13 ] = v.y;
		te[ 14 ] = v.z;

		return this;	//返回新的Matrix4(4x4矩阵)

	},

	/*
	///getInverse方法用来获得Matrix4(4x4矩阵)的逆矩阵.
	/// NOTE:逆矩阵与当前矩阵相乘得到单位矩阵.
	*/
	///<summary>multiplyScalar</summary>
	///<param name ="matrix" type="Matrix4">THREE.Matrix4</param>
	///<param name ="throwOnInvertible" type="Number">异常标志</param>
	///<returns type="Matrix4">返回Matrix4(4x4矩阵)的逆矩阵.</returns>
	getInverse: function ( m, throwOnInvertible ) {

		// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
		var te = this.elements;
		var me = m.elements;

		var n11 = me[ 0 ], n12 = me[ 4 ], n13 = me[ 8 ], n14 = me[ 12 ];
		var n21 = me[ 1 ], n22 = me[ 5 ], n23 = me[ 9 ], n24 = me[ 13 ];
		var n31 = me[ 2 ], n32 = me[ 6 ], n33 = me[ 10 ], n34 = me[ 14 ];
		var n41 = me[ 3 ], n42 = me[ 7 ], n43 = me[ 11 ], n44 = me[ 15 ];

		te[ 0 ] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
		te[ 4 ] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
		te[ 8 ] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
		te[ 12 ] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
		te[ 1 ] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
		te[ 5 ] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
		te[ 9 ] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
		te[ 13 ] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
		te[ 2 ] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
		te[ 6 ] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
		te[ 10 ] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
		te[ 14 ] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
		te[ 3 ] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
		te[ 7 ] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
		te[ 11 ] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
		te[ 15 ] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

		var det = n11 * te[ 0 ] + n21 * te[ 4 ] + n31 * te[ 8 ] + n41 * te[ 12 ];	//获得参数matrix行列式的值

		if ( det == 0 ) {		// 没有逆矩阵


			var msg = "Matrix4.getInverse(): can't invert matrix, determinant is 0";	//提示用户该矩阵没有逆矩阵

			if ( throwOnInvertible || false ) {

				throw new Error( msg );

			} else {

				console.warn( msg );

			}

			this.identity();	//获得一个单位矩阵

			return this;	//返回单位矩阵
		}

		this.multiplyScalar( 1 / det );	//除以行列式得到逆矩阵

		return this;	//返回Matrix4(4x4矩阵)的逆矩阵.

	},

	/*
	///translate方法用来变换Matrix4(4x4矩阵).
	/// NOTE:translate方法已经删除.
	*/
	///<summary>translate</summary>
	///<param name ="v" type="Vector3">THREE.Vecter3</param>
	///<returns type="Matrix4">返回带有新位置信息的Matrix4(4x4矩阵).</returns>
	translate: function ( v ) {
		//提示用户translate()方法已经删除.
		console.warn( 'THREE.Matrix4: .translate() has been removed.' );

	},

	/*
	///rotateX方法用来变换Matrix4(4x4矩阵)的x轴.
	/// NOTE:rotateX方法已经删除.
	*/
	///<summary>rotateX</summary>
	///<param name ="angle" type="Number">角度</param>
	///<returns type="Matrix4">返回带有新的Matrix4(4x4矩阵).</returns>
	rotateX: function ( angle ) {
		//提示用户rotateX()方法已经删除.
		console.warn( 'THREE.Matrix4: .rotateX() has been removed.' );

	},

	/*
	///rotateY方法用来变换Matrix4(4x4矩阵)的Y轴.
	/// NOTE:rotateX方法已经删除.
	*/
	///<summary>rotateY</summary>
	///<param name ="angle" type="Number">角度</param>
	///<returns type="Matrix4">返回带有新的Matrix4(4x4矩阵).</returns>
	rotateY: function ( angle ) {
		//提示用户rotateY()方法已经删除.
		console.warn( 'THREE.Matrix4: .rotateY() has been removed.' );

	},

	/*
	///rotateZ方法用来变换Matrix4(4x4矩阵)的Z轴.
	/// NOTE:rotateZ方法已经删除.
	*/
	///<summary>rotateZ</summary>
	///<param name ="angle" type="Number">角度</param>
	///<returns type="Matrix4">返回带有新的Matrix4(4x4矩阵).</returns>
	rotateZ: function ( angle ) {
		//提示用户rotateZ()方法已经删除.
		console.warn( 'THREE.Matrix4: .rotateZ() has been removed.' );

	},

	/*
	///rotateByAxis方法用来变换Matrix4(4x4矩阵)的任意轴.
	/// NOTE:rotateByAxis方法已经删除.
	*/
	///<summary>rotateByAxis</summary>
	///<param name ="axis" type="Vector3">任意轴</param>
	///<param name ="angle" type="Number">角度</param>
	///<returns type="Matrix4">返回带有新的Matrix4(4x4矩阵).</returns>
	rotateByAxis: function ( axis, angle ) {
		//提示用户rotateByAxis()方法已经删除.
		console.warn( 'THREE.Matrix4: .rotateByAxis() has been removed.' );

	},

	/*
	///scale方法通过预先计算比例向量，将指定的比例向量应用到此 Matrix4(4x4矩阵)。 
	*/
	///<summary>scale</summary>
	///<param name ="v" type="Vector3">比例向量Vector3</param>
	///<returns type="Matrix4">返回新的Matrix4(4x4矩阵).</returns>	
	scale: function ( v ) {

		var te = this.elements;
		var x = v.x, y = v.y, z = v.z;

		te[ 0 ] *= x; te[ 4 ] *= y; te[ 8 ] *= z;
		te[ 1 ] *= x; te[ 5 ] *= y; te[ 9 ] *= z;
		te[ 2 ] *= x; te[ 6 ] *= y; te[ 10 ] *= z;
		te[ 3 ] *= x; te[ 7 ] *= y; te[ 11 ] *= z;

		return this;	//返回新的Matrix4(4x4矩阵).

	},

	getMaxScaleOnAxis: function () {

		var te = this.elements;

		var scaleXSq = te[ 0 ] * te[ 0 ] + te[ 1 ] * te[ 1 ] + te[ 2 ] * te[ 2 ];
		var scaleYSq = te[ 4 ] * te[ 4 ] + te[ 5 ] * te[ 5 ] + te[ 6 ] * te[ 6 ];
		var scaleZSq = te[ 8 ] * te[ 8 ] + te[ 9 ] * te[ 9 ] + te[ 10 ] * te[ 10 ];

		return Math.sqrt( Math.max( scaleXSq, Math.max( scaleYSq, scaleZSq ) ) );

	},

	/*
	///makeTranslation方法根据x, y, z生成平移矩阵.
	*/
	///<summary>makeTranslation</summary>
	///<param name ="x" type="Number">x分量</param>
	///<param name ="y" type="Number">y分量</param>
	///<param name ="z" type="Number">z分量</param>
	///<returns type="Matrix4">返回Matrix4(4x4矩阵),平移矩阵.</returns>
	makeTranslation: function ( x, y, z ) {

		this.set(

			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
			0, 0, 0, 1

		);

		return this;	//返回Matrix4(4x4矩阵),平移矩阵

	},

	/*
	///makeRotationX方法生成绕x轴转theta弧度的旋转矩阵
	/// TODO:这里是弧度还是角度,有待确认.
	*/
	///<summary>makeRotationX</summary>
	///<param name ="theta" type="Number">弧度</param>
	///<returns type="Matrix4">返回Matrix4(4x4矩阵),旋转矩阵.</returns>	
	makeRotationX: function ( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			1, 0,  0, 0,
			0, c, - s, 0,
			0, s,  c, 0,
			0, 0,  0, 1

		);

		return this;	//返回Matrix4(4x4矩阵),旋转矩阵.

	},

	/*
	///makeRotationY方法生成绕y轴转theta弧度的旋转矩阵
	/// TODO:这里是弧度还是角度,有待确认.
	*/
	///<summary>makeRotationY</summary>
	///<param name ="theta" type="Number">弧度</param>
	///<returns type="Matrix4">返回Matrix4(4x4矩阵),旋转矩阵.</returns>	
	makeRotationY: function ( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			 c, 0, s, 0,
			 0, 1, 0, 0,
			- s, 0, c, 0,
			 0, 0, 0, 1

		);

		return this;	//返回Matrix4(4x4矩阵),旋转矩阵.

	},

	/*
	///makeRotationZ方法生成绕z轴转theta弧度的旋转矩阵
	/// TODO:这里是弧度还是角度,有待确认.
	*/
	///<summary>makeRotationZ</summary>
	///<param name ="theta" type="Number">弧度</param>
	///<returns type="Matrix4">返回Matrix4(4x4矩阵),旋转矩阵.</returns>	
	makeRotationZ: function ( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			c, - s, 0, 0,
			s,  c, 0, 0,
			0,  0, 1, 0,
			0,  0, 0, 1

		);

		return this;	//返回Matrix4(4x4矩阵),旋转矩阵.

	},

	/*
	///makeRotationAxis方法生成绕任意轴转angle弧度的旋转矩阵
	/// TODO:这里是弧度还是角度,有待确认.
	*/
	///<summary>makeRotationAxis</summary>
	///<param name ="axis" type="Vector3"> 转轴向量(axis必须是单位向量)</param>
	///<param name ="theta" type="Number">弧度</param>
	///<returns type="Matrix4">返回Matrix4(4x4矩阵),旋转矩阵.</returns>	
	makeRotationAxis: function ( axis, angle ) {

		// Based on http://www.gamedev.net/reference/articles/article1199.asp

		var c = Math.cos( angle );
		var s = Math.sin( angle );
		var t = 1 - c;
		var x = axis.x, y = axis.y, z = axis.z;
		var tx = t * x, ty = t * y;

		this.set(

			tx * x + c, tx * y - s * z, tx * z + s * y, 0,
			tx * y + s * z, ty * y + c, ty * z - s * x, 0,
			tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
			0, 0, 0, 1

		);

		 return this;	//返回Matrix4(4x4矩阵),旋转矩阵.

	},

	/*
	///makeScale方法根据x, y, z生成缩放矩阵.
	*/
	///<summary>makeScale</summary>
	///<param name ="x" type="Number">x分量</param>
	///<param name ="y" type="Number">y分量</param>
	///<param name ="z" type="Number">z分量</param>
	///<returns type="Matrix4">返回Matrix4(4x4矩阵),缩放矩阵.</returns>
	makeScale: function ( x, y, z ) {

		this.set(

			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1

		);

		return this;	//返回Matrix4(4x4矩阵),缩放矩阵.

	},

	/*
	///compose方法设置变换矩阵的平移、旋转和缩放设置
	*/
	///<summary>compose</summary>
	///<param name ="position" type="Vector3">平移向量</param>
	///<param name ="quaternion" type="Vector3">旋转向量</param>
	///<param name ="scale" type="Vector3">缩放向量</param>
	///<returns type="Matrix4">返回Matrix4(4x4矩阵),变换矩阵.</returns>
	compose: function ( position, quaternion, scale ) {

		this.makeRotationFromQuaternion( quaternion );
		this.scale( scale );
		this.setPosition( position );

		return this;	//返回Matrix4(4x4矩阵),变换矩阵.

	},

	/*
	///decompose方法和compose()方法对应.将转换矩阵的平移、旋转和缩放设置作为由三个 Vector3 对象组成的矢量返回。第一个 Vector3 对象容纳平移元素。第二个 Vector3 对象容纳旋转元素。第三个 Vector3 对象容纳缩放元素。 
	*/
	///<summary>decompose</summary>
	///<param name ="position" type="Vector3">平移向量</param>
	///<param name ="quaternion" type="Vector3">旋转向量</param>
	///<param name ="scale" type="Vector3">缩放向量</param>
	///<returns type="Matrix4">返回Matrix4(4x4矩阵),变换矩阵.</returns>
	decompose: function () {

		var vector = new THREE.Vector3();
		var matrix = new THREE.Matrix4();

		return function ( position, quaternion, scale ) {

			var te = this.elements;

			var sx = vector.set( te[ 0 ], te[ 1 ], te[ 2 ] ).length();
			var sy = vector.set( te[ 4 ], te[ 5 ], te[ 6 ] ).length();
			var sz = vector.set( te[ 8 ], te[ 9 ], te[ 10 ] ).length();

			// if determine is negative, we need to invert one scale
			// 如果行列式是负数,把比例转换成正数
			var det = this.determinant();
			if ( det < 0 ) {
				sx = - sx;
			}

			position.x = te[ 12 ];
			position.y = te[ 13 ];
			position.z = te[ 14 ];

			// scale the rotation part
			// 缩放有关旋转的元素

			matrix.elements.set( this.elements ); // at this point matrix is incomplete so we can't use .copy()
												  //这个表示点的矩阵是不完整的,我们不能使用copy()方法

			var invSX = 1 / sx;
			var invSY = 1 / sy;
			var invSZ = 1 / sz;

			matrix.elements[ 0 ] *= invSX;
			matrix.elements[ 1 ] *= invSX;
			matrix.elements[ 2 ] *= invSX;

			matrix.elements[ 4 ] *= invSY;
			matrix.elements[ 5 ] *= invSY;
			matrix.elements[ 6 ] *= invSY;

			matrix.elements[ 8 ] *= invSZ;
			matrix.elements[ 9 ] *= invSZ;
			matrix.elements[ 10 ] *= invSZ;

			quaternion.setFromRotationMatrix( matrix );

			scale.x = sx;
			scale.y = sy;
			scale.z = sz;

			return this;	//返回Matrix4(4x4矩阵),变换矩阵

		};

	}(),

	/*
	///makeFrustum方法根据left, right, bottom, top, near, far生成透视投影矩阵,Frustum平截头体
	*/
	///<summary>makeFrustum</summary>
	///<param name ="left" type="Number">指明相对于垂直平面的左侧坐标位置</param>
	///<param name ="right" type="Number">指明相对于垂直平面的右侧坐标位置</param>
	///<param name ="bottom" type="Number">指明相对于垂直平面的底部坐标位置</param>
	///<param name ="top" type="Number">指明相对于垂直平面的顶部坐标位置</param>
	///<param name ="near" type="Number">指明相对于深度剪切面的近的距离，必须为正数</param>
	///<param name ="far" type="Number">指明相对于深度剪切面的远的距离，必须为正数</param>
	///<returns type="Matrix4">返回Matrix4(4x4矩阵),透视投影矩阵.</returns>
	makeFrustum: function ( left, right, bottom, top, near, far ) {

		var te = this.elements;
		var x = 2 * near / ( right - left );
		var y = 2 * near / ( top - bottom );

		var a = ( right + left ) / ( right - left );
		var b = ( top + bottom ) / ( top - bottom );
		var c = - ( far + near ) / ( far - near );
		var d = - 2 * far * near / ( far - near );

		te[ 0 ] = x;	te[ 4 ] = 0;	te[ 8 ] = a;	te[ 12 ] = 0;
		te[ 1 ] = 0;	te[ 5 ] = y;	te[ 9 ] = b;	te[ 13 ] = 0;
		te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = c;	te[ 14 ] = d;
		te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = - 1;	te[ 15 ] = 0;

		return this;	//返回Matrix4(4x4矩阵),透视投影矩阵

	},

	/*
	///makePerspective方法根据 fov, aspect, near, far 生成透视投影矩阵,对makeFrustu()方法的封装,适配人们习惯的表达方式.
	*/
	///<summary>makePerspective</summary>
	///<param name ="fov" type="Number">指明相机的可视角度</param>
	///<param name ="aspect" type="Number">指明相机可视范围的长宽比</param>
	///<param name ="near" type="Number">指明相对于深度剪切面的近的距离，必须为正数</param>
	///<param name ="far" type="Number">指明相对于深度剪切面的远的距离，必须为正数</param>
	///<returns type="Matrix4">返回Matrix4(4x4矩阵),透视投影矩阵.</returns>
	makePerspective: function ( fov, aspect, near, far ) {

		var ymax = near * Math.tan( THREE.Math.degToRad( fov * 0.5 ) );
		var ymin = - ymax;
		var xmin = ymin * aspect;
		var xmax = ymax * aspect;

		return this.makeFrustum( xmin, xmax, ymin, ymax, near, far );	//调用makeFrustum()方法,返回透视投影矩阵.

	},

	/*
	///makeOrthographic方法根据  left, right, top, bottom, near, far 生成正交矩阵.
	*/
	///<summary>makePerspective</summary>
	///<param name ="left" type="Number">指明相对于垂直平面的左侧坐标位置</param>
	///<param name ="right" type="Number">指明相对于垂直平面的右侧坐标位置</param>
	///<param name ="bottom" type="Number">指明相对于垂直平面的底部坐标位置</param>
	///<param name ="top" type="Number">指明相对于垂直平面的顶部坐标位置</param>
	///<param name ="near" type="Number">指明相对于深度剪切面的近的距离，必须为正数</param>
	///<param name ="far" type="Number">指明相对于深度剪切面的远的距离，必须为正数</param>
	///<returns type="Matrix4">返回Matrix4(4x4矩阵),正交投影矩阵.</returns>
	makeOrthographic: function ( left, right, top, bottom, near, far ) {

		var te = this.elements;
		var w = right - left;
		var h = top - bottom;
		var p = far - near;

		var x = ( right + left ) / w;
		var y = ( top + bottom ) / h;
		var z = ( far + near ) / p;

		te[ 0 ] = 2 / w;	te[ 4 ] = 0;	te[ 8 ] = 0;	te[ 12 ] = - x;
		te[ 1 ] = 0;	te[ 5 ] = 2 / h;	te[ 9 ] = 0;	te[ 13 ] = - y;
		te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = - 2 / p;	te[ 14 ] = - z;
		te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = 0;	te[ 15 ] = 1;

		return this;	//返回Matrix4(4x4矩阵),正交投影矩阵.

	},

	/*fromArray方法
	///fromArray方法将存储Matrix4(4x4矩阵)元素值的数组赋值给当前Matrix4(4x4矩阵)对象
	*/
	///<summary>fromArray</summary>
	///<param name ="array" type="Array">Matrix4(4x4矩阵)元素值的数组array</param>
	///<returns type="Matrix4">返回新的Matrix4(4x4矩阵)</returns>	
	fromArray: function ( array ) {

		this.elements.set( array );		//调用set方法,将数组赋值给当前Matrix4(4x4矩阵)对象

		return this;	//返回新的Matrix4(4x4矩阵)

	},

	/*toArray方法
	///toArray方法将当前Matrix4(4x4矩阵)的元素值赋值给数组array.返回一个数组对象.
	*/
	///<summary>toArray</summary>
	///<returns type="Array">返回含有Matrix4(4x4矩阵)元素值的数组array</returns>	
	toArray: function () {

		var te = this.elements;

		return [
			te[ 0 ], te[ 1 ], te[ 2 ], te[ 3 ],
			te[ 4 ], te[ 5 ], te[ 6 ], te[ 7 ],
			te[ 8 ], te[ 9 ], te[ 10 ], te[ 11 ],
			te[ 12 ], te[ 13 ], te[ 14 ], te[ 15 ]
		];									//返回含有Matrix4(4x4矩阵)元素值的数组array

	},

	/*clone方法
	///clone方法克隆一个Matrix4(4x4矩阵)对象.
	*/
	///<summary>clone</summary>
	///<returns type="Matrix4(4x4矩阵)">返回克隆的Matrix4(4x4矩阵)对象</returns>	
	clone: function () {

		var te = this.elements;

		return new THREE.Matrix4(

			te[ 0 ], te[ 4 ], te[ 8 ], te[ 12 ],
			te[ 1 ], te[ 5 ], te[ 9 ], te[ 13 ],
			te[ 2 ], te[ 6 ], te[ 10 ], te[ 14 ],
			te[ 3 ], te[ 7 ], te[ 11 ], te[ 15 ]

		);		//返回克隆的Matrix4(4x4矩阵)对象

	}

};
