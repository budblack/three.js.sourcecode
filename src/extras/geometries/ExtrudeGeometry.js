/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 * Creates extruded geometry from a path shape.
 *
 * parameters = {
 *
 *  curveSegments: <int>, // number of points on the curves 曲线上的顶点数量
 *  steps: <int>, // number of points for z-side extrusions / used for subdividing segements of extrude spline too 步数,曲线拉伸的细分线段数
 *  amount: <int>, // Depth to extrude the shape 拉伸线段的厚度.
 *
 *  bevelEnabled: <bool>, // turn on bevel 是否启用倒角
 *  bevelThickness: <float>, // how deep into the original shape bevel goes 倒角的厚度
 *  bevelSize: <float>, // how far from shape outline is bevel 从截面外轮廓倒角的尺寸.
 *  bevelSegments: <int>, // number of bevel layers 倒角部分的细分线段数.
 *
 *  extrudePath: <THREE.CurvePath> // 3d spline path to extrude shape along. (creates Frames if .frames aren't defined) 截面拉伸的路径,3d的spline对象.
 *  frames: <THREE.TubeGeometry.FrenetFrames> // containing arrays of tangents, normals, binormals 包含三角形,法线,副法线数组.
 *
 *  material: <int> // material index for front and back faces 正面和背面材质索引
 *  extrudeMaterial: <int> // material index for extrusion and beveled faces 拉伸体和斜面的材质索引
 *  uvGenerator: <Object> // object that provides UV generator functions UV坐标生成函数.
 *
 * }
 **/

/*
///ExtrudeGeometry用来通过截面(参数shape)和参数选项(options)生成拉伸几何体.
*/
///<summary>ExtrudeGeometry</summary>
///<param name ="shapes" type="THREE.Shape">拉伸几何体截面</param>
///<param name ="options" type="Object">拉伸几何体参数选项</param>
THREE.ExtrudeGeometry = function ( shapes, options ) {

	if ( typeof( shapes ) === "undefined" ) {
		shapes = [];
		return;
	}

	THREE.Geometry.call( this );	//调用Geometry()方法创建几何体,并将Geometry对象的方法供ExtrudeGeometry对象使用.

	shapes = shapes instanceof Array ? shapes : [ shapes ];

	this.addShapeList( shapes, options );	//将截面(参数shape)和参数选项,添加到shapes数组.

	this.computeFaceNormals();	//计算三角面法线

	// can't really use automatic vertex normals
	// as then front and back sides get smoothed too
	// should do separate smoothing just for sides

	//this.computeVertexNormals();

	//console.log( "took", ( Date.now() - startTime ) );

};
/*************************************************
****下面是ExtrudeGeometry对象的方法属性定义,继承自Geometry对象.
**************************************************/
THREE.ExtrudeGeometry.prototype = Object.create( THREE.Geometry.prototype );
/*
///addShapeList方法将截面(参数shape)和参数选项,添加到shapes数组.
*/
///<summary>addShapeList</summary>
///<param name ="shapes" type="THREE.ShapeArray">拉伸几何体截面</param>
///<param name ="options" type="Object">拉伸几何体参数选项</param>
THREE.ExtrudeGeometry.prototype.addShapeList = function ( shapes, options ) {
	var sl = shapes.length;

	for ( var s = 0; s < sl; s ++ ) {
		var shape = shapes[ s ];
		this.addShape( shape, options );
	}
};
/*
///addShape方法将截面(参数shape)和参数选项,获得构造几何体的截面.
*/
///<summary>addShape</summary>
///<param name ="shapes" type="THREE.ShapeArray">拉伸几何体截面</param>
///<param name ="options" type="Object">拉伸几何体参数选项</param>
///<returns type="Vector3Array">返回构造几何体的截面.</returns>
THREE.ExtrudeGeometry.prototype.addShape = function ( shape, options ) {

	var amount = options.amount !== undefined ? options.amount : 100;	//拉伸线段的厚度

	var bevelThickness = options.bevelThickness !== undefined ? options.bevelThickness : 6; // 10 //倒角的厚度,默认初始化为6
	var bevelSize = options.bevelSize !== undefined ? options.bevelSize : bevelThickness - 2; // 8 //从截面外轮廓倒角的尺寸,默认初始化为bevelThickness - 2
	var bevelSegments = options.bevelSegments !== undefined ? options.bevelSegments : 3;	//倒角部分的细分线段数,默认初始化为3

	var bevelEnabled = options.bevelEnabled !== undefined ? options.bevelEnabled : true; // false 	//是否启用倒角,默认true

	var curveSegments = options.curveSegments !== undefined ? options.curveSegments : 12;	//曲线上的顶点数量,默认为12

	var steps = options.steps !== undefined ? options.steps : 1;	//步数,曲线拉伸的细分线段数,默认初始化为1.

	var extrudePath = options.extrudePath; 	//拉伸几何体跟随的路径
	var extrudePts, extrudeByPath = false;	//拉伸几何体是否跟随路径.

	var material = options.material;	//正面和背面材质属性
	var extrudeMaterial = options.extrudeMaterial; //拉伸几何体和斜面的材质属性

	// Use default WorldUVGenerator if no UV generators are specified.
	// 如果没有指定uv生成器,使用默认的全局uv生成器.
	var uvgen = options.UVGenerator !== undefined ? options.UVGenerator : THREE.ExtrudeGeometry.WorldUVGenerator;

	var splineTube, binormal, normal, position2;
	if ( extrudePath ) {

		extrudePts = extrudePath.getSpacedPoints( steps );

		extrudeByPath = true;	//启用拉伸几何体跟随路径
		bevelEnabled = false; // bevels not supported for path extrusion 倒角不能用在路径跟随的方式生成的拉伸几何体

		// SETUP TNB variables

		// Reuse TNB from TubeGeomtry for now.
		// TODO1 - have a .isClosed in spline?

		splineTube = options.frames !== undefined ? options.frames : new THREE.TubeGeometry.FrenetFrames(extrudePath, steps, false);	//包含三角形,法线,副法线数组

		// console.log(splineTube, 'splineTube', splineTube.normals.length, 'steps', steps, 'extrudePts', extrudePts.length);

		binormal = new THREE.Vector3();
		normal = new THREE.Vector3();
		position2 = new THREE.Vector3();

	}

	// Safeguards if bevels are not enabled
	// 如果没有启用倒角,将倒角大小,厚度设置为0

	if ( ! bevelEnabled ) {

		bevelSegments = 0;
		bevelThickness = 0;
		bevelSize = 0;

	}

	// Variables initalization 变量初始化

	var ahole, h, hl; // looping of holes 遍历镂空(孔洞)
	var scope = this;
	var bevelPoints = [];

	var shapesOffset = this.vertices.length;

	var shapePoints = shape.extractPoints( curveSegments );	//定数等分截面,获得顶点坐标数组

	var vertices = shapePoints.shape;
	var holes = shapePoints.holes;

	var reverse = ! THREE.Shape.Utils.isClockWise( vertices ) ; 	//反转顶点顺序

	if ( reverse ) {

		vertices = vertices.reverse();

		// Maybe we should also check if holes are in the opposite direction, just to be safe ...
		// 同样检查镂空(孔洞)顶点的顺序.

		for ( h = 0, hl = holes.length; h < hl; h ++ ) {

			ahole = holes[ h ];

			if ( THREE.Shape.Utils.isClockWise( ahole ) ) {

				holes[ h ] = ahole.reverse();

			}

		}

		reverse = false; // If vertices are in order now, we shouldn't need to worry about them again (hopefully)! 如果顶点顺序正确,不用担心他们了.

	}

	//计算三角面.
	var faces = THREE.Shape.Utils.triangulateShape ( vertices, holes );

	/* Vertices */

	var contour = vertices; // vertices has all points but contour has only points of circumference vertices包含所有的点,但是contour只有围绕圆周的顶点.

	for ( h = 0, hl = holes.length;  h < hl; h ++ ) {

		ahole = holes[ h ];

		vertices = vertices.concat( ahole );

	}

	/*
	///scalePt2方法将参数vec上的x,y,z分量分别乘以size,然后加上pt,返回结果.
	*/
	///<summary>scalePt2</summary>
	///<param name ="pt" type="Vector3">三维向量</param>
	///<param name ="vec" type="Vector3">三维向量</param>
	///<param name ="size" type="float">缩放的标量</param>
	///<returns type="Vector3Array">返回构造几何体的截面.</returns>
	function scalePt2 ( pt, vec, size ) {

		if ( ! vec ) console.log( "die" );

		return vec.clone().multiplyScalar( size ).add( pt );

	}

	var b, bs, t, z,
		vert, vlen = vertices.length,
		face, flen = faces.length,
		cont, clen = contour.length;


	// Find directions for point movement
	// 找点移动的方向

	var RAD_TO_DEGREES = 180 / Math.PI;


	/*
	///scalePt2方法获得倒角,斜面上的顶点.
	*/
	///<summary>scalePt2</summary>
	///<param name ="inPt" type="Vector2">二维向量</param>
	///<param name ="inPrev" type="Vector2">二维向量</param>
	///<param name ="inNext" type="Vector2">二维向量</param>
	///<returns type="Vector3Array">返回二维向量.</returns>
	function getBevelVec( inPt, inPrev, inNext ) {

		var EPSILON = 0.0000000001;
		var sign = THREE.Math.sign;
		
		// computes for inPt the corresponding point inPt' on a new contour
		//   shiftet by 1 unit (length of normalized vector) to the left
		// if we walk along contour clockwise, this new contour is outside the old one
		//
		// inPt' is the intersection of the two lines parallel to the two
		//  adjacent edges of inPt at a distance of 1 unit on the left side.
		
		var v_trans_x, v_trans_y, shrink_by = 1;		// resulting translation vector for inPt

		// good reading for geometry algorithms (here: line-line intersection)
		// 非常不错的几何算法 两条线段求交点:
		// http://geomalgorithms.com/a05-_intersect-1.html

		var v_prev_x = inPt.x - inPrev.x, v_prev_y = inPt.y - inPrev.y;
		var v_next_x = inNext.x - inPt.x, v_next_y = inNext.y - inPt.y;
		
		var v_prev_lensq = ( v_prev_x * v_prev_x + v_prev_y * v_prev_y );
		
		// check for colinear edges 检查共线的边
		var colinear0 = ( v_prev_x * v_next_y - v_prev_y * v_next_x );
		
		if ( Math.abs( colinear0 ) > EPSILON ) {		// not colinear 不共线
			
			// length of vectors for normalizing
			// 矢量长度归一化
	
			var v_prev_len = Math.sqrt( v_prev_lensq );
			var v_next_len = Math.sqrt( v_next_x * v_next_x + v_next_y * v_next_y );
			
			// shift adjacent points by unit vectors to the left
			// 按照单位向量左移相邻的点
	
			var ptPrevShift_x = ( inPrev.x - v_prev_y / v_prev_len );
			var ptPrevShift_y = ( inPrev.y + v_prev_x / v_prev_len );
			
			var ptNextShift_x = ( inNext.x - v_next_y / v_next_len );
			var ptNextShift_y = ( inNext.y + v_next_x / v_next_len );
	
			// scaling factor for v_prev to intersection point
			// v_prev到交点的缩放因子
	
			var sf = (  ( ptNextShift_x - ptPrevShift_x ) * v_next_y -
						( ptNextShift_y - ptPrevShift_y ) * v_next_x    ) /
					  ( v_prev_x * v_next_y - v_prev_y * v_next_x );
	
			// vector from inPt to intersection point
			// 从inPt到交点的向量
	
			v_trans_x = ( ptPrevShift_x + v_prev_x * sf - inPt.x );
			v_trans_y = ( ptPrevShift_y + v_prev_y * sf - inPt.y );
	
			// Don't normalize!, otherwise sharp corners become ugly
			// 不能归一化,否则会出现特别丑陋的尖角
			//  but prevent crazy spikes
			var v_trans_lensq = ( v_trans_x * v_trans_x + v_trans_y * v_trans_y )
			if ( v_trans_lensq <= 2 ) {
				return	new THREE.Vector2( v_trans_x, v_trans_y );
			} else {
				shrink_by = Math.sqrt( v_trans_lensq / 2 );
			}
			
		} else {		// handle special case of colinear edges 处理共边的特殊情况

			var direction_eq = false;		// assumes: opposite
			if ( v_prev_x > EPSILON ) {
				if ( v_next_x > EPSILON ) { direction_eq = true; }
			} else {
				if ( v_prev_x < - EPSILON ) {
					if ( v_next_x < - EPSILON ) { direction_eq = true; }
				} else {
					if ( sign(v_prev_y) == sign(v_next_y) ) { direction_eq = true; }
				}
			}

			if ( direction_eq ) {
				// console.log("Warning: lines are a straight sequence");
				v_trans_x = - v_prev_y;
				v_trans_y =  v_prev_x;
				shrink_by = Math.sqrt( v_prev_lensq );
			} else {
				// console.log("Warning: lines are a straight spike");
				v_trans_x = v_prev_x;
				v_trans_y = v_prev_y;
				shrink_by = Math.sqrt( v_prev_lensq / 2 );
			}

		}

		return	new THREE.Vector2( v_trans_x / shrink_by, v_trans_y / shrink_by );	//返回

	}


	var contourMovements = [];

	for ( var i = 0, il = contour.length, j = il - 1, k = i + 1; i < il; i ++, j ++, k ++ ) {

		if ( j === il ) j = 0;
		if ( k === il ) k = 0;

		//  (j)---(i)---(k)
		// console.log('i,j,k', i, j , k)

		var pt_i = contour[ i ];
		var pt_j = contour[ j ];
		var pt_k = contour[ k ];

		contourMovements[ i ]= getBevelVec( contour[ i ], contour[ j ], contour[ k ] );

	}

	var holesMovements = [], oneHoleMovements, verticesMovements = contourMovements.concat();

	for ( h = 0, hl = holes.length; h < hl; h ++ ) {

		ahole = holes[ h ];

		oneHoleMovements = [];

		for ( i = 0, il = ahole.length, j = il - 1, k = i + 1; i < il; i ++, j ++, k ++ ) {

			if ( j === il ) j = 0;
			if ( k === il ) k = 0;

			//  (j)---(i)---(k)
			oneHoleMovements[ i ]= getBevelVec( ahole[ i ], ahole[ j ], ahole[ k ] );

		}

		holesMovements.push( oneHoleMovements );
		verticesMovements = verticesMovements.concat( oneHoleMovements );

	}


	// Loop bevelSegments, 1 for the front, 1 for the back
	// 遍历倒角细分线段数

	for ( b = 0; b < bevelSegments; b ++ ) {
	//for ( b = bevelSegments; b > 0; b -- ) {

		t = b / bevelSegments;
		z = bevelThickness * ( 1 - t );

		//z = bevelThickness * t;
		bs = bevelSize * ( Math.sin ( t * Math.PI/2 ) ) ; // curved
		//bs = bevelSize * t ; // linear

		// contract shape

		for ( i = 0, il = contour.length; i < il; i ++ ) {

			vert = scalePt2( contour[ i ], contourMovements[ i ], bs );

			v( vert.x, vert.y,  - z );

		}

		// expand holes 扩大镂空

		for ( h = 0, hl = holes.length; h < hl; h ++ ) {

			ahole = holes[ h ];
			oneHoleMovements = holesMovements[ h ];

			for ( i = 0, il = ahole.length; i < il; i ++ ) {

				vert = scalePt2( ahole[ i ], oneHoleMovements[ i ], bs );

				v( vert.x, vert.y,  - z );

			}

		}

	}

	bs = bevelSize;

	// Back facing vertices 背面顶点

	for ( i = 0; i < vlen; i ++ ) {

		vert = bevelEnabled ? scalePt2( vertices[ i ], verticesMovements[ i ], bs ) : vertices[ i ];

		if ( ! extrudeByPath ) {

			v( vert.x, vert.y, 0 );

		} else {

			// v( vert.x, vert.y + extrudePts[ 0 ].y, extrudePts[ 0 ].x );

			normal.copy( splineTube.normals[0] ).multiplyScalar(vert.x);
			binormal.copy( splineTube.binormals[0] ).multiplyScalar(vert.y);

			position2.copy( extrudePts[0] ).add(normal).add(binormal);

			v( position2.x, position2.y, position2.z );

		}

	}

	// Add stepped vertices... 添加中间顶点
	// Including front facing vertices
	// 包含正面的顶点

	var s;

	for ( s = 1; s <= steps; s ++ ) {

		for ( i = 0; i < vlen; i ++ ) {

			vert = bevelEnabled ? scalePt2( vertices[ i ], verticesMovements[ i ], bs ) : vertices[ i ];

			if ( ! extrudeByPath ) {

				v( vert.x, vert.y, amount / steps * s );

			} else {

				// v( vert.x, vert.y + extrudePts[ s - 1 ].y, extrudePts[ s - 1 ].x );

				normal.copy( splineTube.normals[s] ).multiplyScalar( vert.x );
				binormal.copy( splineTube.binormals[s] ).multiplyScalar( vert.y );

				position2.copy( extrudePts[s] ).add( normal ).add( binormal );

				v( position2.x, position2.y, position2.z );

			}

		}

	}


	// Add bevel segments planes
	// 添加倒角的斜面

	//for ( b = 1; b <= bevelSegments; b ++ ) {
	for ( b = bevelSegments - 1; b >= 0; b -- ) {

		t = b / bevelSegments;
		z = bevelThickness * ( 1 - t );
		//bs = bevelSize * ( 1-Math.sin ( ( 1 - t ) * Math.PI/2 ) );
		bs = bevelSize * Math.sin ( t * Math.PI/2 ) ;

		// contract shape

		for ( i = 0, il = contour.length; i < il; i ++ ) {

			vert = scalePt2( contour[ i ], contourMovements[ i ], bs );
			v( vert.x, vert.y,  amount + z );

		}

		// expand holes

		for ( h = 0, hl = holes.length; h < hl; h ++ ) {

			ahole = holes[ h ];
			oneHoleMovements = holesMovements[ h ];

			for ( i = 0, il = ahole.length; i < il; i ++ ) {

				vert = scalePt2( ahole[ i ], oneHoleMovements[ i ], bs );

				if ( ! extrudeByPath ) {

					v( vert.x, vert.y,  amount + z );

				} else {

					v( vert.x, vert.y + extrudePts[ steps - 1 ].y, extrudePts[ steps - 1 ].x + z );

				}

			}

		}

	}

	/* Faces */

	// Top and bottom faces
	// 顶面和底面
	buildLidFaces();

	// Sides faces
	// 侧面
	buildSideFaces();


	/////  Internal functions
	/*
	///buildLidFaces方法构建顶面和底面
	///
	*/
	///<summary>buildLidFaces</summary>
	function buildLidFaces() {

		if ( bevelEnabled ) {

			var layer = 0 ; // steps + 1
			var offset = vlen * layer;

			// Bottom faces

			for ( i = 0; i < flen; i ++ ) {

				face = faces[ i ];
				f3( face[ 2 ]+ offset, face[ 1 ]+ offset, face[ 0 ] + offset, true );

			}

			layer = steps + bevelSegments * 2;
			offset = vlen * layer;

			// Top faces

			for ( i = 0; i < flen; i ++ ) {

				face = faces[ i ];
				f3( face[ 0 ] + offset, face[ 1 ] + offset, face[ 2 ] + offset, false );

			}

		} else {

			// Bottom faces

			for ( i = 0; i < flen; i ++ ) {

				face = faces[ i ];
				f3( face[ 2 ], face[ 1 ], face[ 0 ], true );

			}

			// Top faces

			for ( i = 0; i < flen; i ++ ) {

				face = faces[ i ];
				f3( face[ 0 ] + vlen * steps, face[ 1 ] + vlen * steps, face[ 2 ] + vlen * steps, false );

			}
		}

	}

	// Create faces for the z-sides of the shape
	/*
	///buildLidFaces方法构建侧面
	///
	*/
	///<summary>buildLidFaces</summary>
	function buildSideFaces() {

		var layeroffset = 0;
		sidewalls( contour, layeroffset );
		layeroffset += contour.length;

		for ( h = 0, hl = holes.length;  h < hl; h ++ ) {

			ahole = holes[ h ];
			sidewalls( ahole, layeroffset );

			//, true
			layeroffset += ahole.length;

		}

	}
	/*
	///sidewalls方法构建侧面的具体实现,返回侧面的顶点和面和生成uv
	///
	*/
	///<summary>sidewalls</summary>
	///<param name ="contour" type="THREE.ShapeArray">侧面的顶点数组</param>
	///<param name ="layeroffset" type="int">侧面细分线段的第几层</param>
	///<returns type="Vector3Array">返回侧面的顶点和面和生成uv.</returns>
	function sidewalls( contour, layeroffset ) {

		var j, k;
		i = contour.length;

		while ( --i >= 0 ) {

			j = i;
			k = i - 1;
			if ( k < 0 ) k = contour.length - 1;

			//console.log('b', i,j, i-1, k,vertices.length);

			var s = 0, sl = steps  + bevelSegments * 2;

			for ( s = 0; s < sl; s ++ ) {

				var slen1 = vlen * s;
				var slen2 = vlen * ( s + 1 );

				var a = layeroffset + j + slen1,
					b = layeroffset + k + slen1,
					c = layeroffset + k + slen2,
					d = layeroffset + j + slen2;

				f4( a, b, c, d, contour, s, sl, j, k );

			}
		}

	}

	/*
	///v方法将x,y,z压入拉伸立方体顶点数组.
	///
	*/
	///<summary>v</summary>
	///<param name ="a" type="int">四边形的a点索引</param>
	///<param name ="b" type="int">四边形的b点索引</param>
	///<param name ="c" type="int">四边形的c点索引</param>
	function v( x, y, z ) {

		scope.vertices.push( new THREE.Vector3( x, y, z ) );

	}
	/*
	///f3方法将3个点组成的三角面,并生成uv坐标.
	///
	*/
	///<summary>f3</summary>
	///<param name ="a" type="int">四边形的a点索引</param>
	///<param name ="b" type="int">四边形的b点索引</param>
	///<param name ="c" type="int">四边形的c点索引</param>
	///<param name ="isBottom" type="int">底面的uv</param>
	function f3( a, b, c, isBottom ) {

		a += shapesOffset;
		b += shapesOffset;
		c += shapesOffset;

		// normal, color, material
		scope.faces.push( new THREE.Face3( a, b, c, null, null, material ) );

		var uvs = isBottom ? uvgen.generateBottomUV( scope, shape, options, a, b, c ) : uvgen.generateTopUV( scope, shape, options, a, b, c );

 		scope.faceVertexUvs[ 0 ].push( uvs );

	}
	/*
	///f4方法将4个点组成的卖你三角化为三角面,并生成uv坐标.
	///
	*/
	///<summary>f4</summary>
	///<param name ="a" type="int">四边形的a点索引</param>
	///<param name ="b" type="int">四边形的b点索引</param>
	///<param name ="c" type="int">四边形的c点索引</param>
	///<param name ="d" type="int">四边形的d点索引</param>
	///<param name ="wallContour" type="int">侧面轮廓</param>
	///<param name ="stepIndex" type="int">处于侧面轮廓细分的索引</param>
	///<param name ="stepsLength" type="int">侧面轮廓细分数</param>
	///<param name ="contourIndex1" type="int">第一个轮廓索引</param>
	///<param name ="contourIndex2" type="int">第二个轮廓索引</param>
	function f4( a, b, c, d, wallContour, stepIndex, stepsLength, contourIndex1, contourIndex2 ) {

		a += shapesOffset;
		b += shapesOffset;
		c += shapesOffset;
		d += shapesOffset;

 		scope.faces.push( new THREE.Face3( a, b, d, null, null, extrudeMaterial ) );
 		scope.faces.push( new THREE.Face3( b, c, d, null, null, extrudeMaterial ) );

 		var uvs = uvgen.generateSideWallUV( scope, shape, wallContour, options, a, b, c, d,
 		                                    stepIndex, stepsLength, contourIndex1, contourIndex2 );

 		scope.faceVertexUvs[ 0 ].push( [ uvs[ 0 ], uvs[ 1 ], uvs[ 3 ] ] );
 		scope.faceVertexUvs[ 0 ].push( [ uvs[ 1 ], uvs[ 2 ], uvs[ 3 ] ] );

	}

};
/*************************************************
****下面是ExtrudeGeometry对象的全局坐标生成器
**************************************************/
THREE.ExtrudeGeometry.WorldUVGenerator = {
	/*
	///generateTopUV方法生成顶面的uv
	///
	*/
	///<summary>generateTopUV</summary>
	///<param name ="geometry" type="ExtrudeGeometry">拉伸几何体对象</param>
	///<param name ="extrudedShape" type="Shape">顶面形状</param>
	///<param name ="extrudeOptions" type="int">拉伸参数选项</param>
	///<param name ="indexA" type="int">三角面的a点索引</param>
	///<param name ="indexB" type="int">三角面的b点索引</param>
	///<param name ="indexC" type="int">三角面的c点索引</param>
	generateTopUV: function( geometry, extrudedShape, extrudeOptions, indexA, indexB, indexC ) {
		var ax = geometry.vertices[ indexA ].x,
			ay = geometry.vertices[ indexA ].y,

			bx = geometry.vertices[ indexB ].x,
			by = geometry.vertices[ indexB ].y,

			cx = geometry.vertices[ indexC ].x,
			cy = geometry.vertices[ indexC ].y;

		return [
			new THREE.Vector2( ax, ay ),
			new THREE.Vector2( bx, by ),
			new THREE.Vector2( cx, cy )
		];

	},
	/*
	///generateBottomUV方法生成顶面的uv
	///
	*/
	///<summary>generateBottomUV</summary>
	///<param name ="geometry" type="ExtrudeGeometry">拉伸几何体对象</param>
	///<param name ="extrudedShape" type="Shape">顶面形状</param>
	///<param name ="extrudeOptions" type="int">拉伸参数选项</param>
	///<param name ="indexA" type="int">三角面的a点索引</param>
	///<param name ="indexB" type="int">三角面的b点索引</param>
	///<param name ="indexC" type="int">三角面的c点索引</param>
	generateBottomUV: function( geometry, extrudedShape, extrudeOptions, indexA, indexB, indexC ) {

		return this.generateTopUV( geometry, extrudedShape, extrudeOptions, indexA, indexB, indexC );

	},
	/*
	///generateSideWallUV方法生成侧面的uv
	///
	*/
	///<summary>generateSideWallUV</summary>
	///<param name ="geometry" type="ExtrudeGeometry">拉伸几何体对象</param>
	///<param name ="extrudedShape" type="Shape">顶面形状</param>
	///<param name ="wallContour" type="int">侧面轮廓</param>
	///<param name ="extrudeOptions" type="int">拉伸参数选项</param>
	///<param name ="indexA" type="int">四边形的a点索引</param>
	///<param name ="indexB" type="int">四边形的b点索引</param>
	///<param name ="indexC" type="int">四边形的c点索引</param>
	///<param name ="indexC" type="int">四边形的d点索引</param>
	///<param name ="stepIndex" type="int">处于侧面轮廓细分的索引</param>
	///<param name ="stepsLength" type="int">侧面轮廓细分数</param>
	///<param name ="contourIndex1" type="int">第一个轮廓索引</param>
	///<param name ="contourIndex2" type="int">第二个轮廓索引</param>
	generateSideWallUV: function( geometry, extrudedShape, wallContour, extrudeOptions,
	                              indexA, indexB, indexC, indexD, stepIndex, stepsLength,
	                              contourIndex1, contourIndex2 ) {

		var ax = geometry.vertices[ indexA ].x,
			ay = geometry.vertices[ indexA ].y,
			az = geometry.vertices[ indexA ].z,

			bx = geometry.vertices[ indexB ].x,
			by = geometry.vertices[ indexB ].y,
			bz = geometry.vertices[ indexB ].z,

			cx = geometry.vertices[ indexC ].x,
			cy = geometry.vertices[ indexC ].y,
			cz = geometry.vertices[ indexC ].z,

			dx = geometry.vertices[ indexD ].x,
			dy = geometry.vertices[ indexD ].y,
			dz = geometry.vertices[ indexD ].z;

		if ( Math.abs( ay - by ) < 0.01 ) {
			return [
				new THREE.Vector2( ax, 1 - az ),
				new THREE.Vector2( bx, 1 - bz ),
				new THREE.Vector2( cx, 1 - cz ),
				new THREE.Vector2( dx, 1 - dz )
			];
		} else {
			return [
				new THREE.Vector2( ay, 1 - az ),
				new THREE.Vector2( by, 1 - bz ),
				new THREE.Vector2( cy, 1 - cz ),
				new THREE.Vector2( dy, 1 - dz )
			];
		}
	}
};

THREE.ExtrudeGeometry.__v1 = new THREE.Vector2();
THREE.ExtrudeGeometry.__v2 = new THREE.Vector2();
THREE.ExtrudeGeometry.__v3 = new THREE.Vector2();
THREE.ExtrudeGeometry.__v4 = new THREE.Vector2();
THREE.ExtrudeGeometry.__v5 = new THREE.Vector2();
THREE.ExtrudeGeometry.__v6 = new THREE.Vector2();
