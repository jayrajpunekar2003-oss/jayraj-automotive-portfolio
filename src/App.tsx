import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Html, OrbitControls, RoundedBox, useGLTF, useProgress } from '@react-three/drei'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Command,
  BriefcaseBusiness, Box, Download, ExternalLink, FolderOpen, Gauge, GraduationCap,
  Layers3, Mail, Move3d, RotateCcw, ScanLine, TerminalSquare, UserRound, Wrench, X,
} from 'lucide-react'
import type { Group } from 'three'
import { hotspots, profile, projects, skillGroups } from './data'
import PlexusBackground from './PlexusBackground'

type ModelId = 'coupe' | 'sedan' | 'suv' | 'console' | 'cupholder' | 'doortrim'
type DisplayMode = 'shaded' | 'wireframe' | 'transparent'

const modelOptions: { id: ModelId; label: string; kind: string }[] = [
  { id: 'coupe', label: 'Sport Coupe', kind: 'DEMONSTRATION CAR · COUPE' },
  { id: 'sedan', label: 'Executive Sedan', kind: 'DEMO CAR · FOUR DOOR' },
  { id: 'suv', label: 'Touring SUV', kind: 'DEMO CAR · UTILITY' },
  { id: 'console', label: 'Centre Console', kind: 'DEMO COMPONENT' },
  { id: 'cupholder', label: 'Cup Holder', kind: 'DEMO COMPONENT' },
  { id: 'doortrim', label: 'Door Trim', kind: 'DEMO COMPONENT' },
]

function CarModel({ id, mode, showLabel = true }: { id: ModelId; mode: DisplayMode; showLabel?: boolean }) {
  const carRef = useRef<Group>(null)
  const isSuv = id === 'suv'
  const isSedan = id === 'sedan'
  const paint = id === 'coupe' ? '#7d263b' : id === 'sedan' ? '#74777a' : '#6c604c'
  const materialProps = {
    color: paint,
    metalness: 0.72,
    roughness: 0.24,
    wireframe: mode === 'wireframe',
    transparent: mode === 'transparent',
    opacity: mode === 'transparent' ? 0.42 : 1,
  }
  const glassProps = {
    color: '#101820',
    metalness: 0.3,
    roughness: 0.12,
    wireframe: mode === 'wireframe',
    transparent: mode === 'transparent',
    opacity: mode === 'transparent' ? 0.22 : 0.92,
  }
  const wheelZ = isSuv ? 1.28 : 1.18
  const wheelY = isSuv ? 0.48 : 0.43
  const cabinHeight = isSuv ? 1.18 : isSedan ? 1.03 : 0.98
  const cabinLength = isSuv ? 2.0 : isSedan ? 2.18 : 1.78

  return (
    <group ref={carRef} position={[0, 0, 0]}>
      <RoundedBox args={[1.92, isSuv ? 0.62 : 0.5, 4.25]} radius={0.18} smoothness={4} position={[0, isSuv ? 0.72 : 0.62, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...materialProps} />
      </RoundedBox>
      <RoundedBox args={[1.52, isSuv ? 0.78 : 0.64, cabinLength]} radius={0.2} smoothness={4} position={[0, cabinHeight, isSuv ? -0.12 : -0.22]} castShadow>
        <meshStandardMaterial {...materialProps} />
      </RoundedBox>
      <RoundedBox args={[1.35, 0.47, cabinLength - 0.2]} radius={0.16} smoothness={4} position={[0, cabinHeight + 0.02, isSuv ? -0.12 : -0.23]}>
        <meshStandardMaterial {...glassProps} />
      </RoundedBox>
      <RoundedBox args={[1.73, 0.16, 0.42]} radius={0.07} smoothness={3} position={[0, isSuv ? 0.63 : 0.53, 2.08]}>
        <meshStandardMaterial color="#27282b" metalness={0.42} roughness={0.38} wireframe={mode === 'wireframe'} transparent={mode === 'transparent'} opacity={mode === 'transparent' ? 0.4 : 1} />
      </RoundedBox>
      {[-1, 1].map((side) => (
        <group key={side}>
          {[-wheelZ, wheelZ].map((z) => (
            <group key={z} position={[side * 0.94, wheelY, z]}>
              <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[isSuv ? 0.39 : 0.35, isSuv ? 0.39 : 0.35, 0.24, 32]} />
                <meshStandardMaterial color="#121214" roughness={0.88} wireframe={mode === 'wireframe'} />
              </mesh>
              <mesh position={[side * 0.128, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.205, 0.205, 0.25, 24]} />
                <meshStandardMaterial color="#b7b1a5" metalness={0.85} roughness={0.24} wireframe={mode === 'wireframe'} />
              </mesh>
              <mesh position={[side * 0.145, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.075, 0.075, 0.26, 16]} />
                <meshStandardMaterial color="#393a3c" metalness={0.8} roughness={0.3} wireframe={mode === 'wireframe'} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      {[-1, 1].map((side) => (
        <group key={`lamp-${side}`}>
          <mesh position={[side * 0.65, 0.74, 2.1]}>
            <boxGeometry args={[0.42, 0.09, 0.05]} />
            <meshStandardMaterial color="#e5dcc6" emissive="#73684c" emissiveIntensity={0.35} />
          </mesh>
          <mesh position={[side * 0.65, 0.75, -2.1]}>
            <boxGeometry args={[0.4, 0.1, 0.05]} />
            <meshStandardMaterial color="#8d2831" emissive="#511219" emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.73, 2.14]}>
        <boxGeometry args={[0.72, 0.18, 0.06]} />
        <meshStandardMaterial color="#17181a" metalness={0.6} roughness={0.42} wireframe={mode === 'wireframe'} />
      </mesh>
      <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.2, 6.2]} />
        <shadowMaterial transparent opacity={0.25} />
      </mesh>
      {showLabel && (
        <Html position={[0, isSuv ? 1.75 : 1.5, 0]} center distanceFactor={7} style={{ pointerEvents: 'none' }}>
          <span className="model-label">PROCEDURAL DEMONSTRATION MODEL</span>
        </Html>
      )}
    </group>
  )
}

function SkillCarPreview() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="skill-car-preview" aria-label="Interactive 3D sport coupe preview">
      <span className="skill-car-label">DESIGN STUDY / SPORT COUPE</span>
      <Canvas shadows camera={{ position: [5.1, 3.8, 6.5], fov: 38 }} dpr={[1, 1.4]} fallback={<div className="webgl-fallback">3D preview is unavailable in this browser.</div>}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 8, 5]} intensity={3.2} castShadow />
        <pointLight position={[-4, 2, -3]} color="#a43e56" intensity={12} />
        <pointLight position={[4, 1, 4]} color="#d1b477" intensity={7} />
        <CarModel id="coupe" mode="shaded" showLabel={false} />
        <OrbitControls
          autoRotate={!prefersReducedMotion}
          autoRotateSpeed={0.65}
          enableDamping
          dampingFactor={0.08}
          enablePan={false}
          enableZoom={false}
        />
      </Canvas>
      <span className="skill-car-hint">DRAG TO ORBIT</span>
    </div>
  )
}

function HomeCarPreview() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="home-car-preview" aria-label="Interactive 3D sport coupe">
      <Canvas shadows camera={{ position: [5.1, 3.8, 6.5], fov: 38 }} dpr={[1, 1.4]} fallback={<div className="webgl-fallback">3D preview is unavailable in this browser.</div>}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 8, 5]} intensity={3.2} castShadow />
        <pointLight position={[-4, 2, -3]} color="#a43e56" intensity={12} />
        <pointLight position={[4, 1, 4]} color="#d1b477" intensity={7} />
        <CarModel id="coupe" mode="shaded" showLabel={false} />
        <OrbitControls
          autoRotate={!prefersReducedMotion}
          autoRotateSpeed={0.55}
          enableDamping
          dampingFactor={0.08}
          enablePan={false}
          enableZoom={false}
        />
      </Canvas>
    </div>
  )
}

function ScrollReveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const prefersReducedMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.48, delay: prefersReducedMotion ? 0 : delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function ComponentModel({ id, mode }: { id: ModelId; mode: DisplayMode }) {
  const common = { wireframe: mode === 'wireframe', transparent: mode === 'transparent', opacity: mode === 'transparent' ? 0.4 : 1 }
  const floorY = id === 'doortrim' ? -1.12 : 0
  return (
    <group rotation={[0.18, -0.22, 0]}>
      {id === 'console' && (
        <>
          <RoundedBox args={[1.35, 0.34, 2.2]} radius={0.12} smoothness={4} position={[0, 0.48, 0]} castShadow>
            <meshStandardMaterial color="#4c4240" roughness={0.52} {...common} />
          </RoundedBox>
          <RoundedBox args={[0.94, 0.16, 0.76]} radius={0.1} smoothness={3} position={[0, 0.75, 0.36]}>
            <meshStandardMaterial color="#171719" metalness={0.35} {...common} />
          </RoundedBox>
          <mesh position={[0, 0.74, -0.48]}>
            <cylinderGeometry args={[0.24, 0.24, 0.12, 40]} />
            <meshStandardMaterial color="#18191a" metalness={0.36} {...common} />
          </mesh>
          <mesh position={[0, 0.8, -0.48]}>
            <cylinderGeometry args={[0.17, 0.17, 0.04, 40]} />
            <meshStandardMaterial color="#b79a65" metalness={0.75} {...common} />
          </mesh>
          {[0, 1].map((n) => <mesh key={n} position={[(n - 0.5) * 0.57, 0.25, -0.3]}><boxGeometry args={[0.12, 0.36, 1.1]} /><meshStandardMaterial color="#262426" {...common} /></mesh>)}
        </>
      )}
      {id === 'cupholder' && (
        <>
          <RoundedBox args={[1.65, 0.2, 1.5]} radius={0.12} smoothness={4} position={[0, 0.38, 0]} castShadow>
            <meshStandardMaterial color="#4c4240" roughness={0.54} {...common} />
          </RoundedBox>
          {[-0.42, 0.42].map((x) => (
            <group key={x} position={[x, 0.52, 0]}>
              <mesh><cylinderGeometry args={[0.33, 0.28, 0.1, 48]} /><meshStandardMaterial color="#aaa294" metalness={0.44} {...common} /></mesh>
              <mesh position={[0, -0.08, 0]}><cylinderGeometry args={[0.255, 0.25, 0.12, 48]} /><meshStandardMaterial color="#19191b" {...common} /></mesh>
            </group>
          ))}
          {[-1, 1].map((x) => <mesh key={x} position={[x * 0.58, 0.22, 0]}><boxGeometry args={[0.1, 0.42, 0.92]} /><meshStandardMaterial color="#302b2d" {...common} /></mesh>)}
        </>
      )}
      {id === 'doortrim' && (
        <>
          <RoundedBox args={[0.24, 2.2, 3.2]} radius={0.14} smoothness={4} castShadow>
            <meshStandardMaterial color="#41393b" roughness={0.56} {...common} />
          </RoundedBox>
          <RoundedBox args={[0.09, 0.84, 2.55]} radius={0.08} smoothness={3} position={[0.16, 0.55, -0.08]}>
            <meshStandardMaterial color="#18191b" metalness={0.25} {...common} />
          </RoundedBox>
          <RoundedBox args={[0.17, 0.16, 1.05]} radius={0.06} smoothness={3} position={[0.22, 0.1, 0.18]}>
            <meshStandardMaterial color="#c3a56b" metalness={0.7} {...common} />
          </RoundedBox>
          <RoundedBox args={[0.46, 0.58, 0.42]} radius={0.08} smoothness={3} position={[0.12, -0.65, 0.38]}>
            <meshStandardMaterial color="#302b2d" {...common} />
          </RoundedBox>
          {[-0.35, 0, 0.35].map((z) => <mesh key={z} position={[0.17, -0.22, z]}><boxGeometry args={[0.23, 0.08, 0.055]} /><meshStandardMaterial color="#a89a83" metalness={0.5} {...common} /></mesh>)}
        </>
      )}
      <mesh position={[0, floorY, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5, 5]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
      <Html position={[0, 1.35, 0]} center distanceFactor={7} style={{ pointerEvents: 'none' }}>
        <span className="model-label">DEMONSTRATION GEOMETRY</span>
      </Html>
    </group>
  )
}

function UploadedModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const copy = useMemo(() => scene.clone(true), [scene])
  return <primitive object={copy} scale={1.2} />
}

function Loader() {
  const { progress } = useProgress()
  return <Html center><div className="loader-label">LOADING MODEL {Math.round(progress)}%</div></Html>
}

function EngineeringStudio() {
  const [selected, setSelected] = useState<ModelId>('coupe')
  const [mode, setMode] = useState<DisplayMode>('shaded')
  const [autoRotate, setAutoRotate] = useState(true)
  const [hotspot, setHotspot] = useState(0)
  const [resetKey, setResetKey] = useState(0)
  const [uploadedUrl, setUploadedUrl] = useState('')
  const [uploadedName, setUploadedName] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const viewRef = useRef<HTMLDivElement>(null)
  const selectedModel = modelOptions.find((model) => model.id === selected)!
  const isCar = ['coupe', 'sedan', 'suv'].includes(selected)

  useEffect(() => {
    if (!uploadedUrl) return
    return () => URL.revokeObjectURL(uploadedUrl)
  }, [uploadedUrl])

  useEffect(() => {
    const onFullscreen = () => setIsFullscreen(document.fullscreenElement === viewRef.current)
    document.addEventListener('fullscreenchange', onFullscreen)
    return () => document.removeEventListener('fullscreenchange', onFullscreen)
  }, [])

  const chooseFile = (file?: File) => {
    if (!file) return
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (extension !== 'glb' && extension !== 'gltf') {
      window.alert('Choose a .glb or .gltf file. CATIA files need to be converted before viewing.')
      return
    }
    setUploadedUrl(URL.createObjectURL(file))
    setUploadedName(file.name)
  }

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void viewRef.current?.requestFullscreen()
  }

  return (
    <section className="section studio-section" id="3d-models">
      <div className="section-head">
        <ScrollReveal className="section-title-reveal">
        <div>
          <h2>Engineering in <em>three dimensions.</em></h2>
          <p className="section-intro">Explore original, procedural car concepts and illustrative interior-component geometry. Every model here is a demonstration—not CATIA project work.</p>
        </div>
        </ScrollReveal>
        <div className="studio-meta"><Move3d size={17} /><span>DRAG TO ORBIT<br />SCROLL TO ZOOM</span></div>
      </div>

      <div className="studio-shell">
        <div className="studio-toolbar">
          <div className="model-picker">
            <span className="tiny-label">MODEL / {selectedModel.kind}</span>
            <div className="select-wrap">
              <select value={selected} onChange={(event) => { setSelected(event.target.value as ModelId); setUploadedUrl('') }} aria-label="Select 3D model">
                <optgroup label="DEMONSTRATION CAR MODELS">
                  {modelOptions.filter((item) => ['coupe', 'sedan', 'suv'].includes(item.id)).map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}
                </optgroup>
                <optgroup label="INTERIOR COMPONENT STUDIES">
                  {modelOptions.filter((item) => ['console', 'cupholder', 'doortrim'].includes(item.id)).map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}
                </optgroup>
              </select>
              <ChevronDown size={15} />
            </div>
          </div>
          <div className="view-tools">
            {(['shaded', 'wireframe', 'transparent'] as DisplayMode[]).map((item) => (
              <button key={item} className={`tool-button ${mode === item ? 'selected' : ''}`} onClick={() => setMode(item)}>{item}</button>
            ))}
            <button className={`tool-button spin-toggle ${autoRotate && !prefersReducedMotion ? 'selected' : ''}`} aria-pressed={autoRotate && !prefersReducedMotion} onClick={() => setAutoRotate((value) => !value)}>SPIN {autoRotate && !prefersReducedMotion ? 'ON' : 'OFF'}</button>
            <button className="icon-tool" aria-label="Reset view" title="Reset view" onClick={() => setResetKey((key) => key + 1)}><RotateCcw size={15} /></button>
            <button className="icon-tool" aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'} title="Fullscreen" onClick={toggleFullscreen}><ScanLine size={16} /></button>
            <label className="upload-control" title="Upload a GLB or GLTF model">
              <span>+ MODEL</span>
              <input type="file" accept=".glb,.gltf,model/gltf-binary,model/gltf+json" onChange={(event) => chooseFile(event.target.files?.[0])} />
            </label>
          </div>
        </div>

        <div className="studio-viewport" ref={viewRef}>
          <div className="viewport-grid" />
          <div className="viewport-mark top-left">JP / MODEL VIEWER<br />PROCEDURAL / CAD PREVIEW</div>
          <div className="viewport-mark bottom-left">MODEL VIEW<br /><span>{uploadedName || selectedModel.label.toUpperCase()}</span></div>
          <div className="viewport-mark bottom-right"><span className="live-dot" /> WEBGL / READY</div>
          <Canvas shadows camera={{ position: isCar ? [5.1, 3.8, 6.5] : [4, 3.2, 4.8], fov: 38 }} dpr={[1, 1.6]} fallback={<div className="webgl-fallback">3D preview is unavailable in this browser. The model controls require WebGL support.</div>}>
            <color attach="background" args={['#111113']} />
            <ambientLight intensity={1.2} />
            <directionalLight position={[5, 8, 5]} intensity={3.2} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
            <pointLight position={[-4, 2, -3]} color="#a43e56" intensity={15} />
            <pointLight position={[4, 1, 4]} color="#d1b477" intensity={8} />
            <Suspense fallback={<Loader />}>
              {uploadedUrl
                ? <UploadedModel url={uploadedUrl} />
                : isCar
                  ? <CarModel id={selected} mode={mode} />
                  : <ComponentModel id={selected} mode={mode} />}
            </Suspense>
            <OrbitControls key={resetKey} makeDefault autoRotate={autoRotate && !prefersReducedMotion} autoRotateSpeed={0.65} enableDamping dampingFactor={0.08} minDistance={3} maxDistance={13} />
          </Canvas>
          {isFullscreen && <button className="fullscreen-close" onClick={toggleFullscreen} aria-label="Exit fullscreen"><X size={18} /></button>}
        </div>

        <div className="studio-bottom">
          <div className="hotspot-list">
            <span className="tiny-label">ENGINEERING LAYERS</span>
            <div>{hotspots.map(([title], index) => <button key={title} className={hotspot === index ? 'active' : ''} onClick={() => setHotspot(index)}>{String(index + 1).padStart(2, '0')}<span>{title}</span></button>)}</div>
          </div>
          <aside className="hotspot-info">
            <span className="tiny-label">FEATURE NOTE / {String(hotspot + 1).padStart(2, '0')}</span>
            <strong>{hotspots[hotspot][0]}</strong>
            <p>{hotspots[hotspot][1]}</p>
          </aside>
        </div>
        <div className="studio-footnote"><span><i /> DEMONSTRATION GEOMETRY</span><span>GLB / GLTF UPLOAD SUPPORTED · NATIVE CATIA FILES REQUIRE CONVERSION</span></div>
      </div>
    </section>
  )
}

function Terminal() {
  const [history, setHistory] = useState<string[]>([])
  const [entries, setEntries] = useState<string[]>([
    'JAYRAJ.OS [Version 1.0]',
    'Automotive Design Engineering Workspace',
    '',
    'Welcome, Visitor.',
    'Type "help" to explore the available commands.',
  ])
  const [value, setValue] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  const run = (raw: string) => {
    const command = raw.trim().toLowerCase()
    if (!command) return
    setHistory((items) => [raw.trim(), ...items])
    setHistoryIndex(-1)
    if (command === 'clear') {
      setEntries([])
      return
    }
    const outputs: Record<string, string[]> = {
      help: ['AVAILABLE: about · whoami · skills · projects · experience · education · models · contact · linkedin · clear · date', 'Try "project 1", "project 2", "project 3", "project 4.1", or "project 4.2".'],
      about: ['Jayraj Punekar — Automotive Design Engineer in Pune, India.', 'Mechanical & Automation Engineering graduate focused on CATIA V5 and automotive interior plastic trim design.'],
      whoami: ['JAYRAJ PUNEKAR', 'AUTOMOTIVE DESIGN ENGINEER', 'CATIA V5 / AUTOMOTIVE INTERIOR PLASTIC TRIM'],
      skills: ['CATIA V5 · Generative Shape Design · Part Design · Surface Modelling', 'Plastic trim · B-side features · Draft analysis · DFM / DFA'],
      projects: projects.flatMap((item) => [
        `${item.number}  ${item.title}`,
        ...item.subprojects.map((subproject) => `  ${subproject.number}  ${subproject.title}`),
      ]),
      experience: ['DESIGN ENGINEER · AutoOne Engineering, Pune', '23 March 2026 — Present · CATIA V5 / Automotive plastic design domain'],
      education: ['B.Tech, Mechanical & Automation Engineering · WIT Solapur · 2025 · CGPA 9.43/10', 'Diploma, Mechanical Engineering · Government Polytechnic Solapur · 2022 · 79.54%'],
      contact: ['Pune, Maharashtra, India', `Email: ${profile.email}`, 'LinkedIn: linkedin.com/in/jaypunekar811'],
      models: ['The 3D Models section is ready below. Select the supplied vehicle image or a demonstration car/component model.'],
      linkedin: ['Opening Jayraj Punekar on LinkedIn…'],
      date: [new Date().toLocaleString()],
    }
    const projectMatch = command.match(/^project\s+(\d+(?:\.\d+)?)$/)
    const projectEntry = projectMatch
      ? projects.flatMap((project) => [project, ...project.subprojects]).find((project) => project.number === projectMatch[1])
      : undefined
    const result = projectEntry
      ? [projectEntry.title, projectEntry.description, projectMatch && ['1', '2', '3'].includes(projectMatch[1]) ? 'AutoOne Engineering project / CATIA V5.' : 'Independent design practice / CATIA V5.']
      : outputs[command]
    if (command === 'linkedin') window.open('https://www.linkedin.com/in/jaypunekar811', '_blank', 'noopener,noreferrer')
    if (command === 'models') window.location.hash = '#3d-models'
    setEntries((items) => [...items, `visitor@jayraj.os:~$ ${raw.trim()}`, ...(result ?? [`Command not found: ${command}. Type "help" to see available commands.`])])
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      run(value)
      setValue('')
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      const next = Math.min(historyIndex + 1, history.length - 1)
      setHistoryIndex(next)
      setValue(history[next] ?? '')
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      const next = Math.max(historyIndex - 1, -1)
      setHistoryIndex(next)
      setValue(next < 0 ? '' : history[next] ?? '')
    }
  }

  return (
    <section className="section os-section" id="terminal">
      <div className="section-head">
        <ScrollReveal className="section-title-reveal">
        <div>
          <h2>JAYRAJ<em>.OS</em></h2>
          <p className="section-intro">A small interactive engineering workspace. Explore the portfolio with safe, purpose-built commands.</p>
        </div>
        </ScrollReveal>
        <div className="os-mark"><Command size={18} /><span>AN INTERACTIVE<br />ENGINEERING WORKSPACE</span></div>
      </div>
      <div className="terminal-window" onClick={() => inputRef.current?.focus()}>
        <div className="terminal-bar">
          <div className="window-dots"><i /><i /><i /></div>
          <span><TerminalSquare size={14} /> JAYRAJ.OS — PORTFOLIO TERMINAL</span>
          <span className="terminal-status"><b /> SYSTEM ONLINE</span>
        </div>
        <div className="terminal-content" aria-live="polite">
          {entries.map((entry, index) => <p className={entry.startsWith('visitor@') ? 'command-line' : ''} key={`${entry}-${index}`}>{entry}</p>)}
          <form className="terminal-input-line" onSubmit={(event) => { event.preventDefault(); run(value); setValue('') }}>
            <label htmlFor="terminal-command">visitor@jayraj.os:~$</label>
            <input id="terminal-command" ref={inputRef} value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={onKeyDown} autoComplete="off" spellCheck={false} aria-label="Terminal command" />
            <span className="cursor" />
          </form>
        </div>
        <div className="command-shortcuts">
          <span>QUICK COMMANDS</span>
          {['help', 'skills', 'projects', 'models', 'contact'].map((cmd) => <button key={cmd} onClick={() => run(cmd)}>{cmd}</button>)}
        </div>
      </div>
    </section>
  )
}

function App() {
  const [activeSkill, setActiveSkill] = useState(0)
  const [expandedProject, setExpandedProject] = useState('')
  const [activeView, setActiveView] = useState('home')

  useEffect(() => {
    const syncView = () => {
      const view = window.location.hash.slice(1)
      setActiveView(['about', 'expertise', 'projects', 'experience', '3d-models', 'terminal', 'contact'].includes(view) ? view : 'home')
    }
    syncView()
    window.addEventListener('hashchange', syncView)
    return () => window.removeEventListener('hashchange', syncView)
  }, [])

  const resumeAction = profile.resumeUrl
    ? <a className="button button-gold" href={profile.resumeUrl} download><Download size={15} /> Download Resume</a>
    : <button className="button button-gold" disabled title="Add your actual resume PDF to enable downloads"><Download size={15} /> Resume soon</button>

  return (
    <main data-view={activeView}>
      <PlexusBackground />
      {activeView !== 'home' && (
        <a className="return-home" href="#home">
          <ArrowLeft size={15} />
          <span>Back to desktop</span>
        </a>
      )}

      <section className="desktop-home" id="home" aria-label="Portfolio desktop">
        <HomeCarPreview />
        <div className="desktop-grid" aria-label="Portfolio applications">
          <a href="#about" className="desktop-app"><span className="desktop-app-icon"><UserRound size={25} /></span><span>Profile</span></a>
          <a href="#expertise" className="desktop-app"><span className="desktop-app-icon"><Wrench size={25} /></span><span>Skills</span></a>
          <a href="#projects" className="desktop-app"><span className="desktop-app-icon"><FolderOpen size={25} /></span><span>Projects</span></a>
          <a href="#experience" className="desktop-app"><span className="desktop-app-icon"><BriefcaseBusiness size={25} /></span><span>Experience</span></a>
          <a href="#3d-models" className="desktop-app"><span className="desktop-app-icon"><Box size={25} /></span><span>3D Models</span></a>
          <a href="#terminal" className="desktop-app"><span className="desktop-app-icon"><TerminalSquare size={25} /></span><span>Terminal</span></a>
          <a href="#contact" className="desktop-app"><span className="desktop-app-icon"><Mail size={25} /></span><span>Contact</span></a>
          <a href={profile.resumeUrl} className="desktop-app" download><span className="desktop-app-icon"><Download size={25} /></span><span>Resume</span></a>
        </div>
        <div className="home-intro">
          <p className="eyebrow"><span>WELCOME</span> AUTOMOTIVE DESIGN ENGINEER</p>
          <h1>Jayraj <em>Punekar</em></h1>
          <p>Mechanical engineer shaping thoughtful automotive interiors through CATIA V5, surface design, and practical product engineering.</p>
          <a className="home-intro-link" href="#about">A little about me <ArrowRight size={14} /></a>
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="section-head">
          <ScrollReveal className="section-title-reveal">
          <div><h2>The engineer<br />behind the <em>design.</em></h2></div>
          </ScrollReveal>
          <div className="section-side-note">MECHANICAL ENGINEERING<br />AUTOMOTIVE INTERIOR PLASTICS<br />PUNE, MAHARASHTRA</div>
        </div>
        <div className="about-grid">
          <div className="about-portrait">
            <div className="portrait-blueprint">
              <div className="blueprint-rings" /><span className="portrait-monogram">JP</span>
              <span className="portrait-corner">DESIGN ENGINEERING<br />AUTOMOTIVE / CATIA V5</span>
              <span className="portrait-coordinate">19.0760° N<br />72.8777° E</span>
              <div className="portrait-bottom"><strong>JAYRAJ PUNEKAR</strong><span>CATIA V5 / PRODUCT DESIGN</span></div>
            </div>
          </div>
          <div className="about-copy">
            <p className="lead">Precision in every surface.<br /><em>Purpose in every detail.</em></p>
            <p>I am Jayraj Punekar, a Mechanical and Automation Engineering graduate from Walchand Institute of Technology, Solapur. I am currently working as a Design Engineer at AutoOne Engineering in Pune, in the CATIA V5 automotive plastic design domain.</p>
            <p>My technical focus includes automotive interior plastic trim, surface modelling, close-volume development, B-side features, draft analysis, and design for manufacturability. I am committed to building practical capability through continued learning and engineering practice.</p>
            <div className="education-strip">
              <div><GraduationCap size={18} /><span><b>B.TECH · MECHANICAL & AUTOMATION</b><small>WIT Solapur / 2025 / CGPA 9.43</small></span></div>
              <div><Layers3 size={18} /><span><b>DIPLOMA · MECHANICAL ENGINEERING</b><small>Government Polytechnic, Solapur / 2022</small></span></div>
            </div>
            <a className="text-link" href="#experience">View professional timeline <ArrowRight size={15} /></a>
          </div>
        </div>
      </section>

      <section className="section skills-section" id="expertise">
        <div className="section-head">
          <ScrollReveal className="section-title-reveal">
          <div><h2>Built on <em>engineering fundamentals.</em></h2></div>
          </ScrollReveal>
          <p className="section-intro">A practical foundation in CAD, automotive plastics, and the decisions that connect geometry to manufacturability.</p>
        </div>
        <div className="skills-layout">
          <div className="skill-selector">
            <div className="skill-tabs" role="tablist" aria-label="Skill categories">
              {skillGroups.map((group, index) => <button key={group.code} role="tab" aria-selected={activeSkill === index} className={activeSkill === index ? 'active' : ''} onClick={() => setActiveSkill(index)}><span>{group.code}</span>{group.title}<ArrowUpRight size={15} /></button>)}
            </div>
            <SkillCarPreview />
          </div>
          <AnimatePresence mode="wait">
          <motion.div className="skill-detail" role="tabpanel" key={activeSkill} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
            <div className="skill-detail-head"><span>CAPABILITY INDEX / {skillGroups[activeSkill].code}</span><Gauge size={18} /></div>
            <h3>{skillGroups[activeSkill].title.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())}</h3>
            <div className="skill-list">{skillGroups[activeSkill].items.map(([title, detail], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h4>{title}</h4><p>{detail}</p></div><Check size={15} /></article>)}</div>
          </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="section projects-section" id="projects">
        <div className="section-head">
          <ScrollReveal className="section-title-reveal">
          <div><h2>Designed around<br /><em>the component.</em></h2></div>
          </ScrollReveal>
          <p className="section-intro">Selected company project experience, followed by independent component-design exercises. Project details are summarized without sharing confidential CAD data.</p>
        </div>
        <ScrollReveal className="project-grid">
          {projects.map((project, index) => (
            <motion.article className="project-card" key={project.number} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.45, delay: index * 0.08 }}>
              <div className={`project-art art-${index + 1}`}><span className="art-index">{project.employer ? `${project.number} / AUTOONE` : `${project.number} / DESIGN STUDY`}</span><div className="component-sketch"><i /><i /><i /><i /></div><span className="art-caption">{project.employer ? 'CATIA V5 · COMPANY PROJECT' : 'CATIA V5 · INDEPENDENT PRACTICE'}</span></div>
              <div className="project-info">
                <span className="project-type">{project.type}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                {project.employer && <p className="project-company"><span>EMPLOYER · DOMAIN · CAD</span>{project.employer} · CATIA V5</p>}
                {project.component && <p className="project-component"><span>COMPONENT</span>{project.component}</p>}
                <div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
              {(project.responsibilities.length > 0 || project.subprojects.length > 0) && (
                <div className="project-details">
                  {project.responsibilities.length > 0 && (
                    <button className="details-toggle" aria-expanded={expandedProject === project.number} onClick={() => setExpandedProject((current) => current === project.number ? '' : project.number)}>
                      {expandedProject === project.number ? 'HIDE PROJECT DETAILS' : 'VIEW PROJECT DETAILS'}
                      <ChevronDown size={14} className={expandedProject === project.number ? 'expanded' : ''} />
                    </button>
                  )}
                  <AnimatePresence initial={false}>
                    {expandedProject === project.number && (
                      <motion.div className="project-detail-panel" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                        <div className="project-meta-grid">
                          <span><small>ORGANISATION</small><b>{project.employer}</b></span>
                          <span><small>DOMAIN</small><b>Automotive Interior Plastic Trim</b></span>
                          <span><small>CAD SOFTWARE</small><b>CATIA V5</b></span>
                          {project.period && <span><small>PROJECT DURATION</small><b>{project.period}</b></span>}
                        </div>
                        <span className="tiny-label">KEY RESPONSIBILITIES</span>
                        <ul>{project.responsibilities.map((responsibility) => <li key={responsibility}>{responsibility}</li>)}</ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {project.subprojects.length > 0 && (
                    <div className="project-children">
                      <span className="tiny-label">RELATED COMPONENT STUDIES</span>
                      {project.subprojects.map((subproject) => {
                        const detailKey = `${project.number}-${subproject.number}`
                        const isExpanded = expandedProject === detailKey
                        return (
                          <div className="project-child" key={subproject.number}>
                            <button className="project-child-toggle" aria-expanded={isExpanded} onClick={() => setExpandedProject((current) => current === detailKey ? '' : detailKey)}>
                              <span className="project-child-number">{subproject.number}</span>
                              <span className="project-child-copy"><strong>{subproject.title}</strong><small>{subproject.description}</small></span>
                              <ChevronDown size={14} className={isExpanded ? 'expanded' : ''} />
                            </button>
                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div className="subproject-details" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                                  <p>{subproject.approach}</p>
                                  <span className="tiny-label">KEY DESIGN CONSIDERATIONS</span>
                                  <ul>{subproject.considerations.map((consideration) => <li key={consideration}>{consideration}</li>)}</ul>
                                  <div className="tag-list">{subproject.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
              <div className="project-foot"><span>{project.employer ? 'PROFESSIONAL EXPERIENCE / DETAILS SHARED BY THE ENGINEER' : 'INDEPENDENT DESIGN PRACTICE'}</span></div>
            </motion.article>
          ))}
        </ScrollReveal>
      </section>

      <section className="section experience-section" id="experience">
        <div className="section-head">
          <ScrollReveal className="section-title-reveal">
          <div><h2>Growing through<br /><em>engineering practice.</em></h2></div>
          </ScrollReveal>
          <p className="section-intro">A developing professional journey grounded in mechanical engineering and automotive product design.</p>
        </div>
        <div className="timeline">
          <motion.article className="timeline-item current" initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}><span className="timeline-date">MAR 2026 — PRESENT</span><div className="timeline-marker" /><div><span className="timeline-label">PROFESSIONAL EXPERIENCE</span><h3>Design Engineer</h3><p className="timeline-org">AutoOne Engineering <i>·</i> Pune, Maharashtra</p><p>Working in the CATIA V5 automotive plastic design domain, continuing to develop practical experience in interior component design.</p></div><ArrowUpRight size={17} /></motion.article>
          <motion.article className="timeline-item" initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.08 }}><span className="timeline-date">2022 — 2025</span><div className="timeline-marker" /><div><span className="timeline-label">BACHELOR'S DEGREE</span><h3>B.Tech, Mechanical & Automation Engineering</h3><p className="timeline-org">Walchand Institute of Technology <i>·</i> Solapur</p><p>Graduated in 2025 with a CGPA of 9.43/10.</p></div><GraduationCap size={18} /></motion.article>
          <motion.article className="timeline-item" initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.16 }}><span className="timeline-date">COMPLETED 2022</span><div className="timeline-marker" /><div><span className="timeline-label">DIPLOMA</span><h3>Mechanical Engineering</h3><p className="timeline-org">Government Polytechnic <i>·</i> Solapur</p><p>Completed with 79.54%, First Class with Distinction.</p></div><GraduationCap size={18} /></motion.article>
        </div>
      </section>

      <EngineeringStudio />
      <Terminal />

      <section className="contact-section" id="contact">
        <div className="contact-gridline" />
        <h2>Let's engineer<br /><em>what comes next.</em></h2>
        <p>Interested in automotive design engineering, plastic product development, or professional collaboration? Let's connect.</p>
        <div className="contact-actions">
          <a className="button button-gold" href={profile.linkedIn} target="_blank" rel="noreferrer">Connect on LinkedIn <ExternalLink size={15} /></a>
          <a className="button button-outline" href={`mailto:${profile.email}`}>Send an email <ArrowUpRight size={15} /></a>
          {resumeAction}
        </div>
        <div className="contact-details"><span>JAYRAJ PUNEKAR</span><span>AUTOMOTIVE DESIGN ENGINEER</span><span>PUNE, MAHARASHTRA, INDIA</span><a href={`mailto:${profile.email}`}>{profile.email} <ArrowUpRight size={12} /></a><a href={profile.linkedIn} target="_blank" rel="noreferrer">LINKEDIN <ArrowUpRight size={12} /></a></div>
      </section>
      <footer className="site-footer">
        <a className="brand" href="#home"><span>JAYRAJ <i>/</i> PUNEKAR</span><small>CATIA V5 · AUTOMOTIVE PLASTIC TRIM · PRODUCT DESIGN</small></a>
        <span>© {new Date().getFullYear()} JAYRAJ PUNEKAR. ALL RIGHTS RESERVED.</span>
        <a href="#home">ENGINEERED WITH PRECISION <ArrowDown size={13} className="to-top" /></a>
      </footer>
      <div className="desktop-taskbar">
        <a className="taskbar-start" href="#home"><span>JP</span><b>Start</b></a>
        <span className="taskbar-title">JAYRAJ PUNEKAR <i /> AUTOMOTIVE DESIGN ENGINEER</span>
        <span className="taskbar-location">PUNE, INDIA</span>
        <time className="taskbar-clock">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</time>
      </div>
    </main>
  )
}

export default App
