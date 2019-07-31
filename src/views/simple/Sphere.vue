<template>
  <div ref="container"></div>
</template>

<script>
// import { State } from 'vuex-class'
import { Vue, Component } from 'vue-property-decorator'
// import Icosahedron from './Icosahedron.js'
// import Stats from 'three/examples/js/libs/stats.min.js'

@Component
export default class Index extends Vue {
  _initView() {
    // Extra geometry
    // THREE.IcosahedronGeometry = Icosahedron

    // Scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    const renderer = new THREE.WebGLRenderer({
      antialias: 1
    })

    renderer.setClearColor(0xf7f7f7)
    renderer.setSize(window.innerWidth, window.innerHeight)
    this.$refs.container.appendChild(renderer.domElement)

    scene.fog = new THREE.Fog(0xd4d4d4, 8, 20)

    // Create vertex points
    const mesh = new THREE.IcosahedronGeometry(12, 2) // radius, detail
    const vertices = mesh.vertices
    const positions = new Float32Array(vertices.length * 3)
    for (let i = 0, l = vertices.length; i < l; i++) {
      vertices[i].toArray(positions, i * 3)
    }

    const geometry = new THREE.BufferGeometry()
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))

    const sprite = new THREE.TextureLoader().load(require('@/assets/images/disc.png'))
    const material = new THREE.PointsMaterial({
      size: 20,
      sizeAttenuation: false,
      map: sprite,
      alphaTest: 0.1,
      color: 0x2b3044,
      transparent: true
    })
    // material.color.setHSL(1.0, 0.3, 0.7)

    // const material = new THREE.PointsMaterial({
    //   size: 0.4,
    //   vertexColors: THREE.VertexColors,
    //   color: 0x2b3044
    // })
    const points = new THREE.Points(geometry, material)

    const object = new THREE.Object3D()

    object.add(points)
    object.add(
      new THREE.Mesh(
        mesh,
        new THREE.MeshPhongMaterial({
          color: 0x2b3044,
          emissive: 0x2b3044,
          wireframe: true,
          fog: 1
        })
      )
    )

    scene.add(object)

    camera.position.z = 20

    function initLight() {
      const directionalLight = new THREE.DirectionalLight('#ffffff')
      directionalLight.position.set(-140, 90, 90)
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

    const render = function() {
      requestAnimationFrame(render)

      object.rotation.x += 0.001
      object.rotation.y += 0.001

      renderer.render(scene, camera)
    }

    initLight()
    render()
  }

  mounted() {
    this._initView()
  }
}
</script>
