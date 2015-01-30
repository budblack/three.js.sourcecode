/**
 * @author timothypratley / https://github.com/timothypratley
 */
/*
///IcosahedronGeometry用来在三维空间内创建一个二十面体对象.
///
///	用法: var geometry = new THREE.IcosahedronGeometry(70);	
/// 	  var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
/// 	  var icos = new THREE.Mesh(geometry,material);
/// 	  scene.add(icos);
*/
///<summary>IcosahedronGeometry</summary>
///<param name ="radius" type="float">二十面体半径</param>
///<param name ="detail" type="int">细节因子,默认为0,当超过0将会有更多的顶点,当前的几何体就不会是二十面体,当参数detail大于1,将会变成一个球体.</param>
THREE.IcosahedronGeometry = function ( radius, detail ) {

	this.parameters = {
		radius: radius,	//二十面体半径
		detail: detail	//细节因子,默认为0,当超过0将会有更多的顶点,当前的几何体就不会是二十面体,当参数detail大于1,将会变成一个球体
	};

	var t = ( 1 + Math.sqrt( 5 ) ) / 2;

	var vertices = [
		- 1,  t,  0,    1,  t,  0,   - 1, - t,  0,    1, - t,  0,
		 0, - 1,  t,    0,  1,  t,    0, - 1, - t,    0,  1, - t,
		 t,  0, - 1,    t,  0,  1,   - t,  0, - 1,   - t,  0,  1
	]; //顶点数组

	var indices = [
		 0, 11,  5,    0,  5,  1,    0,  1,  7,    0,  7, 10,    0, 10, 11,
		 1,  5,  9,    5, 11,  4,   11, 10,  2,   10,  7,  6,    7,  1,  8,
		 3,  9,  4,    3,  4,  2,    3,  2,  6,    3,  6,  8,    3,  8,  9,
		 4,  9,  5,    2,  4, 11,    6,  2, 10,    8,  6,  7,    9,  8,  1
	];	//指数.

	THREE.PolyhedronGeometry.call( this, vertices, indices, radius, detail );	//调用PolyhedronGeometry对象的call方法,将原本属于Geometry的方法交给当前对象IcosahedronGeometry来使用.

};
/*************************************************
****下面是IcosahedronGeometry对象的方法属性定义,继承自Geometry对象.
**************************************************/
THREE.IcosahedronGeometry.prototype = Object.create( THREE.Geometry.prototype );
