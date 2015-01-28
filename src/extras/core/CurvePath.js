/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 **/

/**************************************************************
 *	Curved Path - a curve path is simply a array of connected
 *  curves, but retains the api of a curve
 **************************************************************/
/**************************************************************
 *	曲线路径 - 数组内的曲线对象互相连接的曲线路经,可以使用曲线对象的方法,
 **************************************************************/
/*
///CurvePath对象曲线路径抽象基类,定义了曲线路经的一些方法,继承自THREE.Curve对象.
/// TODO: THREE.CurvePath对象官方没有文档,里面有几个方法还不是很明确.
///
*/
///<summary>CurvePath</summary>
THREE.CurvePath = function () {

	this.curves = [];		//曲线对象存放的数组
	this.bends = [];		//弯曲对象存放的数组
	
	this.autoClose = false; // Automatically closes the path
							//自动闭合路径,默认初始化为false.
};
/******************************************************************************************
****下面是CurvePath对象的方法属性定义,继承自THREE.Curve对象.其他方法同伙定义原型的方式创建.
*******************************************************************************************/
THREE.CurvePath.prototype = Object.create( THREE.Curve.prototype );
/*
///add用来添加曲线对象到curves数组中.
*/
///<summary>add</summary>
///<param name ="curve" type="THREE.Curve">曲线对象</param>
THREE.CurvePath.prototype.add = function ( curve ) {

	this.curves.push( curve );	//将曲线添加到数组中.

};
/*
///checkConnection用来检查结束点没有和起始点或下一条曲线连接,将不能作为路径
*/
///<summary>checkConnection</summary>
THREE.CurvePath.prototype.checkConnection = function() {
	// TODO
	// If the ending of curve is not connected to the starting
	// or the next curve, then, this is not a real path
	// 如果结束点没有和起始点或下一条曲线连接,将不能作为路径.

};
/*
///closePath闭合路经,将曲线路经起始点和结束点闭合
*/
///<summary>closePath</summary>
THREE.CurvePath.prototype.closePath = function() {
	// TODO Test
	// and verify for vector3 (needs to implement equals)
	// Add a line curve if start and end of lines are not connected
	// 测试和判断起始点和结束点是否相等,如果不相等,以当前起始点和结束点创建一条曲线,添加到曲线数组中.
	var startPoint = this.curves[0].getPoint(0);
	var endPoint = this.curves[this.curves.length-1].getPoint(1);
	
	if (! startPoint.equals(endPoint)) {		//测试和判断起始点和结束点是否相等,如果不相等,
		this.curves.push( new THREE.LineCurve(endPoint, startPoint) );		//以当前起始点和结束点创建一条曲线,添加到曲线数组中
	}
	
};

/*
///getPoint方法返回在curvePath对象上t点(取值范围0.0-1.0之间)的矢量.
*/
///<summary>getPoint</summary>
///<param name ="t" type="float">t的取值范围是0.0 - 1.0,将曲线作为一个整体,一个点在这个整体的位置.</param>
///<returns type="null">返回t点的具体坐标.</returns>

// To get accurate point with reference to
// entire path distance at time t,
// following has to be done:
// 根据参数t,获得相对于整个路经长度上t的点.

// 1. Length of each sub path have to be known
// 1. 先计算出每条子路径的长度.
// 2. Locate and identify type of curve
// 2. 定位和识别曲线类型
// 3. Get t for the curve
// 3. 获得相对于整个路经长度上t的点
// 4. Return curve.getPointAt(t')
// 4. 调用getPointAt方法,返回t位置上的点.

THREE.CurvePath.prototype.getPoint = function( t ) {

	var d = t * this.getLength();	//计算t值占整条路经长度的比例.
	var curveLengths = this.getCurveLengths();	//计算整条曲线路经的长度
	var i = 0, diff, curve;

	// To think about boundaries points.
	// 考虑边界点

	while ( i < curveLengths.length ) {	

		if ( curveLengths[ i ] >= d ) {	//定位识别t位于整条路经的位置.

			diff = curveLengths[ i ] - d;
			curve = this.curves[ i ];

			var u = 1 - diff / curve.getLength();	

			return curve.getPointAt( u );	//调用getPointAt方法

			break;
		}

		i ++;

	}

	return null;

	// loop where sum != 0, sum > d , sum+1 <d

};

/*
THREE.CurvePath.prototype.getTangent = function( t ) {
};*/

/*
///getLength将子曲线的长度的和放入缓存数组.返回曲线路经总长度
*/
///<summary>getLength</summary>
///<returns type="float">返回曲线路经总长度.</returns>
// We cannot use the default THREE.Curve getPoint() with getLength() because in
// THREE.Curve, getLength() depends on getPoint() but in THREE.CurvePath
// getPoint() depends on getLength
// 我们在getLength()中不能使用默认的getPoint()方法,因为在THREE.Curve中getLength()方法
// 依赖getPoint()方法,但是在THREE.CurvePath中getPoint()方法依赖getLength()方法.
THREE.CurvePath.prototype.getLength = function() {

	var lens = this.getCurveLengths();
	return lens[ lens.length - 1 ];

};

/*
///getCurveLengths将子曲线的长度的和放入缓存数组.返回长度数组
*/
///<summary>getCurveLengths</summary>
///<returns type="floatArray">返回长度数组.</returns>
// Compute lengths and cache them
// 计算路径中曲线的长度,并存储
// We cannot overwrite getLengths() because UtoT mapping uses it.
// 我们不能重写getLengths()方法,因为u到t映射使用它.
THREE.CurvePath.prototype.getCurveLengths = function() {

	// We use cache values if curves and cache array are same length
	// 如果缓存长度数组的数量和曲线数量一致,并且缓存长度已经定义,使用缓存长度.

	if ( this.cacheLengths && this.cacheLengths.length == this.curves.length ) {

		return this.cacheLengths;	//使用缓存长度

	};

	// Get length of subsurve
	// 获取子曲线的长度
	// Push sums into cached array
	// 将子曲线的长度的和放入缓存数组.

	var lengths = [], sums = 0;
	var i, il = this.curves.length;

	for ( i = 0; i < il; i ++ ) {

		sums += this.curves[ i ].getLength();
		lengths.push( sums );

	}

	this.cacheLengths = lengths;

	return lengths;		//返回长度数组.

};


/*
///getBoundingBox遍历所有的顶点数据,获得曲线路经的立方体界限,用坐标的最小最大值表示.
*/
///<summary>getBoundingBox</summary>
///<returns type="floatArray">获得曲线路经的立方体界限,用坐标的最小最大值表示.</returns>
// Returns min and max coordinates
// 返回最小最大的坐标值.

THREE.CurvePath.prototype.getBoundingBox = function () {

	var points = this.getPoints();

	var maxX, maxY, maxZ;
	var minX, minY, minZ;

	maxX = maxY = Number.NEGATIVE_INFINITY;
	minX = minY = Number.POSITIVE_INFINITY;

	var p, i, il, sum;

	var v3 = points[0] instanceof THREE.Vector3;

	sum = v3 ? new THREE.Vector3() : new THREE.Vector2();

	for ( i = 0, il = points.length; i < il; i ++ ) {	//遍历所有的顶点数据

		p = points[ i ];

		if ( p.x > maxX ) maxX = p.x;
		else if ( p.x < minX ) minX = p.x;

		if ( p.y > maxY ) maxY = p.y;
		else if ( p.y < minY ) minY = p.y;

		if ( v3 ) {

			if ( p.z > maxZ ) maxZ = p.z;
			else if ( p.z < minZ ) minZ = p.z;

		}

		sum.add( p );

	}

	var ret = {

		minX: minX,
		minY: minY,
		maxX: maxX,
		maxY: maxY

	};

	if ( v3 ) {

		ret.maxZ = maxZ;
		ret.minZ = minZ;

	}

	return ret;	//返回坐标最小最大值

};

/**************************************************************
 *	Create Geometries Helpers 创建几何助手
 **************************************************************/
/*
///createPointsGeometry根据参数divisions(参数divisions在这里是将曲线路经分成几段)等分曲线路经,沿路径创建几何体
*/
///<summary>createPointsGeometry</summary>
///<param name ="divisions" type="int">参数divisions在这里是将曲线路经分成几段.</param>
///<returns type="geometryArray">返回几何体数组.</returns>
/// Generate geometry from path points (for Line or Points objects)
// 从路径顶点数据创建线或者点的几何体

THREE.CurvePath.prototype.createPointsGeometry = function( divisions ) {

	var pts = this.getPoints( divisions, true );	//定量等分路径
	return this.createGeometry( pts );	//调用cretateGeometry()方法,创建几何体对象数组

};

/*
///createPointsGeometry根据参数divisions(参数divisions在这里是距离,按照距离将曲线等分)等分曲线路经,沿路径创建几何体
*/
///<summary>createSpacedPointsGeometry</summary>
///<param name ="divisions" type="float">参数divisions在这里是距离,按照距离将曲线等分.</param>
///<returns type="geometryArray">返回几何体数组.</returns>
/// Generate geometry from path points (for Line or Points objects)
// 从路径顶点数据创建线或者点的几何体
// Generate geometry from equidistance sampling along the path
// 沿路径生成等距的几何体的节点标记.

THREE.CurvePath.prototype.createSpacedPointsGeometry = function( divisions ) {

	var pts = this.getSpacedPoints( divisions, true );	//定距等分路径
	return this.createGeometry( pts );	//调用cretateGeometry()方法,创建几何体对象数组

};
/*
///createGeometry根据参数定点数组,创建几何体
*/
///<summary>createGeometry</summary>
///<param name ="points" type="Vector3Array">顶点数据数组.</param>
///<returns type="geometryArray">返回几何体数组.</returns>
THREE.CurvePath.prototype.createGeometry = function( points ) {

	var geometry = new THREE.Geometry();

	for ( var i = 0; i < points.length; i ++ ) {

		geometry.vertices.push( new THREE.Vector3( points[ i ].x, points[ i ].y, points[ i ].z || 0) );

	}

	return geometry;	//返回几何体数组

};


/**************************************************************
 *	Bend / Wrap Helper Methods
 **************************************************************/

// Wrap path / Bend modifiers?
/*
///addWrapPath用来添加弯曲对象到bends数组中.
///TODO: 这里我也没有弄太清楚,看代码应该是获得围绕曲线路经的弯曲对象.
*/
///<summary>addWrapPath</summary>
///<param name ="bendpath" type="THREE.Curve">弯曲对象</param>
THREE.CurvePath.prototype.addWrapPath = function ( bendpath ) {

	this.bends.push( bendpath );	//添加弯曲对象到弯曲数组

};

/*
///getTransformedPoints用来根据参数bends定量等分当前曲线路经,并且获得围绕参数segments的路径.
*/
///<summary>getTransformedPoints</summary>
///<param name ="segments" type="THREE.Curve">线段</param>
///<param name ="bends" type="intArray">弯曲对象数组(定量等分的数量)</param>
///<returns type="geometryArray">返回围绕参数segments的路径.</returns>
THREE.CurvePath.prototype.getTransformedPoints = function( segments, bends ) {

	var oldPts = this.getPoints( segments ); // getPoints getSpacedPoints // 定量等分路径.
	var i, il;

	if ( ! bends ) {

		bends = this.bends;

	}

	for ( i = 0, il = bends.length; i < il; i ++ ) {

		oldPts = this.getWrapPoints( oldPts, bends[ i ] );	//

	}

	return oldPts;

};

/*
///getTransformedPoints用来根据参数bends定距等分当前曲线路经,并且获得围绕参数segments的路径.
*/
///<summary>getTransformedPoints</summary>
///<param name ="segments" type="THREE.Curve">线段</param>
///<param name ="bends" type="floatArray">弯曲对象数组(定距等分的距离)</param>
///<returns type="geometryArray">返回围绕参数segments的路径.</returns>
THREE.CurvePath.prototype.getTransformedSpacedPoints = function( segments, bends ) {

	var oldPts = this.getSpacedPoints( segments );	//定居等分路径

	var i, il;

	if ( ! bends ) {

		bends = this.bends;

	}

	for ( i = 0, il = bends.length; i < il; i ++ ) {

		oldPts = this.getWrapPoints( oldPts, bends[ i ] );

	}

	return oldPts;

};


/*
///getWrapPoints根据oldPts当前线段,和参数path围绕的路径,获得围绕oldPts的顶点.
*/
///<summary>getTransformedPoints</summary>
///<param name ="segments" type="THREE.Curve">线段</param>
///<param name ="bends" type="THREE.Curve">弯曲对象</param>
///<returns type="geometryArray">返回几何体数组.</returns>

// This returns getPoints() bend/wrapped around the contour of a path.
// 获得围绕当前路径的轮廓线.
// Read http://www.planetclegg.com/projects/WarpingTextToSplines.html

THREE.CurvePath.prototype.getWrapPoints = function ( oldPts, path ) {

	var bounds = this.getBoundingBox();

	var i, il, p, oldX, oldY, xNorm;

	for ( i = 0, il = oldPts.length; i < il; i ++ ) {

		p = oldPts[ i ];

		oldX = p.x;
		oldY = p.y;

		xNorm = oldX / bounds.maxX;

		// If using actual distance, for length > path, requires line extrusions
		// 如果使用实际距离,需要拉伸线.
		//xNorm = path.getUtoTmapping(xNorm, oldX); // 3 styles. 1) wrap stretched. 2) wrap stretch by arc length 3) warp by actual distance
		// 有三种样式,1.根据拉伸,围绕当前路径 2. 根据圆弧长度,围绕当前路径, 3. 根据实际距离,围绕当前路径.

		xNorm = path.getUtoTmapping( xNorm, oldX );

		// check for out of bounds?

		var pathPt = path.getPoint( xNorm );	
		var normal = path.getTangent( xNorm );		//获得切线
		normal.set( - normal.y, normal.x ).multiplyScalar( oldY );

		p.x = pathPt.x + normal.x;
		p.y = pathPt.y + normal.y;

	}

	return oldPts;	//TODO: 返回p吧,这里应该是返回p

};

