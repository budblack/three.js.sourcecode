/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Creates free form 2d path using series of points, lines or curves.
 * 使用系列点创建自由形式的二维路径，直线或曲线。
 *
 **/
/*
///Path类创建2d的路径,包括点,线,和立方体,类似于HTML5 2D画布的API,curvePath类的扩展.
*/
///<summary>Curve</summary>
///<param name ="points" type="Vector2Array">2维向量数组</param>
THREE.Path = function ( points ) {

	THREE.CurvePath.call(this);	//调用CurvePath对象的call方法,将原本属于CurvePath的方法交给当前对象Path来使用.

	this.actions = [];	//可用的动作数组.

	if ( points ) {		//如果有参数points

		this.fromPoints( points );	//调用fromPoints方法创建路径.

	}

};
/*************************************************
****下面是Path对象的方法属性定义,继承自CurvePath对象.
**************************************************/
THREE.Path.prototype = Object.create( THREE.CurvePath.prototype );

THREE.PathActions = {

	MOVE_TO: 'moveTo',		//把路径移动到画布中的指定点，不创建线条
	LINE_TO: 'lineTo',		//添加一个新点，然后在画布中创建从该点到最后指定点的线条
	QUADRATIC_CURVE_TO: 'quadraticCurveTo', // Bezier quadratic curve //创建二次贝塞尔曲线
	BEZIER_CURVE_TO: 'bezierCurveTo', 		// Bezier cubic curve 	  //创建三次贝塞尔曲线
	CSPLINE_THRU: 'splineThru',				// Catmull-rom spline  	  //样条曲线通过
	ARC: 'arc',								// Circle				  //创建弧/曲线（用于创建圆形或部分圆）
	ELLIPSE: 'ellipse'												  //创建椭圆.
};

// TODO Clean up PATH API
/*
///fromPoints方法通过连接二维向量数组(参数vectors)内所有的顶点,创建路径.
*/
///<summary>fromPoints</summary>
///<param name ="vectors" type="Vector2Array">包含顶点信息的二维向量数组</param>
// Create path using straight lines to connect all points
// 连接所有的点,创建路径.
// - vectors: array of Vector2
// - vectors:2位向量数组.
THREE.Path.prototype.fromPoints = function ( vectors ) {

	this.moveTo( vectors[ 0 ].x, vectors[ 0 ].y );	//将光标移到vectors数组中第一个顶点的位置.

	for ( var v = 1, vlen = vectors.length; v < vlen; v ++ ) {	//遍历二维数组

		this.lineTo( vectors[ v ].x, vectors[ v ].y );	//调用lineTo方法,连接所有的顶点.

	};

};

// startPath() endPath()?
/*
///moveTo方法把路径移动到画布中的指定点，不创建线条,把moveTo动作和坐标压入actions数组.
*/
///<summary>moveTo</summary>
///<param name ="x" type="float">x坐标</param>
///<param name ="y" type="float">y坐标</param>
THREE.Path.prototype.moveTo = function ( x, y ) {

	var args = Array.prototype.slice.call( arguments );
	this.actions.push( { action: THREE.PathActions.MOVE_TO, args: args } );		//把moveTo动作和坐标压入actions数组

};
/*
///lineTo方法添加一个新点，然后在画布中创建从该点到最后指定点的线条,把lineTo动作和坐标压入actions数组.
*/
///<summary>moveTo</summary>
///<param name ="x" type="float">结束点x坐标</param>
///<param name ="y" type="float">结束点y坐标</param>
THREE.Path.prototype.lineTo = function ( x, y ) {

	var args = Array.prototype.slice.call( arguments );

	var lastargs = this.actions[ this.actions.length - 1 ].args;

	var x0 = lastargs[ lastargs.length - 2 ];	//通过计算获得起始点x坐标
	var y0 = lastargs[ lastargs.length - 1 ];	//通过计算获得起始点y坐标

	var curve = new THREE.LineCurve( new THREE.Vector2( x0, y0 ), new THREE.Vector2( x, y ) );	//创建可用的2d线段对象
	this.curves.push( curve );	//将曲线压入曲线对象数组

	this.actions.push( { action: THREE.PathActions.LINE_TO, args: args } );	//把lineTo动作和坐标压入actions数组

};
/*
///quadraticCurveTo方法创建二次贝塞尔曲线,把quadraticCurveTo动作和坐标压入actions数组.
*/
///<summary>quadraticCurveTo</summary>
///<param name ="aCPx" type="float">中间点x坐标</param>
///<param name ="aCPy" type="float">中间点y坐标</param>
///<param name ="aX" type="float">结束点x坐标</param>
///<param name ="aY" type="float">结束点y坐标</param>
THREE.Path.prototype.quadraticCurveTo = function( aCPx, aCPy, aX, aY ) {

	var args = Array.prototype.slice.call( arguments );

	var lastargs = this.actions[ this.actions.length - 1 ].args;

	var x0 = lastargs[ lastargs.length - 2 ];	//通过计算获得起始点x坐标
	var y0 = lastargs[ lastargs.length - 1 ];	//通过计算获得起始点y坐标

	var curve = new THREE.QuadraticBezierCurve( new THREE.Vector2( x0, y0 ),
												new THREE.Vector2( aCPx, aCPy ),
												new THREE.Vector2( aX, aY ) );		//创建2d的贝塞尔曲线对象.
	this.curves.push( curve );	//将曲线压入曲线对象数组

	this.actions.push( { action: THREE.PathActions.QUADRATIC_CURVE_TO, args: args } );	//把quadraticCurveTo动作和坐标压入actions数组.

};

/*
///bezierCurveTo方法创建平滑的二次贝塞尔曲线,把bezierCurveTo动作和坐标压入actions数组.
*/
///<summary>bezierCurveTo</summary>
///<param name ="aCP1x" type="float">第一个控制点点x坐标</param>
///<param name ="aCP1y" type="float">第一个控制点y坐标</param>
///<param name ="aCP2x" type="float">第二个控制点x坐标</param>
///<param name ="aCP2y" type="float">第二个控制点y坐标</param>
///<param name ="aX" type="float">结束点x坐标</param>
///<param name ="aY" type="float">结束点y坐标</param>
THREE.Path.prototype.bezierCurveTo = function( aCP1x, aCP1y,
											   aCP2x, aCP2y,
											   aX, aY ) {

	var args = Array.prototype.slice.call( arguments );

	var lastargs = this.actions[ this.actions.length - 1 ].args;

	var x0 = lastargs[ lastargs.length - 2 ];	//通过计算获得起始点x坐标
	var y0 = lastargs[ lastargs.length - 1 ];	//通过计算获得起始点y坐标

	var curve = new THREE.CubicBezierCurve( new THREE.Vector2( x0, y0 ),
											new THREE.Vector2( aCP1x, aCP1y ),
											new THREE.Vector2( aCP2x, aCP2y ),
											new THREE.Vector2( aX, aY ) );	//创建平滑的贝塞尔曲线对象
	this.curves.push( curve );

	this.actions.push( { action: THREE.PathActions.BEZIER_CURVE_TO, args: args } );	//把bezierCurveTo动作和坐标压入actions数组

};

/*
///splineThru方法通过一系列点组成的数组创建一个平滑的二维样条曲线的,把splineThru动作和坐标压入actions数组.
*/
///<summary>splineThru</summary>
///<param name ="pts" type="Vector2Array">顶点组成的数组</param>
THREE.Path.prototype.splineThru = function( pts /*Array of Vector*/ ) {

	var args = Array.prototype.slice.call( arguments );
	var lastargs = this.actions[ this.actions.length - 1 ].args;

	var x0 = lastargs[ lastargs.length - 2 ];	//通过计算获得起始点x坐标
	var y0 = lastargs[ lastargs.length - 1 ];	//通过计算获得起始点y坐标
//---
	var npts = [ new THREE.Vector2( x0, y0 ) ];
	Array.prototype.push.apply( npts, pts );	//将起始点和顶点组成的数组合并.

	var curve = new THREE.SplineCurve( npts );	//创建平滑的二维样条曲线对象.
	this.curves.push( curve );

	this.actions.push( { action: THREE.PathActions.CSPLINE_THRU, args: args } );	//把splineThru动作和坐标压入actions数组

};

// FUTURE: Change the API or follow canvas API?

/*
///arc方法创建弧/曲线（用于创建圆形或部分圆）,把arc动作和坐标压入actions数组.
*/
///<summary>arc</summary>
///<param name ="aX" type="float">圆形或圆弧的圆心x坐标</param>
///<param name ="aY" type="float">圆形或圆弧的圆心y坐标</param>
///<param name ="aRadius" type="float">圆形或圆弧的半径</param>
///<param name ="aStartAngle" type="float">圆形或圆弧的起始点角度,用弧度表示</param>
///<param name ="aEndAngle" type="float">圆形或圆弧的结束点点角度,用弧度表示</param>
///<param name ="aClockwise" type="boolean">x是否是顺时针</param>
THREE.Path.prototype.arc = function ( aX, aY, aRadius,
									  aStartAngle, aEndAngle, aClockwise ) {

	var lastargs = this.actions[ this.actions.length - 1].args;
	var x0 = lastargs[ lastargs.length - 2 ];	//通过计算获得起始点x坐标
	var y0 = lastargs[ lastargs.length - 1 ];	//通过计算获得起始点y坐标

	this.absarc(aX + x0, aY + y0, aRadius,
		aStartAngle, aEndAngle, aClockwise );	//调用absarc方法,创建圆弧对象.

 };

/*
///absarc方法创建弧/曲线（用于创建圆形或部分圆）,把absarc动作和坐标压入actions数组.
*/
///<summary>absarc</summary>
///<param name ="aX" type="float">圆形或圆弧的圆心x坐标</param>
///<param name ="aY" type="float">圆形或圆弧的圆心y坐标</param>
///<param name ="aRadius" type="float">圆形或圆弧的半径</param>
///<param name ="aStartAngle" type="float">圆形或圆弧的起始点角度,用弧度表示</param>
///<param name ="aEndAngle" type="float">圆形或圆弧的结束点点角度,用弧度表示</param>
///<param name ="aClockwise" type="boolean">x是否是顺时针</param>
 THREE.Path.prototype.absarc = function ( aX, aY, aRadius,
									  aStartAngle, aEndAngle, aClockwise ) {
	this.absellipse(aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise);	//调用absellipse方法,创建圆弧对象.
 };

/*
///ellipse方法创建椭圆弧/曲线（用于创建椭圆或部分椭圆）,把ellipse动作和坐标压入actions数组.
*/
///<summary>absarc</summary>
///<param name ="aX" type="float">椭圆或椭圆弧的圆心x坐标</param>
///<param name ="aY" type="float">椭圆或椭圆弧的圆心y坐标</param>
///<param name ="xRadius" type="float">椭圆或椭圆弧的半径</param>
///<param name ="yRadius" type="float">椭圆或椭圆弧的半径</param>
///<param name ="aStartAngle" type="float">椭圆或椭圆弧的起始点角度,用弧度表示</param>
///<param name ="aEndAngle" type="float">椭圆或椭圆弧的结束点点角度,用弧度表示</param>
///<param name ="aClockwise" type="boolean">x是否是顺时针</param>
THREE.Path.prototype.ellipse = function ( aX, aY, xRadius, yRadius,
									  aStartAngle, aEndAngle, aClockwise ) {

	var lastargs = this.actions[ this.actions.length - 1].args;
	var x0 = lastargs[ lastargs.length - 2 ];	//通过计算获得起始点x坐标
	var y0 = lastargs[ lastargs.length - 1 ];	//通过计算获得起始点y坐标

	this.absellipse(aX + x0, aY + y0, xRadius, yRadius,
		aStartAngle, aEndAngle, aClockwise );		//调用absellipse方法,创建椭圆弧对象.

 };

/*
///absellipse方法创建椭圆弧/曲线（用于创建椭圆或部分椭圆）,把absellipse动作和坐标压入actions数组.
*/
///<summary>absellipse</summary>
///<param name ="aX" type="float">椭圆或椭圆弧的圆心x坐标</param>
///<param name ="aY" type="float">椭圆或椭圆弧的圆心y坐标</param>
///<param name ="xRadius" type="float">椭圆或椭圆弧的半径</param>
///<param name ="yRadius" type="float">椭圆或椭圆弧的半径</param>
///<param name ="aStartAngle" type="float">椭圆或椭圆弧的起始点角度,用弧度表示</param>
///<param name ="aEndAngle" type="float">椭圆或椭圆弧的结束点点角度,用弧度表示</param>
///<param name ="aClockwise" type="boolean">x是否是顺时针</param>
THREE.Path.prototype.absellipse = function ( aX, aY, xRadius, yRadius,
									  aStartAngle, aEndAngle, aClockwise ) {

	var args = Array.prototype.slice.call( arguments );
	var curve = new THREE.EllipseCurve( aX, aY, xRadius, yRadius,
									aStartAngle, aEndAngle, aClockwise );	//调用EllipseCurve方法,创建椭圆弧椭圆对象.
	this.curves.push( curve );		//将曲线对象压入曲线数组.

	var lastPoint = curve.getPoint(1);
	args.push(lastPoint.x);
	args.push(lastPoint.y);

	this.actions.push( { action: THREE.PathActions.ELLIPSE, args: args } );		//把ELLIPSE动作和坐标压入actions数组.

 };

/*
///getSpacedPoints方法根据divisions将路径等分,获得在路径对象上等分点的点序列.如果没有设置参数divisions,默认初始化为40等分.返回对应等分线段端点在路径上的相对位置顶点.
*/
///<summary>getSpacedPoints</summary>
///<param name ="divisions" type="int">根据divisions将路径等分,获得在路径对象上等分点的点序列.如果没有设置参数divisions,默认初始化为50等分.</param>
///<returns type="Vector3Array">返回对应等分线段端点在路径上的相对位置顶点.</returns>
THREE.Path.prototype.getSpacedPoints = function ( divisions, closedPath ) {

	if ( ! divisions ) divisions = 40;

	var points = [];

	for ( var i = 0; i < divisions; i ++ ) {

		points.push( this.getPoint( i / divisions ) );

		//if( !this.getPoint( i / divisions ) ) throw "DIE";

	}

	// if ( closedPath ) {
	//
	// 	points.push( points[ 0 ] );
	//
	// }

	return points;	//返回对应等分线段端点在路径上的相对位置顶点

};

/*
///getPoints方法根据divisions将路径等分,获得在路径对象上等分点的点序列.如果没有设置参数divisions,默认初始化为12等分.返回对应等分线段顶点的坐标数组.
///定量等分曲线
*/
///<summary>getPoints</summary>
///<param name ="divisions" type="int">根据divisions将路径等分,获得在路径对象上等分点的点序列.如果没有设置参数divisions,默认初始化为12等分.</param>
///<param name ="closedPath" type="boolean">如果closePath设置为true,添加闭合点,即第一个顶点,可选参数.</param>
///<returns type="Vector3Array">返回对应等分线段顶点的坐标数组.</returns>

/* Return an array of vectors based on contour of the path */
// 基于路径轮廓返回一个矢量数组

THREE.Path.prototype.getPoints = function( divisions, closedPath ) {

	if (this.useSpacedPoints) {
		console.log('tata');
		return this.getSpacedPoints( divisions, closedPath );	//调用getSpacePoints方法,将路径等分,获得等分线段的分界点坐标.
	}

	divisions = divisions || 12;	//如果divisions没有设置,默认初始化为12

	var points = [];

	var i, il, item, action, args;
	var cpx, cpy, cpx2, cpy2, cpx1, cpy1, cpx0, cpy0,
		laste, j,
		t, tx, ty;

	for ( i = 0, il = this.actions.length; i < il; i ++ ) {		//遍历actions数组

		item = this.actions[ i ];

		action = item.action;
		args = item.args;

		switch( action ) {	//根据action计算路径的长度,并返回总长度.

		case THREE.PathActions.MOVE_TO:

			points.push( new THREE.Vector2( args[ 0 ], args[ 1 ] ) );

			break;

		case THREE.PathActions.LINE_TO:

			points.push( new THREE.Vector2( args[ 0 ], args[ 1 ] ) );

			break;

		case THREE.PathActions.QUADRATIC_CURVE_TO:

			cpx  = args[ 2 ];
			cpy  = args[ 3 ];

			cpx1 = args[ 0 ];
			cpy1 = args[ 1 ];

			if ( points.length > 0 ) {

				laste = points[ points.length - 1 ];

				cpx0 = laste.x;
				cpy0 = laste.y;

			} else {

				laste = this.actions[ i - 1 ].args;

				cpx0 = laste[ laste.length - 2 ];
				cpy0 = laste[ laste.length - 1 ];

			}

			for ( j = 1; j <= divisions; j ++ ) {

				t = j / divisions;

				tx = THREE.Shape.Utils.b2( t, cpx0, cpx1, cpx );
				ty = THREE.Shape.Utils.b2( t, cpy0, cpy1, cpy );

				points.push( new THREE.Vector2( tx, ty ) );

			}

			break;

		case THREE.PathActions.BEZIER_CURVE_TO:

			cpx  = args[ 4 ];
			cpy  = args[ 5 ];

			cpx1 = args[ 0 ];
			cpy1 = args[ 1 ];

			cpx2 = args[ 2 ];
			cpy2 = args[ 3 ];

			if ( points.length > 0 ) {

				laste = points[ points.length - 1 ];

				cpx0 = laste.x;
				cpy0 = laste.y;

			} else {

				laste = this.actions[ i - 1 ].args;

				cpx0 = laste[ laste.length - 2 ];
				cpy0 = laste[ laste.length - 1 ];

			}


			for ( j = 1; j <= divisions; j ++ ) {

				t = j / divisions;

				tx = THREE.Shape.Utils.b3( t, cpx0, cpx1, cpx2, cpx );
				ty = THREE.Shape.Utils.b3( t, cpy0, cpy1, cpy2, cpy );

				points.push( new THREE.Vector2( tx, ty ) );

			}

			break;

		case THREE.PathActions.CSPLINE_THRU:

			laste = this.actions[ i - 1 ].args;

			var last = new THREE.Vector2( laste[ laste.length - 2 ], laste[ laste.length - 1 ] );
			var spts = [ last ];

			var n = divisions * args[ 0 ].length;

			spts = spts.concat( args[ 0 ] );

			var spline = new THREE.SplineCurve( spts );

			for ( j = 1; j <= n; j ++ ) {

				points.push( spline.getPointAt( j / n ) ) ;

			}

			break;

		case THREE.PathActions.ARC:

			var aX = args[ 0 ], aY = args[ 1 ],
				aRadius = args[ 2 ],
				aStartAngle = args[ 3 ], aEndAngle = args[ 4 ],
				aClockwise = !! args[ 5 ];

			var deltaAngle = aEndAngle - aStartAngle;
			var angle;
			var tdivisions = divisions * 2;

			for ( j = 1; j <= tdivisions; j ++ ) {

				t = j / tdivisions;

				if ( ! aClockwise ) {

					t = 1 - t;

				}

				angle = aStartAngle + t * deltaAngle;

				tx = aX + aRadius * Math.cos( angle );
				ty = aY + aRadius * Math.sin( angle );

				//console.log('t', t, 'angle', angle, 'tx', tx, 'ty', ty);

				points.push( new THREE.Vector2( tx, ty ) );

			}

			//console.log(points);

		  break;
		  
		case THREE.PathActions.ELLIPSE:

			var aX = args[ 0 ], aY = args[ 1 ],
				xRadius = args[ 2 ],
				yRadius = args[ 3 ],
				aStartAngle = args[ 4 ], aEndAngle = args[ 5 ],
				aClockwise = !! args[ 6 ];


			var deltaAngle = aEndAngle - aStartAngle;
			var angle;
			var tdivisions = divisions * 2;

			for ( j = 1; j <= tdivisions; j ++ ) {

				t = j / tdivisions;

				if ( ! aClockwise ) {

					t = 1 - t;

				}

				angle = aStartAngle + t * deltaAngle;

				tx = aX + xRadius * Math.cos( angle );
				ty = aY + yRadius * Math.sin( angle );

				//console.log('t', t, 'angle', angle, 'tx', tx, 'ty', ty);

				points.push( new THREE.Vector2( tx, ty ) );

			}

			//console.log(points);

		  break;

		} // end switch

	}



	// Normalize to remove the closing point by default.
	// 归一化默认会删除闭合点,
	var lastPoint = points[ points.length - 1];
	var EPSILON = 0.0000000001;
	if ( Math.abs(lastPoint.x - points[ 0 ].x) < EPSILON &&
			 Math.abs(lastPoint.y - points[ 0 ].y) < EPSILON)
		points.splice( points.length - 1, 1);
	if ( closedPath ) {

		points.push( points[ 0 ] );	//如果closePath设置为true,添加闭合点,即第一个顶点

	}

	return points;

};

//
// Breaks path into shapes 
//
//	Assumptions (if parameter isCCW==true the opposite holds):
//	- solid shapes are defined clockwise (CW)
//  - 实体图形对象顶点顺序被定义为顺时针方向
//	- holes are defined counterclockwise (CCW)
//  - 掏空的孔洞对象的顶点顺序被定义为逆时针
//
//	If parameter noHoles==true:
//  - all subPaths are regarded as solid shapes 所有的子路径为实体图形
//  - definition order CW/CCW has no relevance	定义的顺时针,逆时针都没有作用.
//
/*
///toShapes方法将存储在路境内的动作和顶点按照指定的顶点顺序(isCCW,)和是否包含空洞(noHoles),创建实体对象.
*/
///<summary>toShapes</summary>
///<param name ="isCCW" type="boolean">图形顶点顺序是否是你时针方向</param>
///<param name ="noHoles" type="boolean">图形顶点顺序不管是不是逆时针,都不能生成空洞.</param>
THREE.Path.prototype.toShapes = function( isCCW, noHoles ) {
	/*
	///extractSubpaths方法将参数inActions压入subPaths,并将subPaths返回,从函数代码逻辑可以看出将参数inActions作为子路径返回.
	*/
	///<summary>extractSubpaths</summary>
	///<param name ="inActions" type="ObjectArray">包含图形动作和坐标的数组</param>
	///<returns type="ObjectArray">返回子路径.</returns>
	function extractSubpaths( inActions ) {

		var i, il, item, action, args;

		var subPaths = [], lastPath = new THREE.Path();

		for ( i = 0, il = inActions.length; i < il; i ++ ) {	//遍历inActions数组

			item = inActions[ i ];

			args = item.args;
			action = item.action;

			if ( action == THREE.PathActions.MOVE_TO ) {

				if ( lastPath.actions.length != 0 ) {

					subPaths.push( lastPath );
					lastPath = new THREE.Path();

				}

			}

			lastPath[ action ].apply( lastPath, args );

		}

		if ( lastPath.actions.length != 0 ) {

			subPaths.push( lastPath );

		}

		// console.log(subPaths);

		return	subPaths;
	}
	/*
	///toShapesNoHoles方法将参数inSubpaths压入shapes,并将shapes返回,从函数名称中可以看出将子路径生成为实体图形,而非孔洞.
	*/
	///<summary>toShapesNoHoles</summary>
	///<param name ="inSubpaths" type="ObjectArray">包含图形动作和坐标的数组</param>
	///<returns type="ObjectArray">返回实体图形动作和坐标组成的数组.</returns>
	function toShapesNoHoles( inSubpaths ) {

		var shapes = [];

		for ( var i = 0, il = inSubpaths.length; i < il; i ++ ) {

			var tmpPath = inSubpaths[ i ];

			var tmpShape = new THREE.Shape();
			tmpShape.actions = tmpPath.actions;
			tmpShape.curves = tmpPath.curves;

			shapes.push( tmpShape );
		}

		//console.log("shape", shapes);

		return shapes;
	};
	/*
	///isPointInsidePolygon方法从函数名称中可以看出,实在判断参数inPt(vector2),是否在多边形内部(参数inPolygon,vector2Array)
	*/
	///<summary>isPointInsidePolygon</summary>
	///<param name ="inPt" type="ObjectArray">要判断的顶点坐标</param>
	///<param name ="inPolygon" type="vector2Array">要判断的多边形坐标数组</param>
	///<returns type="inPolygon">返回实体图形动作和坐标组成的数组.</returns>
	function isPointInsidePolygon( inPt, inPolygon ) {
		var EPSILON = 0.0000000001;

		var polyLen = inPolygon.length;

		// inPt on polygon contour => immediate success    or
		// toggling of inside/outside at every single! intersection point of an edge
		//  with the horizontal line through inPt, left of inPt
		//  not counting lowerY endpoints of edges and whole edges on that line
		// inPt 在多边形外轮廓线上 => 立即成功 或者 inPt 位于多边形轮廓线外部或者内部, 
		// 通过判断水平通过inPt的直线与多边形是否交点,遍历多边形的所有边的y方向的最小
		// 值不在在水平通过inPt的直线上,说明不相交
		var inside = false;
		for( var p = polyLen - 1, q = 0; q < polyLen; p = q ++ ) {
			var edgeLowPt  = inPolygon[ p ];
			var edgeHighPt = inPolygon[ q ];

			var edgeDx = edgeHighPt.x - edgeLowPt.x;
			var edgeDy = edgeHighPt.y - edgeLowPt.y;

			if ( Math.abs(edgeDy) > EPSILON ) {			// not parallel 不平行
				if ( edgeDy < 0 ) {
					edgeLowPt  = inPolygon[ q ]; edgeDx = - edgeDx;
					edgeHighPt = inPolygon[ p ]; edgeDy = - edgeDy;
				}
				if ( ( inPt.y < edgeLowPt.y ) || ( inPt.y > edgeHighPt.y ) ) 		continue;

				if ( inPt.y == edgeLowPt.y ) {
					if ( inPt.x == edgeLowPt.x )		return	true;		// inPt is on contour ?
					// continue;				// no intersection or edgeLowPt => doesn't count !!!
				} else {
					var perpEdge = edgeDy * (inPt.x - edgeLowPt.x) - edgeDx * (inPt.y - edgeLowPt.y);
					if ( perpEdge == 0 )				return	true;		// inPt is on contour ?
					if ( perpEdge < 0 ) 				continue;
					inside = ! inside;		// true intersection left of inPt
				}
			} else {		// parallel or colinear 平行于
				if ( inPt.y != edgeLowPt.y ) 		continue;			// parallel 平行
				// egde lies on the same horizontal line as inPt
				if ( ( ( edgeHighPt.x <= inPt.x ) && ( inPt.x <= edgeLowPt.x ) ) ||
					 ( ( edgeLowPt.x <= inPt.x ) && ( inPt.x <= edgeHighPt.x ) ) )		return	true;	// inPt: Point on contour ! 点
				// continue;
			}
		}

		return	inside;
	}


	var subPaths = extractSubpaths( this.actions );	//将路径数组中左右的子路径导出.
	if ( subPaths.length == 0 ) return [];

	if ( noHoles === true )	return	toShapesNoHoles( subPaths );	//如果参数noHole为true,调用toShapesNoHoles方法,将子路径转换成实体图形的动作坐标数组,并返回.


	var solid, tmpPath, tmpShape, shapes = [];

	if ( subPaths.length == 1) {

		tmpPath = subPaths[0];
		tmpShape = new THREE.Shape();
		tmpShape.actions = tmpPath.actions;
		tmpShape.curves = tmpPath.curves;
		shapes.push( tmpShape );
		return shapes;

	}

	var holesFirst = ! THREE.Shape.Utils.isClockWise( subPaths[ 0 ].getPoints() ); //调用isClockWise方法判断,子路径数组中的第一条子路径动作和坐标数组是否是顺时针顺序.
	holesFirst = isCCW ? ! holesFirst : holesFirst;

	// console.log("Holes first", holesFirst);
	
	var betterShapeHoles = [];
	var newShapes = [];
	var newShapeHoles = [];
	var mainIdx = 0;
	var tmpPoints;

	newShapes[mainIdx] = undefined;
	newShapeHoles[mainIdx] = [];

	var i, il;

	for ( i = 0, il = subPaths.length; i < il; i ++ ) {

		tmpPath = subPaths[ i ];
		tmpPoints = tmpPath.getPoints();
		solid = THREE.Shape.Utils.isClockWise( tmpPoints ); //调用isClockWise方法判断,子路径中的动作和坐标数组是否是顺时针顺序.
		solid = isCCW ? ! solid : solid;

		if ( solid ) {	//如果子路径中的动作和坐标数组是顺时针方向

			if ( (! holesFirst ) && ( newShapes[mainIdx] ) )	mainIdx ++;	//如果第一条子路径不是顺时针,并且newShapes[mainIdx]不为false,

			newShapes[mainIdx] = { s: new THREE.Shape(), p: tmpPoints };	//创建shape对象
			newShapes[mainIdx].s.actions = tmpPath.actions;
			newShapes[mainIdx].s.curves = tmpPath.curves;
			
			if ( holesFirst )	mainIdx ++;	//如果第一吊子路径为顺时针
			newShapeHoles[mainIdx] = [];	//

			//console.log('cw', i);

		} else {	//如果子路径中的动作和坐标数组是逆时针方向

			newShapeHoles[mainIdx].push( { h: tmpPath, p: tmpPoints[0] } ); //创建hole

			//console.log('ccw', i);

		}

	}

	// only Holes? -> probably all Shapes with wrong orientation
	// 只有孔洞 -> 可能所有的图形的方向都是错误的.
	if ( ! newShapes[0] )	return	toShapesNoHoles( subPaths );	//转换所有的方向

	if ( newShapes.length > 1 ) {
		var ambigious = false;
		var toChange = [];

		for (var sIdx = 0, sLen = newShapes.length; sIdx < sLen; sIdx ++ ) {
			betterShapeHoles[sIdx] = [];
		}
		for (var sIdx = 0, sLen = newShapes.length; sIdx < sLen; sIdx ++ ) {
			var sh = newShapes[sIdx];
			var sho = newShapeHoles[sIdx];
			for (var hIdx = 0; hIdx < sho.length; hIdx ++ ) {
				var ho = sho[hIdx];
				var hole_unassigned = true;
				for (var s2Idx = 0; s2Idx < newShapes.length; s2Idx ++ ) {
					if ( isPointInsidePolygon( ho.p, newShapes[s2Idx].p ) ) {
						if ( sIdx != s2Idx )		toChange.push( { froms: sIdx, tos: s2Idx, hole: hIdx } );
						if ( hole_unassigned ) {
							hole_unassigned = false;
							betterShapeHoles[s2Idx].push( ho );
						} else {
							ambigious = true;
						}
					}
				}
				if ( hole_unassigned ) { betterShapeHoles[sIdx].push( ho ); }
			}
		}
		// console.log("ambigious: ", ambigious);
		if ( toChange.length > 0 ) {
			// console.log("to change: ", toChange);
			if (! ambigious)	newShapeHoles = betterShapeHoles;
		}
	}

	var tmpHoles, j, jl;
	for ( i = 0, il = newShapes.length; i < il; i ++ ) {
		tmpShape = newShapes[i].s;
		shapes.push( tmpShape );
		tmpHoles = newShapeHoles[i];
		for ( j = 0, jl = tmpHoles.length; j < jl; j ++ ) {
			tmpShape.holes.push( tmpHoles[j].h );
		}
	}

	//console.log("shape", shapes);

	return shapes;	//返回创建的实体图形.

};
