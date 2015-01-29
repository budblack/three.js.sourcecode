/**
 * @author mrdoob / http://mrdoob.com/
 */
/**************************************************************
 *	GeometryUtils geometry对象的工具集
 **************************************************************/
THREE.GeometryUtils = {

	/*
	///merge方法将两个几何体对象或者Object3D里面的几何体对象合并,(使用对象的变换)将几何体的顶点,面,UV分别合并.
	///NOTE: merge方法在新版本中已经放到了Geomet对象下面,这里保留为了向后兼容.
	*/
	///<summary>merge</summary>
	///<param name ="geometry1" type="Geometry">几何体对象.</param>
	///<param name ="geometry2" type="Geometry">要被合并的几何体.</param>
	///<param name ="matrix" type="Matrix4">可选参数,变换矩阵,当指定了该参数,合并后的对象会应用变换</param>
	///<param name ="materialIndexOffset" type="Number">材质索引偏移量</param>
	///<returns type="Number">返回合并后的几何体对象</returns>	
	merge: function ( geometry1, geometry2, materialIndexOffset ) {

		console.warn( 'THREE.GeometryUtils: .merge() has been moved to Geometry. Use geometry.merge( geometry2, matrix, materialIndexOffset ) instead.' );

		var matrix;

		if ( geometry2 instanceof THREE.Mesh ) {

			geometry2.matrixAutoUpdate && geometry2.updateMatrix();

			matrix = geometry2.matrix;
			geometry2 = geometry2.geometry;

		}

		geometry1.merge( geometry2, matrix, materialIndexOffset );	//调用Geometry.merge方法,将geometry2对象的方法合并到geometry1对象中.

	},

	/*
	///center方法通过计算出当前Geometry对象的立方体界限的中心,获得当前对象的中心.
	*/
	///<summary>center</summary>
	///<param name ="geometry" type="Geometry">几何体对象.</param>
	///<returns type="Vector3">返回中心点坐标</returns>
	center: function ( geometry ) {

		console.warn( 'THREE.GeometryUtils: .center() has been moved to Geometry. Use geometry.center() instead.' );
		return geometry.center();	//返回中心点坐标

	}

};
