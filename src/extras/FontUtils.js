/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author alteredq / http://alteredqualia.com/
 *
 * For Text operations in three.js (See TextGeometry)
 *
 * It uses techniques used in:
 *
 * 	typeface.js and canvastext
 * 		For converting fonts and rendering with javascript
 *		使用javascript渲染和转换字体通过typeface.js,访问下面网站.
 *		http://typeface.neocracy.org
 *
 *	Triangulation ported from AS3
 *		Simple Polygon Triangulation
 * 		简单的多边形三角化
 *		http://actionsnippet.com/?p=1462
 *
 * 	A Method to triangulate shapes with holes
 *	一个将带有孔洞(镂空,用这个词肯能更加的专业一些吧.)的图形三角化
 *		http://www.sakri.net/blog/2009/06/12/an-approach-to-triangulating-polygons-with-holes/
 */
/****************************typeface_js文件格式,下面是一个字符"o",有兴趣的朋友可以看看形字体的规范.*************************************************
*	if (_typeface_js && _typeface_js.loadFace) _typeface_js.loadFace(
*			{"glyphs":
*				{"ο":
*					{"x_min":30,
*					"x_max":741,
*					"ha":774,
*					"o":"m 395 683 q 645 587 550 683 q 741 337 741 492 q 646 79 741 173 q 385 -15 552 -15 q 127 78 225 -15 q 30 333 30 172 q 129 590 30 498 q 395 683 228 683 m 269 174 q 305 85 275 119 q 386 52 335 52 q 464 85 436 52 q 503 172 491 119 q 510 237 506 194 q 515 336 515 279 q 510 431 515 391 q 503 494 506 472 q 464 581 491 548 q 385 615 436 615 q 291 563 315 615 q 261 459 267 512 q 256 333 256 407 q 269 174 256 248 "
*					}
*				}
*			}
*		}
*	)
****************************************************************************************************************************************************/
/**************************************************************
 *	FontUtils Font对象的工具集
 **************************************************************/
THREE.FontUtils = {

	faces: {}, //组成字体的面.

	// Just for now. face[weight][style]

	face: 'helvetiker', //字体名称
	weight: 'normal',	//字宽,字体笔划的宽度.
	style: 'normal',    //字体样式,粗体,斜体等等
	size: 150,	 	    //字体尺寸
	divisions: 10,	  	//定距等分数量

	getFace: function () {

		try {	//捕获字体字宽字体样式等异常

			return this.faces[ this.face ][ this.weight ][ this.style ];

		} catch (e) {

			throw "The font " + this.face + " with " + this.weight + " weight and " + this.style + " style is missing."

		};

	},
	/*
	///loadFace方法的具体实现,读取字体文件内的字符的比划图形路径数据.
	///****************************typeface_js文件格式,下面是一个字符"o",有兴趣的朋友可以看看形字体的规范.*************************************************
	///	if (_typeface_js && _typeface_js.loadFace) _typeface_js.loadFace(
	///			{"glyphs":
	///				{"ο":
	///					{"x_min":30,
	///					"x_max":741,
	///					"ha":774,
	///					"o":"m 395 683 q 645 587 550 683 q 741 337 741 492 q 646 79 741 173 q 385 -15 552 -15 q 127 78 225 -15 q 30 333 30 172 q 129 590 30 498 q 395 683 228 683 m 269 174 q 305 85 275 119 q 386 52 335 52 q 464 85 436 52 q 503 172 491 119 q 510 237 506 194 q 515 336 515 279 q 510 431 515 391 q 503 494 506 472 q 464 581 491 548 q 385 615 436 615 q 291 563 315 615 q 261 459 267 512 q 256 333 256 407 q 269 174 256 248 "
	///					}
	///				}
	///			}
	///		}
	///	)
	///****************************************************************************************************************************************************
	*/
	///<summary>loadFace</summary>
	///<param name ="data" type="Object">字体形数据.</param>
	///<returns type="Object3d">返回Object3D对象</returns>	
	loadFace: function ( data ) {

		var family = data.familyName.toLowerCase();	//字体族名字转换成小写

		var ThreeFont = this; 

		ThreeFont.faces[ family ] = ThreeFont.faces[ family ] || {};

		ThreeFont.faces[ family ][ data.cssFontWeight ] = ThreeFont.faces[ family ][ data.cssFontWeight ] || {};
		ThreeFont.faces[ family ][ data.cssFontWeight ][ data.cssFontStyle ] = data;

		var face = ThreeFont.faces[ family ][ data.cssFontWeight ][ data.cssFontStyle ] = data;

		return data; //返回字体文件内的字符的比划图形路径数据.

	},
	/*
	///drawText方法的具体实现,从读取的字体数据中,按照文字内容中的每个字符,获得字符的比划路径
	*/
	///<summary>loadFace</summary>
	///<param name ="text" type="String">文字内容.</param>
	///<returns type="Object3d">返回字符的比划图形路径</returns>	
	drawText: function ( text ) {

		var characterPts = [], allPts = [];

		// RenderText

		var i, p,
			face = this.getFace(),	//字体文件内的字符的比划图形路径数据.
			scale = this.size / face.resolution, 	//字体缩放
			offset = 0,	//字符间距
			chars = String( text ).split( '' ), 	//分割字符串
			length = chars.length;

		var fontPaths = [];	 	//字体路径顶点数据数组.

		for ( i = 0; i < length; i ++ ) {	//遍历所有的字符

			var path = new THREE.Path();

			var ret = this.extractGlyphPoints( chars[ i ], face, scale, offset, path );	//调用extractGlyphPoints方法,解析字符路径.
			offset += ret.offset;

			fontPaths.push( ret.path );

		}

		// get the width

		var width = offset / 2; 	//字宽,字体笔划的宽度
		//
		// for ( p = 0; p < allPts.length; p++ ) {
		//
		// 	allPts[ p ].x -= width;
		//
		// }

		//var extract = this.extractPoints( allPts, characterPts );
		//extract.contour = allPts;

		//extract.paths = fontPaths;
		//extract.offset = width;

		return { paths: fontPaths, offset: width }; //返回特定格式的对象.

	},

	/*
	///extractGlyphPoints方法解析字符路径.返回特定格式的字符路径对象
	///****************************typeface_js文件格式,下面是一个字符"o",有兴趣的朋友可以看看形字体的规范.*************************************************
	///	if (_typeface_js && _typeface_js.loadFace) _typeface_js.loadFace(
	///			{"glyphs":
	///				{"ο":
	///					{"x_min":30,
	///					"x_max":741,
	///					"ha":774,
	///					"o":"m 395 683 q 645 587 550 683 q 741 337 741 492 q 646 79 741 173 q 385 -15 552 -15 q 127 78 225 -15 q 30 333 30 172 q 129 590 30 498 q 395 683 228 683 m 269 174 q 305 85 275 119 q 386 52 335 52 q 464 85 436 52 q 503 172 491 119 q 510 237 506 194 q 515 336 515 279 q 510 431 515 391 q 503 494 506 472 q 464 581 491 548 q 385 615 436 615 q 291 563 315 615 q 261 459 267 512 q 256 333 256 407 q 269 174 256 248 "
	///					}
	///				}
	///			}
	///		}
	///	)
	///****************************************************************************************************************************************************
	*/
	///<summary>extractGlyphPoints</summary>
	///<param name ="c" type="Char">字符.</param>
	///<param name ="face" type="Object">字体文件内的字符的比划图形路径数据.</param>
	///<param name ="scale" type="float">字体缩放.</param>
	///<param name ="offset" type="float">字符间距.</param>
	///<param name ="path" type="THREE.Path">文字的图形路径.</param>
	///<returns type="Object3d">返回特定格式的字符路径对象</returns>	
	extractGlyphPoints: function ( c, face, scale, offset, path ) {

		var pts = [];

		var i, i2, divisions,
			outline, action, length,
			scaleX, scaleY,
			x, y, cpx, cpy, cpx0, cpy0, cpx1, cpy1, cpx2, cpy2,
			laste,
			glyph = face.glyphs[ c ] || face.glyphs[ '?' ];

		if ( ! glyph ) return;
		//下边的代码,和THREE.Path里定义的动作定义的一样.结合字符的数据.这样笔划的图形路径就画出来了.
		if ( glyph.o ) {

			outline = glyph._cachedOutline || ( glyph._cachedOutline = glyph.o.split( ' ' ) );
			length = outline.length;

			scaleX = scale;
			scaleY = scale;

			for ( i = 0; i < length; ) {

				action = outline[ i ++ ];

				//console.log( action );

				switch ( action ) {

				case 'm':

					// Move To

					x = outline[ i ++ ] * scaleX + offset;
					y = outline[ i ++ ] * scaleY;

					path.moveTo( x, y );
					break;

				case 'l':

					// Line To

					x = outline[ i ++ ] * scaleX + offset;
					y = outline[ i ++ ] * scaleY;
					path.lineTo( x,y );
					break;

				case 'q':

					// QuadraticCurveTo

					cpx  = outline[ i ++ ] * scaleX + offset;
					cpy  = outline[ i ++ ] * scaleY;
					cpx1 = outline[ i ++ ] * scaleX + offset;
					cpy1 = outline[ i ++ ] * scaleY;

					path.quadraticCurveTo( cpx1, cpy1, cpx, cpy );

					laste = pts[ pts.length - 1 ];

					if ( laste ) {

						cpx0 = laste.x;
						cpy0 = laste.y;

						for ( i2 = 1, divisions = this.divisions; i2 <= divisions; i2 ++ ) {

							var t = i2 / divisions;
							var tx = THREE.Shape.Utils.b2( t, cpx0, cpx1, cpx );
							var ty = THREE.Shape.Utils.b2( t, cpy0, cpy1, cpy );
					  }

				  }

				  break;

				case 'b':

					// Cubic Bezier Curve

					cpx  = outline[ i ++ ] *  scaleX + offset;
					cpy  = outline[ i ++ ] *  scaleY;
					cpx1 = outline[ i ++ ] *  scaleX + offset;
					cpy1 = outline[ i ++ ] *  scaleY;
					cpx2 = outline[ i ++ ] *  scaleX + offset;
					cpy2 = outline[ i ++ ] *  scaleY;

					path.bezierCurveTo( cpx1, cpy1, cpx2, cpy2, cpx, cpy );

					laste = pts[ pts.length - 1 ];

					if ( laste ) {

						cpx0 = laste.x;
						cpy0 = laste.y;

						for ( i2 = 1, divisions = this.divisions; i2 <= divisions; i2 ++ ) {

							var t = i2 / divisions;
							var tx = THREE.Shape.Utils.b3( t, cpx0, cpx1, cpx2, cpx );
							var ty = THREE.Shape.Utils.b3( t, cpy0, cpy1, cpy2, cpy );

						}

					}

					break;

				}

			}
		}



		return { offset: glyph.ha * scale, path:path };	//返回特定格式的字符路径轮廓图形对象
	}

};

/*
///generateShapes方法的根据文字内容(参数text),参数选项(参数parameters),生成文字路径轮廓图形数组.
/// NOTE:参数parameters的格式如下,和材质的用法一致.
/// parameters = {
///  size: 			<float>, 	// size of the text 	字体的大小
///  height: 		<float>, 	// thickness to extrude text 	3维字体的拉伸厚度,
///  curveSegments: 	<int>,		// number of points on the curves  	拉伸厚度上的细分线段数.
///
///  font: 			<string>,		// font name 	//字体名称
///  weight: 		<string>,		// font weight (normal, bold) //字体宽度
///  style: 			<string>,		// font style  (normal, italics)  //字体样式
///
///  bevelEnabled:	<bool>,			// turn on bevel  是否启用字体倒角
///  bevelThickness: <float>, 		// how deep into text bevel goes  //倒角的厚度
///  bevelSize:		<float>, 		// how far from text outline is bevel  	//从截面外轮廓倒角的尺寸
///  }
*/
///<summary>generateShapes</summary>
///<param name ="text" type="String">文字内容.</param>
///<param name ="parameters" type="Object">文字内容.</param>
///<returns type="Object3d">返回文字路径轮廓图形数组</returns>	
THREE.FontUtils.generateShapes = function ( text, parameters ) {

	// Parameters 

	parameters = parameters || {}; //参数选项.

	var size = parameters.size !== undefined ? parameters.size : 100;	//字体的大小,如果未定义初始化为100.
	var curveSegments = parameters.curveSegments !== undefined ? parameters.curveSegments : 4;	//拉伸厚度上的细分线段数,如果未定义初始化为4

	var font = parameters.font !== undefined ? parameters.font : 'helvetiker';	//字体名称,如果未定义初始化为'helvetiker'
	var weight = parameters.weight !== undefined ? parameters.weight : 'normal';	//字体宽度,如果未定义初始化为'normal'
	var style = parameters.style !== undefined ? parameters.style : 'normal';	//字体样式,如果未定义初始化为'normal'

	THREE.FontUtils.size = size;	//赋值字体的大小
	THREE.FontUtils.divisions = curveSegments;	//赋值定距等分数量

	THREE.FontUtils.face = font;	//赋值字体名称
	THREE.FontUtils.weight = weight;	//赋值字体宽度
	THREE.FontUtils.style = style;	//赋值字体样式

	// Get a Font data json object

	var data = THREE.FontUtils.drawText( text );	//调用THREE.FontUtils.drawText()方法,返回字符的比划图形路径

	var paths = data.paths;	
	var shapes = [];

	for ( var p = 0, pl = paths.length; p < pl; p ++ ) {	//遍历图形数组

		Array.prototype.push.apply( shapes, paths[ p ].toShapes() );	//将图形复制到shapes数组内.

	}

	return shapes;	//返回文字路径轮廓图形数组

};


/**
 * This code is a quick port of code written in C++ which was submitted to
 * flipcode.com by John W. Ratcliff  // July 22, 2000
 * See original code and more information here:
 * http://www.flipcode.com/archives/Efficient_Polygon_Triangulation.shtml
 *
 * ported to actionscript by Zevan Rosser
 * www.actionsnippet.com
 *
 * ported to javascript by Joshua Koo
 * http://www.lab4games.net/zz85/blog
 *
 */


( function ( namespace ) {

	var EPSILON = 0.0000000001;

	// takes in an contour array and returns
	//多边形三角化算法参考:
	// http://en.wikipedia.org/wiki/Delaunay_triangulation
	/*
	///process方法将多边形三角化.特别详细的还是找本几何造型的书,自己看看吧.
	*/
	///<summary>process</summary>
	///<param name ="contour" type="Vector2Array">二维向量数组.</param>
	///<param name ="indices" type="Geometry">true 或者 false,一个布尔值，指示是否需要返回索引</param>
	///<returns type="Number">返回三角形顶点数据</returns>	
	var process = function ( contour, indices ) {

		var n = contour.length;

		if ( n < 3 ) return null;

		var result = [],
			verts = [],
			vertIndices = [];

		/* we want a counter-clockwise polygon in verts */
		/* 我们想要顶点顺序顺时针的多边形*/

		var u, v, w;

		if ( area( contour ) > 0.0 ) {

			for ( v = 0; v < n; v ++ ) verts[ v ] = v;

		} else {

			for ( v = 0; v < n; v ++ ) verts[ v ] = ( n - 1 ) - v;

		}

		var nv = n;

		/*  remove nv - 2 vertices, creating 1 triangle every time */
		// 删除nv 2个顶点,每次创建一个三角形.

		var count = 2 * nv;   /* error detection */	//错误检查

		for ( v = nv - 1; nv > 2; ) {

			/* if we loop, it is probably a non-simple polygon */
			// 如果上面条件成立,这个图形将不是一个简化多边形.

			if ( ( count -- ) <= 0 ) { //如果数量小于等于0

				//** Triangulate: ERROR - probable bad polygon! 错误的多边形对象

				//throw ( "Warning, unable to triangulate polygon!" );
				//return null;
				// Sometimes warning is fine, especially polygons are triangulated in reverse.
				console.log( 'Warning, unable to triangulate polygon!' ); //提示用户不能三角化多边形

				if ( indices ) return vertIndices;
				return result;

			}

			/* three consecutive vertices in current polygon, <u,v,w> */
			// u,v,w 当前多边形的三个连续的顶点

			u = v; 	 	if ( nv <= u ) u = 0;     /* previous */
			v = u + 1;  if ( nv <= v ) v = 0;     /* new v    */
			w = v + 1;  if ( nv <= w ) w = 0;     /* next     */

			if ( snip( contour, u, v, w, nv, verts ) ) {

				var a, b, c, s, t;

				/* true names of the vertices */
				// 指定顶点为三角形的顶点a,b,c
				a = verts[ u ];
				b = verts[ v ];
				c = verts[ w ];

				/* output Triangle */
				//输出三角形

				result.push( [ contour[ a ],
					contour[ b ],
					contour[ c ] ] );


				vertIndices.push( [ verts[ u ], verts[ v ], verts[ w ] ] );
				//包含系列的三角形顶点数组

				/* remove v from the remaining polygon */
				//从剩余的多边形删除v
				for ( s = v, t = v + 1; t < nv; s++, t++ ) {

					verts[ s ] = verts[ t ];

				}

				nv --;

				/* reset error detection counter */
				//复位错误检测计数器

				count = 2 * nv;

			}

		}

		if ( indices ) return vertIndices; 	//返回
		return result;

	};

	/*
	///area用来计算多边形轮廓的面积,经常用来判断顶点的排列顺序,是顺时针,还是逆时针,结果小于0,为顺时针,大于0,为逆时针.
	*/
	///<summary>area</summary>
	///<param name ="contour" type="Vector2Array">多边形顶点数组</param>
	///<returns type="float">返回多边形的面积</returns>	
	// calculate area of the contour polygon
	// 计算多边形轮廓的面积
	var area = function ( contour ) {

		var n = contour.length;
		var a = 0.0;

		for ( var p = n - 1, q = 0; q < n; p = q ++ ) {

			a += contour[ p ].x * contour[ q ].y - contour[ q ].x * contour[ p ].y;

		}

		return a * 0.5;	//返回多边形的面积.

	};

	var snip = function ( contour, u, v, w, n, verts ) {

		var p;
		var ax, ay, bx, by;
		var cx, cy, px, py;

		ax = contour[ verts[ u ] ].x;
		ay = contour[ verts[ u ] ].y;

		bx = contour[ verts[ v ] ].x;
		by = contour[ verts[ v ] ].y;

		cx = contour[ verts[ w ] ].x;
		cy = contour[ verts[ w ] ].y;

		if ( EPSILON > ( ( ( bx - ax ) * ( cy - ay ) ) - ( ( by - ay ) * ( cx - ax ) ) ) ) return false; //如果底边乘以高

		var aX, aY, bX, bY, cX, cY;
		var apx, apy, bpx, bpy, cpx, cpy;
		var cCROSSap, bCROSScp, aCROSSbp;

		aX = cx - bx;  aY = cy - by;
		bX = ax - cx;  bY = ay - cy;
		cX = bx - ax;  cY = by - ay;

		for ( p = 0; p < n; p ++ ) {

			px = contour[ verts[ p ] ].x
			py = contour[ verts[ p ] ].y

			if ( ( ( px === ax ) && ( py === ay ) ) ||
				 ( ( px === bx ) && ( py === by ) ) ||
				 ( ( px === cx ) && ( py === cy ) ) )	continue;

			apx = px - ax;  apy = py - ay;
			bpx = px - bx;  bpy = py - by;
			cpx = px - cx;  cpy = py - cy;

			// see if p is inside triangle abc

			aCROSSbp = aX * bpy - aY * bpx;
			cCROSSap = cX * apy - cY * apx;
			bCROSScp = bX * cpy - bY * cpx;

			if ( ( aCROSSbp >= - EPSILON ) && ( bCROSScp >= - EPSILON ) && ( cCROSSap >= - EPSILON ) ) return false;

		}

		return true;

	};


	namespace.Triangulate = process;
	namespace.Triangulate.area = area;

	return namespace;

} )( THREE.FontUtils );

// To use the typeface.js face files, hook up the API
// 使用typeface.js面文件，挂接API,
self._typeface_js = { faces: THREE.FontUtils.faces, loadFace: THREE.FontUtils.loadFace };
THREE.typeface_js = self._typeface_js;
