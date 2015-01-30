/**
 * @author astrodud / http://astrodud.isgreat.org/
 * @author zz85 / https://github.com/zz85
 * @author bhouston / http://exocortex.com
 */
/*
///LatheGeometry类通过截面顶点数组(points)创建旋转几何体.
///
///	用法: 
///		var points = [];
///		for ( var i = 0; i < 10; i ++ ) {
///			points.push( new THREE.Vector3( Math.sin( i * 0.2 ) * 15 + 50, 0, ( i - 5 ) * 2 ) );
///		}
///		var geometry = new THREE.LatheGeometry( points );
///		var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
///		var lathe = new THREE.Mesh( geometry, material );
///		scene.add( lathe );
*/
///<summary>LatheGeometry</summary>
///<param name ="points" type="float">旋转体截面顶点数组</param>
///<param name ="segments" type="int">旋转体旋转圆周的细分线段数</param>
///<param name ="phiStart" type="float">旋转体的起始点</param>
///<param name ="phiLength" type="float">旋转体的弧长</param>
// points - to create a closed torus, one must use a set of points //创建一个封闭的环面,
//    like so: [ a, b, c, d, a ], see first is the same as last.	//例如[a,b,c,d,a],第一个顶点必须和最后一个顶点相同.
// segments - the number of circumference segments to create //旋转圆周的细分线段数
// phiStart - the starting radian 	//旋转截面的起始点,默认初始化为0.
// phiLength - the radian (0 to 2*PI) range of the lathed section
//    2*pi is a closed lathe, less than 2PI is a portion. 	//旋转的弧长默认初始化为2*PI.
THREE.LatheGeometry = function ( points, segments, phiStart, phiLength ) {

	THREE.Geometry.call( this );

	segments = segments || 12;
	phiStart = phiStart || 0;
	phiLength = phiLength || 2 * Math.PI;

	var inversePointLength = 1.0 / ( points.length - 1 );
	var inverseSegments = 1.0 / segments;
	//旋转体截面顶点数组通过旋转,获得所有的顶点数组.
	for ( var i = 0, il = segments; i <= il; i ++ ) {

		var phi = phiStart + i * inverseSegments * phiLength;

		var c = Math.cos( phi ),
			s = Math.sin( phi );

		for ( var j = 0, jl = points.length; j < jl; j ++ ) {

			var pt = points[ j ];

			var vertex = new THREE.Vector3();

			vertex.x = c * pt.x - s * pt.y;
			vertex.y = s * pt.x + c * pt.y;
			vertex.z = pt.z;

			this.vertices.push( vertex );

		}

	}

	var np = points.length;
	//将所有的顶点计算生成三角面,并计算出三角面贴图的uv
	for ( var i = 0, il = segments; i < il; i ++ ) {

		for ( var j = 0, jl = points.length - 1; j < jl; j ++ ) {

			var base = j + np * i;
			var a = base;
			var b = base + np;
			var c = base + 1 + np;
			var d = base + 1;

			var u0 = i * inverseSegments;
			var v0 = j * inversePointLength;
			var u1 = u0 + inverseSegments;
			var v1 = v0 + inversePointLength;

			this.faces.push( new THREE.Face3( a, b, d ) );

			this.faceVertexUvs[ 0 ].push( [

				new THREE.Vector2( u0, v0 ),
				new THREE.Vector2( u1, v0 ),
				new THREE.Vector2( u0, v1 )

			] );

			this.faces.push( new THREE.Face3( b, c, d ) );

			this.faceVertexUvs[ 0 ].push( [

				new THREE.Vector2( u1, v0 ),
				new THREE.Vector2( u1, v1 ),
				new THREE.Vector2( u0, v1 )

			] );


		}

	}

	this.mergeVertices();	//合并顶点,删除多余的顶点 
	this.computeFaceNormals();	//计算三角面的法线
	this.computeVertexNormals();	//计算顶点的法线

};
/*************************************************
****下面是LatheGeometry对象的方法属性定义,继承自Geometry对象.
**************************************************/
THREE.LatheGeometry.prototype = Object.create( THREE.Geometry.prototype );
