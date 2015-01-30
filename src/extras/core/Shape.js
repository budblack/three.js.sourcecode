/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Defines a 2d shape plane using paths.
 **/

// STEP 1 Create a path.
// 1. 创建路径
// STEP 2 Turn path into shape.
// 2. 将路径变成截面
// STEP 3 ExtrudeGeometry takes in Shape/Shapes
// 3. 将截面拉伸成几何体
// STEP 3a - Extract points from each shape, turn to vertices
// 3a. 导出所有的截面顶点到vertices属性中
// STEP 3b - Triangulate each shape, add faces.
// 3b. 组织所有的顶点为三角面.
/*
///Shape对象将二维平面生成图形对象的抽象基类.
///
*/
///<summary>Shape</summary>
THREE.Shape = function () {

	THREE.Path.apply( this, arguments );	//调用Path对象的call方法,将原本属于Path的方法交给当前对象Shape来使用.
	this.holes = [];	//将孔洞存放到holes数组中.

};
/*************************************************
****下面是Shape对象的方法属性定义,继承自Path对象.
**************************************************/
THREE.Shape.prototype = Object.create( THREE.Path.prototype );

/*
///extrude生成拉伸几何体的便利方法.
///
/// parameters = {
///
///  curveSegments: <int>, // number of points on the curves 曲线上的顶点数量
///  steps: <int>, // number of points for z-side extrusions / used for subdividing segements of extrude spline too 步数,曲线拉伸的细分线段数
///  amount: <int>, // Depth to extrude the shape 拉伸线段的厚度.
///
///  bevelEnabled: <bool>, // turn on bevel 是否启用倒角
///  bevelThickness: <float>, // how deep into the original shape bevel goes 倒角的厚度
///  bevelSize: <float>, // how far from shape outline is bevel 从截面外轮廓倒角的尺寸.
///  bevelSegments: <int>, // number of bevel layers 倒角部分的细分线段数.
///
///  extrudePath: <THREE.CurvePath> // 3d spline path to extrude shape along. (creates Frames if .frames aren't defined) 截面拉伸的路径,3d的spline对象.
///  frames: <THREE.TubeGeometry.FrenetFrames> // containing arrays of tangents, normals, binormals 包含三角形,法线,副法线数组.
///
///  material: <int> // material index for front and back faces 正面和背面材质索引
///  extrudeMaterial: <int> // material index for extrusion and beveled faces 拉伸体和斜面的材质索引
///  uvGenerator: <Object> // object that provides UV generator functions UV坐标生成函数.
///
/// }
*/
///<summary>extrude</summary>
///<param name ="options" type="String">参数选项</param>
///<returns type="THREE.ExtrudeGeometry">拉伸几何体.</returns>
// Convenience method to return ExtrudeGeometry
// 生成拉伸几何体的便利方法.
THREE.Shape.prototype.extrude = function ( options ) {

	var extruded = new THREE.ExtrudeGeometry( this, options );
	return extruded;

};
/*
///makeGeometry创建图形几何体的便利方法
///
/// parameters = {
///
///	curveSegments: <int>, // number of points on the curves. NOT USED AT THE MOMENT. 曲线上的顶点数量
///
///	material: <int> // material index for front and back faces 正面和背面材质索引
///	uvGenerator: <Object> // object that provides UV generator functions UV坐标生成函数
///
/// }
*/
///<summary>makeGeometry</summary>
///<param name ="options" type="String">参数选项</param>
///<returns type="THREE.ShapeGeometry">拉伸几何体.</returns>
// Convenience method to return ShapeGeometry
// 创建图形几何体的便利方法.
THREE.Shape.prototype.makeGeometry = function ( options ) {

	var geometry = new THREE.ShapeGeometry( this, options );
	return geometry;

};
/*
///getPointsHoles方法根据divisions将孔洞等分,获得在孔洞对象上等分点的点序列.如果没有设置参数divisions.返回对应等分孔洞顶点的坐标数组.
///定量等分孔洞
*/
///<summary>getPointsHoles</summary>
///<param name ="divisions" type="int">根据divisions将孔洞等分,获得在孔洞对象上等分点的点序列.如果没有设置参数divisions.</param>
///<returns type="Vector3Array">返回对应等分孔洞顶点的坐标数组.</returns>
// Get points of holes
// 定量等分,获得所有孔洞的顶点
THREE.Shape.prototype.getPointsHoles = function ( divisions ) {

	var i, il = this.holes.length, holesPts = [];

	for ( i = 0; i < il; i ++ ) {

		holesPts[ i ] = this.holes[ i ].getTransformedPoints( divisions, this.bends );

	}

	return holesPts;	//返回对应等分孔洞顶点的坐标数组

};
/*
///getSpacedPointsHoles方法根据divisions将孔洞等分,获得在孔洞对象上等分点的点序列.如果没有设置参数divisions.返回对应等分孔洞顶点的坐标数组.
///定距等分孔洞
*/
///<summary>getSpacedPointsHoles</summary>
///<param name ="divisions" type="int">根据divisions将孔洞等分,获得在孔洞对象上等分点的点序列.如果没有设置参数divisions.</param>
///<returns type="Vector3Array">返回对应等分孔洞顶点的坐标数组.</returns>
// Get points of holes (spaced by regular distance)
// 定距等分,获得所有孔洞的顶点.
THREE.Shape.prototype.getSpacedPointsHoles = function ( divisions ) {

	var i, il = this.holes.length, holesPts = [];

	for ( i = 0; i < il; i ++ ) {

		holesPts[ i ] = this.holes[ i ].getTransformedSpacedPoints( divisions, this.bends );

	}

	return holesPts;	//返回对应等分孔洞顶点的坐标数组

};

/*
///extractAllPoints方法根据divisions将孔洞等分,获得在所有界面和孔洞对象上等分点的点序列.如果没有设置参数divisions.返回所有界面和孔洞等分顶点的坐标数组.
///定量等分孔洞
*/
///<summary>extractAllPoints</summary>
///<param name ="divisions" type="int">根据divisions将所有界面和孔洞等分,获得在所有界面和孔洞对象上等分点的点序列.如果没有设置参数divisions.</param>
///<returns type="Vector3Array">返回所有界面和孔洞等分顶点的坐标数组.</returns>
// Get points of shape and holes (keypoints based on segments parameter)
// 定量等分,获得所有界面和孔洞的顶点.
THREE.Shape.prototype.extractAllPoints = function ( divisions ) {

	return {

		shape: this.getTransformedPoints( divisions ),
		holes: this.getPointsHoles( divisions )

	};

};

/*
///extractPoints方法根据divisions将孔洞等分,获得在所有界面和孔洞对象上等分点的点序列.如果没有设置参数divisions.返回所有界面和孔洞等分顶点的坐标数组.
///
*/
///<summary>extractPoints</summary>
///<param name ="divisions" type="int">根据divisions将所有界面和孔洞等分,获得在所有界面和孔洞对象上等分点的点序列.如果没有设置参数divisions.</param>
///<returns type="Vector3Array">返回所有界面和孔洞等分顶点的坐标数组.</returns>
// 等分所有界面和孔洞,获得的顶点
THREE.Shape.prototype.extractPoints = function ( divisions ) {

	if (this.useSpacedPoints) {
		return this.extractAllSpacedPoints(divisions);
	}

	return this.extractAllPoints(divisions);

};

//
// THREE.Shape.prototype.extractAllPointsWithBend = function ( divisions, bend ) {
//
// 	return {
//
// 		shape: this.transform( bend, divisions ),
// 		holes: this.getPointsHoles( divisions, bend )
//
// 	};
//
// };

/*
///extractAllSpacedPoints方法根据divisions将孔洞等分,获得在所有界面和孔洞对象上等分点的点序列.如果没有设置参数divisions.返回所有界面和孔洞等分顶点的坐标数组.
///定距等分孔洞
*/
///<summary>extractAllSpacedPoints</summary>
///<param name ="divisions" type="int">根据divisions将所有界面和孔洞等分,获得在所有界面和孔洞对象上等分点的点序列.如果没有设置参数divisions.</param>
///<returns type="Object">返回所有界面和孔洞等分顶点的坐标数组.</returns>
// Get points of shape and holes (spaced by regular distance)
// 定距等分,获得所有界面和孔洞的顶点.
THREE.Shape.prototype.extractAllSpacedPoints = function ( divisions ) {

	return {

		shape: this.getTransformedSpacedPoints( divisions ),
		holes: this.getSpacedPointsHoles( divisions )

	};

};

/**************************************************************
 *	Utils shape对象的工具集
 **************************************************************/
THREE.Shape.Utils = {
	/*
	///triangulateShape方法将传递的顶点数组(参数contour)和镂空(孔洞)数组(参数holes)三角化.
	*/
	///<summary>triangulateShape</summary>
	///<param name ="contour" type="Vector3Array">拉伸几何体的顶点数据.</param>
	///<param name ="holes" type="Vector3Array">镂空(孔洞)顶点数据.</param>
	///<returns type="Vector3Array">返回围绕形状的顶点索引.</returns>
	triangulateShape: function ( contour, holes ) {

		function point_in_segment_2D_colin( inSegPt1, inSegPt2, inOtherPt ) {
			// inOtherPt needs to be colinear to the inSegment
			if ( inSegPt1.x != inSegPt2.x ) {
				if ( inSegPt1.x < inSegPt2.x ) {
					return	( ( inSegPt1.x <= inOtherPt.x ) && ( inOtherPt.x <= inSegPt2.x ) );
				} else {
					return	( ( inSegPt2.x <= inOtherPt.x ) && ( inOtherPt.x <= inSegPt1.x ) );
				}
			} else {
				if ( inSegPt1.y < inSegPt2.y ) {
					return	( ( inSegPt1.y <= inOtherPt.y ) && ( inOtherPt.y <= inSegPt2.y ) );
				} else {
					return	( ( inSegPt2.y <= inOtherPt.y ) && ( inOtherPt.y <= inSegPt1.y ) );
				}
			}
		}

		/*
		///intersect_segments_2D方法返回两条线段的交点.
		*/
		///<summary>intersect_segments_2D</summary>
		///<param name ="inSeg1Pt1" type="Vector2">要检查交点的第一条线的起始点.</param>
		///<param name ="inSeg1Pt2" type="Vector2">要检查交点的第一条线的结束点.</param>
		///<param name ="inSeg2Pt1" type="Vector2">要检查交点的第二条线的起始点.</param>
		///<param name ="inSeg2Pt2" type="Vector2">要检查交点的第二条线的结束点.</param>
		///<param name ="inExcludeAdjacentSegs" type="boolean">是否排除相邻的线段.</param>
		///<returns type="Vector2Array">二维向量数组.</returns>
		function intersect_segments_2D( inSeg1Pt1, inSeg1Pt2, inSeg2Pt1, inSeg2Pt2, inExcludeAdjacentSegs ) {
			var EPSILON = 0.0000000001;

			var seg1dx = inSeg1Pt2.x - inSeg1Pt1.x,   seg1dy = inSeg1Pt2.y - inSeg1Pt1.y;
			var seg2dx = inSeg2Pt2.x - inSeg2Pt1.x,   seg2dy = inSeg2Pt2.y - inSeg2Pt1.y;

			var seg1seg2dx = inSeg1Pt1.x - inSeg2Pt1.x;
			var seg1seg2dy = inSeg1Pt1.y - inSeg2Pt1.y;

			var limit		= seg1dy * seg2dx - seg1dx * seg2dy;
			var perpSeg1	= seg1dy * seg1seg2dx - seg1dx * seg1seg2dy;

			if ( Math.abs(limit) > EPSILON ) {			// not parallel //两条线不平行

				var perpSeg2;
				if ( limit > 0 ) {
					if ( ( perpSeg1 < 0 ) || ( perpSeg1 > limit ) ) 		return [];	//返回空数组
					perpSeg2 = seg2dy * seg1seg2dx - seg2dx * seg1seg2dy;
					if ( ( perpSeg2 < 0 ) || ( perpSeg2 > limit ) ) 		return [];	//返回空数组
				} else {
					if ( ( perpSeg1 > 0 ) || ( perpSeg1 < limit ) ) 		return [];	//返回空数组
					perpSeg2 = seg2dy * seg1seg2dx - seg2dx * seg1seg2dy;
					if ( ( perpSeg2 > 0 ) || ( perpSeg2 < limit ) ) 		return [];	//返回空数组
				}

				// i.e. to reduce rounding errors
				// intersection at endpoint of segment#1?
				// 交点位于第一条线的端点
				if ( perpSeg2 == 0 ) {
					if ( ( inExcludeAdjacentSegs ) &&
						 ( ( perpSeg1 == 0 ) || ( perpSeg1 == limit ) ) )		return [];	//返回空数组
					return  [ inSeg1Pt1 ];
				}
				if ( perpSeg2 == limit ) {
					if ( ( inExcludeAdjacentSegs ) &&
						 ( ( perpSeg1 == 0 ) || ( perpSeg1 == limit ) ) )		return [];	//返回空数组
					return  [ inSeg1Pt2 ];
				}
				// intersection at endpoint of segment#2?
				// 交点位于第二条线的端点
				if ( perpSeg1 == 0 )		return  [ inSeg2Pt1 ];
				if ( perpSeg1 == limit )	return  [ inSeg2Pt2 ];

				// return real intersection point
				// 返回真正的交点
				var factorSeg1 = perpSeg2 / limit;
				return	[ { x: inSeg1Pt1.x + factorSeg1 * seg1dx,
							y: inSeg1Pt1.y + factorSeg1 * seg1dy } ];

			} else {		// parallel or colinear 平行或共线
				if ( ( perpSeg1 != 0 ) ||
					 ( seg2dy * seg1seg2dx != seg2dx * seg1seg2dy ) ) 			return [];	//返回空数组

				// they are collinear or degenerate 两条线共线或则无效
				var seg1Pt = ( (seg1dx == 0) && (seg1dy == 0) );	// segment1 ist just a point? 第一条线只是一个点
				var seg2Pt = ( (seg2dx == 0) && (seg2dy == 0) );	// segment2 ist just a point? 第二条线只是一个点
				// both segments are points 两条线都是点
				if ( seg1Pt && seg2Pt ) {
					if ( (inSeg1Pt1.x != inSeg2Pt1.x) ||
						 (inSeg1Pt1.y != inSeg2Pt1.y) )		return [];   	// they are distinct  points 两个点不共点,返回空数组
					return  [ inSeg1Pt1 ];                 					// they are the same point 共点
				}
				// segment#1  is a single point 第一条线段是一个点
				if ( seg1Pt ) {
					if (! point_in_segment_2D_colin( inSeg2Pt1, inSeg2Pt2, inSeg1Pt1 ) )		return [];		// but not in segment#2 不在第二条线段内,返回空数组
					return  [ inSeg1Pt1 ];
				}
				// segment#2  is a single point 第二条线是一个点
				if ( seg2Pt ) {
					if (! point_in_segment_2D_colin( inSeg1Pt1, inSeg1Pt2, inSeg2Pt1 ) )		return [];		// but not in segment#1 不在第一条线段内,返回空数组
					return  [ inSeg2Pt1 ];
				}

				// they are collinear segments, which might overlap 两条线共线,有可能重叠.
				var seg1min, seg1max, seg1minVal, seg1maxVal;
				var seg2min, seg2max, seg2minVal, seg2maxVal;
				if (seg1dx != 0) {		// the segments are NOT on a vertical line 线不是垂直线
					if ( inSeg1Pt1.x < inSeg1Pt2.x ) {
						seg1min = inSeg1Pt1; seg1minVal = inSeg1Pt1.x;
						seg1max = inSeg1Pt2; seg1maxVal = inSeg1Pt2.x;
					} else {
						seg1min = inSeg1Pt2; seg1minVal = inSeg1Pt2.x;
						seg1max = inSeg1Pt1; seg1maxVal = inSeg1Pt1.x;
					}
					if ( inSeg2Pt1.x < inSeg2Pt2.x ) {
						seg2min = inSeg2Pt1; seg2minVal = inSeg2Pt1.x;
						seg2max = inSeg2Pt2; seg2maxVal = inSeg2Pt2.x;
					} else {
						seg2min = inSeg2Pt2; seg2minVal = inSeg2Pt2.x;
						seg2max = inSeg2Pt1; seg2maxVal = inSeg2Pt1.x;
					}
				} else {				// the segments are on a vertical line 
					if ( inSeg1Pt1.y < inSeg1Pt2.y ) {
						seg1min = inSeg1Pt1; seg1minVal = inSeg1Pt1.y;
						seg1max = inSeg1Pt2; seg1maxVal = inSeg1Pt2.y;
					} else {
						seg1min = inSeg1Pt2; seg1minVal = inSeg1Pt2.y;
						seg1max = inSeg1Pt1; seg1maxVal = inSeg1Pt1.y;
					}
					if ( inSeg2Pt1.y < inSeg2Pt2.y ) {
						seg2min = inSeg2Pt1; seg2minVal = inSeg2Pt1.y;
						seg2max = inSeg2Pt2; seg2maxVal = inSeg2Pt2.y;
					} else {
						seg2min = inSeg2Pt2; seg2minVal = inSeg2Pt2.y;
						seg2max = inSeg2Pt1; seg2maxVal = inSeg2Pt1.y;
					}
				}
				if ( seg1minVal <= seg2minVal ) {
					if ( seg1maxVal <  seg2minVal )	return [];
					if ( seg1maxVal == seg2minVal )	{
						if ( inExcludeAdjacentSegs )		return [];
						return [ seg2min ];
					}
					if ( seg1maxVal <= seg2maxVal )	return [ seg2min, seg1max ];
					return	[ seg2min, seg2max ];
				} else {
					if ( seg1minVal >  seg2maxVal )	return [];
					if ( seg1minVal == seg2maxVal )	{
						if ( inExcludeAdjacentSegs )		return [];
						return [ seg1min ];
					}
					if ( seg1maxVal <= seg2maxVal )	return [ seg1min, seg1max ];
					return	[ seg1min, seg2max ];
				}
			}
		}

		/*
		///isPointInsideAngle方法判断第四个参数是否在前三个参数组成的三角形内.
		*/
		///<summary>isPointInsideAngle</summary>
		///<param name ="inVertex" type="int">顶点索引.</param>
		///<param name ="inLegFromPt" type="int">上一个顶点索引.</param>
		///<param name ="inLegToPt" type="int">下一个顶点索引.</param>
		///<param name ="inOtherPt" type="int">孔洞顶点索引.</param>
		///<returns type="boolean">true 或者 false.</returns>
		function isPointInsideAngle( inVertex, inLegFromPt, inLegToPt, inOtherPt ) {
			// The order of legs is important	参数的排列顺序非常重要.

			var EPSILON = 0.0000000001;

			// translation of all points, so that Vertex is at (0,0)
			var legFromPtX	= inLegFromPt.x - inVertex.x,  legFromPtY	= inLegFromPt.y - inVertex.y;
			var legToPtX	= inLegToPt.x	- inVertex.x,  legToPtY		= inLegToPt.y	- inVertex.y;
			var otherPtX	= inOtherPt.x	- inVertex.x,  otherPtY		= inOtherPt.y	- inVertex.y;

			// main angle >0: < 180 deg.; 0: 180 deg.; <0: > 180 deg.
			var from2toAngle	= legFromPtX * legToPtY - legFromPtY * legToPtX;
			var from2otherAngle	= legFromPtX * otherPtY - legFromPtY * otherPtX;

			if ( Math.abs(from2toAngle) > EPSILON ) {			// angle != 180 deg.

				var other2toAngle		= otherPtX * legToPtY - otherPtY * legToPtX;
				// console.log( "from2to: " + from2toAngle + ", from2other: " + from2otherAngle + ", other2to: " + other2toAngle );

				if ( from2toAngle > 0 ) {				// main angle < 180 deg.
					return	( ( from2otherAngle >= 0 ) && ( other2toAngle >= 0 ) );
				} else {								// main angle > 180 deg.
					return	( ( from2otherAngle >= 0 ) || ( other2toAngle >= 0 ) );
				}
			} else {										// angle == 180 deg.
				// console.log( "from2to: 180 deg., from2other: " + from2otherAngle  );
				return	( from2otherAngle > 0 );
			}
		}

		/*
		///removeHoles方法从拉伸几何体中删除孔洞.
		*/
		///<summary>removeHoles</summary>
		///<param name ="contour" type="Vector3Array">拉伸几何体的顶点数据.</param>
		///<param name ="holes" type="Vector3Array">镂空(孔洞)顶点数据.</param>
		///<returns type="Object">返回没有镂空(孔洞)的拉伸几何体.</returns>
		function removeHoles( contour, holes ) {

			var shape = contour.concat(); // work on this shape
			var hole;

			/*
			///isCutLineInsideAngles方法返回当前索引所指的图形顶点在镂空顶点,以及前一个顶点,后一个顶点组成的三角形内.
			// 或者当前索引所指的镂空顶点在图形顶点,以及前一个顶点,后一个顶点组成的三角形内,true为真.
			*/
			///<summary>isCutLineInsideAngles</summary>
			///<param name ="inShapeIdx" type="int">拉伸几何体的顶点数据.</param>
			///<param name ="inHoleIdx" type="int">镂空(孔洞)顶点数据.</param>
			///<returns type="boolean">true 或者 false.</returns>
			function isCutLineInsideAngles( inShapeIdx, inHoleIdx ) {
				// Check if hole point lies within angle around shape point
				// 检查镂空(孔洞)的顶点在
				var lastShapeIdx = shape.length - 1;

				var prevShapeIdx = inShapeIdx - 1;
				if ( prevShapeIdx < 0 )			prevShapeIdx = lastShapeIdx;

				var nextShapeIdx = inShapeIdx + 1;
				if ( nextShapeIdx > lastShapeIdx )	nextShapeIdx = 0;

				var insideAngle = isPointInsideAngle( shape[inShapeIdx], shape[ prevShapeIdx ], shape[ nextShapeIdx ], hole[inHoleIdx] );
				if (! insideAngle ) {
					// console.log( "Vertex (Shape): " + inShapeIdx + ", Point: " + hole[inHoleIdx].x + "/" + hole[inHoleIdx].y );
					return	false;
				}

				// Check if shape point lies within angle around hole point
				// 检查图形顶点位于环绕镂空(孔洞)的三角形内.
				var lastHoleIdx = hole.length - 1;

				var prevHoleIdx = inHoleIdx - 1;
				if ( prevHoleIdx < 0 )			prevHoleIdx = lastHoleIdx;

				var nextHoleIdx = inHoleIdx + 1;
				if ( nextHoleIdx > lastHoleIdx )	nextHoleIdx = 0;

				insideAngle = isPointInsideAngle( hole[inHoleIdx], hole[ prevHoleIdx ], hole[ nextHoleIdx ], shape[inShapeIdx] );
				if (! insideAngle ) {
					// console.log( "Vertex (Hole): " + inHoleIdx + ", Point: " + shape[inShapeIdx].x + "/" + shape[inShapeIdx].y );
					return	false;
				}

				return	true;	//
			}
			/*
			///intersectsShapeEdge方法检查镂空(孔洞)与形状边界是否有交点,true为真.
			*/
			///<summary>isCutLineInsideAngles</summary>
			///<param name ="inShapeIdx" type="int">拉伸几何体的顶点数据.</param>
			///<param name ="inHoleIdx" type="int">镂空(孔洞)顶点数据.</param>
			///<returns type="boolean">true 或者 false.</returns>
			function intersectsShapeEdge( inShapePt, inHolePt ) {
				// checks for intersections with shape edges
				// 检查镂空(孔洞)与形状边界是否有交点.
				var sIdx, nextIdx, intersection;
				for ( sIdx = 0; sIdx < shape.length; sIdx ++ ) {
					nextIdx = sIdx+1; nextIdx %= shape.length;
					intersection = intersect_segments_2D( inShapePt, inHolePt, shape[sIdx], shape[nextIdx], true );
					if ( intersection.length > 0 )		return	true;
				}

				return	false;
			}

			var indepHoles = [];
			/*
			///intersectsShapeEdge方法检查当前的镂空(孔洞)是否是否与其它镂空(孔洞)边界相交,true为真.
			*/
			///<summary>isCutLineInsideAngles</summary>
			///<param name ="inShapeIdx" type="int">拉伸几何体的顶点数据.</param>
			///<param name ="inHoleIdx" type="int">镂空(孔洞)顶点数据.</param>
			///<returns type="boolean">true 或者 false.</returns>
			function intersectsHoleEdge( inShapePt, inHolePt ) {
				// checks for intersections with hole edges
				// 检查当前的镂空(孔洞)是否是否与其它镂空(孔洞)边界相交.
				var ihIdx, chkHole,
					hIdx, nextIdx, intersection;
				for ( ihIdx = 0; ihIdx < indepHoles.length; ihIdx ++ ) {
					chkHole = holes[indepHoles[ihIdx]];
					for ( hIdx = 0; hIdx < chkHole.length; hIdx ++ ) {
						nextIdx = hIdx+1; nextIdx %= chkHole.length;
						intersection = intersect_segments_2D( inShapePt, inHolePt, chkHole[hIdx], chkHole[nextIdx], true );
						if ( intersection.length > 0 )		return	true;
					}
				}
				return	false;
			}

			var holeIndex, shapeIndex,
				shapePt, holePt,
				holeIdx, cutKey, failedCuts = [],
				tmpShape1, tmpShape2,
				tmpHole1, tmpHole2;

			for ( var h = 0, hl = holes.length; h < hl; h ++ ) {

				indepHoles.push( h );

			}

			var minShapeIndex = 0;
			var counter = indepHoles.length * 2;
			while ( indepHoles.length > 0 ) {
				counter --;
				if ( counter < 0 ) {
					console.log( "Infinite Loop! Holes left:" + indepHoles.length + ", Probably Hole outside Shape!" );
					break;
				}

				// search for shape-vertex and hole-vertex,
				// 搜索形状的顶点和镂空(孔洞)顶点
				// which can be connected without intersections
				// 哪些可以连接并无交点.
				for ( shapeIndex = minShapeIndex; shapeIndex < shape.length; shapeIndex ++ ) {

					shapePt = shape[ shapeIndex ];
					holeIndex	= - 1;

					// search for hole which can be reached without intersections
					// 搜索镂空(孔洞)的顶点,哪些可以到达并没有交点.
					for ( var h = 0; h < indepHoles.length; h ++ ) {
						holeIdx = indepHoles[h];

						// prevent multiple checks
						// 避免多次检查
						cutKey = shapePt.x + ":" + shapePt.y + ":" + holeIdx;
						if ( failedCuts[cutKey] !== undefined )			continue;

						hole = holes[holeIdx];
						for ( var h2 = 0; h2 < hole.length; h2 ++ ) {
							holePt = hole[ h2 ];
							if (! isCutLineInsideAngles( shapeIndex, h2 ) )		continue;	//如果孔洞顶点不在切线内
							if ( intersectsShapeEdge( shapePt, holePt ) )		continue;	//如果与图形的边相交.
							if ( intersectsHoleEdge( shapePt, holePt ) )		continue;	//如果与镂空(空洞)的边相交.

							holeIndex = h2;
							indepHoles.splice(h,1);

							tmpShape1 = shape.slice( 0, shapeIndex+1 );
							tmpShape2 = shape.slice( shapeIndex );
							tmpHole1 = hole.slice( holeIndex );
							tmpHole2 = hole.slice( 0, holeIndex+1 );

							shape = tmpShape1.concat( tmpHole1 ).concat( tmpHole2 ).concat( tmpShape2 );

							minShapeIndex = shapeIndex;

							// Debug only, to show the selected cuts
							// glob_CutLines.push( [ shapePt, holePt ] );

							break;
						}
						if ( holeIndex >= 0 )	break;		// hole-vertex found 找到镂空顶点

						failedCuts[cutKey] = true;			// remember failure	//添加切割线顶点索引
					}
					if ( holeIndex >= 0 )	break;		// hole-vertex found	//找到镂空(孔洞)顶点
				}
			}

			return shape; 			/* shape with no holes */ // 返回不包含镂空(孔洞)的形状.
		}


		var i, il, f, face,
			key, index,
			allPointsMap = {};

		// To maintain reference to old shape, one must match coordinates, or offset the indices from original arrays. It's probably easier to do the first.
		// 将孔洞的顶点按照图形原来坐标顺序,偏移索引,这是首先能做的.

		var allpoints = contour.concat(); 	//声明数组,存放合并后的顶点数组.

		for ( var h = 0, hl = holes.length; h < hl; h ++ ) {	//遍历镂空(孔洞)的顶点

			Array.prototype.push.apply( allpoints, holes[h] );	//将镂空(孔洞)的顶点压入所有顶点数组中.

		}

		//console.log( "allpoints",allpoints, allpoints.length );

		// prepare all points map 准备所有的顶点的哈希表.

		for ( i = 0, il = allpoints.length; i < il; i ++ ) {

			key = allpoints[ i ].x + ":" + allpoints[ i ].y;

			if ( allPointsMap[ key ] !== undefined ) {

				console.log( "Duplicate point", key );

			}

			allPointsMap[ key ] = i;

		}

		// remove holes by cutting paths to holes and adding them to the shape
		// 删除镂空(孔洞),并将孔洞的作为实体的一部分.
		var shapeWithoutHoles = removeHoles( contour, holes );	//调用removeHoles方法.

		var triangles = THREE.FontUtils.Triangulate( shapeWithoutHoles, false ); // True returns indices for points of spooled shape 真正返回围绕形状的顶点索引.
		//console.log( "triangles",triangles, triangles.length );

		// check all face vertices against all points map
		// 检查所有的面顶点顺序与所有顶点的哈希表一致.

		for ( i = 0, il = triangles.length; i < il; i ++ ) {

			face = triangles[ i ];

			for ( f = 0; f < 3; f ++ ) {

				key = face[ f ].x + ":" + face[ f ].y;

				index = allPointsMap[ key ];

				if ( index !== undefined ) {

					face[ f ] = index;

				}

			}

		}

		return triangles.concat(); //返回围绕形状的顶点索引.

	},
	/*
	///isClockWise方法判断顶点坐标数组的顺序是否是顺时针.
	*/
	///<summary>isClockWise</summary>
	///<param name ="pts" type="PointArray">顶点坐标数组</param>
	///<returns type="boolean">返回true 或者 false.</returns>
	isClockWise: function ( pts ) {

		return THREE.FontUtils.Triangulate.area( pts ) < 0;

	},

	// Bezier Curves formulas obtained from
	// http://en.wikipedia.org/wiki/B%C3%A9zier_curve

	// Quad Bezier Functions
	// 二次贝塞尔方程.

	b2p0: function ( t, p ) {

		var k = 1 - t;
		return k * k * p;

	},

	b2p1: function ( t, p ) {

		return 2 * ( 1 - t ) * t * p;

	},

	b2p2: function ( t, p ) {

		return t * t * p;

	},

	b2: function ( t, p0, p1, p2 ) {

		return this.b2p0( t, p0 ) + this.b2p1( t, p1 ) + this.b2p2( t, p2 );

	},

	// Cubic Bezier Functions
	// 三次贝塞尔取信方程.

	b3p0: function ( t, p ) {

		var k = 1 - t;
		return k * k * k * p;

	},

	b3p1: function ( t, p ) {

		var k = 1 - t;
		return 3 * k * k * t * p;

	},

	b3p2: function ( t, p ) {

		var k = 1 - t;
		return 3 * k * t * t * p;

	},

	b3p3: function ( t, p ) {

		return t * t * t * p;

	},

	b3: function ( t, p0, p1, p2, p3 ) {

		return this.b3p0( t, p0 ) + this.b3p1( t, p1 ) + this.b3p2( t, p2 ) +  this.b3p3( t, p3 );

	}

};

