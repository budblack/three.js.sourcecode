/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author ikerr / http://verold.com
 */
/*
///Scene是骨骼对象,是蒙皮对象的一部分,用来制作支持骨骼动画,当前有两种模型动画的方式：顶点动画和骨骼动画。顶点动画中，每帧动画其实就是模型特定姿态的一个“快照”。通过在帧之间插值的方法，
/// 引擎可以得到平滑的动画效果。在骨骼动画中，模型具有互相连接的“骨骼”组成的骨架结构，通过改变骨骼的朝向和位置来为模型生成动画。
/// 骨骼动画比顶点动画要求更高的处理器性能，但同时它也具有更多的优点，骨骼动画可以更容易、更快捷地创建。不同的骨骼动画可以被结合到一起——比如，
/// 模型可以转动头部、射击并且同时也在走路。一些引擎可以实时操纵单个骨骼，这样就可以和环境更加准确地进行交互——模型可以俯身并向某个方向观察或射击，
/// 或者从地上的某个地方捡起一个东西。多数引擎支持顶点动画，但不是所有的引擎都支持骨骼动画。
/// 一些引擎包含面部动画系统，这种系统使用通过音位（phoneme）和情绪修改面部骨骼集合来表达面部表情和嘴部动作。
*/
///<summary>Scene</summary>
///<param name ="belongsToSkin" type="SkinnedMesh">蒙皮对象</param>
///<returns type="Bone">骨骼对象</returns>
THREE.Bone = function ( belongsToSkin ) {

	THREE.Object3D.call( this );	//调用Object3D对象的call方法,将原本属于Object3D的方法交给当前对象Bone来使用.

	this.skin = belongsToSkin;	//包含次骨骼的皮肤.

	this.accumulatedRotWeight = 0;	//旋转权重递增步长
	this.accumulatedPosWeight = 0;	//位移权重递增步长
	this.accumulatedSclWeight = 0;	//缩放权重递增步长

};

/*************************************************
****下面是Bone对象的方法属性定义,继承自Object3D
**************************************************/
THREE.Bone.prototype = Object.create( THREE.Object3D.prototype );

/*
///updateMatrixWorld方法对当前骨骼对象及其子对象的matrix属性应用全局位移,旋转,缩放变换.
///NOTE: 在updateMatrixWorld方法中如果参数force为true,将对其子对象应用同样的全局变换.
*/
///<summary>updateMatrixWorld</summary>
///<param name ="force" type="Boolean">true或者false</param>
///<returns type="Object3D">返回新的Object3D对象</returns>	
THREE.Bone.prototype.updateMatrixWorld = function ( force ) {

	THREE.Object3D.prototype.updateMatrixWorld.call( this, force );		//继承Object3D对象的updateMatrixWorld方法,

	// Reset weights to be re-accumulated in the next frame
	// 重新设置权重,在下一帧重新递增步长

	this.accumulatedRotWeight = 0;
	this.accumulatedPosWeight = 0;
	this.accumulatedSclWeight = 0;

};

