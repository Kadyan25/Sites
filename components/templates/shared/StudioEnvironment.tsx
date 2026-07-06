import { Environment } from '@react-three/drei'
import { BackSide, DoubleSide } from 'three'

interface StudioEnvironmentProps {
  /** Tint for the two side softbox panels — pass a template's accent color for a subtle color-matched reflection. */
  tint?: string
  /** Background sphere color — should read as a dim, neutral studio wall. */
  wallColor?: string
}

/**
 * A fully local stand-in for drei's `<Environment preset="...">`. The `preset`
 * prop fetches an HDRI from a remote CDN at runtime — if that request fails or
 * is blocked (corporate network, ad-blocker, offline), the whole page blanks
 * with no recovery. This bakes an equivalent studio-lighting environment map
 * from local geometry only, so PBR materials still get believable reflections
 * with zero network dependency.
 */
export function StudioEnvironment({ tint = '#ffffff', wallColor = '#20242b' }: StudioEnvironmentProps) {
  return (
    <Environment resolution={256} background={false}>
      <mesh scale={40}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={wallColor} side={BackSide} />
      </mesh>
      {/* key softbox */}
      <mesh position={[0, 4, -6]} scale={[7, 3.5, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#ffffff" toneMapped={false} side={DoubleSide} />
      </mesh>
      {/* fill softboxes, tinted */}
      <mesh position={[-6, 1, 2]} rotation={[0, Math.PI / 3, 0]} scale={[4, 4.5, 1]}>
        <planeGeometry />
        <meshBasicMaterial color={tint} toneMapped={false} side={DoubleSide} />
      </mesh>
      <mesh position={[6, -1, 3]} rotation={[0, -Math.PI / 3, 0]} scale={[3.5, 5, 1]}>
        <planeGeometry />
        <meshBasicMaterial color={tint} toneMapped={false} side={DoubleSide} />
      </mesh>
    </Environment>
  )
}
