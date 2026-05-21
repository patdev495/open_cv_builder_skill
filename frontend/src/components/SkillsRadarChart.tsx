import { useEffect, useRef } from 'react';

interface SkillGroup {
  id: string;
  category: string;
  skills: string[];
}

interface SkillsRadarChartProps {
  skills: SkillGroup[];
  activeColor: {
    primary: string;
    pill: string;
    border?: string;
  };
}

export function SkillsRadarChart({ skills, activeColor }: SkillsRadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Parse color from Tailwind classes
  const getColorDetails = (primaryClass: string) => {
    const lower = primaryClass.toLowerCase();
    if (lower.includes('indigo')) return { main: '#4f46e5', rgb: '79, 70, 229' };
    if (lower.includes('emerald')) return { main: '#059669', rgb: '5, 150, 105' };
    if (lower.includes('rose')) return { main: '#e11d48', rgb: '225, 29, 72' };
    if (lower.includes('amber')) return { main: '#d97706', rgb: '217, 119, 6' };
    if (lower.includes('bronze') || lower.includes('brown')) return { main: '#854d0e', rgb: '133, 77, 14' };
    if (lower.includes('blue')) return { main: '#2563eb', rgb: '37, 99, 235' };
    if (lower.includes('violet') || lower.includes('purple')) return { main: '#7c3aed', rgb: '124, 58, 237' };
    return { main: '#475569', rgb: '71, 85, 105' }; // default slate-600
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !skills || skills.length === 0) return;

    // Build data structure
    let axes = skills
      .filter(grp => grp.category.trim() !== '')
      .map(grp => ({
        label: grp.category,
        value: grp.skills.filter(Boolean).length,
      }));

    if (axes.length === 0) return;

    // Radar chart requires at least 3 axes for visual rendering
    if (axes.length === 1) {
      axes = [
        axes[0],
        { label: '', value: 0 },
        { label: '', value: 0 },
      ];
    } else if (axes.length === 2) {
      axes = [
        axes[0],
        axes[1],
        { label: '', value: 0 },
      ];
    }

    const rawValues = axes.map(a => a.value);
    const maxVal = Math.max(...rawValues, 5); // default min scale is 5

    // Animation configuration
    let animationId: number;
    let startTime = performance.now();
    const duration = 800; // ms

    const draw = () => {
      const cvs = canvasRef.current;
      if (!cvs) return;
      const ctx = cvs.getContext('2d');
      if (!ctx) return;

      const rect = cvs.getBoundingClientRect();
      const width = rect.width || 300;
      const height = rect.height || 300;

      const dpr = window.devicePixelRatio || 1;
      cvs.width = width * dpr;
      cvs.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Check dark mode
      const isDarkMode = 
        document.documentElement.classList.contains('dark') || 
        document.body.classList.contains('dark');

      // Animation calculation
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // Ease out cubic

      // Clear
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.35;

      const N = axes.length;
      const angleStep = (2 * Math.PI) / N;

      // Draw Grid (concentric polygons)
      const gridLevels = 4;
      for (let i = 1; i <= gridLevels; i++) {
        const r = (radius / gridLevels) * i;
        ctx.beginPath();
        for (let j = 0; j < N; j++) {
          const angle = angleStep * j - Math.PI / 2;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = isDarkMode ? 'rgba(148, 163, 184, 0.12)' : 'rgba(148, 163, 184, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw Axes lines
      for (let j = 0; j < N; j++) {
        const angle = angleStep * j - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = isDarkMode ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.25)';
        ctx.stroke();

        // Draw label
        if (axes[j].label) {
          const labelOffset = 12;
          const lx = cx + (radius + labelOffset) * Math.cos(angle);
          const ly = cy + (radius + labelOffset) * Math.sin(angle);

          const cosVal = Math.cos(angle);
          const sinVal = Math.sin(angle);

          if (Math.abs(cosVal) < 0.1) {
            ctx.textAlign = 'center';
          } else {
            ctx.textAlign = cosVal > 0 ? 'left' : 'right';
          }

          if (Math.abs(sinVal) < 0.1) {
            ctx.textBaseline = 'middle';
          } else {
            ctx.textBaseline = sinVal > 0 ? 'top' : 'bottom';
          }

          ctx.font = '800 10px Inter, system-ui, sans-serif';
          ctx.fillStyle = isDarkMode ? '#cbd5e1' : '#334155'; // slate-300 / slate-700
          ctx.fillText(axes[j].label, lx, ly);
        }
      }

      // Draw Data area
      const color = getColorDetails(activeColor.primary);
      const dataPoints: { x: number; y: number }[] = [];

      for (let j = 0; j < N; j++) {
        const angle = angleStep * j - Math.PI / 2;
        const val = (axes[j].value / maxVal) * ease;
        const x = cx + radius * val * Math.cos(angle);
        const y = cy + radius * val * Math.sin(angle);
        dataPoints.push({ x, y });
      }

      // Polygon fill
      ctx.beginPath();
      for (let j = 0; j < N; j++) {
        if (j === 0) ctx.moveTo(dataPoints[j].x, dataPoints[j].y);
        else ctx.lineTo(dataPoints[j].x, dataPoints[j].y);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(${color.rgb}, 0.15)`;
      ctx.fill();

      // Polygon stroke
      ctx.strokeStyle = color.main;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw dots on vertices
      for (let j = 0; j < N; j++) {
        // Skip dummy vertices padded for small lengths
        if (j >= skills.length) continue;
        
        const pt = dataPoints[j];
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3.5, 0, 2 * Math.PI);
        ctx.fillStyle = color.main;
        ctx.fill();
        ctx.strokeStyle = isDarkMode ? '#1e293b' : '#ffffff'; // slate-800 / white
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      if (progress < 1) {
        animationId = requestAnimationFrame(draw);
      }
    };

    // Initialize ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      draw();
    });

    resizeObserver.observe(canvas);
    animationId = requestAnimationFrame(draw);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, [skills, activeColor]);

  return (
    <div className="w-full relative flex justify-center items-center py-2 select-none">
      <canvas 
        ref={canvasRef} 
        className="w-full aspect-square max-w-[280px] h-auto"
        style={{ display: 'block' }}
      />
    </div>
  );
}
