/**
 * @author oosmoxiecode
 * @author mrdoob / http://mrdoob.com/
 * based on http://code.google.com/p/away3d/source/browse/trunk/fp10/Away3DLite/src/away3dlite/primitives/Torus.as?r=2888
 */
/*
///TorusGeometry用来在三维空间内创建一个圆环体对象.
///
///	用法: var geometry = new THREE.TorusGeometry(3,1,12,18);	
/// 	  var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
/// 	  var torus = new THREE.Mesh(geometry,material);
/// 	  scene.add(torus);
*/
///<summary>TorusGeometry</summary>
///<param name ="radius" type="float">圆环体半径</param>
///<param name ="tube" type="float">圆环弯管半径</param>
///<param name ="radialSegments" type="int">圆环体圆周上细分线段数</param>
///<param name ="tubularSegments" type="int">圆环弯管圆周上的细分线段数</param>
///<param name ="arc" type="float">圆环体圆周弧长,默认初始化为Math.PI * 2</param>
THREE.TorusGeometry = function ( radius, tube, radialSegments, tubularSegments, arc ) {

	THREE.Geometry.call( this );	//调用Geometry对象的call方法,将原本属于Geometry的方法交给当前对象TorusGeometry来使用.

	this.parameters = {
		radius: radius,	//圆环体半径
		tube: tube,	 	//圆环弯管半径
		radialSegments: radialSegments, 	//圆环体圆周上细分线段数
		tubularSegments: tubularSegments,	//圆环弯管圆周上的细分线段数
		arc: arc 	//圆环体圆周弧长,默认初始化为Math.PI * 2
	};

	radius = radius || 100;	//圆环体半径,如果参数未设置,初始化为100.
	tube = tube || 40;	 	//圆环弯管半径,如果参数未设置,初始化为40.
	radialSegments = radialSegments || 8; 	//圆环体圆周上细分线段数,如果参数未设置,初始化为8.
	tubularSegments = tubularSegments || 6;	//圆环弯管圆周上的细分线段数,如果参数未设置,初始化为6.
	arc = arc || Math.PI * 2;		//圆环体圆周弧长,默认初始化为Math.PI * 2

	var center = new THREE.Vector3(), uvs = [], normals = [];
	//计算顶点数据,压入vertices数组.
	for ( var j = 0; j <= radialSegments; j ++ ) {

		for ( var i = 0; i <= tubularSegments; i ++ ) {

			var u = i / tubularSegments * arc;
			var v = j / radialSegments * Math.PI * 2;

			center.x = radius * Math.cos( u );
			center.y = radius * Math.sin( u );

			var vertex = new THREE.Vector3();
			vertex.x = ( radius + tube * Math.cos( v ) ) * Math.cos( u );
			vertex.y = ( radius + tube * Math.cos( v ) ) * Math.sin( u );
			vertex.z = tube * Math.sin( v );

			this.vertices.push( vertex );

			uvs.push( new THREE.Vector2( i / tubularSegments, j / radialSegments ) );
			normals.push( vertex.clone().sub( center ).normalize() );

		}

	}
	//计算三角面,以及贴图uv.
	for ( var j = 1; j <= radialSegments; j ++ ) {

		for ( var i = 1; i <= tubularSegments; i ++ ) {

			var a = ( tubularSegments + 1 ) * j + i - 1;
			var b = ( tubularSegments + 1 ) * ( j - 1 ) + i - 1;
			var c = ( tubularSegments + 1 ) * ( j - 1 ) + i;
			var d = ( tubularSegments + 1 ) * j + i;

			var face = new THREE.Face3( a, b, d, [ normals[ a ].clone(), normals[ b ].clone(), normals[ d ].clone() ] );
			this.faces.push( face );
			this.faceVertexUvs[ 0 ].push( [ uvs[ a ].clone(), uvs[ b ].clone(), uvs[ d ].clone() ] );

			face = new THREE.Face3( b, c, d, [ normals[ b ].clone(), normals[ c ].clone(), normals[ d ].clone() ] );
			this.faces.push( face );
			this.faceVertexUvs[ 0 ].push( [ uvs[ b ].clone(), uvs[ c ].clone(), uvs[ d ].clone() ] );

		}

	}

	this.computeFaceNormals();	//计算面的法线

};
/*************************************************
****下面是TorusGeometry对象的方法属性定义,继承自Geometry对象.
**************************************************/
THREE.TorusGeometry.prototype = Object.create( THREE.Geometry.prototype );
