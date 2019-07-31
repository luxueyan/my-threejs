<template>
  <div ref="container">
  </div>
</template>

<script>
// import { State } from 'vuex-class'
import { Vue, Component } from 'vue-property-decorator'
import Stats from 'three/examples/js/libs/stats.min.js'

@Component
export default class Index extends Vue {
  _initView() {
    let _this = this
    let renderer, camera, scene, stats, ambientLight, directionalLight, control
    function initRender() {
      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      //告诉渲染器需要阴影效果
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
      _this.$refs.container.appendChild(renderer.domElement)
    }
    function initCamera() {
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.set(0, 100, 200)
      camera.lookAt(new THREE.Vector3(0, 0, 0))
    }
    function initScene() {
      scene = new THREE.Scene()
    }
    function initGui() {
      //声明一个保存需求修改的相关数据的对象
      // gui = {}
      // const datGui = new dat.GUI()
      //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
    }
    function initLight() {
      ambientLight = new THREE.AmbientLight('#fff')
      scene.add(ambientLight)
      directionalLight = new THREE.DirectionalLight('#ffffff')
      directionalLight.position.set(40, 60, 10)
      directionalLight.shadow.camera.near = 1 //产生阴影的最近距离
      directionalLight.shadow.camera.far = 400 //产生阴影的最远距离
      directionalLight.shadow.camera.left = -50 //产生阴影距离位置的最左边位置
      directionalLight.shadow.camera.right = 50 //最右边
      directionalLight.shadow.camera.top = 50 //最上边
      directionalLight.shadow.camera.bottom = -50 //最下面
      //这两个值决定生成阴影密度 默认512
      directionalLight.shadow.mapSize.height = 1024
      directionalLight.shadow.mapSize.width = 1024
      //告诉平行光需要开启阴影投射
      directionalLight.castShadow = true
      scene.add(directionalLight)
    }
    function initModel() {
      //底部平面
      const planeGeometry = new THREE.PlaneGeometry(100, 100)
      const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide })
      const plane = new THREE.Mesh(planeGeometry, planeMaterial)
      plane.rotation.x = -0.5 * Math.PI
      plane.position.y = -0.1
      plane.receiveShadow = true //可以接收阴影
      scene.add(plane)
      //创建gltf加载器
      const loader = new THREE.GLTFLoader()
      loader.load('/models/pony_cartoon/scene.gltf', function(gltf) {
        gltf.scene.scale.set(0.1, 0.1, 0.1)
        scene.add(gltf.scene)
      })
    }
    function initStats() {
      stats = new Stats()
      _this.$refs.container.appendChild(stats.dom)
    }
    function initControl() {
      control = new THREE.OrbitControls(camera, renderer.domElement)
    }
    function render() {
      control.update()
      renderer.render(scene, camera)
    }
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    function animate() {
      //更新控制器
      render()
      //更新性能插件
      stats.update()
      requestAnimationFrame(animate)
    }
    function draw() {
      initGui()
      initRender()
      initScene()
      initCamera()
      initLight()
      initModel()
      initStats()
      initControl()
      animate()
      window.onresize = onWindowResize
    }
    draw()
  }

  mounted() {
    this._initView()
    Logger.info(this.text, '首页成功加载')
  }
}
</script>
