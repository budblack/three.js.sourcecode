three.js 源码注释
=========

#### 为什么要做源码注释 ####

首先,自己对计算机图形学,webgl非常感兴趣,希望有时间可以学学.通过注释Three.js源码确实对学习计算机图形学,有非常大的帮助.

### 注释说明 ###
一开始打算直接在three.js文件中注释,但是由于github对超过1mb的文件无法直接在浏览器中查看的限制,而且为了方便以后的维护和管理,定改变注释的方式.以后将按照官方的目录结构,按单个文件方式进行注释.之前注释的代码在three.js文件中.

### 进度说明 ###

```

src
¦
¦  Three.js- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 100%
¦  
--cameras
¦      Camera.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - --100%
¦      CubeCamera.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - --100%
¦      OrthographicCamera.js - - - - - - - - - - - - - - - - - - - - - - - - - --100%
¦      PerspectiveCamera.js - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      
--core
¦      BufferAttribute.js - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      BufferGeometry.js - - - - - - - - - - - - - - - - - - - - - - - - - - - --100%
¦      Clock.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      EventDispatcher.js - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      Face3.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      Face4.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      Geometry.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -100%
¦      Object3D.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -100%
¦      Projector.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦      Raycaster.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦      
--extras
¦  ¦  FontUtils.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -100%
¦  ¦  GeometryUtils.js - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -100%
¦  ¦  ImageUtils.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦  ¦  SceneUtils.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦  ¦  
¦  --animation
¦  ¦      Animation.js - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦      AnimationHandler.js - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      KeyFrameAnimation.js - - - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦      MorphAnimation.js - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      
¦  --core
¦  ¦      Curve.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -100%
¦  ¦      CurvePath.js - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -100%
¦  ¦      Gyroscope.js - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -100%
¦  ¦      Path.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦  ¦      Shape.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -100%
¦  ¦      
¦  --curves
¦  ¦      ArcCurve.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      ClosedSplineCurve3.js - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      CubicBezierCurve.js - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      CubicBezierCurve3.js - - - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦      EllipseCurve.js - - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      LineCurve.js - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦      LineCurve3.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      QuadraticBezierCurve.js - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      QuadraticBezierCurve3.js - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦      SplineCurve.js - - - - - - - - - - - - - - - - - - - - - - - - - - - --  0%
¦  ¦      SplineCurve3.js - - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      
¦  --geometries
¦  ¦      BoxGeometry.js - - - - - - - - - - - - - - - - - - - - - - - - - - - --100%
¦  ¦      CircleGeometry.js - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦  ¦      CubeGeometry.js - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦  ¦      CylinderGeometry.js - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦  ¦      ExtrudeGeometry.js - - - - - - - - - - - - - - - - - - - - - - - - - --100%
¦  ¦      IcosahedronGeometry.js - - - - - - - - - - - - - - - - - - - - - - - --  0%
¦  ¦      LatheGeometry.js - - - - - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦      OctahedronGeometry.js - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      ParametricGeometry.js - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      PlaneGeometry.js - - - - - - - - - - - - - - - - - - - - - - - - -  - -100%
¦  ¦      PolyhedronGeometry.js - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      RingGeometry.js - - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      ShapeGeometry.js - - - - - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦      SphereGeometry.js - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      TetrahedronGeometry.js - - - - - - - - - - - - - - - - - - - - - - - --  0%
¦  ¦      TextGeometry.js - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦  ¦      TorusGeometry.js - - - - - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦      TorusKnotGeometry.js - - - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦      TubeGeometry.js - - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      
¦  --helpers
¦  ¦      ArrowHelper.js - - - - - - - - - - - - - - - - - - - - - - - - - - - --  0%
¦  ¦      AxisHelper.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      BoundingBoxHelper.js - - - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦      BoxHelper.js - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦      CameraHelper.js - - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      DirectionalLightHelper.js - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      EdgesHelper.js - - - - - - - - - - - - - - - - - - - - - - - - - - - --  0%
¦  ¦      FaceNormalsHelper.js - - - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦      GridHelper.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      HemisphereLightHelper.js - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦      PointLightHelper.js - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      SkeletonHelper.js - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      SpotLightHelper.js - - - - - - - - - - - - - - - - - - - - - - - - - --  0%
¦  ¦      VertexNormalsHelper.js - - - - - - - - - - - - - - - - - - - - - - - --  0%
¦  ¦      VertexTangentsHelper.js - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      WireframeHelper.js - - - - - - - - - - - - - - - - - - - - - - - - - --  0%
¦  ¦      
¦  --objects
¦  ¦      ImmediateRenderObject.js - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦      LensFlare.js - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦      MorphBlendMesh.js - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      
¦  --renderers
¦  ¦  --plugins
¦  ¦          DepthPassPlugin.js - - - - - - - - - - - - - - - - - - - - - - - --  0%
¦  ¦          LensFlarePlugin.js - - - - - - - - - - - - - - - - - - - - - - - --  0%
¦  ¦          ShadowMapPlugin.js - - - - - - - - - - - - - - - - - - - - - - - --  0%
¦  ¦          SpritePlugin.js - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦          
¦  --shaders
¦          ShaderFlares.js - - - - - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦          
--lights
¦      AmbientLight.js - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -100%
¦      AreaLight.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      DirectionalLight.js - - - - - - - - - - - - - - - - - - - - - - - - -  - -100%
¦      HemisphereLight.js - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      Light.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      PointLight.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - --100%
¦      SpotLight.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      
--loaders
¦      BufferGeometryLoader.js - - - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦      Cache.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦      GeometryLoader.js - - - - - - - - - - - - - - - - - - - - - - - - - - - --  0%
¦      ImageLoader.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦      JSONLoader.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - --  0%
¦      Loader.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - --  0%
¦      LoadingManager.js - - - - - - - - - - - - - - - - - - - - - - - - - - - --  0%
¦      MaterialLoader.js - - - - - - - - - - - - - - - - - - - - - - - - - - - --  0%
¦      ObjectLoader.js - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦      TextureLoader.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦      XHRLoader.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦      
--materials
¦      LineBasicMaterial.js - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      LineDashedMaterial.js - - - - - - - - - - - - - - - - - - - - - - - - - --100%
¦      Material.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -100%
¦      MeshBasicMaterial.js - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      MeshDepthMaterial.js - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      MeshFaceMaterial.js - - - - - - - - - - - - - - - - - - - - - - - - -  - -100%
¦      MeshLambertMaterial.js - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      MeshNormalMaterial.js - - - - - - - - - - - - - - - - - - - - - - - - - --100%
¦      MeshPhongMaterial.js - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      PointCloudMaterial.js - - - - - - - - - - - - - - - - - - - - - - - - - --100%
¦      RawShaderMaterial.js - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      ShaderMaterial.js - - - - - - - - - - - - - - - - - - - - - - - - - - - --100%
¦      SpriteCanvasMaterial.js - - - - - - - - - - - - - - - - - - - - - - -  - -100%
¦      SpriteMaterial.js - - - - - - - - - - - - - - - - - - - - - - - - - - - --100%
¦      
--math
¦      Box2.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -100%
¦      Box3.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -100%
¦      Color.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      Euler.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      Frustum.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      Line3.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      Math.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -100%
¦      Matrix3.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      Matrix4.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      Plane.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      Quaternion.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - --100%
¦      Ray.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      Sphere.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - --100%
¦      Spline.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - --100%
¦      Triangle.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -100%
¦      Vector2.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      Vector3.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      Vector4.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      
--objects
¦      Bone.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -100%
¦      Line.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -100%
¦      LOD.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      Mesh.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -100%
¦      MorphAnimMesh.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      PointCloud.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - --100%
¦      Skeleton.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -100%
¦      SkinnedMesh.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      Sprite.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - --100%
¦      
--renderers
¦  ¦  CanvasRenderer.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦  WebGLRenderer.js - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦  WebGLRenderTarget.js - - - - - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦  WebGLRenderTargetCube.js - - - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦  
¦  --renderables
¦  ¦      RenderableFace.js - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      RenderableLine.js - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      RenderableObject.js - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      RenderableSprite.js - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      RenderableVertex.js - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦      
¦  --shaders
¦  ¦  ¦  ShaderChunk.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦  ¦  ShaderLib.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦  ¦  UniformsLib.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦  ¦  UniformsUtils.js - - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦  ¦  
¦  ¦  --ShaderChunk
¦  ¦          alphamap_fragment.glsl - - - - - - - - - - - - - - - - - - - - - --  0%
¦  ¦          alphamap_pars_fragment.glsl - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦          alphatest_fragment.glsl - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦          bumpmap_pars_fragment.glsl - - - - - - - - - - - - - - - - - - - --  0%
¦  ¦          color_fragment.glsl - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦          color_pars_fragment.glsl - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦          color_pars_vertex.glsl - - - - - - - - - - - - - - - - - - - - - --  0%
¦  ¦          color_vertex.glsl - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦          defaultnormal_vertex.glsl - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦          default_vertex.glsl - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦          envmap_fragment.glsl - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦          envmap_pars_fragment.glsl - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦          envmap_pars_vertex.glsl - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦          envmap_vertex.glsl - - - - - - - - - - - - - - - - - - - - - - - --  0%
¦  ¦          fog_fragment.glsl - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦          fog_pars_fragment.glsl - - - - - - - - - - - - - - - - - - - - - --  0%
¦  ¦          lightmap_fragment.glsl - - - - - - - - - - - - - - - - - - - - - --  0%
¦  ¦          lightmap_pars_fragment.glsl - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦          lightmap_pars_vertex.glsl - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦          lightmap_vertex.glsl - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦          lights_lambert_pars_vertex.glsl - - - - - - - - - - - - - - - - - -  0%
¦  ¦          lights_lambert_vertex.glsl - - - - - - - - - - - - - - - - - - - --  0%
¦  ¦          lights_phong_fragment.glsl - - - - - - - - - - - - - - - - - - - --  0%
¦  ¦          lights_phong_pars_fragment.glsl - - - - - - - - - - - - - - - - - -  0%
¦  ¦          lights_phong_pars_vertex.glsl - - - - - - - - - - - - - - - - - - -  0%
¦  ¦          lights_phong_vertex.glsl - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦          linear_to_gamma_fragment.glsl - - - - - - - - - - - - - - - - - - -  0%
¦  ¦          logdepthbuf_fragment.glsl - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦          logdepthbuf_pars_fragment.glsl - - - - - - - - - - - - - - - - - --  0%
¦  ¦          logdepthbuf_pars_vertex.glsl - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦          logdepthbuf_vertex.glsl - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦          map_fragment.glsl - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦          map_pars_fragment.glsl - - - - - - - - - - - - - - - - - - - - - --  0%
¦  ¦          map_pars_vertex.glsl - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦          map_particle_fragment.glsl - - - - - - - - - - - - - - - - - - - --  0%
¦  ¦          map_particle_pars_fragment.glsl - - - - - - - - - - - - - - - - - -  0%
¦  ¦          map_vertex.glsl - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦          morphnormal_vertex.glsl - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦          morphtarget_pars_vertex.glsl - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦          morphtarget_vertex.glsl - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦          normalmap_pars_fragment.glsl - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦          shadowmap_fragment.glsl - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦          shadowmap_pars_fragment.glsl - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦          shadowmap_pars_vertex.glsl - - - - - - - - - - - - - - - - - - - --  0%
¦  ¦          shadowmap_vertex.glsl - - - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦          skinbase_vertex.glsl - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦          skinning_pars_vertex.glsl - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦          skinning_vertex.glsl - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦          skinnormal_vertex.glsl - - - - - - - - - - - - - - - - - - - - - --  0%
¦  ¦          specularmap_fragment.glsl - - - - - - - - - - - - - - - - - - - - -  0%
¦  ¦          specularmap_pars_fragment.glsl - - - - - - - - - - - - - - - - - --  0%
¦  ¦          worldpos_vertex.glsl - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦  ¦          
¦  --webgl
¦          WebGLProgram.js - - - - - - - - - - - - - - - - - - - - - - - - -  - -  0%
¦          WebGLShader.js - - - - - - - - - - - - - - - - - - - - - - - - - - - -  0%
¦          
--scenes
¦      Fog.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      FogExp2.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      Scene.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -100%
¦      
--textures
        CompressedTexture.js - - - - - - - - - - - - - - - - - - - - - - - - - --100%
        CubeTexture.js - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -100%
        DataTexture.js - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -100%
        Texture.js - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  - -100%
        
```
