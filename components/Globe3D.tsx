'use client';

import { useRef, useMemo, Suspense, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Echo } from '@/lib/types';
import { latLngToVector3, GLOBE_RADIUS } from '@/lib/geo3d';
import { spreadEchoMarkers } from '@/lib/markerSpread';
import { extractCityZh, CITY_CATALOG } from '@/lib/cities';
import { useLocale } from '@/components/LocaleProvider';
import {
  cutePinSvg,
  avatarTooltipHtml,
  pinSizeForGlobeDistance,
  globeDistanceFactor,
} from '@/lib/pinMarker';

const EARTH_TEXTURE =
  'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';

const ZOOM_LABEL_DISTANCE = 4.75;

type SpreadEcho = Echo & { markerLat: number; markerLng: number };

interface Globe3DProps {
  echoes: Echo[];
  onSelectEcho: (echo: Echo) => void;
}

function EchoPinMarker({
  echo,
  onSelect,
}: {
  echo: SpreadEcho;
  onSelect: (e: Echo) => void;
}) {
  const { camera } = useThree();
  const pos = useMemo(
    () => latLngToVector3(echo.markerLat, echo.markerLng, GLOBE_RADIUS + 0.05),
    [echo.markerLat, echo.markerLng]
  );
  const [distanceFactor, setDistanceFactor] = useState(8);
  const [pinPx, setPinPx] = useState(14);
  const [showAvatar, setShowAvatar] = useState(false);

  useFrame(() => {
    const world = new THREE.Vector3(pos.x, pos.y, pos.z);
    const dist = camera.position.distanceTo(world);
    setDistanceFactor(globeDistanceFactor(dist));
    setPinPx(pinSizeForGlobeDistance(dist));
  });

  const pinH = Math.round(pinPx * 1.28);

  return (
    <Html
      position={pos}
      center
      distanceFactor={distanceFactor}
      zIndexRange={[50, 0]}
      style={{ pointerEvents: 'auto' }}
    >
      <div
        className="echo-globe-pin-wrap"
        onPointerEnter={() => setShowAvatar(true)}
        onPointerLeave={() => setShowAvatar(false)}
      >
        {showAvatar && (
          <div
            className="echo-globe-pin-avatar"
            dangerouslySetInnerHTML={{
              __html: avatarTooltipHtml(echo.userAvatar, echo.userName, 22),
            }}
          />
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(echo);
          }}
          className="echo-marker-btn block leading-none"
          style={{
            width: pinPx,
            height: pinH,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
          title={echo.placeName}
        >
          <span
            className="block"
            dangerouslySetInnerHTML={{ __html: cutePinSvg(echo.userId, pinPx) }}
          />
        </button>
      </div>
    </Html>
  );
}

function CityNameLabels({ spread }: { spread: SpreadEcho[] }) {
  const { camera } = useThree();
  const { locale } = useLocale();
  const [show, setShow] = useState(false);

  useFrame(() => {
    setShow(camera.position.length() < ZOOM_LABEL_DISTANCE);
  });

  if (!show) return null;

  return (
    <>
      {spread.map((echo, i) => {
        const cityZh = extractCityZh(echo.placeName);
        const entry = CITY_CATALOG.find((c) => c.zh === cityZh);
        const label = locale === 'en' ? (entry?.en ?? cityZh) : cityZh;
        const pos = latLngToVector3(
          echo.markerLat,
          echo.markerLng,
          GLOBE_RADIUS + 0.11
        );

        return (
          <Html
            key={echo.id ? `city-label-${echo.id}` : `city-label-${i}`}
            position={pos}
            center
            distanceFactor={10}
            zIndexRange={[30, 0]}
            style={{ pointerEvents: 'none' }}
          >
            <div className="globe-city-label">{label}</div>
          </Html>
        );
      })}
    </>
  );
}

function EarthSphere({
  spread,
  onSelectEcho,
}: {
  spread: SpreadEcho[];
  onSelectEcho: (echo: Echo) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture(EARTH_TEXTURE);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.04;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.85}
          metalness={0.05}
          emissive="#8ecdf5"
          emissiveIntensity={0.08}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS + 0.02, 64, 64]} />
        <meshBasicMaterial color="#ffc4d6" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>
      <CityNameLabels spread={spread} />
      {spread.map((echo, i) => (
        <EchoPinMarker
          key={echo.id ? `pin-${echo.id}` : `pin-${i}`}
          echo={echo}
          onSelect={onSelectEcho}
        />
      ))}
    </group>
  );
}

function GlobeScene({ echoes, onSelectEcho }: Globe3DProps) {
  const spread = useMemo(() => spreadEchoMarkers(echoes), [echoes]);
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 2, 4]} intensity={1.1} color="#fff5f9" />
      <pointLight position={[-4, -2, -3]} intensity={0.4} color="#b8e4ff" />
      <EarthSphere spread={spread} onSelectEcho={onSelectEcho} />
      <OrbitControls
        enablePan={false}
        minDistance={3.2}
        maxDistance={7}
        rotateSpeed={0.35}
        zoomSpeed={0.6}
      />
    </>
  );
}

export default function Globe3D({ echoes, onSelectEcho }: Globe3DProps) {
  return (
    <div className="relative h-full w-full min-h-[320px] bg-gradient-to-b from-[#e8f4ff] via-[#fff5f9] to-[#fffbe6]">
      <Canvas
        camera={{ position: [0, 0.4, 5.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ touchAction: 'none' }}
      >
        <Suspense fallback={null}>
          <GlobeScene echoes={echoes} onSelectEcho={onSelectEcho} />
        </Suspense>
      </Canvas>
    </div>
  );
}
