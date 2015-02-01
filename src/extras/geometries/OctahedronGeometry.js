/**
 * @author timothypratley / https://github.com/timothypratley
 */
/*
///OctahedronGeometry用来在三维空间内创建一个八面体对象.
///
///	用法: var geometry = new THREE.OctahedronGeometry(70);	
/// 	  var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
/// 	  var icos = new THREE.Mesh(geometry,material);
/// 	  scene.add(icos);
*/
///<summary>OctahedronGeometry</summary>
///<param name ="radius" type="float">八面体半径</param>
///<param name ="detail" type="int">细节因子,默认为0,当超过0将会有更多的顶点,当前的几何体就不会是八面体,当参数detail大于1,将会变成一个球体.</param>
THREE.OctahedronGeometry = function ( radius, detail ) {

	this.parameters = {
		radius: radius,	//八面体半径
		detail: detail	//细节因子,默认为0,当超过0将会有更多的顶点,当前的几何体就不会是八面体,当参数detail大于1,将会变成一个球体.
	};

	var vertices = [
		1, 0, 0,   - 1, 0, 0,    0, 1, 0,    0,- 1, 0,    0, 0, 1,    0, 0,- 1
	]; //顶点数组

	var indices = [
		0, 2, 4,    0, 4, 3,    0, 3, 5,    0, 5, 2,    1, 2, 5,    1, 5, 3,    1, 3, 4,    1, 4, 2
	];	//顶点索引

	THREE.PolyhedronGeometry.call( this, vertices, indices, radius, detail );
};
/*************************************************
****下面是IcosahedronGeometry对象的方法属性定义,继承自Geometry对象.
**************************************************/
THREE.OctahedronGeometry.prototype = Object.create( THREE.Geometry.prototype );
