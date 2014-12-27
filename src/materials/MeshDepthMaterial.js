/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  opacity: <float>,
 *
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>
 * }
 */

/*
///MeshNormalMaterial方法根据参数parameters创建mesh(网格)的标准材质类型,到这里真的不知道怎么翻译才好,还不如叫NormalMaterial呢,
///parameters参数的格式看上面.MeshNormalMaterial对象的功能函数采用,定义构造的函数原型对象来实现.大部分属性方法继承自材质的基类Material.
*/
///<summary>MeshDepthMaterial</summary>
///<param name ="parameters" type="String">string类型的JSON格式材质属性参数</param>
///<returns type="MeshDepthMaterial">返回MeshDepthMaterial,网格深度材质.</returns>
THREE.MeshDepthMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.morphTargets = false;
	this.wireframe = false;
	this.wireframeLinewidth = 1;

	this.setValues( parameters );

};

THREE.MeshDepthMaterial.prototype = Object.create( THREE.Material.prototype );

THREE.MeshDepthMaterial.prototype.clone = function () {

	var material = new THREE.MeshDepthMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.wireframe = this.wireframe;
	material.wireframeLinewidth = this.wireframeLinewidth;

	return material;

};
