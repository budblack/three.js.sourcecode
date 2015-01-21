/**
 * @author alteredq / http://alteredqualia.com/
 */

/*
///PointCloud点云对象,在场景中方便的改变大量的点精灵对象大小,位置等属性.
*/
///<summary>PointCloud</summary>
///<param name ="geometry" type="THREE.Geometry">Geometry对象点云对象里的点集合</param>
///<param name ="material" type="THREE.PointCloudMaterial">PointCloudMaterial对象(点云材质对象)</param>
///<returns type="PointCloud">返回Mesh对象</returns>
THREE.PointCloud = function ( geometry, material ) {

	THREE.Object3D.call( this );	//调用Object3D对象的call方法,将原本属于Object3D的方法交给当前对象PointCloud来使用.

	this.geometry = geometry !== undefined ? geometry : new THREE.Geometry();	//	//将参数geometry赋值给mesh对象的geometry属性
	this.material = material !== undefined ? material : new THREE.PointCloudMaterial( { color: Math.random() * 0xffffff } );		//将参数material赋值给PointCloud对象的material属性,如果没有传递material参数,将创建随机颜色材质,赋值给当前PointCloud对象

	this.sortParticles = false;	//设置是否排序粒子??
								//TODO:sortParticles属性没有弄明白,有时间回来处理.

};
/*************************************************
****下面是PointCloud对象的方法属性定义,继承自Object3D
**************************************************/
THREE.PointCloud.prototype = Object.create( THREE.Object3D.prototype );

/*
///raycast方法用来获得当前对象与射线（参数raycaster）的交点.raycaster.intersectObject会调用这个方法。主要是用来进行碰撞检测,
/// 在选择场景中的对象时经常会用到,判断当前鼠标是否与对象重合用来选择对象.
/// NOTE：raycast方法中参数intersects参数用来存储交点的集合，格式如下
///	intersects.push( {
///
///				distance: distance,
///				point: intersectionPoint,
///				indices: [ a, b, c ],
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
THREE.PointCloud.prototype.raycast = ( function () {

	var inverseMatrix = new THREE.Matrix4();	//声明一个4x4矩阵，用来放置逆矩阵
	var ray = new THREE.Ray();			//声明全局射线对象

	return function ( raycaster, intersects ) {

		var object = this;
		var geometry = object.geometry;
		var threshold = raycaster.params.PointCloud.threshold;

		inverseMatrix.getInverse( this.matrixWorld );
		ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );

		if ( geometry.boundingBox !== null ) {

			if ( ray.isIntersectionBox( geometry.boundingBox ) === false ) {

				return;

			}

		}

		var localThreshold = threshold / ( ( this.scale.x + this.scale.y + this.scale.z ) / 3 );
		var position = new THREE.Vector3();
		//检查射线与点云元素是否碰撞的具体实现.
		var testPoint = function ( point, index ) {

			var rayPointDistance = ray.distanceToPoint( point );

			if ( rayPointDistance < localThreshold ) {

				var intersectPoint = ray.closestPointToPoint( point );
				intersectPoint.applyMatrix4( object.matrixWorld );

				var distance = raycaster.ray.origin.distanceTo( intersectPoint );

				intersects.push( {

					distance: distance,
					distanceToRay: rayPointDistance,
					point: intersectPoint.clone(),
					index: index,
					face: null,
					object: object

				} );

			}

		};
		//如果geometry对象是BufferGeometry对象
		if ( geometry instanceof THREE.BufferGeometry ) {

			var attributes = geometry.attributes;
			var positions = attributes.position.array;
			//下面对三种数据格式的pointCloud对象的元素进行检测.
			if ( attributes.index !== undefined ) {

				var indices = attributes.index.array;
				var offsets = geometry.offsets;

				if ( offsets.length === 0 ) {

					var offset = {
						start: 0,
						count: indices.length,
						index: 0
					};

					offsets = [ offset ];

				}

				for ( var oi = 0, ol = offsets.length; oi < ol; ++oi ) {

					var start = offsets[ oi ].start;
					var count = offsets[ oi ].count;
					var index = offsets[ oi ].index;

					for ( var i = start, il = start + count; i < il; i ++ ) {

						var a = index + indices[ i ];

						position.set(
							positions[ a * 3 ],
							positions[ a * 3 + 1 ],
							positions[ a * 3 + 2 ]
						);

						testPoint( position, a );

					}

				}

			} else {

				var pointCount = positions.length / 3;

				for ( var i = 0; i < pointCount; i ++ ) {

					position.set(
						positions[ 3 * i ],
						positions[ 3 * i + 1 ],
						positions[ 3 * i + 2 ]
					);

					testPoint( position, i );

				}

			}

		} else {

			var vertices = this.geometry.vertices;

			for ( var i = 0; i < vertices.length; i ++ ) {

				testPoint( vertices[ i ], i );

			}

		}

	};

}() );

/*clone方法
///clone方法克隆一个PointCloud点云对象.
*/
///<summary>clone</summary>
///<param name ="object" type="PointCloud">接收克隆的Object3D对象</param>
///<returns type="PointCloud">返回PointCloud对象.</returns>	
THREE.PointCloud.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.PointCloud( this.geometry, this.material );

	object.sortParticles = this.sortParticles;

	THREE.Object3D.prototype.clone.call( this, object );	//继承Object3D的clone方法

	return object;	//返回克隆的PointCloud对象

};

// Backwards compatibility 向后兼容,粒子系统呗点云对象替代.用法和THREE.PointCloud对象一样.

THREE.ParticleSystem = function ( geometry, material ) {

	console.warn( 'THREE.ParticleSystem has been renamed to THREE.PointCloud.' );
	return new THREE.PointCloud( geometry, material );

};
