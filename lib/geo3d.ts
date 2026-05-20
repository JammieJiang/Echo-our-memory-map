import * as THREE from 'three';

const GLOBE_RADIUS = 2;

/** 经纬度 → 球面坐标（Three.js Y 轴朝上） */
export function latLngToVector3(lat: number, lng: number, radius = GLOBE_RADIUS): THREE.Vector3 {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lng + 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export { GLOBE_RADIUS };
