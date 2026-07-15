import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import redlineWolf from '../assets/logos/redline-wolf.png';
import probiznesMark from '../assets/logos/probiznes-mark.jpeg';

function createGlowTexture(hex) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, `${hex}aa`);
  gradient.addColorStop(0.4, `${hex}55`);
  gradient.addColorStop(1, `${hex}00`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function Glow({ color = '#e51b23', scale = 3.2 }) {
  const texture = useMemo(() => createGlowTexture(color), [color]);
  return (
    <sprite scale={[scale, scale, 1]} position={[0, 0, -0.15]}>
      <spriteMaterial
        map={texture}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </sprite>
  );
}

function LogoPlane({ src, position, width, glowColor, glowScale, floatSpeed, rotationSpeed }) {
  const texture = useTexture(src);
  const meshRef = useRef(null);
  const height = width * (texture.image.height / texture.image.width);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <Float speed={floatSpeed} floatIntensity={1.1} rotationIntensity={0.35}>
      <group position={position}>
        <Glow color={glowColor} scale={glowScale} />
        <mesh ref={meshRef}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial
            map={texture}
            transparent
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </Float>
  );
}

function ParallaxRig({ children }) {
  const group = useRef(null);

  useFrame((state) => {
    if (!group.current) return;
    const targetY = state.pointer.x * 0.22;
    const targetX = state.pointer.y * 0.12;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.04);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.04);
  });

  return <group ref={group}>{children}</group>;
}

function Scene({ compact }) {
  const { viewport } = useThree();
  const wolfWidth = Math.min(viewport.width * (compact ? 0.34 : 0.42), compact ? 2.6 : 3.4);
  const markWidth = wolfWidth * 0.62;

  return (
    <>
      <fog attach="fog" args={['#050505', 5, 11]} />
      <ambientLight intensity={0.5} />
      <pointLight color="#ff3b3b" intensity={3} position={[2.5, 1.5, 3]} />
      <pointLight color="#5566ff" intensity={0.35} position={[-3, -1.5, -2]} />

      <ParallaxRig>
        <LogoPlane
          src={redlineWolf}
          position={[0.55, 0.35, 0.4]}
          width={wolfWidth}
          glowColor="#e51b23"
          glowScale={wolfWidth * 1.5}
          floatSpeed={1.1}
          rotationSpeed={0.06}
        />
        <LogoPlane
          src={probiznesMark}
          position={[-0.75, -0.5, -0.3]}
          width={markWidth}
          glowColor="#ffffff"
          glowScale={markWidth * 1.7}
          floatSpeed={1.4}
          rotationSpeed={-0.045}
        />
        <Sparkles count={70} scale={[6, 4, 3]} size={1.6} speed={0.25} color="#ff5a55" opacity={0.5} />
      </ParallaxRig>
    </>
  );
}

export default function LogoScene3D({ compact = false, active = true }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 5], fov: 42 }}
      frameloop={active ? 'always' : 'never'}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <Scene compact={compact} />
      </Suspense>
    </Canvas>
  );
}
