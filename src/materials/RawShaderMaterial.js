/**
 * @author mrdoob / http://mrdoob.com/
 */

/*
///RawShaderMaterial方法根据参数parameters创建为自定义着色器创建材质类型,这样的材质对象让用户扩充材质类型,有了无限的可能.这个类和ShaderMaterial
///工作方式一样,除了自定义的uniforms和attribute属性不会自动追加到GLSL着色器代码中.
///parameters参数的格式看上面.ShaderMaterial对象的功能函数采用,定义构造的函数原型对象来实现.大部分属性方法继承自材质的基类ShaderMaterial.
///
/// Example:
///			var material = new THREE.RawShaderMaterial({
///				uniforms: {
///					time:{type: "f", value: new THREE.Vector2()}
///					},
///					vertexShader: document.getElementById('vertexShader').textContent,
///					fragmentShader: document.getElementById('fragmentShader').textContent
///				});
///
*/
///<summary>RawShaderMaterial</summary>
///<param name ="parameters" type="String">string类型的JSON格式材质属性参数</param>
///<returns type="RawShaderMaterial">返回RawShaderMaterial,为自定义着色器创建材质类型</returns>
THREE.RawShaderMaterial = function ( parameters ) {

	THREE.ShaderMaterial.call( this, parameters );	//调用ShaderMaterial对象的call方法,将原本属于ShaderMaterial的方法交给当前对象ShaderMaterial来使用.

};

/*************************************************************
****下面是RawShaderMaterial对象的方法属性定义,继承自ShaderMaterial
*************************************************************/
THREE.RawShaderMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );

/*clone方法
///clone方法克隆RawShaderMaterial对象,
*/
///<summary>clone</summary>
///<param name ="material" type="RawShaderMaterial">RawShaderMaterial对象,可有可无.</param>
///<returns type="RawShaderMaterial">返回克隆的RawShaderMaterial对象</returns>	
THREE.RawShaderMaterial.prototype.clone = function () {
	//以下是将材质的属性一一进行复制
	var material = new THREE.RawShaderMaterial();

	THREE.ShaderMaterial.prototype.clone.call( this, material );

	return material;	//返回克隆的RawShaderMaterial对象

};
