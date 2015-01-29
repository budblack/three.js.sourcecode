/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author alteredq / http://alteredqualia.com/
 *
 * For creating 3D text geometry in three.js
 *
 * Text = 3D Text
 *
 * parameters = {
 *  size: 			<float>, 	// size of the text 	字体的大小
 *  height: 		<float>, 	// thickness to extrude text 	3维字体的拉伸厚度,
 *  curveSegments: 	<int>,		// number of points on the curves  	拉伸厚度上的细分线段数.
 *
 *  font: 			<string>,		// font name 	//字体名称
 *  weight: 		<string>,		// font weight (normal, bold) //字体宽度
 *  style: 			<string>,		// font style  (normal, italics)  //字体样式
 *
 *  bevelEnabled:	<bool>,			// turn on bevel  是否启用字体倒角
 *  bevelThickness: <float>, 		// how deep into text bevel goes  //倒角的厚度
 *  bevelSize:		<float>, 		// how far from text outline is bevel  	//从截面外轮廓倒角的尺寸
 *  }
 *
 */

/*	Usage Examples 实例:

	// TextGeometry wrapper

	var text3d = new TextGeometry( text, options );			//创建textGeometry()对象.

	// Complete manner

	var textShapes = THREE.FontUtils.generateShapes( text, options );	//根据文字和参数选项生成图形截面
	var text3d = new ExtrudeGeometry( textShapes, options );			//调用ExtrudeGeometry()方法生成拉伸几何体

*/

/*
///TextGeometry用来生成文字
*/
///<summary>TextGeometry</summary>
///<param name ="text" type="string">文字内容</param>
///<param name ="parameters" type="Object">文字参数选项</param>
THREE.TextGeometry = function ( text, parameters ) {

	parameters = parameters || {};	//将参数赋值.

	var textShapes = THREE.FontUtils.generateShapes( text, parameters );	//根据文字和参数选项生成图形截面

	// translate parameters to ExtrudeGeometry API

	parameters.amount = parameters.height !== undefined ? parameters.height : 50; 	//3维字体的拉伸厚度,默认初始化为50

	// defaults

	if ( parameters.bevelThickness === undefined ) parameters.bevelThickness = 10;	//倒角的厚度,默认初始化为10
	if ( parameters.bevelSize === undefined ) parameters.bevelSize = 8;				//从截面外轮廓倒角的尺寸,默认初始化为8
	if ( parameters.bevelEnabled === undefined ) parameters.bevelEnabled = false; 	//是否启用字体倒角,默认不启用

	THREE.ExtrudeGeometry.call( this, textShapes, parameters );		//调用ExtrudeGeometry()方法生成拉伸几何体,并将ExtrudeGeometry对象的方法供TextGeometry对象使用.

};
/*************************************************
****下面是TextGeometryh对象的方法属性定义,继承自ExtrudeGeometry对象.
**************************************************/
THREE.TextGeometry.prototype = Object.create( THREE.ExtrudeGeometry.prototype );
