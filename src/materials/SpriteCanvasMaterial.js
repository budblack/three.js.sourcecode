/**
 * @author mrdoob / http://mrdoob.com/
 *
 * parameters = {
 *  color: <hex>,
 *  program: <function>,
 *  opacity: <float>,
 *  blending: THREE.NormalBlending
 * }
 */

/*
///SpriteCanvasMaterial方法根据参数parameters创建适用于canvas渲染器的Sprite(点精灵)的材质类型,
///parameters参数的格式看上面.SpriteCanvasMaterial对象的功能函数采用,定义构造的函数原型对象来实现.大部分属性方法继承自材质的基类Material.
///TODO: SpriteCanvasMaterial和SpriteMaterial除了几个属性不一样,不知道是不是应用场景也不一样?
*/
///<summary>SpriteCanvasMaterial</summary>
///<param name ="parameters" type="String">string类型的JSON格式材质属性参数</param>
///<returns type="SpriteCanvasMaterial">返回SpriteCanvasMaterial,点精灵材质.</returns>
THREE.SpriteCanvasMaterial = function ( parameters ) {

	THREE.Material.call( this );	//调用Material对象的call方法,将原本属于Material的方法交给当前对象SpriteCanvasMaterial来使用

	this.color = new THREE.Color( 0xffffff ); // 颜色,默认初始化为0xffffff,白色
	this.program = function ( context, color ) {};	//自定义程序,
													//TODO:this.program属性在这里是啥意思???

	this.setValues( parameters );	//调用Material类的setValues方法,将参数parameters赋值给当前SpriteCanvasMaterial材质的属性.

};
/*************************************************************
****下面是SpriteCanvasMaterial对象的方法属性定义,继承自Material
*************************************************************/
THREE.SpriteCanvasMaterial.prototype = Object.create( THREE.Material.prototype );

/*clone方法
///clone方法克隆SpriteCanvasMaterial对象,
*/
///<summary>clone</summary>
///<param name ="material" type="SpriteCanvasMaterial">SpriteCanvasMaterial对象,可有可无.</param>
///<returns type="SpriteCanvasMaterial">返回克隆的SpriteCanvasMaterial对象</returns>	
THREE.SpriteCanvasMaterial.prototype.clone = function () {
	//以下是将材质的属性一一进行复制.
	var material = new THREE.SpriteCanvasMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.color.copy( this.color );
	material.program = this.program;

	return material;	//返回克隆的SpriteMaterial对象

};

// backwards compatibility 向后兼容
/*
///ParticleCanvasMaterial方法被THREE.SpriteCanvasMaterial方法替换.
*/
THREE.ParticleCanvasMaterial = THREE.SpriteCanvasMaterial;
