/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Extensible curve object
 *
 * Some common of Curve methods 一些通用的方法.
 * .getPoint(t), getTangent(t)
 * .getPointAt(u), getTagentAt(u)
 * .getPoints(), .getSpacedPoints()
 * .getLength()
 * .updateArcLengths()
 *
 * This following classes subclasses THREE.Curve:
 * 这些是THREE.Curve的一些子类.
 *
 * -- 2d classes --
 * THREE.LineCurve
 * THREE.QuadraticBezierCurve
 * THREE.CubicBezierCurve
 * THREE.SplineCurve
 * THREE.ArcCurve
 * THREE.EllipseCurve
 *
 * -- 3d classes --
 * THREE.LineCurve3
 * THREE.QuadraticBezierCurve3
 * THREE.CubicBezierCurve3
 * THREE.SplineCurve3
 * THREE.ClosedSplineCurve3
 *
 * A series of curves can be represented as a THREE.CurvePath
 * 一个曲线序列可以用THREE.CurvePath
 *
 **/

/**************************************************************
 *	Abstract Curve base class 曲线抽象基类
 **************************************************************/
/*
///Curve对象曲线抽象基类,一个可扩展的曲线对象包含插值方法.
///
///	定义:样条曲线是经过一系列给定点的光滑曲线。最初，样条曲线都是借助于物理样条得到的，放样员把富有弹性的细木条（或有机玻璃条），
///		 用压铁固定在曲线应该通过的给定型值点处，样条做自然弯曲所绘制出来的曲线就是样条曲线。样条曲线不仅通过各有序型值点，
///		 并且在各型值点处的一阶和二阶导数连续，也即该曲线具有连续的、曲率变化均匀的特点。
///	NOTE:参考百度百科http://baike.baidu.com/view/1896463.htm?fr=aladdin
/// NOTE:关于三次样条插值,参考百度百科http://baike.baidu.com/view/2326225.htm?fr=aladdin
/// NOTE:关于更多样条曲线插值,参考维基百科http://zh.wikipedia.org/wiki/%E8%B2%9D%E8%8C%B2%E6%9B%B2%E7%B7%9A
/// NOTE:关于样条曲线,参考维基百科http://zh.wikipedia.org/wiki/%E6%A0%B7%E6%9D%A1%E5%87%BD%E6%95%B0
///
///
*/
///<summary>Curve</summary>
THREE.Curve = function () {

};

/****************************************
****下面是Curve对象提供的功能函数.
****************************************/

/*
///getPoint方法返回在curve对象上t点(取值范围0.0-1.0之间)的矢量.
*/
///<summary>getPoint</summary>
///<param name ="t" type="float">t的取值范围是0.0 - 1.0,将曲线作为一个整体,一个点在这个整体的位置.</param>
///<returns type="null">返回t点的具体坐标.</returns>

// Virtual base class method to overwrite and implement in subclasses
// 虚基类方法,需要在子类中重写具体实现.
//	- t [0 .. 1]
// t的取值范围是0.0 - 1.0,将曲线作为一个整体,一个点在这个整体的位置.
THREE.Curve.prototype.getPoint = function ( t ) {

	console.log( "Warning, getPoint() not implemented!" );
	return null;

};

/*
///getPointAt方法获得一个点u在曲线上的相对位置,用弧长表示.
*/
///<summary>getPointAt</summary>
///<param name ="t" type="float">u的取值范围是0.0 - 1.0,将曲线作为一个整体,一个点在这个整体的位置.</param>
///<returns type="float">返回点u在曲线上的相对位置,用弧长表示.</returns>

// Get point at relative position in curve according to arc length
//获得一个点u在曲线上的相对位置,用弧长表示.
// - u [0 .. 1]
// u的取值范围是0.0 - 1.0,将曲线作为一个整体,一个点在这个整体的位置.
THREE.Curve.prototype.getPointAt = function ( u ) {

	var t = this.getUtoTmapping( u );	//调用getUtoTmapping,将当前样条曲线作为一个整体,返回点u在曲线上的相对位置或者对应distance对应的位置(0.0-1.0).
	return this.getPoint( t );	//返回点u在曲线上的相对位置,用弧长表示.

};

/*
///getPoints方法根据divisions将曲线等分,获得在曲线对象上等分点的点序列.如果没有设置参数divisions,默认初始化为5等分.返回对应等分线段顶点的坐标数组.
*/
///<summary>getPoints</summary>
///<param name ="divisions" type="int">根据divisions将曲线等分,获得在曲线对象上等分点的点序列.如果没有设置参数divisions,默认初始化为5等分.</param>
///<returns type="Vector3Array">返回对应等分线段顶点的坐标数组.</returns>

// Get sequence of points using getPoint( t )
// 根据divisions将曲线等分,获得在曲线对象上等分点的点序列.如果没有设置参数divisions,默认初始化为5等分.
THREE.Curve.prototype.getPoints = function ( divisions ) {

	if ( ! divisions ) divisions = 5;

	var d, pts = [];

	for ( d = 0; d <= divisions; d ++ ) {	//遍历等分数量

		pts.push( this.getPoint( d / divisions ) );	//调用getPoint方法,返回对应等分线段端点的坐标.

	}

	return pts;		//返回对应等分线段顶点的坐标数组.

};

/*
///getSpacedPoints方法根据divisions将曲线等分,获得在曲线对象上等分点的点序列.如果没有设置参数divisions,默认初始化为5等分.返回对应等分线段端点在曲线上的相对位置数组,用弧长表示.
*/
///<summary>getPointAt</summary>
///<param name ="t" type="float">u的取值范围是0.0 - 1.0,将曲线作为一个整体,一个点在这个整体的位置.</param>
///<returns type="float">返回对应等分线段端点在曲线上的相对位置数组,用弧长表示.</returns>
// Get sequence of points using getPointAt( u )
// 获得一系列顶点的相对位置的数组.调用getPointAt方法.
THREE.Curve.prototype.getSpacedPoints = function ( divisions ) {

	if ( ! divisions ) divisions = 5;

	var d, pts = [];

	for ( d = 0; d <= divisions; d ++ ) {		//遍历等分数量

		pts.push( this.getPointAt( d / divisions ) );	//调用getPointAt方法,返回对应等分线段端点在曲线上的相对位置数组,用弧长表示.

	}

	return pts;		//返回对应等分线段端点在曲线上的相对位置数组,用弧长表示.

};

/*
///getLength将子曲线的长度的和放入缓存数组.返回曲线路经总长度
*/
///<summary>getLength</summary>
///<returns type="float">返回曲线路经总长度.</returns>

// Get total curve arc length
//获得曲线总的弧长

THREE.Curve.prototype.getLength = function () {

	var lengths = this.getLengths();
	return lengths[ lengths.length - 1 ];

};

/*
///getLengths将子曲线的长度的和放入缓存数组.返回长度数组
*/
///<summary>getLengths</summary>
///<returns type="floatArray">返回长度数组.</returns>

// Get list of cumulative segment lengths
// 获得个线段的长度的列表
THREE.Curve.prototype.getLengths = function ( divisions ) {

	if ( ! divisions ) divisions = (this.__arcLengthDivisions) ? (this.__arcLengthDivisions): 200;

	if ( this.cacheArcLengths
		&& ( this.cacheArcLengths.length == divisions + 1 )
		&& ! this.needsUpdate) {

		//console.log( "cached", this.cacheArcLengths );
		return this.cacheArcLengths;

	}

	this.needsUpdate = false;

	var cache = [];
	var current, last = this.getPoint( 0 );
	var p, sum = 0;

	cache.push( 0 );

	for ( p = 1; p <= divisions; p ++ ) {

		current = this.getPoint ( p / divisions );
		sum += current.distanceTo( last );
		cache.push( sum );
		last = current;

	}

	this.cacheArcLengths = cache;

	return cache; // { sums: cache, sum:sum }; Sum is in the last element.

};

/*
///updateArcLengths调用getLengths方法,更新长度数组.
*/
///<summary>updateArcLengths</summary>
///<returns type="floatArray">返回长度数组.</returns>

THREE.Curve.prototype.updateArcLengths = function() {
	this.needsUpdate = true;
	this.getLengths();
};

/*
///getUtoTmapping方法将当前样条曲线作为一个整体,返回点u在曲线上的相对位置或者对应distance对应的位置(0.0-1.0).
*/
///<summary>getUtoTmapping</summary>
///<param name ="u" type="float">u的取值范围是0.0 - 1.0,将曲线作为一个整体,一个点在这个整体的位置.</param>
///<param name ="distance" type="float">如果设置长度值,则返回对应长度在整条线段的位置</param>
///<returns type="float">点u在曲线上的相对位置或者对应distance对应的位置(0.0-1.0)</returns>

// Given u ( 0 .. 1 ), get a t to find p. This gives you points which are equi distance
// 获得在curve对象上u点(取值范围0.0-1.0之间)距离等于distance的点t.
THREE.Curve.prototype.getUtoTmapping = function ( u, distance ) {

	var arcLengths = this.getLengths();	//获得这个线段的长度列表

	var i = 0, il = arcLengths.length;

	var targetArcLength; // The targeted u distance value to get 获得目标点u的长度值

	if ( distance ) {	//如果设置了长度

		targetArcLength = distance;		

	} else {

		targetArcLength = u * arcLengths[ il - 1 ];	//获得u点在整条线段(是由多个曲线对象组成的线段)中的位置.

	}

	//var time = Date.now();

	// binary search for the index with largest value smaller than target u distance
	// 遍历线段的索引,u值在曲线线段上的第几段,就是u值所在位置的线段在arcLengths的索引.

	var low = 0, high = il - 1, comparison;

	while ( low <= high ) {

		i = Math.floor( low + ( high - low ) / 2 ); // less likely to overflow, though probably not issue here, JS doesn't really have integers, all numbers are floats
													// 很少有可能溢出,为了保险,将浮点数转成整数

		comparison = arcLengths[ i ] - targetArcLength;

		if ( comparison < 0 ) {

			low = i + 1;
			continue;

		} else if ( comparison > 0 ) {

			high = i - 1;
			continue;

		} else {

			high = i;
			break;

			// DONE

		}

	}

	i = high;

	//console.log('b' , i, low, high, Date.now()- time);

	if ( arcLengths[ i ] == targetArcLength ) {

		var t = i / ( il - 1 );
		return t;	//返回位置

	}

	// we could get finer grain at lengths, or use simple interpolatation between two points
	// 获得更精确的长度,在两个索引值之间的位置.

	var lengthBefore = arcLengths[ i ];
    var lengthAfter = arcLengths[ i + 1 ];

    var segmentLength = lengthAfter - lengthBefore;

    // determine where we are between the 'before' and 'after' points
    // 确定点在“before”和“after"的确切位置.

    var segmentFraction = ( targetArcLength - lengthBefore ) / segmentLength;

    // add that fractional amount to t
    // 获得t在整个线段中的位置

    var t = ( i + segmentFraction ) / ( il -1 );

	return t;	//返回位置.

};

/*
///getTangent方法将返回一个点t在曲线上位置向量的法线向量.
*/
///<summary>getTangent</summary>
///<param name ="t" type="float">t的取值范围是0.0 - 1.0,将曲线作为一个整体,一个点在这个整体的位置.</param>
///<returns type="Vector3">返回一个点t在曲线上位置向量的单位向量</returns>

// Returns a unit vector tangent at t
// 返回一个点t在曲线上位置向量的单位向量
// In case any sub curve does not implement its tangent derivation,
// 2 points a small delta apart will be used to find its gradient
// which seems to give a reasonable approximation
THREE.Curve.prototype.getTangent = function( t ) {
	//这里为了给向量设定一个方向.
	var delta = 0.0001;	//设置一个delta值
	var t1 = t - delta;	//t点减delta值,
	var t2 = t + delta;	//t点加delta值.

	// Capping in case of danger

	if ( t1 < 0 ) t1 = 0;
	if ( t2 > 1 ) t2 = 1;

	var pt1 = this.getPoint( t1 );
	var pt2 = this.getPoint( t2 );

	var vec = pt2.clone().sub(pt1);
	return vec.normalize();	//返回一个点t在曲线上位置向量的法线向量.

};


/*
///getTangent方法将返回一个点t在曲线上位置向量的法线向量.
*/
///<summary>getTangentAt</summary>
///<param name ="u" type="float">t的取值范围是0.0 - 1.0,将曲线作为一个整体,一个点在这个整体的位置.</param>
///<returns type="Vector3">返回一个点t在曲线上位置向量的单位向量</returns>
THREE.Curve.prototype.getTangentAt = function ( u ) {

	var t = this.getUtoTmapping( u );	//getUtoTmapping方法将当前样条曲线作为一个整体,返回点u在曲线上的相对位置或者对应distance对应的位置(0.0-1.0).
	return this.getTangent( t );	//getTangent方法将返回一个点t在曲线上位置向量的法线向量

};





/**************************************************************
 *	Utils
 **************************************************************/
// 关于bezier曲线,b样条,nurbs曲线的一些差别.
//§  Bezier曲线中的每个控制点都会影响整个曲线的形状，而B样条中的控制点只会影响整个曲线的一部分，显然B样条提供了更多的灵活性；
//§  Bezier和B样条都是多项式参数曲线，不能表示一些基本的曲线，比如圆，所以引入了NURBS，即非均匀有理B样条来解决这个问题；
// 关于二次样条,3次样条曲线的一些简单的差别,二次样条有3个控制点控制一段曲线,三次样条曲线由4个控制点控制一段曲线.更细分的区别百度吧.
THREE.Curve.Utils = {
	/*
	///tangentQuadraticBezier方法将返回二次Bezier曲线上点t的切线
	*/
	///<summary>tangentQuadraticBezier</summary>
	///<param name ="t" type="Vector3">三维向量</param>
	///<param name ="p0" type="Vector3">三维向量</param>
	///<param name ="p1" type="Vector3">三维向量</param>
	///<param name ="p2" type="Vector3">三维向量</param>
	///<returns type="number">二次Bezier曲线上点t的切线</returns>
	tangentQuadraticBezier: function ( t, p0, p1, p2 ) {

		return 2 * ( 1 - t ) * ( p1 - p0 ) + 2 * t * ( p2 - p1 );		//二次Bezier曲线上点t的切线

	},

	// Puay Bing, thanks for helping with this derivative!
	/*
	///tangentCubicBezier方法将返回三次Bezier曲线上点t的切线
	*/
	///<summary>tangentQuadraticBezier</summary>
	///<param name ="t" type="Vector3">三维向量</param>
	///<param name ="p0" type="Vector3">三维向量</param>
	///<param name ="p1" type="Vector3">三维向量</param>
	///<param name ="p2" type="Vector3">三维向量</param>
	///<param name ="p3" type="Vector3">三维向量</param>
	///<returns type="number">三次Bezier曲线上点t的切线</returns>
	tangentCubicBezier: function (t, p0, p1, p2, p3 ) {

		return - 3 * p0 * (1 - t) * (1 - t)  +
			3 * p1 * (1 - t) * (1-t) - 6 *t *p1 * (1-t) +
			6 * t *  p2 * (1-t) - 3 * t * t * p2 +
			3 * t * t * p3;		//三次Bezier曲线上点t的切线
	},

	/*
	///tangentSpline方法将返回Spline曲线上点t的切线
	*/
	///<summary>tangentSpline</summary>
	///<param name ="t" type="Vector3">三维向量</param>
	///<param name ="p0" type="Vector3">三维向量</param>
	///<param name ="p1" type="Vector3">三维向量</param>
	///<param name ="p2" type="Vector3">三维向量</param>
	///<param name ="p3" type="Vector3">三维向量</param>
	///<returns type="number">返回Spline曲线上点t的切线</returns>
	tangentSpline: function ( t, p0, p1, p2, p3 ) {

		// To check if my formulas are correct

		var h00 = 6 * t * t - 6 * t; 	// derived from 2t^3 − 3t^2 + 1
		var h10 = 3 * t * t - 4 * t + 1; // t^3 − 2t^2 + t
		var h01 = - 6 * t * t + 6 * t; 	// − 2t3 + 3t2
		var h11 = 3 * t * t - 2 * t;	// t3 − t2

		return h00 + h10 + h01 + h11;	//三次Bezier曲线上点t的切线

	},

	// Catmull-Rom

	/*
	///tangentSpline方法将点t在三次Bezier曲线上插值.
	*/
	///<summary>tangentSpline</summary>
	///<param name ="t" type="Vector3">三维向量</param>
	///<param name ="p0" type="Vector3">三维向量</param>
	///<param name ="p1" type="Vector3">三维向量</param>
	///<param name ="p2" type="Vector3">三维向量</param>
	///<param name ="p3" type="Vector3">三维向量</param>
	///<returns type="number">返回点t插值后的三次Bezier曲线</returns>
	interpolate: function( p0, p1, p2, p3, t ) {

		var v0 = ( p2 - p0 ) * 0.5;
		var v1 = ( p3 - p1 ) * 0.5;
		var t2 = t * t;
		var t3 = t * t2;
		return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;	//返回点t插值后的三次Bezier曲线

	}

};


// TODO: Transformation for Curves?
// TODO: 曲线这个东西,我还是接触的非常少的,不过理解的应该差不多.我自己能说服自己.以后希望更多有才的人来补充.

/**************************************************************
 *	3D Curves
 **************************************************************/

// A Factory method for creating new curve subclasses
// 一个构造方法用来创建新曲线子类.

/*
///create方法一个构造方法用来创建新曲线子类
*/
///<summary>create</summary>
///<param name ="constructor" type="Object.prototype">.</param>
///<returns type="Vector3">返回一个点t在曲线上位置向量的单位向量</returns>
THREE.Curve.create = function ( constructor, getPointFunc ) {

	constructor.prototype = Object.create( THREE.Curve.prototype );	//构造新区线类.
	constructor.prototype.getPoint = getPointFunc;	//getPoint方法的具体实现

	return constructor;		//返回构造对象.

};
