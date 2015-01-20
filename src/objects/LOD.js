/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */
 /*
///LOD对象,LOD技术即Levels of Detail的简称，意为多细节层次。LOD技术指根据物体模型的节点在显示环境中所处的位置和重要度，决定物体渲染的资源分配，降低非重要物体的面数和细节度，从而获得高效率的渲染运算。
///	注释摘抄自http://blog.csdn.net/u011209953/article/details/37863701
///用法:	var geometry = [
///
///				[ new THREE.IcosahedronGeometry( 100, 4 ), 50 ],
///				[ new THREE.IcosahedronGeometry( 100, 3 ), 300 ],
///				[ new THREE.IcosahedronGeometry( 100, 2 ), 1000 ],
///				[ new THREE.IcosahedronGeometry( 100, 1 ), 2000 ],
///				[ new THREE.IcosahedronGeometry( 100, 0 ), 8000 ]
///
///			];		//创建几何体对象.
///
///			var material = new THREE.MeshLambertMaterial( { color: 0xffffff, wireframe: true } );	//创建材质
///
///			var i, j, mesh, lod;	
///
///			for ( j = 0; j < 1000; j ++ ) {
///
///				lod = new THREE.LOD();	//创建lod对象
///
///				for ( i = 0; i < geometry.length; i ++ ) {
///
///					mesh = new THREE.Mesh( geometry[ i ][ 0 ], material );
///					mesh.scale.set( 1.5, 1.5, 1.5 );
///					mesh.updateMatrix();
///					mesh.matrixAutoUpdate = false;
///					lod.addLevel( mesh, geometry[ i ][ 1 ] );	//为几何体添加层次细节,这里根据距离来表现几何体的细节层次,可以看到公分5个层次.
///
///				}
///
///				lod.position.x = 10000 * ( 0.5 - Math.random() );	
///				lod.position.y =  7500 * ( 0.5 - Math.random() );
///				lod.position.z = 10000 * ( 0.5 - Math.random() );
///				lod.updateMatrix();
///				lod.matrixAutoUpdate = false;
///				scene.add( lod );	//将lod添加到场景中.
///
///			}
/// 以下是对LOD技术的详解:
/// 一、LOD简介
/// 1976年，Clark[1]提出了细节层次（Levels of Detail，简称LOD）模型的概念，认为当物体覆盖屏幕较小区域时，可以使用该物体描述较粗的模型，并给出了一个用于可见面判定算法的几何层次模型，
/// 以便对复杂场景进行快速绘制。1982年，Rubin[2]结合光线跟踪算法，提出了复杂场景的层次表示算法及相关的绘制算法，从而使计算机能以较少的时间绘制复杂场景。
/// 90年代初，图形学方向上派生出虚拟现实和科学计算可视化等新研究领域。虚拟现实和交互式可视化等交互式图形应用系统要求图形生成速度达到实时，而计算机所提供的计算能力往往不能满足复杂
/// 三维场景的实时绘制要求，因而研究人员提出多种图形生成加速方法，LOD模型则是其中一种主要方法。这几年在全世界范围内形成了对LOD技术的研究热潮，并且取得了很多有意义的研究结果。
/// 二、LOD技术
/// 1. LOD技术的概念和应用领域
/// LOD技术在不影响画面视觉效果的条件下，通过逐次简化景物的表面细节来减少场景的几何复杂性，从而提高绘制算法的效率。该技术通常对每一原始多面体模型建立几个不同逼近精度的几何模型。
/// 与原模型相比，每个模型均保留了一定层次的细节。在绘制时，根据不同的表准选择适当的层次模型来表示物体。LOD技术具有广泛的应用领域。目前在实时图像通信、交互式可视化、虚拟现实、地形表示、
/// 飞行模拟、碰撞检测、限时图形绘制等领域都得到了应用，已经成为一项要害技术。很多造型软件和VR开发系统都开始支持LOD模型表示。
/// 2.虚拟场景生成中LOD模型的选择
/// 恰当地选择细节层次模型能在不损失图形细节的条件下加速场景显示，提高系统的响应能力。选择的方法可以分为如下几类：一类是侧重于去掉那些不需要用图形显示硬件绘制的细节。一类是去掉那些无法
/// 用图形硬件绘制的细节，如基于距离和物体尺寸标准的方法。另一类是去掉那些人类视觉觉察不到的细节，如基于偏心率，视野深度，运动速度等标准的方法。此外还有一种方法考虑的是保持恒定帧率。
/// （1）剔除法
/// 在一些特定的情况下，场景中的一部分几何形体是什么时候都无法被观察者看到的。在此情况下，图形系统不再绘制这部分物体。
/// （2）距离标准
/// 这种方法考虑的是物体到观察者的距离。这个距离是从视点到物体内指定点的欧氏距离。这种方法的理论依据是当一个物体距离视点越远，此物体能够被观察到的精细的细节部分就越少。这就意味着选择较粗
/// 糙的细节层次来表示物体不会对显示的逼真度有很大影响。
/// （3）尺寸标准
/// 这种方法利用了人眼辨识物体的能力随着物体尺寸的减小而减弱的特性。它考虑到待表示物体的尺寸，较小的物体用较粗糙的细节层次，较大的用较精细的细节层次。
/// （4）偏心率
/// 此方法利用了人眼辨识物体的能力随着物体逐渐远离视域中心而减弱的特性。视网膜的中心对物体细节的分辨能力较强，视网膜边缘的分辨能力较弱。根据这个原理，将显示的场景分为具有较精细细节层次的中心部分
/// （对应于眼睛视域的中心）和外围部分（对应于视域的外围部分）。
/// （5）视野深度
/// 这种方法根据观察者眼睛的焦距来为物体选择合适的细节层次。在聚焦区域的前面或者后面的物体不被聚焦。
/// （6）运动速度
/// 该方法是根据物体相对于观察者视线的角速度选择合适的细节层次。在屏幕上快速运动的物体看起来是模糊的，这些物体只在很短的时间内被看到，因而观察者可能看不清它们。这样就可以用较粗糙的细节层次来表示它们。
/// （7）固定帧率
/// 保持一个较高并且稳定的帧率对于良好的交互性能是非常重要的。这就意味着一旦选定一个帧率，就要保持恒定，不能随场景复杂度的改变而变化。
/// 3.LOD模型的生成
/// （1）光照模型
/// 这种方法利用光照技术得到物体的不同细节层次。例如，我们可以用较少的多边形和改进的光照算法得到同包含较多的多边形的表示相似的效果。
/// （2）纹理映射
/// 该方法是适用一些纹理来表示不同的细节层次。具有精细细节层次的区域可以用一个带有纹理的多边形来代替。这个多边形的纹理是从某个特定的视点和距离得到的这个区域的一幅图像。
/// （3）多边形简化
/// 多边形简化算法的目的是输入一个由很多多边形构成的精细模型，得到一个跟原模型相当相似的但包含较少数目的多边形的简化模型，并保持原模型重要的视觉特征。大多数的细节层次简化算法都属于此类。
/// 4.LOD细模型的实现方式
/// （1）静态Lod
/// 在预处理过程中产生一个物体的几个离散的不同细节层次模型。实时绘制时根据特定的标准选择合适的细节层次模型来表示物体。
/// （2）动态Lod
/// 在动态Lod算法中生成一个数据结构，在实时绘制时可以从这个数据结构中抽取出所需的细节层次模型。从这个数据结构中可以得到大量不同分辨率的细节层次模型，分辨率甚至可以是连续变化的。
/// 三、LOD模型生成算法的分类
/// 由于人们通常用多边形网格（特例为三角形网格）来描述场景中的图形物体，因而LOD模型的生成就转化为三维多边形网格简化问题。网格简化的目的是把一个用多边形网格表示的模型用一个近似的模型表示，近似模型基本保持了原模
/// 型的可视特征，但顶点数目少于原始网格的顶点数目。多边形网格简化算法进行分类的方法有多种：
/// 1.按是否保持拓扑结构分类
/// 拓扑结构保持算法：较好的视觉逼真度，但是限制了简化的程度，并且要求初始模型是流形。拓扑结构非保持算法：可实现大幅度地简化，逼真度较差
/// 2.按简化机制不同分类
/// 自适应细分型：首先建立原始模型的最简化形式，然后根据一定的规则通过细分把细节信息增加到简化模型中。不常用，因为构造最初网格的最简模型相当困难，主要适用与均匀网格。
/// 采样型：类似于图像处理的滤波方式，把几何包围盒中的一组顶点用一个代表顶点代替。适用于具有光滑表面的模型。
/// 几何元素删除型：通过重复地把几何元素从三角形中“移去”来得到简化模型。这里地移去包括：直接删除、合并、折叠。这类算法实现简单，速度快。大多数的简化算法都属于这一类。
/// 3.局部算法/全局算法
/// 全局算法是指对整个物体模型或场景模型的简化过程进行优化，而不仅仅根据局部的特征来确定删除不重要的元素。局部算法是指应用一组局部规则，仅考虑物体的某个局部区域的特征对物体进行简化。
/// 四、典型的LOD模型生成算法概述
/// 1．近平面合并法
/// Hinkler等的几何优化方法[3]检测出共面或近似共面的三角面片，将这些三角面片合并为大的多边形，然后用较少数目的三角形将这个多边形重新三角化。这个方法的步骤是
///		（1）迅速地将面片分类为近似共面的集合
///		（2）快速合并这些集合中的面片
///		（3）简单而且鲁棒的三角化。
///	面片分类依据的是他们的各自的法线之间的夹角。该算法的误差衡量标准可以归为全局误差，但是由于它仅仅依据法线之间的夹角，它的误差评估准确性较差。它不能保证一定误差限制。
/// 2．几何元素（顶点/边/面）删除法
/// 几何元素删除法由局部几何优化机制驱动，要计算每次删除产生的近似误差。
/// Schroeder的顶点删除算法[4]通过删除满足距离或者角度标准的顶点来减小三角网格的复杂度。删除顶点留下的空洞要重新三角化填补。该算法速度快，但不能保证近似误差。它估算局部误差，未考虑新面片同原始网格的联系和误差积累。
/// Hoppe渐进网格算法[5]包含基于边折叠的网格简化方法、能量函数优化和新的多分辨率表示。算法采用了单步和可逆的边折叠操作，可以将整个简化过程存入一个多分辨率数据结构（称为渐进网格表示（PM））。
///	PM方案由一个简化网格Mk和一系列细化记录（通过与从原始网格M0得到简化网格Mk的简化步骤的相反的步骤得到）, 这些细化记录可以使网格Mk通过逐步求精得到任意精确度的网格Mi。在简化过程中，将每条边按照其折叠的能量代价排序得到一个优先级队列，
///	通过这个队列实现边折叠操作。该算法也是采用全局误差度量。
/// 3．重新划分算法
/// Turk的重新划分算法[6]先将一定数量的点分布到原有网格上 ,然后新点与老顶点生成一个中间网格 ,最后删除中间网格中的老顶点 ,并对产生的多边形区域进行局部三角化 ,形成以新点为顶点的三角形网格 .其中分布新点采用排斥力算法 ,即先随机分布新点 ,
//	然后计算新点之间的排斥力 ,根据排斥力在网格上移动这些新点 ,使它们重新分布 .排斥力的大小与新点之间的距离、新点所在三角形的曲率和面积有关。这种方法对那些较光滑的模型是很有效的 ,但对于那些不光滑的模型 ,效果较差; 由于根据排斥力重新分
///	布新点 ,涉及到平面旋转或投影 ,计算量和误差都较大。
/// 4．聚类算法
/// Rossignac等的顶点聚类算法[7]通过检测并合并相邻顶点的聚类来简化网格。每个聚类被一个代表顶点取代，这个代表顶点可能是顶点聚类的中心或者是聚类中具有最大权值的顶点（定义顶点的权值是为了强调相对的视觉总要性）。然后，去处那些由于聚类操作
///	引起的重叠或者退化的边或者三角形。算法简化引入的误差由用户定义的准确度控制，这个标准用来驱动聚类尺寸的选择。该算法实现简单、速度快，但是没有考虑到保持原始网格的拓扑和几何结构，有可能生成非常粗糙的近似网格。
/// 5．小波分解算法
/// Eck等的基于小波变换的多分辨率模型[8]使用了带有修正项的基本网格，修正项称为小波系数，用来表示模型在不同分辨率情况下的细节特征。算法的三个主要步骤：分割：输入网格M被分成一些（数目较少）三角形的区域T1,......,Tn, 由此构成的低分辨率
///	三角网格称为基本网格K0。参数化：对于每个三角区域Ti，根据它在基本网格K0上相应的表面进行局部参数化。重新采样：对基本网格进行j次递归细分就得到网格Kj，并且通过使用参数化过程中建立的参数将Kj的顶点映射到3维空间中得到网格Kj的坐标。
///	此算法可以处理任意拓扑结构的网格，而且可以提供：有界误差、紧凑的多分辨率表示和多分辨率尺度下的网格编辑。
/// 五、结束语
/// LOD技术在虚拟场景生成中具有非常要害的作用，本文讨论了LOD技术的研究内容、LOD模型的生成算法和其在虚拟场景生成中的应用方式。LOD技术今后需要进一步研究的内容包括：简化过程中模型表面属性的处理以及特征保持问题；建立统一的误差评价测度；
/// 不同细节层次之间的平滑过渡；视点相关的LOD生成算法研究等。
*/
///<summary>LOD</summary>
///<returns type="Mesh">返回LOD对象</returns>
THREE.LOD = function () {

	THREE.Object3D.call( this );	//调用Object3D对象的call方法,将原本属于Object3D的方法交给当前对象LOD来使用.

	this.objects = [];		//存放层次细节展示的对象集合

};

/*************************************************
****下面是LOD对象的方法属性定义,继承自Object3D
**************************************************/
THREE.LOD.prototype = Object.create( THREE.Object3D.prototype );

/*
///addLevel方法将对象(参数object)根据参数distance插入到存放层次细节展示的对象集合中(LOD.Objects).
*/
///<summary>addLevel</summary>
///<param name ="object" type="Mesh">网格对象</param>
///<param name ="distance" type="float">层次距离</param>
///<returns type="Mesh">返回LOd对象</returns>
THREE.LOD.prototype.addLevel = function ( object, distance ) {

	if ( distance === undefined ) distance = 0; //未定义距离时为0  

	distance = Math.abs( distance );  //取距离的绝对值 

	for ( var l = 0; l < this.objects.length; l ++ ) {	//将各个细节的距离进行从小到大的排序  

		if ( distance < this.objects[ l ].distance ) {

			break;

		}

	}

	this.objects.splice( l, 0, { distance: distance, object: object } );
	this.add( object );

};

/*
///getObjectForDistance方法根据距离返回对应层次的对象.
*/
///<summary>getObjectForDistance</summary>
///<param name ="distance" type="float">距离</param>
///<returns type="Mesh">返回参数name所对应的顶点</returns>
THREE.LOD.prototype.getObjectForDistance = function ( distance ) {
    //排序由小到大遍历  
	for ( var i = 1, l = this.objects.length; i < l; i ++ ) {

		if ( distance < this.objects[ i ].distance ) {

			break;

		}

	}

	return this.objects[ i - 1 ].object;

};
/*
///raycast方法用来获得当前层次的对象与射线（参数raycaster）的交点.raycaster.intersectObject会调用这个方法。主要是用来进行碰撞检测,
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
THREE.LOD.prototype.raycast = ( function () {

	var matrixPosition = new THREE.Vector3();

	return function ( raycaster, intersects ) {

		matrixPosition.setFromMatrixPosition( this.matrixWorld );

		var distance = raycaster.ray.origin.distanceTo( matrixPosition );

		this.getObjectForDistance( distance ).raycast( raycaster, intersects );	//将当前层次的对象,进行光线跟踪计算.

	};

}() );

/*
///update方法根据相机的位置更新显示的层次.
*/
///<summary>update</summary>
///<param name ="camera" type="Camara">相机</param>
///<returns type="Lod">返回新的LOD对象.</returns>
THREE.LOD.prototype.update = function () {

	var v1 = new THREE.Vector3();
	var v2 = new THREE.Vector3();

	return function ( camera ) {

		if ( this.objects.length > 1 ) {

			v1.setFromMatrixPosition( camera.matrixWorld );
			v2.setFromMatrixPosition( this.matrixWorld );

			var distance = v1.distanceTo( v2 );	//重新计算相机的位置到当前层次的距离

			this.objects[ 0 ].object.visible = true;

			for ( var i = 1, l = this.objects.length; i < l; i ++ ) {	

				if ( distance >= this.objects[ i ].distance ) {	//如果计算相机的位置到当前层次的距离大于当前对象的距离

					this.objects[ i - 1 ].object.visible = false;	//计算相机的位置到当前层次的距离之前的对象不显示
					this.objects[ i     ].object.visible = true;	//计算相机的位置到当前层次的距离之后的对象显示.

				} else {

					break;

				}

			}

			for ( ; i < l; i ++ ) {

				this.objects[ i ].object.visible = false;

			}

		}

	};

}();

/*clone方法
///clone方法克隆一个LOD对象.
*/
///<summary>LOD</summary>
///<param name ="object" type="Object3D">接收克隆的LOD对象</param>
///<returns type="LOD">返回LOD网格对象.</returns>	
THREE.LOD.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.LOD();

	THREE.Object3D.prototype.clone.call( this, object );

	for ( var i = 0, l = this.objects.length; i < l; i ++ ) {	//对按照距离分层的对象一一进行复制.
		var x = this.objects[ i ].object.clone();
		x.visible = i === 0;
		object.addLevel( x, this.objects[ i ].distance );
	}

	return object;		//返回LOD网格对象.

};
