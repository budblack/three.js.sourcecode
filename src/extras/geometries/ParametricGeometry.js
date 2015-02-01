/**
 * @author zz85 / https://github.com/zz85
 * Parametric Surfaces Geometry
 * based on the brilliant article by @prideout http://prideout.net/blog/?p=44
 *
 * new THREE.ParametricGeometry( parametricFunction, uSegments, ySegements );
 *
 */
/*
///ParametricGeometry用来在三维空间内通过参数func的定义,生成一个几何体.有了这个对象,各种你想要的集合体,发挥你的数学天赋吧.
///
///	用法: 
/// 	  var func = function(u,v){
///				var point = new THREE.Vector3();
///				point.x = 100 + Math.cos(u);
///				point.y = 100 + Math.sin(v);
///				return point;
///		  };
///		  var geometry = new THREE.ParametricGeometry(func,8,8);	
/// 	  var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
/// 	  var param = new THREE.Mesh(geometry,material);
/// 	  scene.add(param);
*/
///<summary>ParametricGeometry</summary>
///<param name ="func" type="funciton">功能函数,必须接受参数u,v,返回Vector3</param>
///<param name ="slices" type="int">u方向上的细分线段数</param>
///<param name ="stacks" type="int">v方向上的细分线段数</param>
THREE.ParametricGeometry = function ( func, slices, stacks ) {

	THREE.Geometry.call( this );	//调用Geometry对象的call方法,将原本属于Geometry的方法交给当前对象ParametricGeometry来使用.

	var verts = this.vertices;
	var faces = this.faces;
	var uvs = this.faceVertexUvs[ 0 ];

	var i, il, j, p;
	var u, v;

	var stackCount = stacks + 1;
	var sliceCount = slices + 1;
	//计算顶点数据,压入vertices数组.
	for ( i = 0; i <= stacks; i ++ ) {

		v = i / stacks;

		for ( j = 0; j <= slices; j ++ ) {

			u = j / slices;

			p = func( u, v );
			verts.push( p );

		}
	}

	var a, b, c, d;
	var uva, uvb, uvc, uvd;
	//计算三角面,以及贴图uv.
	for ( i = 0; i < stacks; i ++ ) {

		for ( j = 0; j < slices; j ++ ) {

			a = i * sliceCount + j;
			b = i * sliceCount + j + 1;
			c = (i + 1) * sliceCount + j + 1;
			d = (i + 1) * sliceCount + j;

			uva = new THREE.Vector2( j / slices, i / stacks );
			uvb = new THREE.Vector2( ( j + 1 ) / slices, i / stacks );
			uvc = new THREE.Vector2( ( j + 1 ) / slices, ( i + 1 ) / stacks );
			uvd = new THREE.Vector2( j / slices, ( i + 1 ) / stacks );

			faces.push( new THREE.Face3( a, b, d ) );
			uvs.push( [ uva, uvb, uvd ] );

			faces.push( new THREE.Face3( b, c, d ) );
			uvs.push( [ uvb.clone(), uvc, uvd.clone() ] );

		}

	}

	// console.log(this);

	// magic bullet
	// var diff = this.mergeVertices();
	// console.log('removed ', diff, ' vertices by merging');

	this.computeFaceNormals();	//计算面的法线
	this.computeVertexNormals();	//计算顶点法线

};
/*************************************************
****下面是ParametricGeometry对象的方法属性定义,继承自Geometry对象.
**************************************************/
THREE.ParametricGeometry.prototype = Object.create( THREE.Geometry.prototype );
