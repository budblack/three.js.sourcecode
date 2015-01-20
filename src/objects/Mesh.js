/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author jonobr1 / http://jonobr1.com/
 */

/*
///Mesh对象,最终的网格对象,有高人把图形学建模比作是制作灯笼,先用Geometry创建灯笼的框架,然后将材质material贴在框架上,最后形成的总体灯笼,就是Mesh对象.下面看一下Mesh对象的用法和具体实现.
/// 用法:var geometry = new THREE.Geometry(1,1,1);				//创建geometry对象(灯笼的框架),
///																//有一下可选对象BoxGeometry,CircleGeometry,CubeGeometry,CylinderGeometry,DodecahedronGeometry,ExtrudeGeometry,IcosahedronGeometry,
///																//LatheGeometry,OctahedronGeometry,ParametricGeometry,PlaneGeometry,PolyhedronGeometry,RingGeometry,ShapeGeometry,SphereGeometry,
///																//TetrahedronGeometry,TextGeometry,TorusGeometry,TorusKnotGeometry,TubeGeometry
///		 var material = new THREE.Material({color: 0xffff00});	//创建材质对象(灯笼的表面)
///																//有以下可选对象LineBasicMaterial,LineDashedMaterial,Material,MeshBasicMaterial,MeshDepthMaterial,MeshFaceMaterial,
///																//MeshLambertMaterial,MeshNormalMaterial,MeshPhongMaterial,PointCloudMaterial,RawShaderMaterial,ShaderMaterial,
///																//SpriteCanvasMaterial,SpriteMaterial
///		 var mesh = new THREE.Mesh(geometry, material);	//创建mesh(灯笼)对象,并将geometry对象(灯笼的框架)和material对象(灯笼的表面)传递给mesh(灯笼)对象
///		 scene.add(mesh); 	//将mesh(灯笼)添加到场景中.
*/
///<summary>Mesh</summary>
///<param name ="geometry" type="THREE.Geometry">Geometry对象(灯笼的框架)</param>
///<param name ="material" type="THREE.Material">Material对象(材质对象)</param>
///<returns type="Mesh">返回Mesh对象</returns>
THREE.Mesh = function ( geometry, material ) {

	THREE.Object3D.call( this );	//调用Object3D对象的call方法,将原本属于Object3D的方法交给当前对象Mesh来使用.

	this.geometry = geometry !== undefined ? geometry : new THREE.Geometry();	//将参数geometry赋值给mesh对象的geometry属性
	this.material = material !== undefined ? material : new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } );		//将参数material赋值给mesh对象的material属性,如果没有传递material参数,将创建随机颜色材质,赋值给当前mesh对象

/*
///MorphTargets
///原文地址:http://www.tuicool.com/articles/rYzuuu
///先睹为快
///
///MorphTargets允许物体发生变形。如果该物体的geometry有 $n$ 个顶点，那么MorphTargets允许你再指定 $n$ 个， $2n$ 个， $3n$ 个甚至更多个顶点
///（比如，$ p\cdot n$ 个），同时mesh对象提供一个数组morphTargetInfluences（公式中$ f_{j} $表示morphTargetInfluences[j]），具有 $p$ 个元素，
///每个元素取值在0-1之间。渲染这个物体的时候，某个顶点 $V_{i}$ 的位置其实变了，成了:
///
///$$V_{i}=V_{i}+\sum_{j=0}^{p}f_{j}\cdot (V_{j,i}-V_{i})$$
///
///举个简单的例子，一个立方体有8个顶点， MorphTargets又指定了8个顶点，立方体的一个顶点为（1,1,1），而在 MorphTargets中与之对应的顶点为（2,2,2），
///那么当 morphTargetInfluences[0]为0.5的时候，实际渲染的时候该顶点的位置就成了（1.5,1.5,1.5）。这样做的好处是显而易见的，你可以通过简单地调整
/// morphTargetInfluences数组来使物体形变，只要之前你设置好了。
///
///向物体加入morphTargets的方法很简单：
///
///var geometry = new THREE.CubeGeometry(100,100,100);
///   var material = new THREE.MeshLambertMaterial({color:0xffffff, morphTargets:true});
///
///    var vertices = [];
///    for(var i=0; i<geometry.vertices.length; i++)
///    {
///       var f = 2;
///        vertices.push(geometry.vertices[i].clone());
///        vertices[i].x *= f;
///        vertices[i].y *= f;
///        vertices[i].z *= f;
///    }
///    geometry.morphTargets.push({name:'target0', vertices:vertices});
/// 在其他什么地方（比如animate()或render()方法中）改变morphTargetInfluences，实在方便
///
///var s = 0;
///function render()
///{
///    s += 0.03;
///    mesh.morphTargetInfluences[0] = Math.abs(Math.sin(s));
///    ...
///}
///最关键的问题是，我相信，这个功能是通过着色器来完成的。我阅读过一些简单的着色器，因此我发现在着色器中完成这件事实在太合适了。
///如果某个geometry有几千甚至上万个顶点，使用JavaScript逐个计算变形后顶点的位置会造成很大压力，而显卡大规模并行计算的能力很适合处理这个任务
///（毕竟每个顶点是独立地）。
 */

	this.updateMorphTargets();	//更新目标变形，不影响geometry对象。

};
/*************************************************
****下面是Mesh对象的方法属性定义,继承自Object3D
**************************************************/
THREE.Mesh.prototype = Object.create( THREE.Object3D.prototype );

/*
///updateMorphTargets方法将geometry对象的morphTargets属性复制到this.morphTargetInfluences属性，不影响geometry对象本身。
*/
///<summary>updateMorphTargets</summary>
///<returns type="Mesh">返回新的Mesh对象</returns>
THREE.Mesh.prototype.updateMorphTargets = function () {

	if ( this.geometry.morphTargets !== undefined && this.geometry.morphTargets.length > 0 ) {	//判断geometry对象是否有目标变形数组。

		this.morphTargetBase = - 1;		//给Mesh对象设置morphTargetBase属性，并初始化为-1.
		this.morphTargetForcedOrder = [];	//给Mesh对象设置morphTargetForcedOrder属性数组，初始化[].
		this.morphTargetInfluences = [];	//给Mesh对象设置morphTargetInfluences属性数组，初始化为[].	
		this.morphTargetDictionary = {};	//给Mesh对象设置morphTargetDictionary属性，初始化为}{}.

		for ( var m = 0, ml = this.geometry.morphTargets.length; m < ml; m ++ ) {	//遍历geometry对象

			this.morphTargetInfluences.push( 0 );		
			this.morphTargetDictionary[ this.geometry.morphTargets[ m ].name ] = m;		//将geometry.morphTargets属性数组中的值，一一赋值给morphTargetDictionary[]属性数组。

		}

	}

};
/*
///getMorphTargetIndexByName方法通过参数name获得存储在morphTargetDictionary[]属性数组中的变形目标索引或者说是。
*/
///<summary>getMorphTargetIndexByName</summary>
///<param name ="name" type="String">MorphTarget存储的名字</param>
///<returns type="Mesh">返回参数name所对应的顶点</returns>
THREE.Mesh.prototype.getMorphTargetIndexByName = function ( name ) {

	if ( this.morphTargetDictionary[ name ] !== undefined ) {	//如果morphTargetDictionary[name]属性对象存在

		return this.morphTargetDictionary[ name ];	//返回该对象。

	}

	console.log( 'THREE.Mesh.getMorphTargetIndexByName: morph target ' + name + ' does not exist. Returning 0.' );	//提示用户，该对象不存在。返回值是0.

	return 0;

};

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
THREE.Mesh.prototype.raycast = ( function () {

	var inverseMatrix = new THREE.Matrix4();	//声明一个4x4矩阵，用来放置逆矩阵
	var ray = new THREE.Ray();			//声明全局射线对象
	var sphere = new THREE.Sphere();		//声明全局球体对象

	var vA = new THREE.Vector3();			//声明3维向量，vA
	var vB = new THREE.Vector3();			//声明3维向量，vB
	var vC = new THREE.Vector3();			//声明3维向量，vC

	return function ( raycaster, intersects ) {	

		var geometry = this.geometry;

		// Checking boundingSphere distance to ray
		// 检查geometry对象的球体边界到射线的距离。

		if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

		sphere.copy( geometry.boundingSphere );
		sphere.applyMatrix4( this.matrixWorld );

		if ( raycaster.ray.isIntersectionSphere( sphere ) === false ) {	//调用光线跟踪的isIntersectionSphere方法，判断geometry对象的球体边界是否与射线相交。

			return;		//如果不相交，返回。

		}

		// Check boundingBox before continuing
		//检查geometry对象的立方体边界到射线距离

		inverseMatrix.getInverse( this.matrixWorld );
		ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );

		if ( geometry.boundingBox !== null ) {

			if ( ray.isIntersectionBox( geometry.boundingBox ) === false )  {	//调用光线跟踪的isIntersectionBox方法，判断geometry对象的立方体边界是否与射线相交。

				return;

			}

		}
		//如果geometry对象是BufferGeometry对象
		if ( geometry instanceof THREE.BufferGeometry ) {

			var material = this.material;

			if ( material === undefined ) return;	//如果没有材质,返回

			var attributes = geometry.attributes;

			var a, b, c;
			var precision = raycaster.precision;	//精度因子

			if ( attributes.index !== undefined ) {		//如果bufferGeometry对象的attributes.index属性不为undefined

				var indices = attributes.index.array;
				var positions = attributes.position.array;
				var offsets = geometry.offsets;

				if ( offsets.length === 0 ) {

					offsets = [ { start: 0, count: indices.length, index: 0 } ];

				}

				for ( var oi = 0, ol = offsets.length; oi < ol; ++oi ) {	//根据定义bufferGeomentry存放的格式,遍历attributes属性.找到顶点数据存储区域

					var start = offsets[ oi ].start;
					var count = offsets[ oi ].count;
					var index = offsets[ oi ].index;

					for ( var i = start, il = start + count; i < il; i += 3 ) {	//根据定义bufferGeomentry存放的格式,遍历attributes属性.找到顶点数据

						a = index + indices[ i ];
						b = index + indices[ i + 1 ];
						c = index + indices[ i + 2 ];

						vA.set(
							positions[ a * 3 ],
							positions[ a * 3 + 1 ],
							positions[ a * 3 + 2 ]
						);
						vB.set(
							positions[ b * 3 ],
							positions[ b * 3 + 1 ],
							positions[ b * 3 + 2 ]
						);
						vC.set(
							positions[ c * 3 ],
							positions[ c * 3 + 1 ],
							positions[ c * 3 + 2 ]
						);


						if ( material.side === THREE.BackSide ) {	//如果材质的side属性为BackSide

							var intersectionPoint = ray.intersectTriangle( vC, vB, vA, true );	//调用intersectTriangle方法判断是否与参数VC,VB,VA组成的Triangle三角形对象相交,如果相交返回交点.如果不想交返回null,这里最后一个参数true,表示判断背面

						} else {

							var intersectionPoint = ray.intersectTriangle( vA, vB, vC, material.side !== THREE.DoubleSide );		//调用intersectTriangle方法判断是否与参数VA,VB,VC组成的Triangle三角形对象相交,如果相交返回交点.如果不想交返回null,这里最后一个参数,表示判断正面

						}

						if ( intersectionPoint === null ) continue;		//如果没有交点,跳出循环

						intersectionPoint.applyMatrix4( this.matrixWorld );		//将非null的交点应用世界坐标变换

						var distance = raycaster.ray.origin.distanceTo( intersectionPoint );	//计算射线原点到交点的距离

						if ( distance < precision || distance < raycaster.near || distance > raycaster.far ) continue;	//如果距离小于精度因子,或小于射线的近端,或大于射线的远端,跳出循环

						intersects.push( {		//将相交的对象,顶点索引,距离,交点保存到intersects属性数组中

							distance: distance,		//距离
							point: intersectionPoint,	//交点
							indices: [ a, b, c ],	//顶点在attribute属性中的索引
							face: null,				//面
							faceIndex: null,		//面所在属性数组中的索引
							object: this 			//对象

						} );

					}

				}

			} else {		//如果bufferGeometry对象的attributes.index属性为undefined

				var positions = attributes.position.array;

				for ( var i = 0, j = 0, il = positions.length; i < il; i += 3, j += 9 ) {	//找到所有的顶点位置属性

					a = i;
					b = i + 1;
					c = i + 2;

					vA.set(
						positions[ j ],
						positions[ j + 1 ],
						positions[ j + 2 ]
					);
					vB.set(
						positions[ j + 3 ],
						positions[ j + 4 ],
						positions[ j + 5 ]
					);
					vC.set(
						positions[ j + 6 ],
						positions[ j + 7 ],
						positions[ j + 8 ]
					);


					if ( material.side === THREE.BackSide ) {	//如果材质的side属性为BackSide

						var intersectionPoint = ray.intersectTriangle( vC, vB, vA, true );	//调用intersectTriangle方法判断是否与参数VC,VB,VA组成的Triangle三角形对象相交,如果相交返回交点.如果不想交返回null,这里最后一个参数true,表示判断背面

					} else {

						var intersectionPoint = ray.intersectTriangle( vA, vB, vC, material.side !== THREE.DoubleSide );		//调用intersectTriangle方法判断是否与参数VA,VB,VC组成的Triangle三角形对象相交,如果相交返回交点.如果不想交返回null,这里最后一个参数,表示判断正面

					}

					if ( intersectionPoint === null ) continue;		//如果没有交点,跳出循环

					intersectionPoint.applyMatrix4( this.matrixWorld );	//将非null的交点应用世界坐标变换

					var distance = raycaster.ray.origin.distanceTo( intersectionPoint );	//计算射线原点到交点的距离

					if ( distance < precision || distance < raycaster.near || distance > raycaster.far ) continue;	//如果距离小于精度因子,或小于射线的近端,或大于射线的远端,跳出循环

					intersects.push( {	//将相交的对象,顶点索引,距离,交点保存到intersects属性数组中

						distance: distance,	//距离
						point: intersectionPoint,	//交点
						indices: [ a, b, c ],	//顶点在attribute属性中的索引
						face: null,			//面
						faceIndex: null,		//面所在属性数组中的索引
						object: this 			//对象

					} );

				}

			}

		} else if ( geometry instanceof THREE.Geometry ) {	//如果geometry对象是THREE.Geometry类型

			var isFaceMaterial = this.material instanceof THREE.MeshFaceMaterial;
			var objectMaterials = isFaceMaterial === true ? this.material.materials : null;

			var a, b, c, d;
			var precision = raycaster.precision;	//精度因子

			var vertices = geometry.vertices;		

			for ( var f = 0, fl = geometry.faces.length; f < fl; f ++ ) {	//遍历geometry对象的所有面

				var face = geometry.faces[ f ];

				var material = isFaceMaterial === true ? objectMaterials[ face.materialIndex ] : this.material;

				if ( material === undefined ) continue;	//如果没有材质,跳出循环

				a = vertices[ face.a ];
				b = vertices[ face.b ];
				c = vertices[ face.c ];

				if ( material.morphTargets === true ) {		//如果有变性目标属性

					var morphTargets = geometry.morphTargets;
					var morphInfluences = this.morphTargetInfluences;

					vA.set( 0, 0, 0 );
					vB.set( 0, 0, 0 );
					vC.set( 0, 0, 0 );

					for ( var t = 0, tl = morphTargets.length; t < tl; t ++ ) {		//将所有的顶点按照变形数据做变换

						var influence = morphInfluences[ t ];

						if ( influence === 0 ) continue;

						var targets = morphTargets[ t ].vertices;

						vA.x += ( targets[ face.a ].x - a.x ) * influence;
						vA.y += ( targets[ face.a ].y - a.y ) * influence;
						vA.z += ( targets[ face.a ].z - a.z ) * influence;

						vB.x += ( targets[ face.b ].x - b.x ) * influence;
						vB.y += ( targets[ face.b ].y - b.y ) * influence;
						vB.z += ( targets[ face.b ].z - b.z ) * influence;

						vC.x += ( targets[ face.c ].x - c.x ) * influence;
						vC.y += ( targets[ face.c ].y - c.y ) * influence;
						vC.z += ( targets[ face.c ].z - c.z ) * influence;

					}

					vA.add( a );
					vB.add( b );
					vC.add( c );

					a = vA;
					b = vB;
					c = vC;

				}

				if ( material.side === THREE.BackSide ) {	//如果材质的side属性为BackSide

					var intersectionPoint = ray.intersectTriangle( c, b, a, true );	//调用intersectTriangle方法判断是否与参数VC,VB,VA组成的Triangle三角形对象相交,如果相交返回交点.如果不想交返回null,这里最后一个参数true,表示判断背面

				} else {

					var intersectionPoint = ray.intersectTriangle( a, b, c, material.side !== THREE.DoubleSide );		//调用intersectTriangle方法判断是否与参数VA,VB,VC组成的Triangle三角形对象相交,如果相交返回交点.如果不想交返回null,这里最后一个参数,表示判断正面

				}

				if ( intersectionPoint === null ) continue;		//如果没有交点,跳出循环

				intersectionPoint.applyMatrix4( this.matrixWorld );	//将非null的交点应用世界坐标变换

				var distance = raycaster.ray.origin.distanceTo( intersectionPoint );	//计算射线原点到交点的距离

				if ( distance < precision || distance < raycaster.near || distance > raycaster.far ) continue;	//如果距离小于精度因子,或小于射线的近端,或大于射线的远端,跳出循环

				intersects.push( {

					distance: distance,	//距离
					point: intersectionPoint,	//交点
					face: face,	//面
					faceIndex: f,	//面索引
					object: this 	//对象

				} );

			}

		}

	};

}() );

/*clone方法
///clone方法克隆一个Mesh网格对象.
*/
///<summary>clone</summary>
///<param name ="object" type="Object3D">接收克隆的Object3D对象</param>
///<param name ="recursive" type="boolean">是否对子对象一一进行克隆</param>
///<returns type="Ray">返回Mesh网格对象.</returns>	
THREE.Mesh.prototype.clone = function ( object, recursive ) {

	if ( object === undefined ) object = new THREE.Mesh( this.geometry, this.material );

	THREE.Object3D.prototype.clone.call( this, object, recursive );	//继承Object3D的clone方法

	return object;		//返回Mesh网格对象.

};
