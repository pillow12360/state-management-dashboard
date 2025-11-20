import { Box } from '@mui/material';

/**
 * @component HeavyComponent
 * @description
 * 렌더링 성능에 부하를 주기 위해 의도적으로 복잡한 연산이나 많은 DOM 요소를 생성하는 컴포넌트.
 * 각 아이템마다 수백 개의 보이지 않는 요소를 렌더링하여 레이아웃 계산 및 페인팅 비용을 높인다.
 */

const dummyItems = Array.from({ length: 100 });

export function HeavyComponent() {

  const items = dummyItems

  return (
    <Box sx={{ display: 'none' }}>
      {items.map((_, i) => (
        <div key={i} data-testid="heavy-element">
          Hidden Element {i}
        </div>
      ))}
    </Box>
  );
}
