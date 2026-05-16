import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const container = document.getElementById('scene-container')

// Cena
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xfdf6fa)

// Câmera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 1.5, 4)

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.SRGBColorSpace
container.appendChild(renderer.domElement)

// Controles de câmera
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.enableZoom = true
controls.enablePan = true
controls.minDistance = 1.5
controls.maxDistance = 10
controls.target.set(0, 0.8, 0)
controls.update()

// Luz ambiente
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
scene.add(ambientLight)

// Luz principal
const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
directionalLight.position.set(4, 5, 3)
scene.add(directionalLight)

// Luz suave lateral
const fillLight = new THREE.PointLight(0xffc8dd, 1.5, 10)
fillLight.position.set(-3, 2, 3)
scene.add(fillLight)

// Base simples
const floorGeometry = new THREE.CircleGeometry(2.2, 64)
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.8,
  metalness: 0
})
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotation.x = -Math.PI / 2
floor.position.y = -0.02
scene.add(floor)

// Carregamento do modelo GLB/GLTF
const loader = new GLTFLoader()

loader.load(
  './models/cute_cat_with_strawberries.glb',
  (gltf) => {
    const model = gltf.scene

    // Centraliza e ajusta o tamanho do modelo automaticamente
    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    model.position.x -= center.x
    model.position.y -= center.y
    model.position.z -= center.z

    const maxSize = Math.max(size.x, size.y, size.z)
    const scale = 2 / maxSize
    model.scale.setScalar(scale)

    model.position.y = 0.8
    scene.add(model)
  },
  (progress) => {
    const percent = (progress.loaded / progress.total) * 100
    console.log(`Carregando modelo: ${percent.toFixed(2)}%`)
  },
  (error) => {
    console.error('Erro ao carregar o modelo 3D:', error)
  }
)

// Loop de animação
function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

animate()

// Responsividade / resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
