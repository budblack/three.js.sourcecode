/**
 * Spline from Tween.js, slightly optimized (and trashed)
 * http://sole.github.com/tween.js/examples/05_spline.html
 *
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

/*
///Spline对象的构造函数.用来在三维空间内通过参数points(Vector3数组)创建一个样条曲线对象..
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
///	用法: var a = new Vector3(0,0,0),b = new Vector3(1,1,1),c = new Vector3(2,2,2); var points = new Array(a,b,c); var spline = new Spline(points);
///创建一个a,b,c三点组成的样条曲线对象.
*/
///<summary>Spline</summary>
///<param name ="points" type="Vector3Array">Vector3对象组成的points数组对象</param>
THREE.Spline = function ( points ) {

	this.points = points;	//将参数points设置给当前样条对象的points属性

	var c = [], v3 = { x: 0, y: 0, z: 0 },
	point, intPoint, weight, w2, w3,
	pa, pb, pc, pd;

	/****************************************
	****下面是Spline对象提供的功能函数.
	****************************************/

	/*
	///initFromArray方法通过Vector3对象组成的数组(参数a),重新设置当前样条曲线.
	*/
	///<summary>initFromArray</summary>
	///<param name ="a" type="Vector3Array">Vector3对象组成的points数组对象</param>
	///<returns type="Spline">返回新的样条曲线</returns>
	this.initFromArray = function ( a ) {

		this.points = [];

		for ( var i = 0; i < a.length; i ++ ) {	//获得数组长度,并将数组中元素赋值给当前样条曲线的points属性.

			this.points[ i ] = { x: a[ i ][ 0 ], y: a[ i ][ 1 ], z: a[ i ][ 2 ] };

		}

	};

	/*
	///getPoint方法将当前样条曲线作为一个整体,返回位于当前样条曲线k位置上的点坐标.
	/// NOTE:getPoint()方法中k值取值范围是0.0-1.0.
	*/
	///<summary>getPoint</summary>
	///<param name ="k" type="Float">返回位于当前样条曲线k位置上的点坐标</param>
	///<returns type="Spline">返回新的样条曲线</returns>
	this.getPoint = function ( k ) {

		point = ( this.points.length - 1 ) * k;	//获得k大概位于当前样条曲线的第几个节点后,得出结果可能是小数(例如样条曲线有9个节点,参数k为0.4,得出结果3.2说明参数k位于当前样条曲线第三个节点到第四个节点长度20%的位置),赋值给point
		intPoint = Math.floor( point );		//调用Math.floor()方法,获得整数,第三个节点,赋值给intPoint
		weight = point - intPoint;	//或得权值,赋值给weight

		c[ 0 ] = intPoint === 0 ? intPoint : intPoint - 1;	//三次样条曲线的起始点c[0]
		c[ 1 ] = intPoint;	//三次样条曲线的控制点c[1]
		c[ 2 ] = intPoint  > this.points.length - 2 ? this.points.length - 1 : intPoint + 1;	//三次样条曲线的控制点c[2]
		c[ 3 ] = intPoint  > this.points.length - 3 ? this.points.length - 1 : intPoint + 2;	//三次样条曲线的结束点c[3]

		pa = this.points[ c[ 0 ] ];
		pb = this.points[ c[ 1 ] ];
		pc = this.points[ c[ 2 ] ];
		pd = this.points[ c[ 3 ] ];

		w2 = weight * weight;	//权值的平方
		w3 = weight * w2;	//权值的立方

		v3.x = interpolate( pa.x, pb.x, pc.x, pd.x, weight, w2, w3 );	//调用interpolate方法是样条插值函数,返回计算位于参数值t的曲线点x坐标
		v3.y = interpolate( pa.y, pb.y, pc.y, pd.y, weight, w2, w3 );	//调用interpolate方法是样条插值函数,返回计算位于参数值t的曲线点y坐标
		v3.z = interpolate( pa.z, pb.z, pc.z, pd.z, weight, w2, w3 );	//调用interpolate方法是样条插值函数,返回计算位于参数值t的曲线点z坐标

		return v3;	//返回位于当前样条曲线k位置上的点坐标

	};

	/*
	///getControlPointsArray方法返回当前样条曲线节点坐标构成的数组
	*/
	///<summary>getControlPointsArray</summary>
	///<returns type="Vector3Array">返回当前样条曲线节点坐标构成的数组</returns>
	this.getControlPointsArray = function () {

		var i, p, l = this.points.length,
			coords = [];

		for ( i = 0; i < l; i ++ ) {	//遍历当前样条曲线points属性

			p = this.points[ i ];
			coords[ i ] = [ p.x, p.y, p.z ];	//将points属性直接赋值给coords数组

		}

		return coords;	//返回当前样条曲线节点坐标构成的数组

	};



	/*
	///getLength方法返回被参数nSubDivisions(将当前样条曲线等分成多少段)等分当前样条曲线的长度数组和总长度组成的对象.
	*/
	///<summary>getLength</summary>
	///<param name ="nSubDivisions" type="Number">分段数</param>
	///<returns type="Spline">返回被参数nSubDivisions(将当前样条曲线等分成多少段)等分当前样条曲线的长度数组和总长度组成的对象</returns>
	// approximate length by summing linear segments
	//汇总线性线段获得近似长度
	this.getLength = function ( nSubDivisions ) {

		var i, index, nSamples, position,
			point = 0, intPoint = 0, oldIntPoint = 0,
			oldPosition = new THREE.Vector3(),
			tmpVec = new THREE.Vector3(),
			chunkLengths = [],
			totalLength = 0;

		// first point has 0 length
		// 第一个起点长度是0

		chunkLengths[ 0 ] = 0;

		if ( ! nSubDivisions ) nSubDivisions = 100;

		nSamples = this.points.length * nSubDivisions;

		oldPosition.copy( this.points[ 0 ] );

		for ( i = 1; i < nSamples; i ++ ) {

			index = i / nSamples;

			position = this.getPoint( index );	//调用getPoint()方法,获得当前段数的位置坐标.
			tmpVec.copy( position );

			totalLength += tmpVec.distanceTo( oldPosition );	//求当前段数长度.

			oldPosition.copy( position );

			point = ( this.points.length - 1 ) * index;
			intPoint = Math.floor( point );

			if ( intPoint != oldIntPoint ) {

				chunkLengths[ intPoint ] = totalLength;
				oldIntPoint = intPoint;

			}

		}

		// last point ends with total length
		//最后一个结束点,返回总长度.

		chunkLengths[ chunkLengths.length ] = totalLength;

		return { chunks: chunkLengths, total: totalLength };

	};

	this.reparametrizeByArcLength = function ( samplingCoef ) {

		var i, j,
			index, indexCurrent, indexNext,
			linearDistance, realDistance,
			sampling, position,
			newpoints = [],
			tmpVec = new THREE.Vector3(),
			sl = this.getLength();

		newpoints.push( tmpVec.copy( this.points[ 0 ] ).clone() );

		for ( i = 1; i < this.points.length; i ++ ) {

			//tmpVec.copy( this.points[ i - 1 ] );
			//linearDistance = tmpVec.distanceTo( this.points[ i ] );

			realDistance = sl.chunks[ i ] - sl.chunks[ i - 1 ];

			sampling = Math.ceil( samplingCoef * realDistance / sl.total );

			indexCurrent = ( i - 1 ) / ( this.points.length - 1 );
			indexNext = i / ( this.points.length - 1 );

			for ( j = 1; j < sampling - 1; j ++ ) {

				index = indexCurrent + j * ( 1 / sampling ) * ( indexNext - indexCurrent );

				position = this.getPoint( index );
				newpoints.push( tmpVec.copy( position ).clone() );

			}

			newpoints.push( tmpVec.copy( this.points[ i ] ).clone() );

		}

		this.points = newpoints;

	};

	// Catmull-Rom

	/*
	///interpolate方法是传说中的样条插值函数,这里是三次样条插值算法,返回计算位于参数值t的曲线点.
	/// NOTE:关于三次样条插值,参考百度百科http://baike.baidu.com/view/2326225.htm?fr=aladdin
	/// NOTE:关于更多样条曲线插值,参考维基百科http://zh.wikipedia.org/wiki/%E8%B2%9D%E8%8C%B2%E6%9B%B2%E7%B7%9A
	///										  http://zh.wikipedia.org/wiki/%E6%A0%B7%E6%9D%A1%E6%8F%92%E5%80%BC
	/// NOTE:关于样条曲线,参考维基百科http://zh.wikipedia.org/wiki/%E6%A0%B7%E6%9D%A1%E5%87%BD%E6%95%B0
	*/
	///<summary>interpolate</summary>
	///<param name ="p0" type="Float">样条曲线起始点p0</param>
	///<param name ="p1" type="Float">样条曲线控制点p1</param>
	///<param name ="p2" type="Float">样条曲线控制点p2</param>
	///<param name ="p3" type="Float">样条曲线结束点p3</param>
	///<param name ="t" type="Float">t为参数值,0<=t<=1</param>
	///<param name ="t2" type="Float">t2是参数值t的平方</param>
	///<param name ="t3" type="Float">t3是参数值t的立方</param>
	///<returns type="Spline">返回计算位于参数值t的曲线点</returns>
	function interpolate( p0, p1, p2, p3, t, t2, t3 ) {

		var v0 = ( p2 - p0 ) * 0.5,
			v1 = ( p3 - p1 ) * 0.5;

		return ( 2 * ( p1 - p2 ) + v0 + v1 ) * t3 + ( - 3 * ( p1 - p2 ) - 2 * v0 - v1 ) * t2 + v0 * t + p1;		//返回计算位于参数值t的曲线点

	};

};
