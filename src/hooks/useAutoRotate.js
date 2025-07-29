import { useEffect, useRef } from "react";

/**
 * Auto-rotation logic Hook
 */
export const useAutoRotate = (viewerInstance, isAutoRotating) => {
  const animationIdRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    if (!viewerInstance || !isAutoRotating) return;

    const animate = () => {
      if (isAutoRotating && viewerInstance && isMountedRef.current) {
        const time = Date.now() * 0.001;
        const radius = 8;
        const x = Math.sin(time * 0.5) * radius;
        const z = Math.cos(time * 0.5) * radius;

        try {
          if (viewerInstance.camera && viewerInstance.controls) {
            viewerInstance.camera.position.set(x, -4, z);
            viewerInstance.controls.target.set(0, 4, 0);
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
  }, [isAutoRotating, viewerInstance]);
};
