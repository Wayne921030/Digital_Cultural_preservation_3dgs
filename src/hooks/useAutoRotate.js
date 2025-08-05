import { useEffect, useRef } from "react";

/**
 * Auto-rotation logic Hook
 */
export const useAutoRotate = (
  viewerInstance,
  isAutoRotating,
  rotationRangeDeg = 360,
  orbit = "frontFocus"
) => {
  const animationIdRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    if (!viewerInstance || !isAutoRotating) return;

    // Determine rotation range based on orbit type
    let effectiveRotationRange = rotationRangeDeg;
    if (orbit === "topDown360") {
      effectiveRotationRange = 360;
    } else if (orbit === "frontFocus") {
      effectiveRotationRange = 20; // Swing mode for front focus
    }

    const animate = () => {
      if (isAutoRotating && viewerInstance && isMountedRef.current) {
        const time = Date.now() * 0.001;
        const radius = 8;

        let x = 0;
        let z = 0;

        if (effectiveRotationRange >= 360) {
          // Full 360° orbit
          x = Math.sin(time * 0.5) * radius;
          z = Math.cos(time * 0.5) * radius;
        } else {
          // Swing left-right within the specified range (e.g. 60° total → ±30°)
          const maxRad = (effectiveRotationRange * Math.PI) / 180 / 2; // half range in radians
          const angle = Math.sin(time * 0.5) * maxRad; // oscillate between -maxRad and +maxRad
          x = Math.sin(angle) * radius;
          z = Math.cos(angle) * radius;
        }

        try {
          if (viewerInstance.camera && viewerInstance.controls) {
            viewerInstance.camera.position.set(x, 0, z);
            viewerInstance.controls.update();
          }
        } catch (err) {
          console.warn("Error updating camera:", err);
          return;
        }

        animationIdRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      isMountedRef.current = false;
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isAutoRotating, viewerInstance, rotationRangeDeg, orbit]);
};
