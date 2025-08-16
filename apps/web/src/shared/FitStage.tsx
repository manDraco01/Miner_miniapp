import React, { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  baseWidth: number;   // ������ ������������ ������ (px)
  baseHeight: number;  // ������ ������������ ������ (px)
  children: React.ReactNode;
  // �������������: ������� ���������� ���� (��������, iPhone �����)
  safeTop?: number;    // px � ����������� �������� ������
};

export const FitStage: React.FC<Props> = ({ baseWidth, baseHeight, children, safeTop = 0 }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const { width, height } = el.getBoundingClientRect();
      const s = Math.min(width / baseWidth, height / baseHeight);
      setScale(s);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseWidth, baseHeight]);

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'fixed',
        inset: 0,
        // ��������� ��������� ������/������:
        paddingTop: 'max(env(safe-area-inset-top), 0px)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 0px)',
        paddingLeft: 'max(env(safe-area-inset-left), 0px)',
        paddingRight: 'max(env(safe-area-inset-right), 0px)',
        overflow: 'hidden',
        background: '#0b0f14',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: `calc(50% + ${safeTop}px)`, // ����� ���� �������� ����� �� ������-����
          width: baseWidth,
          height: baseHeight,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
          // ����� ����� ��������� ���������:
          pointerEvents: 'auto',
        }}
      >
        {children}
      </div>
    </div>
  );
};
