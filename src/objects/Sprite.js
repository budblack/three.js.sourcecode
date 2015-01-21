/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */
/*
///Sprite对象,点精灵对象,对应粒子对象,具体的实现是通过BufferGeometry创建一个总是面对相机的平面.
/// 用法:var map = THREE.ImageUtils.loadTexture("sprite.png");				//加载image对象
///		 var material = new THREE.SpriteMaterial({map:map,color: 0xffffff,fog: true});	//创建材质对象,这里有专门适用于Sprite对象的材质对象SpriteMaterial.
///		 var sprite = new THREE.Sprite( material);	//创建精灵对象.
///		 scene.add(line); 	//将精灵添加到场景中.
*/
///<summary>Sprite</summary>
///<param name ="material" type="THREE.SpriteMaterial">可选参数,SpriteMaterial对象(点精灵对象专用的材质对象)</param>
///<returns type="Sprite">返回Sprite对象</returns>
THREE.Sprite = ( function () {

	var vertices = new Float32Array( [ - 0.5, - 0.5, 0, 0.5, - 0.5, 0, 0.5, 0.5, 0 ] );

	var geometry = new THREE.BufferGeometry();		//使用buffergeometry对象
	geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );	//为geometry对象添加position属性.这里可以看考BufferGeometry对象的源码注释.

	return function ( material ) {

		THREE.Object3D.call( this );	//调用Object3D对象的call方法,将原本属于Object3D的方法交给当前对象Sprite来使用.

		this.geometry = geometry;
		this.material = ( material !== undefined ) ? material : new THREE.SpriteMaterial();

	};

} )();

/*************************************************
****下面是Sprite对象的方法属性定义,继承自Object3D
**************************************************/
THREE.Sprite.prototype = Object.create( THREE.Object3D.prototype );

/*
///raycast方法用来获得当前对象与射线（参数raycaster）的交点.raycaster.intersectObject会调用这个方法。主要是用来进行碰撞检测,
/// 在选择场景中的对象时经常会用到,判断当前鼠标是否与对象重合用来选择对象.
/// NOTE：raycast方法中参数intersects参数用来存储交点的集合，格式如下
///	intersects.push( {
///
///				distance: distance,
///				point: this.position,
///				face: null,
///				object: this
///
///			} );
///
*////<summary>raycast</summary>
///<param name ="raycaster" type="THREE.Raycaster">射线对象</param>
///<param name ="intersects" type="ObjectArray">交点的属性集合</param>
///<returns type="ObjectArray">交点的属性集合</returns>
THREE.Sprite.prototype.raycast = ( function () {

	var matrixPosition = new THREE.Vector3();

	return function ( raycaster, intersects ) {

		matrixPosition.setFromMatrixPosition( this.matrixWorld );

		var distance = raycaster.ray.distanceToPoint( matrixPosition );

		if ( distance > this.scale.x ) {

			return;

		}

		intersects.push( {

			distance: distance,
			point: this.position,
			face: null,
			object: this

		} );

	};

}() );

/*updateMatrix方法
///updateMatrix方法更新场景中当前精灵的平移、旋转和缩放属性.
*/
///<summary>updateMatrix</summary>
///<returns type="Skeleton">返回新的Sprite精灵对象.</returns>	
THREE.Sprite.prototype.updateMatrix = function () {

	this.matrix.compose( this.position, this.quaternion, this.scale );	//compose方法应用变换矩阵的平移、旋转和缩放设置

	this.matrixWorldNeedsUpdate = true;	//Sprite对象matrixWorldNeedsUpdate属性,设置为true.

};

/*clone方法
///clone方法克隆一个Sprite精灵对象.
*/
///<summary>clone</summary>
///<param name ="object" type="Sprite">接收克隆的Sprite对象</param>
///<returns type="Sprite">返回克隆的Sprite精灵对象.</returns>	
THREE.Sprite.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.Sprite( this.material );

	THREE.Object3D.prototype.clone.call( this, object );

	return object;		//返回克隆的Sprite精灵对象

};

// Backwards compatibility 向后兼容,粒子被更名为精灵.

THREE.Particle = THREE.Sprite;
