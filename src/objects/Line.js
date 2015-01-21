/**
 * @author mrdoob / http://mrdoob.com/
 */
/*
///Line对象,创建一条线,或者一组线.
/// 用法:var geometry = new THREE.Geometry();				//创建geometry对象
///		 var material = new THREE.LineBasicMaterial({color: 0xffff00});	//创建材质对象,这里有专门适用于line对象的材质对象LineBasicMaterial.
///		 geometry.verteces.push(new THREE.Vector3(-10,0,0),			//为geometry对象添加verteces顶点数据
///				new THREE.Vector3(0,10,0),
///				new THREE.Vector3(10,0,0)
///		 );
///		 var line = new THREE.Mesh(geometry, material,THREE.LineStrip);	//通过geometry的顶点数据创建材质为material,类型为THREE.LineStrip(不闭合的折线)的线.
///		 scene.add(line); 	//将线添加到场景中.
*/
///<summary>Line</summary>
///<param name ="geometry" type="THREE.Geometry">Geometry对象(灯笼的框架)</param>
///<param name ="material" type="THREE.Material">Material对象(材质对象)</param>
///<param name ="type" type="线类型常量">线类型常量,有不闭合折线(THREE.LineStrip),多组双顶点线段(THREE.LinePieces)</param>
///<returns type="Line">返回Line对象</returns>
THREE.Line = function ( geometry, material, type ) {

	THREE.Object3D.call( this );	//调用Object3D对象的call方法,将原本属于Object3D的方法交给当前对象Line来使用.

	this.geometry = geometry !== undefined ? geometry : new THREE.Geometry();	//将参数geometry赋值给line对象的geometry属性
	this.material = material !== undefined ? material : new THREE.LineBasicMaterial( { color: Math.random() * 0xffffff } );	//将参数material赋值给line对象的material属性,如果没有传递material参数,将创建随机颜色材质,赋值给当前mesh对象

	this.type = ( type !== undefined ) ? type : THREE.LineStrip;	//将参数type赋值给line对像的type属性,如果没有传递type参数,默认初始化为THREE.LineStrip类型.

};

THREE.LineStrip = 0;	//不闭合折线
THREE.LinePieces = 1;	//多组双顶点线段
//TODO: 缺少THREE.LineLoop	//闭合折线.

/*************************************************
****下面是Line对象的方法属性定义,继承自Object3D
**************************************************/
THREE.Line.prototype = Object.create( THREE.Object3D.prototype );

/*
///raycast方法用来获得当前对象与射线（参数raycaster）的交点.raycaster.intersectObject会调用这个方法。主要是用来进行碰撞检测,
/// 在选择场景中的对象时经常会用到,判断当前鼠标是否与对象重合用来选择对象.
/// NOTE：raycast方法中参数intersects参数用来存储交点的集合，格式如下
///	intersects.push( {
///
///				distance: distance,
///				point: intersectionPoint,
///				face: null,
///				faceIndex: null,
///				object: this
///
///			} );
///
*////<summary>raycast</summary>
///<param name ="raycaster" type="THREE.Raycaster">射线对象</param>
///<param name ="intersects" type="ObjectArray">交点的属性集合</param>
///<returns type="ObjectArray">交点的属性集合</returns>
THREE.Line.prototype.raycast = ( function () {

	var inverseMatrix = new THREE.Matrix4();
	var ray = new THREE.Ray();
	var sphere = new THREE.Sphere();

	return function ( raycaster, intersects ) {

		var precision = raycaster.linePrecision;	//射线和Line对象相交的精度因子。
		var precisionSq = precision * precision;	//精度因子的平方

		var geometry = this.geometry;

		if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();	//确保boundingSphere属性不为null

		// Checking boundingSphere distance to ray
		//检查线段的球体界限到射线的距离

		sphere.copy( geometry.boundingSphere );
		sphere.applyMatrix4( this.matrixWorld );

		if ( raycaster.ray.isIntersectionSphere( sphere ) === false ) {		//如果几何体的球体界限与射线不想交

			return;														    //返回

		}

		inverseMatrix.getInverse( this.matrixWorld );	//获得当前对象的this.matrixWorld属性的逆矩阵
		ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );	//给射线对象的原点,方向,乘以逆矩阵,

		/* if ( geometry instanceof THREE.BufferGeometry ) {

		} else */ if ( geometry instanceof THREE.Geometry ) {

			var vertices = geometry.vertices;
			var nbVertices = vertices.length;
			var interSegment = new THREE.Vector3();
			var interRay = new THREE.Vector3();
			var step = this.type === THREE.LineStrip ? 1 : 2;

			for ( var i = 0; i < nbVertices - 1; i = i + step ) {	//如果是不闭合折线,每次自变量+1,如果是多组双顶点线段,自变量每次+2

				var distSq = ray.distanceSqToSegment( vertices[ i ], vertices[ i + 1 ], interRay, interSegment );	//distanceSqToSegment方法将返回有参数vertices[ i ], vertices[ i + 1 ]组成的线段到当前射线的最小距离.interRay, interSegment,分别用来存储在射线上和在线段上的垂足

				if ( distSq > precisionSq ) continue;	//如果最小距离大于精度因子,退出循环.

				var distance = ray.origin.distanceTo( interRay );	//射线原点到射线到线段的垂足的距离.

				if ( distance < raycaster.near || distance > raycaster.far ) continue;	//如果距离小于射线的近端,或大于射线的远端,跳出循环

				intersects.push( {		//将相交的对象,顶点索引,距离,交点保存到intersects属性数组中

					distance: distance,		//距离
					// What do we want? intersection point on the ray or on the segment??
					// 我们要什么,交点在射线上或者在线段上
					// point: raycaster.ray.at( distance ), 如果要在射线上,那就将raycaster.ray.at( distance )的赋值给point
					point: interSegment.clone().applyMatrix4( this.matrixWorld ),	//如果想要获得交点在线段的位置,将interSegment.clone().applyMatrix4( this.matrixWorld )赋值给point
					face: null,			//面
					faceIndex: null,		//面所在属性数组中的索引
					object: this			//对象

				} );

			}

		}

	};

}() );

/*clone方法
///clone方法克隆一个Line线对象.
*/
///<summary>clone</summary>
///<param name ="object" type="Object3D">接收克隆的Object3D对象</param>
///<returns type="Line">返回Line线对象.</returns>	
THREE.Line.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.Line( this.geometry, this.material, this.type );

	THREE.Object3D.prototype.clone.call( this, object );	//继承Object3D的clone方法

	return object;		//返回Line线对象.

};
