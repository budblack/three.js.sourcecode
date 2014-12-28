/**
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  defines: { "label" : "value" },
 *  uniforms: { "parameter1": { type: "f", value: 1.0 }, "parameter2": { type: "i" value2: 2 } },
 *
 *  fragmentShader: <string>,
 *  vertexShader: <string>,
 *
 *  shading: THREE.SmoothShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  lights: <bool>,
 *
 *  vertexColors: THREE.NoColors / THREE.VertexColors / THREE.FaceColors,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>,
 *
 *	fog: <bool>
 * }
 */

/*
///ShaderMaterial方法根据参数parameters创建为自定义着色器创建材质类型,这样的材质对象让用户扩充材质类型,有了无限的可能.
///parameters参数的格式看上面.ShaderMaterial对象的功能函数采用,定义构造的函数原型对象来实现.大部分属性方法继承自材质的基类Material.
///
/// Example:
///			var material = new THREE.ShaderMaterial({
///				uniforms: {
///					time:{type: "f", value: new THREE.Vector2()}
///					},
///					vertexShader: document.getElementById('vertexShader').textContent,
///					fragmentShader: document.getElementById('fragmentShader').textContent
///				});
///
*/
///<summary>ShaderMaterial</summary>
///<param name ="parameters" type="String">string类型的JSON格式材质属性参数</param>
///<returns type="ShaderMaterial">返回ShaderMaterial,为自定义着色器创建材质类型</returns>
THREE.ShaderMaterial = function ( parameters ) {

	THREE.Material.call( this );	//调用Material对象的call方法,将原本属于Material的方法交给当前对象ShaderMaterial来使用.

	this.defines = {};	//用户自定义defines变量
	this.uniforms = {};	//用户自定义uniforms变量
	this.attributes = null;	//用户自定义attribute变量,默认初始化为null

	this.vertexShader = 'void main() {\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}';	//由glsl写的自定义顶点着色器
	this.fragmentShader = 'void main() {\n\tgl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}';			//由glsl编写的自定义片元着色器

	// shading
	// 着色处理
	/*********************着色方式**************************************************************************
	着色方式
	         绝大多数的3D物体是由多边形（polygon）所构成的，它们都必须经过某些着色处理的手续，才不会以线结构（wireframe）的方式显示。
	         这些着色处理方式有差到好，依次主要分为FlatShading、GouraudShading、PhoneShading、ScanlineRenderer、Ray-Traced。
	        FlatShading（平面着色）
	            也叫做“恒量着色”，平面着色是最简单也是最快速的着色方法，每个多边形都会被指定一个单一且没有变化的颜色。这种方法虽然会产生出不真实
	            的效果，不过它非常适用于快速成像及其它要求速度重于细致度的场合，如：生成预览动画。

	        GouraudShading（高洛德着色/高氏着色）
	            这种着色的效果要好得多，也是在游戏中使用最广泛的一种着色方式。它可对3D模型各顶点的颜色进行平滑、融合处理，将每个多边形上的每个点
	            赋以一组色调值，同时将多边形着上较为顺滑的渐变色，使其外观具有更强烈的实时感和立体动感，不过其着色速度比平面着色慢得多。

	        PhoneShading（补色着色）
	            首先，找出每个多边形顶点，然后根据内插值的方法，算出顶点间算连线上像素的光影值，接着再次运用线性的插值处理，算出其他所有像素高氏着
	            色在取样计算时，只顾及每个多边形顶点的光影效果，而补色着色却会把所有的点都计算进去。

	        ScanlineRenderer（扫描线着色）
	            这是3ds Max的默认渲染方式，它是一种基于一组连续水平线的着色方式，由于它渲染速度较快，一般被使用在预览场景中。

	        Ray-Traced（光线跟踪着色）
	            光线跟踪是真实按照物理照射光线的入射路径投射在物体上，最终反射回摄象机所得到每一个像素的真实值的着色算法，由于它计算精确，所得到的
	            图象效果优质，因此制作CG一定要使用该选项。

	        Radiosity（辐射着色）
	            这是一种类似光线跟踪的特效。它通过制定在场景中光线的来源并且根据物体的位置和反射情况来计算从观察者到光源的整个路径上的光影效果。在
	            这条线路上，光线受到不同物体的相互影响，如：反射、吸收、折射等情况都被计算在内。


	        glShadeModel( GLenum mode )可以设置的着色模型有：GL_SMOOTH和GL_FLAT
	            GL_FLAT恒定着色：对点，直线或多边形采用一种颜色进行绘制，整个图元的颜色就是它的任何一点的颜色。
	            GL_SMOOTH平滑着色：用多种颜色进行绘制，每个顶点都是单独进行处理的，各顶点和各图元之间采用均匀插值。

	*********************着色方式**************************************************************************/
	this.shading = THREE.SmoothShading;//着色方式,THREE.SmoothShading平滑着色：用多种颜色进行绘制，每个顶点都是单独进行处理的，各顶点和各图元之间采用均匀插值。
										//还有以下几种THREE.NoShading = 0;    //不着色???? 
										//THREE.FlatShading = 1;  //GL_FLAT恒定着色：对点，直线或多边形采用一种颜色进行绘制，整个图元的颜色就是它的任何一点的颜色。

	this.linewidth = 1;		//线宽属性,默认初始化为1
							//TODO: 这个linewidth属性是干啥的呢?

	this.wireframe = false;				//以线框方式渲染几何体.默认为false
	this.wireframeLinewidth = 1;		//线框的宽度,默认初始化为1.

	this.fog = false; // set to use scene fog 	//是否开启雾效,默认关闭

	this.lights = false; // set to use scene lights	//是否使用场景内的灯光,默认初始化为false

	this.vertexColors = THREE.NoColors; // set to use "color" attribute stream
											//顶点颜色,默认初始化为THREE.NoColors.当然还可以有 THREE.VertexColors / THREE.FaceColors等选项,这里显示出了javascript的灵活性了.

	this.skinning = false; // set to use skinning attribute streams  //定义材质是否使用蒙皮,默认初始化为false

	this.morphTargets = false; // set to use morph targets			//定义材质是否设定目标变形动画,默认为false
	this.morphNormals = false; // set to use morph normals 			//定义是否反转(变换)法线,默认为false

	// When rendered geometry doesn't include these attributes but the material does,
	// use these default values in WebGL. This avoids errors when buffer data is missing.
	// 当渲染几何体不包含这些属性,但是材质中包含,在WEBGL中使用这些默认的值,可以避免缓存数据丢失发生错误.
	this.defaultAttributeValues = {
		'color': [ 1, 1, 1 ],
		'uv': [ 0, 0 ],
		'uv2': [ 0, 0 ]
	};	//在WEBGL中的默认属性值.

	this.index0AttributeName = undefined;	//这个index0AttributeName属性,用来接收索引为0的属性名.
											//TODO:等到看我WEBGL渲染器后,回来补充这里吧.

	this.setValues( parameters );	//调用Material类的setValues方法,将参数parameters赋值给当前ShaderMaterial材质的属性.

};

/*************************************************************
****下面是ShaderMaterial对象的方法属性定义,继承自Material
*************************************************************/
THREE.ShaderMaterial.prototype = Object.create( THREE.Material.prototype );

/*clone方法
///clone方法克隆ShaderMaterial对象,
*/
///<summary>clone</summary>
///<param name ="material" type="ShaderMaterial">ShaderMaterial对象,可有可无.</param>
///<returns type="ShaderMaterial">返回克隆的ShaderMaterial对象</returns>	
THREE.ShaderMaterial.prototype.clone = function () {
	//以下是将材质的属性一一进行复制
	var material = new THREE.ShaderMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.fragmentShader = this.fragmentShader;
	material.vertexShader = this.vertexShader;

	material.uniforms = THREE.UniformsUtils.clone( this.uniforms );

	material.attributes = this.attributes;
	material.defines = this.defines;

	material.shading = this.shading;

	material.wireframe = this.wireframe;
	material.wireframeLinewidth = this.wireframeLinewidth;

	material.fog = this.fog;

	material.lights = this.lights;

	material.vertexColors = this.vertexColors;

	material.skinning = this.skinning;

	material.morphTargets = this.morphTargets;
	material.morphNormals = this.morphNormals;

	return material;	//返回克隆的ShaderMaterial对象

};
